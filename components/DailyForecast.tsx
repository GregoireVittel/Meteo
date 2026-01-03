
import React from 'react';
import { WeatherIcon } from './WeatherIcons';

interface DailyData {
  day: string;
  high: number;
  low: number;
  condition: string;
  description: string;
}

interface DailyForecastProps {
  data: DailyData[];
}

/**
 * Renders a summary of the weather for the next 7 days.
 */
export const DailyForecast: React.FC<DailyForecastProps> = ({ data }) => {
  return (
    <div className="glass rounded-[40px] p-8">
      <h3 className="text-2xl font-bold text-white mb-6">7-Day Forecast</h3>
      <div className="space-y-6">
        {data.map((day, i) => (
          <div key={i} className="group flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
            <div className="flex items-center gap-4 w-1/3">
              <span className={`text-sm font-bold ${i === 0 ? 'text-blue-400' : 'text-slate-400'}`}>
                {day.day}
              </span>
            </div>
            
            <div className="flex items-center justify-center gap-3 w-1/3">
              <WeatherIcon condition={day.condition} className="w-6 h-6 text-blue-400" />
              <span className="text-xs text-slate-500 hidden md:inline capitalize">{day.condition}</span>
            </div>

            <div className="flex items-center justify-end gap-4 w-1/3">
              <span className="text-sm font-bold text-white">{day.high}°</span>
              <span className="text-sm text-slate-600">{day.low}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
