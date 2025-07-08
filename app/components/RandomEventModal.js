'use client';

export default function RandomEventModal({ isOpen, event, onClose }) {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 text-center max-w-lg w-full transform transition-all animate-jump-in border-4 border-yellow-500">
        <h2 className="text-4xl font-bold text-yellow-400 mb-4">{event.title}</h2>
        <p className="text-xl text-white mb-8 whitespace-pre-line">{event.message}</p>
        <button
          onClick={onClose}
          className="bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors hover:bg-yellow-400 transform hover:scale-105"
        >
          {event.buttonText || 'Continue'}
        </button>
      </div>
    </div>
  );
} 