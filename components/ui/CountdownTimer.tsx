'use client'
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
                                                         targetDate,
                                                         className
                                                       }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = Number(targetDate) - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    // Run once immediately
    calculateTimeLeft();

    // Set up interval
    const timer = setInterval(calculateTimeLeft, 1000);

    // Cleanup
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="flex items-center gap-2 mb-2 text-purple-600">
        <Clock className="h-5 w-5 text-brand"  />
        <span className="text-brand">Launching In:</span>
      </div>
      <div className="flex gap-4">
        {[
          { value: timeLeft.days, label: 'Days' },
          { value: timeLeft.hours, label: 'Hours' },
          { value: timeLeft.minutes, label: 'Minutes' },
          { value: timeLeft.seconds, label: 'Seconds' },
        ].map((timeUnit, index) => (
          <motion.div
            key={timeUnit.label}
            className="flex flex-col items-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="btn btn-primary btn-md cursor-pointer">
              <span className="text-2xl font-bold">{timeUnit.value}</span>
            </div>
            <span className="text-xs mt-1 font-medium">{timeUnit.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
