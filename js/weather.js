// Weather API configuration
const WEATHER_API_KEY = 'your-api-key-here';
const WEATHER_BASE_URL = 'https://api.weatherapi.com/v1/current.json';

// Fetch weather data for a city
async function getWeatherData(city) {
  try {
    const url = `${WEATHER_BASE_URL}?key=${weatherKey}&q=${encodeURIComponent(city)}`;
    console.log(url);
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