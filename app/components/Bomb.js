export default function Bomb({ sips, timeLeft }) {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96 bg-gray-800 rounded-full flex flex-col items-center justify-center shadow-2xl border-8 border-gray-700">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full animate-ping-slow rounded-full bg-red-500 opacity-20"></div>
      <div className="z-10 text-center">
        <p className="text-xl text-gray-400">Sips Remaining</p>
        <h2 className="text-8xl md:text-9xl font-mono font-bold text-red-500 my-2">
          {sips}
        </h2>
        <p className="text-2xl font-mono text-yellow-400 tracking-widest">
          {formatTime(timeLeft)}
        </p>
      </div>
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