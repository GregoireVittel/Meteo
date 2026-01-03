
import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// --- Types ---
interface WeatherData {
  current: {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    feelsLike: number;
    description: string;
  };
  hourly: Array<{
    time: string;
    temp: number;
    condition: string;
    pop: number; 
    rain: number; // mm
    ml: number;   // ml/h
  }>;
  daily: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
  }>;
}

// --- Icons Component ---
const WeatherIcon = ({ condition, className = "w-6 h-6" }: { condition: string; className?: string }) => {
  const c = condition.toLowerCase();
  if (c.includes('sun') || c.includes('clear')) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <circle cx="12" cy="12" r="5" /><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    );
  }
  if (c.includes('rain') || c.includes('shower') || c.includes('drizzle')) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path d="M16 13v8m-4-7v6m-4-5v4M20 10A5.5 5.5 0 0 0 14.5 4.5 5.5 5.5 0 0 0 9 10 4 4 0 0 0 5 14c0 2.2 1.8 4 4 4h9a4 4 0 0 0 4-4 4 4 0 0 0-3-3.8V10z" />
      </svg>
    );
  }
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M17.5 19c2.5 0 4.5-2 4.5-4.5 0-2.3-1.7-4.2-3.9-4.5C17.6 6.3 14.5 4 11 4 7.7 4 5 6.3 4.4 9.4 2.4 10 1 11.8 1 14c0 2.8 2.2 5 5 5h11.5z" />
    </svg>
  );
};

// --- Weather Logic ---
const LAT = 48.878;
const LON = 2.144;
const weatherCodeMap: Record<number, string> = {
  0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
  45: "Fog", 51: "Drizzle", 61: "Rain", 80: "Rain Showers", 95: "Storm"
};

const fetchWeather = async (): Promise<WeatherData> => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,precipitation_probability,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FParis`;
  const res = await fetch(url);
  const data = await res.json();

  const hourly = data.hourly.time.slice(0, 24).map((t: string, i: number) => ({
    time: new Date(t).getHours() + ":00",
    temp: Math.round(data.hourly.temperature_2m[i]),
    condition: weatherCodeMap[data.hourly.weather_code[i]] || "Cloudy",
    pop: data.hourly.precipitation_probability[i],
    rain: data.hourly.precipitation[i],
    ml: Math.round(data.hourly.precipitation[i] * 1000)
  }));

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daily = data.daily.time.map((d: string, i: number) => ({
    day: i === 0 ? "Today" : dayNames[new Date(d).getDay()],
    high: Math.round(data.daily.temperature_2m_max[i]),
    low: Math.round(data.daily.temperature_2m_min[i]),
    condition: weatherCodeMap[data.daily.weather_code[i]] || "Cloudy"
  }));

  return {
    current: {
      temp: Math.round(data.current.temperature_2m),
      condition: weatherCodeMap[data.current.weather_code] || "Clear",
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m),
      feelsLike: Math.round(data.current.apparent_temperature),
      description: `In Croissy-sur-Seine, it's currently ${weatherCodeMap[data.current.weather_code] || "clear"}.`
    },
    hourly,
    daily
  };
};

// --- App Component ---
const App = () => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-white">Croissy-sur-Seine</h1>
        <p className="text-slate-400">Weather Forecast</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 glass rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-7xl font-bold">{data.current.temp}°</span>
              <h2 className="text-2xl font-bold text-slate-300 mt-2">{data.current.condition}</h2>
            </div>
            <WeatherIcon condition={data.current.condition} className="w-16 h-16 text-blue-400" />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8 border-t border-slate-700 pt-6">
            <div>
              <p className="text-xs text-slate-500 uppercase">Wind</p>
              <p className="font-bold">{data.current.windSpeed} km/h</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Humidity</p>
              <p className="font-bold">{data.current.humidity}%</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Feels</p>
              <p className="font-bold">{data.current.feelsLike}°</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 overflow-y-auto max-h-[400px]">
          <h3 className="font-bold mb-4 border-b border-slate-700 pb-2">Next 7 Days</h3>
          <div className="space-y-4">
            {data.daily.map((d, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="w-12 text-slate-400">{d.day}</span>
                <WeatherIcon condition={d.condition} className="w-5 h-5 text-blue-300" />
                <span className="font-bold w-12 text-right">{d.high}° <span className="text-slate-600 font-normal">{d.low}°</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-3xl p-6">
        <h3 className="font-bold text-xl mb-1">Precipitation Volume</h3>
        <p className="text-xs text-slate-500 mb-6">Milliliters per hour (ml/h)</p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.hourly}>
              <defs>
                <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                formatter={(v) => [`${v} ml/h`, 'Rain Volume']}
              />
              <Area type="monotone" dataKey="ml" stroke="#0ea5e9" fill="url(#rainGrad)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex overflow-x-auto mt-4 gap-6 no-scrollbar">
          {data.hourly.map((h, i) => (
            <div key={i} className="flex flex-col items-center min-w-[60px]">
              <span className="text-[10px] text-slate-500">{h.time}</span>
              <span className="text-xs font-bold text-cyan-400 mt-1">{h.ml} ml</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
