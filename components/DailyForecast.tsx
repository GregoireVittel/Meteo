
import React from 'react';
import { WeatherData } from '../types';
import { WeatherIcon } from './WeatherIcons';

interface DailyForecastProps {
  data: WeatherData['daily'];
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ data }) => {
  return (
    <div className="glass rounded-3xl p-6">
      <h3 className="text-xl font-bold mb-6">7-Day Forecast</h3>
      <div className="space-y-4">
        {data.map((day, idx) => (
          <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0 group hover:bg-slate-700/20 transition-colors px-2 rounded-xl">
            <div className="w-24">
              <span className="font-medium text-slate-200">{day.day}</span>
            </div>
            
            <div className="flex items-center gap-3 flex-1 justify-center">
              <WeatherIcon condition={day.condition} className="w-6 h-6 text-blue-400" />
              <span className="text-sm text-slate-400 hidden sm:inline-block capitalize">{day.condition}</span>
            </div>

            <div className="flex items-center gap-4 w-28 justify-end">
              <span className="font-bold text-blue-400 text-lg">{day.high}°</span>
              <span className="text-slate-500 text-lg">{day.low}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
