# 🌍 SmartTravel – AI Powered Collaborative Travel Planner

SmartTravel is a full-stack AI-powered travel planning platform that helps users create personalized itineraries, estimate trip budgets, collaborate with friends, and manage travel plans from a single dashboard.

Built using the MERN stack with Gemini AI integration, Google OAuth authentication, and real-time collaboration features.

---

## 🚀 Live Demo

Live:[https://smart-travel-alpha.vercel.app/]

---




# ✨ Features

## 🤖 AI-Powered Trip Planning

- Generate personalized itineraries using Gemini AI
- Destination-based recommendations
- Day-wise travel plans
- Activity suggestions
- Travel budget estimation as per preferences added
- Collaborative Workspace to edit itinerary
- Notification system that notifies all collaborators changes made in itinerary

---

## 🔐 Authentication & Security

- JWT Authentication
- Google OAuth 2.0 Login
- Protected Routes
- Secure User Sessions

---

## 👥 Collaborative Planning

- Invite collaborators
- Shared itinerary editing
- Team-based trip planning
- Activity updates across collaborators

---

## 🔔 Notification System

Users receive notifications when:

- Added as a collaborator
- New activities are added
- Trip updates occur
- Invitations are accepted

---

## 📅 Itinerary Management

- Add Days
- Delete Days
- Add Activities
- Remove Activities
- Day-wise planning structure

Morning → Afternoon → Evening

---

## 💰 Budget Tracking

Automatic budget breakdown:

- Accommodation
- Transportation
- Food & Dining
- Activities
- Miscellaneous Expenses

---

## 📊 Trip Dashboard

- Upcoming Trips
- Draft Trips
- Completed Trips
- Search Trips
- Quick Navigation

---

# 🛠️ Tech Stack

## Frontend

- React.js
- React Router
- Tailwind CSS
- Axios
- Framer Motion
- Lucide Icons

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose

## Authentication

- JWT
- Google OAuth 2.0
- Passport.js

## AI Integration

- Gemini API

---

# 🔄 User Workflow

## 1️⃣ Register / Login

Users can:

- Register using email and password
- Login using Google OAuth

---

## 2️⃣ Create a Trip

Enter:

- Destination
- Travel Dates
- Number of Travelers
- Preferences

Examples:

- Budget Friendly
- Adventure
- Luxury
- Cultural

---

## 3️⃣ Generate AI Itinerary

SmartTravel sends trip information to Gemini AI.

AI generates:

- Day-wise itinerary
- Activities
- Travel suggestions
- Budget estimation

---

## 4️⃣ Customize the Plan

Users can:

- Add new days
- Remove days
- Add activities
- Delete activities
-Look places for activities with the help of integrated map.
---

## 5️⃣ Invite Collaborators

Search users by username.

Invite them to:

- View trip
- Edit itinerary
- Collaborate on planning

---

## 6️⃣ Receive Notifications

Collaborators receive notifications when:

- Added to a trip
- Activities are updated
- Plans change

---

## 7️⃣ Track Trip Progress

Trips are automatically categorized as:

- Draft
- Upcoming
- Completed

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/Suhanii15/Smart_Travel.git
```

```bash
cd SmartTravel
```

---

## Backend Setup

```bash
cd server
npm install
```

Create `.env`

```env
PORT=5000

MONGO_URI=

JWT_SECRET=

GEMINI_API_KEY=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

GOOGLE_CALLBACK_URL=
```

Start backend:

```bash
npm run server
```

---

## Frontend Setup

```bash
cd client
npm install
```

Start frontend:

```bash
npm run dev
```

---

# Future Improvements

- Twilio SMS Trip Reminders
- Email Invitations
- Real-Time Collaboration using Socket.IO
- Expense Splitting
- Hotel Recommendations
- Flight Recommendations
- Maps Integration
- Weather Forecast Integration

---
