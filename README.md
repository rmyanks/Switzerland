# Switzerland & Italy 2026 — Family Trip Itinerary

A web app for viewing and sharing a family trip itinerary with calendar export and daily SMS notifications.

## Features

- **Interactive itinerary** — Browse day-by-day events with location and time details
- **Calendar export** — Download `.ics` files or add events directly to Google Calendar
- **Daily SMS texts** — Sign up to receive a morning text with the day's plan and weather-based clothing recommendations

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file and add your API keys
cp .env.example .env

# Start the server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

Edit `.env` with your credentials:

| Variable | Description |
|---|---|
| `TWILIO_ACCOUNT_SID` | Your Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Your Twilio Auth Token |
| `TWILIO_PHONE_NUMBER` | Your Twilio phone number (e.g. `+1234567890`) |
| `OPENWEATHER_API_KEY` | Free API key from [OpenWeatherMap](https://openweathermap.org/api) |
| `PORT` | Server port (default: 3000) |

> **Note:** The app works without API keys — weather data will be mocked and SMS messages will be logged to the console instead of sent.

## Customizing the Itinerary

Edit `server/itinerary.js` to update destinations, dates, times, and descriptions. Each event has:

- `id` — Unique identifier
- `date` — Date in `YYYY-MM-DD` format
- `title` — Event name
- `location` — City and country
- `lat` / `lon` — Coordinates (used for weather)
- `startTime` / `endTime` — 24h local time
- `description` — What you'll be doing
- `category` — `travel` or `sightseeing`

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/itinerary` | GET | Returns full itinerary as JSON |
| `/api/sms/subscribe` | POST | Subscribe a phone number for daily texts |
| `/api/sms/unsubscribe` | POST | Unsubscribe a phone number |
| `/api/sms/subscribers` | GET | List subscribers (masked numbers) |
| `/api/sms/preview` | GET | Preview today's SMS message |

## Architecture

```
public/          Static frontend (HTML, CSS, JS)
server/
  index.js       Express server & cron job
  itinerary.js   Trip data
  sms.js         SMS messaging & daily text builder
  weather.js     Weather fetching & clothing recommendations
```

## Deployment

This app can be deployed to any Node.js hosting platform (Render, Railway, Fly.io, Heroku, etc.). Set the environment variables in your platform's dashboard.
