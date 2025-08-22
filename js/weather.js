// Weather API configuration
const WEATHER_API_KEY = CONFIG.WeatherAPI_KEY;
const WEATHER_BASE_URL = 'https://api.weatherapi.com/v1/current.json';
const WEATHER_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
let lastWeatherFetch = null;


/**
 * Fetches weather data for the specified city from the WeatherAPI.
 * Uses cached data if available and not forced to refresh.
 *
 * @param {string} city - The city to fetch weather for
 * @param {boolean} [userRefresh=false] - If true, forces a refresh from the API
 * @returns {Promise<Object>} Weather data or error object
 */
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
/**
 * Formats a temperature value, optionally including the unit.
 *
 * @param {number} temp - Temperature value
 * @param {boolean} [showUnit=true] - Whether to show the unit
 * @returns {string} Formatted temperature
 */
function formatTemperature(temp, showUnit = true) {
  const roundedTemp = Math.round(temp);
  return showUnit ? `${roundedTemp}°F` : roundedTemp.toString();
}

/**
 * Formats a humidity value as a percentage string.
 *
 * @param {number} humidity - Humidity value
 * @returns {string} Formatted humidity
 */
function formatHumidity(humidity) {
  return `${Math.round(humidity)}%`;
}

/**
 * Formats the "feels like" temperature string.
 *
 * @param {number} feelsLike - Feels like temperature
 * @returns {string} Formatted feels like temperature
 */
function formatFeelsLike(feelsLike) {
  return `Feels like ${Math.round(feelsLike)}°F`;
}

/**
 * Formats the weather icon URL, ensuring it uses https.
 *
 * @param {string} iconUrl - Icon URL from WeatherAPI
 * @returns {string} Formatted icon URL
 */
function formatWeatherIcon(iconUrl) {
  // WeatherAPI returns URLs starting with //, add https:
  if (iconUrl && iconUrl.startsWith('//')) {
    return `https:${iconUrl}`;
  }
  return iconUrl || '';
}

/**
 * Formats the complete weather data object for display.
 *
 * @param {Object} weather - Raw weather data object
 * @returns {Object|string} Formatted weather display object or error message
 */
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


/**
 * Fetches and displays weather data for the user's city in the UI.
 */
function generateWeatherDisplay() {
  const userSettings = appUserSettings;
  const userCity = userSettings.city || 'Lexington, KY';
 
  getWeatherData(userCity)
    .then(weather => {
      if (weather === null) {
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
                <img src="${formatted.icon}" alt="${formatted.icon.alt}" class="weather-icon icon-xxl">
                ${formatted.temperature} • ${formatted.condition}
                <img class="refresh icon icon-md" src="./assets/images/refresh.svg" alt="refresh weather" onclick="generateWeatherDisplay()" title="Refresh Weather">
            `;
        }    
      }
    );
}
