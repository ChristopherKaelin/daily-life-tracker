// Weather API configuration
const WEATHER_API_KEY = CONFIG.WeatherAPI_KEY;
const WEATHER_BASE_URL = 'https://api.weatherapi.com/v1/current.json';
const WEATHER_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
let lastWeatherFetch = null;


// Fetch weather data for a city
async function getWeatherData(city, userRefresh = false) {
  try {
    const now = Date.now();
    
    // Check if we have recent data and this isn't a forced refresh
    if (!userRefresh && lastWeatherFetch && (now - lastWeatherFetch) < WEATHER_CACHE_DURATION) {
      console.log('Using cached weather data (fetched within last 15 minutes)');
      return null; // Return null to indicate cached data should be used
    }

    const url = `${WEATHER_BASE_URL}?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      temperature: Math.round(data.current.temp_f),
      condition: data.current.condition.text,
      city: data.location.name,
      region: data.location.region,
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
    city: weather.city,
    region: weather.region
  };
}

function generateWeatherDisplay() {
  const userSettings = getUserSettings();
  const userCity = userSettings.city || 'Lexington, KY';
 
  getWeatherData(userCity)
    .then(weather => {
      if (weather === null) {
        console.log('Using cached weather data, no display update needed');
        return;
      }
      
      const formatted = formatWeatherDisplay(weather);
        
        // Update city header
        const weatherLocation = `${formatted.city}, ${formatted.region}`
        document.getElementById('weather-city').textContent = `${weatherLocation || city} weather: `;
        
        // Update weather data
        const weatherDataElement = document.getElementById('weather-data');
        if (weather.error) {
            weatherDataElement.textContent = formatted.message;
        } else {
            weatherDataElement.innerHTML = `
                <img src="${formatted.icon}" alt="${formatted.icon.alt}" class="weather-icon icon-xl">
                ${formatted.temperature} • ${formatted.condition}
            `;
        }    
      }
    );
}
