import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string;
  isOpen?: boolean;
  label?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate, isOpen = true, label = "Closes in:" }) => {
  const parseDate = (dateString: string): number => {
    if (!dateString) return 0;

    let date = new Date(dateString);
    if (!isNaN(date.getTime())) return date.getTime();

    date = new Date(dateString.replace(' ', 'T'));
    if (!isNaN(date.getTime())) return date.getTime();

    const parts = dateString.split(/[- :T]/);
    if (parts.length >= 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const hour = parts.length > 3 ? parseInt(parts[3], 10) : 0;
      const min = parts.length > 4 ? parseInt(parts[4], 10) : 0;
      const sec = parts.length > 5 ? parseInt(parts[5], 10) : 0;
      
      return new Date(year, month, day, hour, min, sec).getTime();
    }

    return 0;
  };

  const calculateTimeLeft = (): TimeLeft | null => {
    const targetTime = parseDate(targetDate);
    if (targetTime === 0) return null;

    const difference = targetTime - Date.now();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return null;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  if (!isOpen) {
    return (
        <div className="bg-red-50 text-red-600 border-red-100 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-widest border">
          Registration Closed
        </div>
    );
  }

  if (!targetDate) {
    return (
        <div className="bg-green-50 text-green-600 border-green-100 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-widest border">
          Registration Open
        </div>
    );
  }

  if (!timeLeft) {
    return (
        <div className="bg-red-50 text-red-600 border-red-100 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-widest border">
          Registration Closed
        </div>
    );
  }

  const TimeUnit: React.FC<{ value: number; unit: string }> = ({ value, unit }) => (
    <div className="flex items-baseline space-x-0.5">
      <span className="font-mono text-sm font-bold text-[#2E3192]">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[8px] uppercase tracking-tighter text-gray-400 font-bold">
        {unit.charAt(0)}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center space-x-2 bg-gray-50/50 px-2 py-1 rounded-lg">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
          {label}
        </span>
        <div className="flex items-center space-x-1">
          <TimeUnit value={timeLeft.days} unit="Days" />
          <TimeUnit value={timeLeft.hours} unit="Hrs" />
          <TimeUnit value={timeLeft.minutes} unit="Mins" />
          <TimeUnit value={timeLeft.seconds} unit="Secs" />
        </div>
      </div>
    </div>
  );

};

export default Countdown;