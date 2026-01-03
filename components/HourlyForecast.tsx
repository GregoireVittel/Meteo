
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface HourlyData {
  time: string;
  temp: number;
  condition: string;
  pop: number;
  rain: number;
}

interface HourlyForecastProps {
  data: HourlyData[];
}

/**
 * Displays hourly forecast information including a precipitation chart and temperature tiles.
 */
export const HourlyForecast: React.FC<HourlyForecastProps> = ({ data }) => {
  return (
    <div className="glass rounded-[40px] p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-white">Precipitation</h3>
          <p className="text-slate-400 text-sm">Next 24 hours probability and volume</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-slate-300">Volume (mm)</span>
          </div>
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
            <XAxis 
              dataKey="time" 
              stroke="#475569" 
              fontSize={12} 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#94a3b8' }}
              interval={2}
            />
            <YAxis hide domain={[0, 'auto']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
              cursor={{ stroke: '#334155' }}
              formatter={(value: number) => [`${value} mm`, 'Rain']}
            />
            <Area 
              type="monotone" 
              dataKey="rain" 
              stroke="#3b82f6" 
              fill="url(#rainGrad)" 
              strokeWidth={3} 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex overflow-x-auto mt-8 pb-2 gap-8 no-scrollbar">
        {data.map((h, i) => (
          <div key={i} className="flex flex-col items-center min-w-[50px]">
            <span className="text-xs text-slate-500 font-medium">{h.time}</span>
            <span className="text-lg font-bold text-white mt-1">{h.temp}°</span>
            <span className="text-[10px] font-bold text-blue-400 mt-1">{h.pop}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
