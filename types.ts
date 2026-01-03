
export interface WeatherData {
  current: {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    feelsLike: number;
    uvIndex: string;
    description: string;
  };
  hourly: Array<{
    time: string;
    temp: number;
    condition: string;
    pop: number; // Probability of precipitation in %
    rain: number; // Precipitation volume in mm
  }>;
  daily: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    description: string;
  }>;
}
