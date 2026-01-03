
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { WeatherData } from '../types';
import { WeatherIcon } from './WeatherIcons';

interface HourlyForecastProps {
  data: WeatherData['hourly'];
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ data }) => {
  return (
    <div className="glass rounded-3xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold">Rain Forecast</h3>
          <p className="text-slate-400 text-xs">Hourly precipitation volume (mm)</p>
        </div>
        <span className="text-slate-400 text-sm">Next 24 hours</span>
      </div>

      <div className="h-48 w-full mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(val) => `${val}mm`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#f8fafc' }}
              itemStyle={{ color: '#0ea5e9' }}
              formatter={(value: number) => [`${value} mm`, 'Precipitation']}
            />
            <Area 
              type="monotone" 
              dataKey="rain" 
              stroke="#0ea5e9" 
              fillOpacity={1} 
              fill="url(#colorRain)" 
              strokeWidth={3} 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex overflow-x-auto pb-4 gap-6 no-scrollbar">
        {data.map((hour, idx) => (
          <div key={idx} className="flex flex-col items-center min-w-[70px] group transition-all">
            <span className="text-slate-400 text-xs mb-2">{hour.time}</span>
            <WeatherIcon condition={hour.condition} className="w-8 h-8 text-blue-400 mb-2" />
            
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-bold text-base text-white">{hour.temp}°</span>
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.5C8.5 21.5 5.5 18.5 5.5 15C5.5 12.5 7 10 9 7.5L12 3L15 7.5C17 10 18.5 12.5 18.5 15C18.5 18.5 15.5 21.5 12 21.5Z" />
                </svg>
                <span className="text-cyan-400 text-xs font-medium">{hour.rain} mm</span>
              </div>
              <span className="text-slate-500 text-[10px]">{hour.pop}% prob.</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
