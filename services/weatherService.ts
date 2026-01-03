
import { WeatherData } from "../types";

// Coordinates for Croissy-sur-Seine
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
  71: "Slight Snow",
  73: "Moderate Snow",
  75: "Heavy Snow",
  80: "Slight Rain Showers",
  81: "Moderate Rain Showers",
  82: "Violent Rain Showers",
  95: "Thunderstorm",
};

export const fetchWeatherForCroissy = async (): Promise<WeatherData> => {
  // Added 'precipitation' to the hourly fields
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,precipitation_probability,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FParis`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch weather data");
  
  const data = await response.json();

  const current = {
    temp: Math.round(data.current.temperature_2m),
    condition: weatherCodeMap[data.current.weather_code] || "Clear",
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m),
    feelsLike: Math.round(data.current.apparent_temperature),
    uvIndex: "N/A",
    description: `Current condition in Croissy-sur-Seine is ${weatherCodeMap[data.current.weather_code] || "clear"}.`,
  };

  const hourly = data.hourly.time.slice(0, 24).map((time: string, i: number) => ({
    time: new Date(time).getHours() + ":00",
    temp: Math.round(data.hourly.temperature_2m[i]),
    condition: weatherCodeMap[data.hourly.weather_code[i]] || "Clear",
    pop: data.hourly.precipitation_probability[i],
    rain: data.hourly.precipitation[i], // Rain volume in mm
  }));

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daily = data.daily.time.map((date: string, i: number) => ({
    day: i === 0 ? "Today" : dayNames[new Date(date).getDay()],
    high: Math.round(data.daily.temperature_2m_max[i]),
    low: Math.round(data.daily.temperature_2m_min[i]),
    condition: weatherCodeMap[data.daily.weather_code[i]] || "Clear",
    description: weatherCodeMap[data.daily.weather_code[i]] || "Clear",
  }));

  return { current, hourly, daily };
};
