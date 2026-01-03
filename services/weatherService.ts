
import { WeatherData } from '../types';

// Croissy-sur-Seine coordinates
const LAT = 48.878;
const LON = 2.144;

const weatherCodeMap: Record<number, string> = {
  0: "Clear Sky",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing Rime Fog",
  51: "Light Drizzle",
  53: "Moderate Drizzle",
  55: "Dense Drizzle",
  61: "Slight Rain",
  63: "Moderate Rain",
  65: "Heavy Rain",
  71: "Slight Snow Fall",
  73: "Moderate Snow Fall",
  75: "Heavy Snow Fall",
  80: "Slight Rain Showers",
  81: "Moderate Rain Showers",
  82: "Violent Rain Showers",
  95: "Thunderstorm",
};

/**
 * Fetches current, hourly and daily weather data for Croissy-sur-Seine.
 */
export const fetchWeatherForCroissy = async (): Promise<WeatherData> => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,precipitation_probability,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FParis`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  const data = await response.json();

  const currentCondition = weatherCodeMap[data.current.weather_code] || "Cloudy";

  // Map hourly data for the next 24 hours
  const hourly = data.hourly.time.slice(0, 24).map((time: string, i: number) => ({
    time: new Date(time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(data.hourly.temperature_2m[i]),
    condition: weatherCodeMap[data.hourly.weather_code[i]] || "Cloudy",
    pop: data.hourly.precipitation_probability[i],
    rain: data.hourly.precipitation[i]
  }));

  // Map daily data
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daily = data.daily.time.map((time: string, i: number) => {
    const date = new Date(time);
    const dayName = i === 0 ? "Today" : dayNames[date.getDay()];
    const condition = weatherCodeMap[data.daily.weather_code[i]] || "Cloudy";
    
    return {
      day: dayName,
      high: Math.round(data.daily.temperature_2m_max[i]),
      low: Math.round(data.daily.temperature_2m_min[i]),
      condition: condition,
      description: `${condition} expected throughout the day.`
    };
  });

  return {
    current: {
      temp: Math.round(data.current.temperature_2m),
      condition: currentCondition,
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m),
      feelsLike: Math.round(data.current.apparent_temperature),
      uvIndex: "Low",
      description: `Currently ${currentCondition.toLowerCase()} in Croissy-sur-Seine.`
    },
    hourly,
    daily
  };
};
