
import React from 'react';

interface WeatherIconProps {
  condition: string;
  className?: string;
}

/**
 * Returns an appropriate SVG icon based on the provided weather condition string.
 */
export const WeatherIcon: React.FC<WeatherIconProps> = ({ condition, className = "w-6 h-6" }) => {
  const c = condition.toLowerCase();
  
  // Sunny / Clear
  if (c.includes('sun') || c.includes('clear')) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  
  // Rain / Showers / Storms
  if (c.includes('rain') || c.includes('shower') || c.includes('drizzle') || c.includes('storm')) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 13v8m-4-7v6m-4-5v4M20 10A5.5 5.5 0 0 0 14.5 4.5 5.5 5.5 0 0 0 9 10 4 4 0 0 0 5 14c0 2.2 1.8 4 4 4h9a4 4 0 0 0 4-4 4 4 0 0 0-3-3.8V10z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  
  // Default / Cloudy
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.5 19c2.5 0 4.5-2 4.5-4.5 0-2.3-1.7-4.2-3.9-4.5C17.6 6.3 14.5 4 11 4 7.7 4 5 6.3 4.4 9.4 2.4 10 1 11.8 1 14c0 2.8 2.2 5 5 5h11.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
