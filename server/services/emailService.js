
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendTripReminder(user, trip) {
  if (!user?.email) {
    throw new Error("User email is missing");
  }

  const startDate = new Date(trip.startDate);
  const formattedDate = startDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });

  await sgMail.send({
    to: user.email,
    from: {
      email: process.env.EMAIL_FROM,
      name: "Smart Travel",
    },
    subject: `Your trip to ${trip.destination} is coming up!`,
    text: `Hi ${user.name || "traveller"}! Your trip to ${trip.destination} starts on ${formattedDate}. Open Smart Travel to review your itinerary.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto;">
        <h2>Your next adventure is almost here!</h2>
        <p>Hi ${escapeHtml(user.name || "traveller")},</p>
        <p>Your trip to <strong>${escapeHtml(trip.destination)}</strong>
        starts on ${formattedDate}.</p>
        <p>Review your itinerary and coordinate with your travel collaborators.</p>
        <a href="${process.env.CLIENT_URL}">Open Smart Travel</a>
      </div>
    `,
  });
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

module.exports = { sendTripReminder };