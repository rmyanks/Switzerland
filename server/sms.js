const itinerary = require("./itinerary");
const { getWeather, clothingRecommendation } = require("./weather");

/**
 * Build the daily message for a given date (defaults to today).
 */
async function buildDailyMessage(dateOverride) {
  const today =
    dateOverride ||
    new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local time

  const events = itinerary.filter((e) => e.date === today);

  if (events.length === 0) {
    return null; // No itinerary for today — skip
  }

  // Get weather for the first event's location
  const loc = events[0];
  let weather;
  try {
    weather = await getWeather(loc.lat, loc.lon);
  } catch (err) {
    console.error("Weather fetch failed:", err.message);
    weather = null;
  }

  let msg = `Good morning! Here's today's plan:\n\n`;

  for (const ev of events) {
    msg += `${ev.startTime}–${ev.endTime}: ${ev.title}\n`;
    msg += `  ${ev.location}\n`;
    msg += `  ${ev.description}\n\n`;
  }

  if (weather) {
    msg += `Weather: ${weather.temp}°C (feels like ${weather.feelsLike}°C), ${weather.description}\n\n`;
    const clothing = clothingRecommendation(weather);
    msg += `What to wear:\n`;
    for (const tip of clothing) {
      msg += `• ${tip}\n`;
    }
  }

  return msg;
}

/**
 * Send daily texts to all subscribers whose local time is ~7 AM.
 * Called hourly by the cron job.
 */
async function sendDailyTexts(subscribers) {
  if (!subscribers || subscribers.length === 0) return;

  // Check which subscribers should get a text this hour
  const now = new Date();

  for (const sub of subscribers) {
    // Get current hour in subscriber's timezone
    const localHour = parseInt(
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        hour12: false,
        timeZone: sub.timezone,
      }).format(now),
      10
    );

    if (localHour !== 7) continue; // Only send at 7 AM local

    // Get the date in the trip's timezone (Europe/Zurich)
    const tripDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Zurich",
    }).format(now);

    const message = await buildDailyMessage(tripDate);
    if (!message) continue; // No events today

    try {
      await sendSMS(sub.phone, message);
      console.log(`Sent daily text to ${sub.phone}`);
    } catch (err) {
      console.error(`Failed to send to ${sub.phone}:`, err.message);
    }
  }
}

/**
 * Send an SMS via Twilio.
 */
async function sendSMS(to, body) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !from ||
      accountSid === "your_account_sid") {
    console.log("[SMS Preview — Twilio not configured]");
    console.log(`To: ${to}`);
    console.log(`Message:\n${body}\n`);
    return;
  }

  const twilio = require("twilio")(accountSid, authToken);
  await twilio.messages.create({ body, from, to });
}

module.exports = { buildDailyMessage, sendDailyTexts, sendSMS };
