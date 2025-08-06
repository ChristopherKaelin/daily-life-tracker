// Weather API configuration
const WEATHER_API_KEY = 'your-api-key-here';
const WEATHER_BASE_URL = 'https://api.weatherapi.com/v1/current.json';

// Fetch weather data for a city
async function getWeatherData(city) {
  try {
    const url = `${WEATHER_BASE_URL}?key=${weatherKey}&q=${encodeURIComponent(city)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      temperature: Math.round(data.current.temp_f),
      condition: data.current.condition.text,
      city: data.location.name,
      icon: data.current.condition.icon,
      humidity: data.current.humidity,
      feels_like: data.current.feelslike_f
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    return {
      error: true,
      message: `Unable to retrieve weather data for ${city}.`
    };
  }
}

// Helper functions for formatting weather data
function formatTemperature(temp, showUnit = true) {
  const roundedTemp = Math.round(temp);
  return showUnit ? `${roundedTemp}°F` : roundedTemp.toString();
}

function formatHumidity(humidity) {
  return `${Math.round(humidity)}%`;
}

function formatFeelsLike(feelsLike) {
  return `Feels like ${Math.round(feelsLike)}°F`;
}

function formatWeatherIcon(iconUrl) {
  // WeatherAPI returns URLs starting with //, add https:
  if (iconUrl && iconUrl.startsWith('//')) {
    return `https:${iconUrl}`;
  }
  return iconUrl || '';
}

// Main formatting function for complete weather display
function formatWeatherDisplay(weather) {
  if (weather.error) {
    return weather.message;
  }
  
  return {
    temperature: formatTemperature(weather.temperature),
    condition: weather.condition,
    feelsLike: formatFeelsLike(weather.feels_like),
    humidity: formatHumidity(weather.humidity),
    icon: formatWeatherIcon(weather.icon),
    city: weather.city
  };
}

function generateWeatherDisplay() {
  const userSettings = getUserSettings();
  const userCity = userSettings.city || 'Lexington, KY';
 
  // Test weather API
    getWeatherData(userCity).then(weather => {
      const formatted = formatWeatherDisplay(weather);
    });
}
