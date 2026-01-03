
import React, { useState, useEffect, useCallback } from 'react';
import { WeatherData } from './types';
import { fetchWeatherForCroissy } from './services/weatherService';
import { WeatherIcon } from './components/WeatherIcons';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherForCroissy();
      setWeather(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Failed to load weather:", err);
      setError("Unable to retrieve weather data for Croissy-sur-Seine. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold">Checking Croissy-sur-Seine Weather...</h2>
        <p className="text-slate-400 mt-2">Connecting to meteorological sensors</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
        <div className="glass rounded-3xl p-8 max-w-md w-full text-center">
          <div className="text-red-400 mb-4 flex justify-center">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-4">Network Error</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button 
            onClick={loadData}
            className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-blue-400 mb-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              </svg>
              <span className="font-semibold uppercase tracking-wider text-xs">Ile-de-France, France</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white">Croissy-sur-Seine</h1>
          </div>
          <div className="text-slate-400 text-sm md:text-right">
            <p>Last updated: {lastUpdated}</p>
            <button 
              onClick={loadData}
              className="mt-2 text-blue-400 hover:text-blue-300 flex items-center md:justify-end gap-1 font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-[40px] p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500/20 blur-[100px] rounded-full"></div>
              
              <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest">Local Forecast</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-6">
                    <span className="text-8xl font-black text-white">{weather?.current.temp}°</span>
                    <WeatherIcon condition={weather?.current.condition || ""} className="w-20 h-20 text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-200 mt-2 capitalize">{weather?.current.condition}</h2>
                  <p className="text-slate-400 mt-2 max-w-sm">{weather?.current.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                  <div className="glass bg-white/5 p-4 rounded-3xl border-white/5">
                    <p className="text-slate-400 text-xs uppercase mb-1">Apparent</p>
                    <p className="text-xl font-bold">{weather?.current.feelsLike}°</p>
                  </div>
                  <div className="glass bg-white/5 p-4 rounded-3xl border-white/5">
                    <p className="text-slate-400 text-xs uppercase mb-1">Wind</p>
                    <p className="text-xl font-bold">{weather?.current.windSpeed} km/h</p>
                  </div>
                  <div className="glass bg-white/5 p-4 rounded-3xl border-white/5">
                    <p className="text-slate-400 text-xs uppercase mb-1">Humidity</p>
                    <p className="text-xl font-bold">{weather?.current.humidity}%</p>
                  </div>
                  <div className="glass bg-white/5 p-4 rounded-3xl border-white/5">
                    <p className="text-slate-400 text-xs uppercase mb-1">Reliability</p>
                    <p className="text-xl font-bold">High</p>
                  </div>
                </div>
              </div>
            </div>

            {weather && <HourlyForecast data={weather.hourly} />}
          </div>

          <div className="lg:col-span-1">
            {weather && <DailyForecast data={weather.daily} />}
            
            <div className="mt-8 glass rounded-3xl p-6 bg-blue-600/10 border-blue-500/20">
              <h4 className="font-bold text-blue-400 mb-2">Local Climate Insight</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Croissy-sur-Seine's proximity to the river can cause localized temperature variances. Forecasts are synchronized with the nearest metropolitan weather station.
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-16 pt-8 border-t border-slate-900 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Croissy Weather Service. Data provided by Open-Meteo.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
