'use client';

import { useState, useEffect, useRef } from 'react';

export default function Bomb({ sips, timeLeft }) {
  const [displaySips, setDisplaySips] = useState(sips);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState(''); // 'increase' or 'decrease'
  const [previousSips, setPreviousSips] = useState(sips);
  const animationRef = useRef(null);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Animate sips counting when the value changes
  useEffect(() => {
    if (sips !== previousSips) {
      const difference = sips - previousSips;
      const isIncrease = difference > 0;
      
      setAnimationType(isIncrease ? 'increase' : 'decrease');
      setIsAnimating(true);

      // Cancel any existing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Animation parameters
      const startValue = previousSips;
      const endValue = sips;
      const duration = Math.min(Math.abs(difference) * 150, 2000); // Max 2 seconds
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation (ease-out-cubic)
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = Math.round(startValue + (endValue - startValue) * easedProgress);
        setDisplaySips(currentValue);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setDisplaySips(endValue);
          setIsAnimating(false);
          setPreviousSips(endValue);
        }
      };

      animate();
    }
  }, [sips, previousSips]);

  // Initialize previousSips on first render
  useEffect(() => {
    setPreviousSips(sips);
    setDisplaySips(sips);
  }, []); // Only run once on mount

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96 bg-gray-800 rounded-full flex flex-col items-center justify-center shadow-2xl border-8 border-gray-700">
      {/* Existing ping animation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full animate-ping-slow rounded-full bg-red-500 opacity-20"></div>
      
      {/* Animation effects overlay */}
      {isAnimating && (
        <>
          {/* Pulsing ring effect */}
          <div 
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full animate-pulse ${
              animationType === 'increase' 
                ? 'bg-red-500 opacity-30' 
                : 'bg-green-500 opacity-30'
            }`}
          />
          
          {/* Expanding ring */}
          <div 
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full animate-ping ${
              animationType === 'increase' 
                ? 'bg-red-400' 
                : 'bg-green-400'
            } opacity-40`}
          />
          
          {/* Glow effect */}
          <div 
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-xl ${
              animationType === 'increase' 
                ? 'bg-red-500' 
                : 'bg-green-500'
            } opacity-20 animate-pulse`}
          />
        </>
      )}

      <div className={`z-10 text-center transition-all duration-300 ${
        isAnimating ? 'transform scale-110' : 'transform scale-100'
      }`}>
        <p className="text-xl text-gray-400">Sips Remaining</p>
        
        {/* Animated sips counter */}
        <div className="relative">
          <h2 className={`text-8xl md:text-9xl font-mono font-bold my-2 transition-all duration-300 ${
            isAnimating 
              ? animationType === 'increase'
                ? 'text-red-400 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]'
                : 'text-green-400 drop-shadow-[0_0_20px_rgba(34,197,94,0.8)]'
              : 'text-red-500'
          }`}>
            {displaySips}
          </h2>
          
          {/* Floating animation indicators */}
          {isAnimating && (
            <div className="absolute top-0 right-0 transform translate-x-full">
              {animationType === 'increase' ? (
                <div className="animate-bounce text-4xl text-red-400">
                  ↑
                </div>
              ) : (
                <div className="animate-bounce text-4xl text-green-400">
                  ↓
                </div>
              )}
            </div>
          )}
        </div>
        
        <p className="text-2xl font-mono text-yellow-400 tracking-widest">
          {formatTime(timeLeft)}
        </p>
      </div>
      
      {/* Success/Danger particles effect */}
      {isAnimating && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full animate-ping ${
                animationType === 'increase' ? 'bg-red-400' : 'bg-green-400'
              }`}
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: '1s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Add this to your tailwind.config.js to create the animation
/*
  theme: {
    extend: {
      animation: {
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
*/