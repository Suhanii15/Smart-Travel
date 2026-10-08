require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const cron = require("node-cron");

const connectDB = require("./lib/db.js");
const Trip = require("./models/TripModel");
const User = require("./models/UserModel");
const { sendTripReminder } = require("./services/emailService");

const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: "4mb" }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://smart-travel-alpha.vercel.app",
    ],
    credentials: true,
  })
);

app.set("trust proxy", 1);

const userRouter = require("./routes/userRoutes");
const tripRouter = require("./routes/tripRoutes.js");
const passport = require("./config/passport");
const authRouter = require("./routes/authRoutes.js");
const notificationRouter = require("./routes/notificationRotes.js");

app.use(passport.initialize());

app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) =>
  res.json({})
);

app.use("/api/status", (req, res) => res.send("server is live"));
app.use("/api/user", userRouter);
app.use("/api/trips", tripRouter);
app.use("/api/auth", authRouter);
app.use("/api/notification", notificationRouter);

// Returns tomorrow's date range in Indian Standard Time.
function getTomorrowInIndia() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  );

  const todayUtc = new Date(
    Date.UTC(
      Number(values.year),
      Number(values.month) - 1,
      Number(values.day)
    )
  );

  todayUtc.setUTCDate(todayUtc.getUTCDate() + 1);

  const date = todayUtc.toISOString().slice(0, 10);
  const start = new Date(`${date}T00:00:00+05:30`);

  return {
    start,
    end: new Date(start.getTime() + 24 * 60 * 60 * 1000),
  };
}

// Prevents two runs (in-process cron + external trigger) from overlapping.
let reminderJobRunning = false;

async function runTripReminders() {
  if (reminderJobRunning) {
    console.log("Trip reminder job already running; skipping this trigger");
    return;
  }

  reminderJobRunning = true;
  console.log("Trip reminder job started at:", new Date().toISOString());

  try {
    const { start, end } = getTomorrowInIndia();

    console.log("Checking trips starting tomorrow (IST)");
    console.log("Range start:", start.toISOString());
    console.log("Range end:", end.toISOString());

    const trips = await Trip.find({
      startDate: {
        $gte: start,
        $lt: end,
      },
      status: "finalized",
      reminderSentAt: null,
    });

    console.log("Eligible trips found:", trips.length);

    for (const trip of trips) {
      try {
        // Get all collaborators for this trip.
        const collaboratorIds = [
          ...new Set(
            (trip.collaborators || [])
              .map((collaborator) => {
                const user = collaborator.user;
                return user?._id
                  ? String(user._id)
                  : user
                    ? String(user)
                    : null;
              })
              .filter(Boolean)
          ),
        ];

        const users = await User.find({
          _id: { $in: collaboratorIds },
        });

        if (users.length === 0) {
          console.log(`No collaborators found for trip ${trip._id}`);
        }

        let allRecipientsProcessed = true;

        for (const user of users) {
          if (!user.email) {
            console.log(`Skipping user ${user._id}: no email address`);
            allRecipientsProcessed = false;
            continue;
          }

          try {
            console.log(`Attempting reminder for ${user.email}`);

            // Recipient is read from the user's database record.
            await sendTripReminder(user, trip);

            console.log(`SendGrid accepted reminder for ${user.email}`);

            // Add the in-app notification.
            await User.updateOne(
              { _id: user._id },
              {
                $push: {
                  notifications: {
                    message: `Your trip to ${trip.destination} starts tomorrow! 🎒`,
                    type: "trip_reminder",
                    tripId: trip._id,
                    read: false,
                  },
                },
              }
            );
          } catch (err) {
            allRecipientsProcessed = false;

            console.error(
              `Reminder failed for ${user.email}:`,
              err.response?.body || err.message
            );
          }
        }

        // Mark the trip only if all recipients were processed.
        if (users.length > 0 && allRecipientsProcessed) {
          trip.reminderSentAt = new Date();
          await trip.save();

          console.log(`Trip reminder processed: ${trip._id}`);
        } else {
          console.log(
            `Trip ${trip._id} remains unprocessed; check recipients`
          );
        }
      } catch (err) {
        console.error(
          `Failed to process trip ${trip._id}:`,
          err.response?.body || err.message
        );
      }
    }

    console.log("Daily trip reminder job finished");
  } catch (err) {
    console.error("Cron job failed:", err);
  } finally {
    reminderJobRunning = false;
  }
}

// In-process schedule: only fires if the server is awake at 3:15 PM IST.
console.log("Registering trip reminder cron job...");
cron.schedule("31 15 * * *", runTripReminders, {
  timezone: "Asia/Kolkata",
});

// External trigger: call this from cron-job.org, GitHub Actions, or your
// host's scheduler so reminders still go out if the server was asleep.
// Send header:  x-cron-secret: <CRON_SECRET>
app.post("/api/cron/trip-reminders", (req, res) => {
  if (
    !process.env.CRON_SECRET ||
    req.get("x-cron-secret") !== process.env.CRON_SECRET
  ) {
    return res.sendStatus(401);
  }

  res.json({ started: true });
  runTripReminders();
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  }
}

startServer();