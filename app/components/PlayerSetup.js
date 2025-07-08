'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function PlayerSetup() {
  const [players, setPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState('');
  const router = useRouter();
  const backgroundMusicRef = useRef(null);

  useEffect(() => {
    if (!backgroundMusicRef.current) {
        backgroundMusicRef.current = new Audio('/humorous-loop-275485.mp3');
        backgroundMusicRef.current.loop = true;
        backgroundMusicRef.current.play().catch(error => {
            console.warn("Background music autoplay was prevented. The user may need to interact with the page first.", error);
        });
    }

    return () => {
        if (backgroundMusicRef.current) {
            backgroundMusicRef.current.pause();
            backgroundMusicRef.current = null;
        }
    };
  }, []);

  useEffect(() => {
    try {
      const savedPlayers = localStorage.getItem('previousPlayers');
      if (savedPlayers) {
        setPlayers(JSON.parse(savedPlayers));
      } else {
        setPlayers(['Player 1', 'Player 2']);
      }
    } catch (error) {
      console.error("Could not load players from localStorage", error);
      setPlayers(['Player 1', 'Player 2']);
    }
  }, []);

  const addPlayer = (e) => {
    e.preventDefault();
    if (newPlayer.trim() && !players.includes(newPlayer.trim())) {
      const capitalizedName = newPlayer.trim().charAt(0).toUpperCase() + newPlayer.trim().slice(1);
      setPlayers([...players, capitalizedName]);
      setNewPlayer('');
    }
  };

  const removePlayer = (playerToRemove) => {
    setPlayers(players.filter(p => p !== playerToRemove));
  };

  const startGame = () => {
    if (players.length < 2) {
      alert('You need at least 2 players to start!');
      return;
    }
    
    if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
    }

    const audio = new Audio('/game-intro-345507.mp3');
    audio.play();
    // Encode player names to be URL-safe and pass them as a query parameter
    const playerQuery = encodeURIComponent(players.join(','));
    router.push(`/game?players=${playerQuery}`);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 md:p-8 bg-gray-800 rounded-2xl shadow-2xl">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 text-yellow-400">
        Sip Bomb
      </h1>
      <p className="text-center text-gray-300 mb-8">Add players to defuse the bomb!</p>
      
      <form onSubmit={addPlayer} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          placeholder="Enter player name"
          className="flex-grow bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-5 rounded-lg transition-colors">
          Add
        </button>
      </form>
      
      <div className="space-y-2 mb-8 h-40 overflow-y-auto pr-2">
        {players.map(player => (
          <div key={player} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg animate-fade-in">
            <span className="font-semibold">{player}</span>
            <button onClick={() => removePlayer(player)} className="text-red-500 hover:text-red-400 font-bold text-xl">
              ×
            </button>
          </div>
        ))}
        {players.length === 0 && (
            <p className="text-center text-gray-500 pt-8">Add some players to get started...</p>
        )}
      </div>

      <button
        onClick={startGame}
        disabled={players.length < 2}
        className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-lg text-2xl tracking-wider transition-all disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105"
      >
        START GAME
      </button>
    </div>
  );
}