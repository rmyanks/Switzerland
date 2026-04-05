// Sample itinerary data — customize with your actual trip details!
// Dates are in YYYY-MM-DD format. Times are 24h local time.

const itinerary = [
  // ──── Switzerland ────
  {
    id: "day1-arrival",
    date: "2026-07-11",
    title: "Arrive in Zürich",
    location: "Zürich, Switzerland",
    lat: 47.3769,
    lon: 8.5417,
    startTime: "14:00",
    endTime: "18:00",
    description: "Arrive at Zürich Airport. Pick up luggage, take the train to the hotel, and settle in. Evening stroll along the Limmat River.",
    category: "travel"
  },
  {
    id: "day2-zurich",
    date: "2026-07-12",
    title: "Explore Zürich Old Town",
    location: "Zürich, Switzerland",
    lat: 47.3769,
    lon: 8.5417,
    startTime: "09:00",
    endTime: "17:00",
    description: "Visit Grossmünster, stroll through Bahnhofstrasse, explore the Swiss National Museum. Lunch at a local café.",
    category: "sightseeing"
  },
  {
    id: "day3-lucerne",
    date: "2026-07-13",
    title: "Day Trip to Lucerne",
    location: "Lucerne, Switzerland",
    lat: 47.0502,
    lon: 8.3093,
    startTime: "08:00",
    endTime: "19:00",
    description: "Train to Lucerne. Walk across Chapel Bridge, visit the Lion Monument, and take a boat cruise on Lake Lucerne.",
    category: "sightseeing"
  },
  {
    id: "day4-interlaken",
    date: "2026-07-14",
    title: "Travel to Interlaken",
    location: "Interlaken, Switzerland",
    lat: 46.6863,
    lon: 7.8632,
    startTime: "09:00",
    endTime: "18:00",
    description: "Scenic train ride to Interlaken. Afternoon paragliding or leisurely walk along the Höheweg promenade between the two lakes.",
    category: "travel"
  },
  {
    id: "day5-jungfrau",
    date: "2026-07-15",
    title: "Jungfraujoch – Top of Europe",
    location: "Jungfraujoch, Switzerland",
    lat: 46.5472,
    lon: 7.9853,
    startTime: "07:30",
    endTime: "17:00",
    description: "Take the cogwheel train to Jungfraujoch (3,454m). Visit the Ice Palace, Sphinx Observatory, and enjoy panoramic Alpine views.",
    category: "sightseeing"
  },
  {
    id: "day6-bern",
    date: "2026-07-16",
    title: "Visit Bern",
    location: "Bern, Switzerland",
    lat: 46.9480,
    lon: 7.4474,
    startTime: "09:00",
    endTime: "18:00",
    description: "Explore the UNESCO-listed Old Town of Bern. See the Zytglogge clock tower, Bear Park, and the Federal Palace.",
    category: "sightseeing"
  },
  // ──── Italy ────
  {
    id: "day7-milan",
    date: "2026-07-17",
    title: "Travel to Milan",
    location: "Milan, Italy",
    lat: 45.4642,
    lon: 9.1900,
    startTime: "08:00",
    endTime: "18:00",
    description: "Train from Bern to Milan. Check in to hotel. Visit the Duomo di Milano and Galleria Vittorio Emanuele II.",
    category: "travel"
  },
  {
    id: "day8-como",
    date: "2026-07-18",
    title: "Lake Como Day Trip",
    location: "Lake Como, Italy",
    lat: 45.9880,
    lon: 9.2575,
    startTime: "08:30",
    endTime: "19:00",
    description: "Ferry hop between Bellagio, Varenna, and Menaggio. Enjoy lakeside gelato and stunning mountain-lake scenery.",
    category: "sightseeing"
  },
  {
    id: "day9-venice",
    date: "2026-07-19",
    title: "Travel to Venice",
    location: "Venice, Italy",
    lat: 45.4408,
    lon: 12.3155,
    startTime: "08:00",
    endTime: "18:00",
    description: "High-speed train to Venice. Water taxi to hotel. Evening gondola ride through the canals.",
    category: "travel"
  },
  {
    id: "day10-venice",
    date: "2026-07-20",
    title: "Explore Venice",
    location: "Venice, Italy",
    lat: 45.4408,
    lon: 12.3155,
    startTime: "09:00",
    endTime: "20:00",
    description: "Visit St. Mark's Basilica, Doge's Palace, and Rialto Bridge. Get lost in the narrow streets. Seafood dinner at a canal-side restaurant.",
    category: "sightseeing"
  },
  {
    id: "day11-florence",
    date: "2026-07-21",
    title: "Travel to Florence",
    location: "Florence, Italy",
    lat: 43.7696,
    lon: 11.2558,
    startTime: "09:00",
    endTime: "18:00",
    description: "Train to Florence. Visit the Uffizi Gallery and Ponte Vecchio. Climb to Piazzale Michelangelo for sunset views.",
    category: "travel"
  },
  {
    id: "day12-florence",
    date: "2026-07-22",
    title: "Florence Art & Food",
    location: "Florence, Italy",
    lat: 43.7696,
    lon: 11.2558,
    startTime: "09:00",
    endTime: "21:00",
    description: "Morning at the Accademia Gallery (David). Afternoon food tour through San Lorenzo Market. Evening passeggiata and gelato.",
    category: "sightseeing"
  },
  {
    id: "day13-rome",
    date: "2026-07-23",
    title: "Travel to Rome",
    location: "Rome, Italy",
    lat: 41.9028,
    lon: 12.4964,
    startTime: "09:00",
    endTime: "18:00",
    description: "Train to Rome. Visit the Colosseum and Roman Forum. Evening stroll to Trevi Fountain.",
    category: "travel"
  },
  {
    id: "day14-rome",
    date: "2026-07-24",
    title: "Vatican & Farewell Dinner",
    location: "Rome, Italy",
    lat: 41.9028,
    lon: 12.4964,
    startTime: "08:00",
    endTime: "22:00",
    description: "Morning at Vatican Museums and Sistine Chapel. Afternoon at St. Peter's Basilica. Farewell family dinner in Trastevere.",
    category: "sightseeing"
  },
  {
    id: "day15-depart",
    date: "2026-07-25",
    title: "Depart from Rome",
    location: "Rome, Italy",
    lat: 41.9028,
    lon: 12.4964,
    startTime: "06:00",
    endTime: "10:00",
    description: "Transfer to Fiumicino Airport. Fly home with wonderful memories!",
    category: "travel"
  }
];

module.exports = itinerary;
