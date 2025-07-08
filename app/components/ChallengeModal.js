export default function ChallengeModal({ isOpen, children, bombSips, bombTimer }) {
  if (!isOpen) return null;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 md:p-8 text-center animate-fade-in-up relative">
        {bombTimer !== undefined && bombSips !== undefined && (
          <div className="absolute top-[-1rem] right-[-1rem] bg-gray-900 p-2 rounded-lg border-2 border-yellow-500 text-left shadow-lg">
            <p className="text-lg font-mono text-yellow-400 tracking-wider">
              {formatTime(bombTimer)}
            </p>
            <p className="text-center text-sm font-bold text-red-500 mt-1">
              {bombSips} SIPS
            </p>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// Add this to your tailwind.config.js
/*
  theme: {
    extend: {
      keyframes: {
        'fade-in-up': {
            '0%': { opacity: '0', transform: 'translateY(20px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
      }
    },
  },
*/