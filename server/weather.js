const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

/**
 * Fetch current weather for a location.
 * Returns { temp, feelsLike, description, icon, humidity, windSpeed }
 */
async function getWeather(lat, lon) {
  if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === "your_openweather_api_key") {
    // Return mock weather when no API key is configured
    return {
      temp: 22,
      feelsLike: 21,
      description: "partly cloudy",
      humidity: 55,
      windSpeed: 12,
    };
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather API error: ${res.status}`);
  }
  const data = await res.json();

  return {
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6), // m/s -> km/h
  };
}

/**
 * Generate clothing recommendations based on weather.
 */
function clothingRecommendation(weather) {
  const tips = [];
  const temp = weather.feelsLike;

  if (temp <= 5) {
    tips.push("Heavy winter coat, layers, gloves, and a warm hat");
  } else if (temp <= 12) {
    tips.push("Warm jacket or fleece, long pants, and a scarf");
  } else if (temp <= 18) {
    tips.push("Light jacket or sweater with long pants");
  } else if (temp <= 25) {
    tips.push("T-shirt and light pants or shorts");
  } else {
    tips.push("Light, breathable clothing — it's hot!");
  }

  const desc = weather.description.toLowerCase();
  if (desc.includes("rain") || desc.includes("drizzle") || desc.includes("shower")) {
    tips.push("Bring a rain jacket or umbrella");
  }

  if (weather.windSpeed > 25) {
    tips.push("It's windy — a windbreaker is recommended");
  }

  tips.push("Comfortable walking shoes are a must");

  return tips;
}

module.exports = { getWeather, clothingRecommendation };
