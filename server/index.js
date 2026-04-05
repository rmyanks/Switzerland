require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { CronJob } = require("cron");
const itinerary = require("./itinerary");
const { sendDailyTexts } = require("./sms");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// ── API: Get itinerary ──
app.get("/api/itinerary", (_req, res) => {
  res.json(itinerary);
});

// ── API: SMS subscribe ──
const subscribers = []; // In production, use a database

app.get("/api/sms/subscribers", (_req, res) => {
  res.json(
    subscribers.map((s) => ({
      phone: s.phone.slice(0, 4) + "****" + s.phone.slice(-2),
      timezone: s.timezone,
    }))
  );
});

app.post("/api/sms/subscribe", (req, res) => {
  const { phone, timezone } = req.body;

  if (!phone || !timezone) {
    return res.status(400).json({ error: "Phone number and timezone are required." });
  }

  // Basic phone validation
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  if (!/^\+?\d{10,15}$/.test(cleaned)) {
    return res.status(400).json({ error: "Please enter a valid phone number." });
  }

  // Prevent duplicates
  if (subscribers.some((s) => s.phone === cleaned)) {
    return res.status(409).json({ error: "This number is already subscribed." });
  }

  subscribers.push({ phone: cleaned, timezone });
  console.log(`New SMS subscriber: ${cleaned} (${timezone})`);
  res.json({ message: "Subscribed successfully!" });
});

app.post("/api/sms/unsubscribe", (req, res) => {
  const { phone } = req.body;
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  const idx = subscribers.findIndex((s) => s.phone === cleaned);
  if (idx === -1) {
    return res.status(404).json({ error: "Phone number not found." });
  }
  subscribers.splice(idx, 1);
  res.json({ message: "Unsubscribed successfully." });
});

// ── API: Preview today's message (for testing) ──
app.get("/api/sms/preview", async (_req, res) => {
  const { buildDailyMessage } = require("./sms");
  try {
    const msg = await buildDailyMessage();
    res.json({ message: msg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Cron: Send daily texts ──
// Runs every hour on the hour; sendDailyTexts checks each subscriber's
// timezone to see if it's ~7 AM for them.
const cronJob = new CronJob("0 * * * *", () => {
  sendDailyTexts(subscribers).catch((err) =>
    console.error("Error sending daily texts:", err)
  );
});
cronJob.start();

// ── Serve SPA fallback ──
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
