"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";

export default function FlashTimer({ expiry }: { expiry: string }) {
  const [timeLeft, setTimeLeft] = useState<{h: number, m: number, s: number} | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(expiry).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60)
      });
    };

    const timer = setInterval(calculateTime, 1000);
    calculateTime();

    return () => clearInterval(timer);
  }, [expiry]);

  if (!timeLeft) return null;

  return (
    <div className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-2xl shadow-lg shadow-amber-200 animate-in zoom-in duration-300">
      <Zap size={16} fill="currentColor" className="animate-pulse" />
      <div className="flex items-center gap-1 font-black text-[11px] uppercase tracking-widest">
        <span>Ends In:</span>
        <span className="bg-white/20 px-1.5 py-0.5 rounded-lg tabular-nums">
          {timeLeft.h.toString().padStart(2, '0')}h : {timeLeft.m.toString().padStart(2, '0')}m : {timeLeft.s.toString().padStart(2, '0')}s
        </span>
      </div>
    </div>
  );
}