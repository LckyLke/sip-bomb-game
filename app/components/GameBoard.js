'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Bomb from './Bomb';
import ChallengeModal from './ChallengeModal';

// Dynamically import challenges to keep initial bundle small
import TriviaChallenge from './challenges/TriviaChallenge';
import GambleChallenge from './challenges/GambleChallenge';
import PhysicalChallenge from './challenges/PhysicalChallenge';
import FriendshipChallenge from './challenges/FriendshipChallenge';
import HarmonyChallenge from './challenges/HarmonyChallenge';
import TruthChallenge from './challenges/TruthChallenge';

// Helper function to get a random element from an array
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const challengeComponents = [
  'Trivia', 'Gamble', 'Physical', 'Friendship', 'Harmony', 'Truth'
];

export default function GameBoard() {
  const searchParams = useSearchParams();
  const [players, setPlayers] = useState([]);
  
  // Game State
  const [bombSips, setBombSips] = useState(20);
  const [bombTimer, setBombTimer] = useState(300); // 5 minutes
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameMessage, setGameMessage] = useState({ text: '', type: 'win' });

  // Challenge State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [notification, setNotification] = useState('');

  // Cooldown State
  const [challengeCooldowns, setChallengeCooldowns] = useState({});
  const [lastPlayedInfo, setLastPlayedInfo] = useState({ challenge: null, consecutive: 0 });

  // Setup game on component mount
  useEffect(() => {
    const playerNames = searchParams.get('players');
    if (playerNames) {
      const decodedPlayers = decodeURIComponent(playerNames).split(',');
      setPlayers(decodedPlayers);
      try {
        localStorage.setItem('previousPlayers', JSON.stringify(decodedPlayers));
      } catch (error) {
        console.error("Could not save players to localStorage", error);
      }
      
      // Randomize initial settings
      setBombSips(Math.floor(Math.random() * 16) + 15); // 15-30 sips
      setBombTimer(Math.floor(Math.random() * 121) + 180); // 3-5 minutes
      setIsGameActive(true);

      // Initialize cooldowns
      const initialCooldowns = challengeComponents.reduce((acc, c) => ({ ...acc, [c]: 0 }), {});
      setChallengeCooldowns(initialCooldowns);
    }
  }, [searchParams]);

  // Game timer countdown
  useEffect(() => {
    if (!isGameActive) return;

    if (bombTimer <= 0) {
      setIsGameActive(false);
      setGameMessage({ text: `BOOM! The bomb exploded! Time for the final ${bombSips} sips!`, type: 'loss' });
      return;
    }

    const timerId = setInterval(() => {
      setBombTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isGameActive, bombTimer, bombSips]);
  
  // Cooldown timer
  useEffect(() => {
    if (!isGameActive) return;

    const timerId = setInterval(() => {
      setChallengeCooldowns(prev => {
        const newCooldowns = { ...prev };
        Object.keys(newCooldowns).forEach(challenge => {
          if (newCooldowns[challenge] > 0) {
            newCooldowns[challenge] -= 1;
          }
        });
        return newCooldowns;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isGameActive]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000); // Notification disappears after 3 seconds
  };

  const handleChallengeSelect = (challengeType) => {
    if (!isGameActive) return;
    setCurrentChallenge(challengeType);
    setIsModalOpen(true);
  };

  const handleChallengeComplete = (result) => {
    setIsModalOpen(false);

    // Cooldown logic
    const newConsecutive = currentChallenge === lastPlayedInfo.challenge 
      ? lastPlayedInfo.consecutive + 1 
      : 1;

    setChallengeCooldowns(prev => ({ 
      ...prev, 
      [currentChallenge]: 10 * newConsecutive 
    }));

    setLastPlayedInfo({ 
      challenge: currentChallenge, 
      consecutive: newConsecutive 
    });

    setCurrentChallenge(null);

    // Default values
    let sipsChange = 0;
    let sipsIncrease = 0;
    
    // Process result
    if (result.success) {
      sipsChange = result.sipsChange || -3; // Default reward
      showNotification(`Success! Bomb sips reduced by ${-sipsChange}!`);
    } else {
      sipsIncrease = result.sipsIncrease || 3; // Default punishment
      if (result.instantSips) {
          showNotification(`Failure! Everyone drinks ${result.instantSips} now! Bomb sips increased by ${sipsIncrease}.`);
      } else {
          showNotification(`Failure! Bomb sips increased by ${sipsIncrease}!`);
      }
    }

    let newSipCount = bombSips + sipsChange + sipsIncrease;
    if (result.sipsMultiplier) {
        newSipCount = Math.ceil(bombSips * result.sipsMultiplier);
        showNotification(`DANGER! Bomb sips multiplied to ${newSipCount}!`);
    }
    
    if (newSipCount <= 0) {
        setIsGameActive(false);
        setGameMessage({ text: 'CONGRATULATIONS! You defused the Sip Bomb!', type: 'win' });
        setBombSips(0);
    } else {
        setBombSips(newSipCount);
    }
  };

  const renderChallenge = () => {
    const props = { players, onComplete: handleChallengeComplete };
    switch (currentChallenge) {
      case 'Trivia': return <TriviaChallenge {...props} />;
      case 'Gamble': return <GambleChallenge {...props} />;
      case 'Physical': return <PhysicalChallenge {...props} />;
      case 'Friendship': return <FriendshipChallenge {...props} />;
      case 'Harmony': return <HarmonyChallenge {...props} />;
      case 'Truth': return <TruthChallenge {...props} />;
      default: return null;
    }
  };

  if (!isGameActive && !gameMessage.text) {
    return <div className="flex h-screen items-center justify-center">Setting up your game...</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 overflow-hidden">
      {notification && (
        <div className="absolute top-5 bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg animate-bounce z-50">
          {notification}
        </div>
      )}

      {!isGameActive && gameMessage.text ? (
        <div className="text-center bg-gray-800 p-10 rounded-2xl shadow-2xl">
            <h2 className={`text-4xl font-bold mb-4 ${gameMessage.type === 'win' ? 'text-green-400' : 'text-red-500'}`}>
                {gameMessage.type === 'win' ? 'YOU WIN!' : 'GAME OVER'}
            </h2>
            <p className="text-xl text-gray-300">{gameMessage.text}</p>
            <Link href="/" className="mt-8 inline-block bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors hover:bg-yellow-400">
                Play Again
            </Link>
        </div>
      ) : (
        <>
            <Bomb sips={bombSips} timeLeft={bombTimer} />
            <div className="mt-8 text-center w-full max-w-2xl">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Choose Your Challenge!</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {challengeComponents.map(challenge => (
                  <button 
                    key={challenge}
                    onClick={() => handleChallengeSelect(challenge)}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-800 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={challengeCooldowns[challenge] > 0}
                  >
                    {challengeCooldowns[challenge] > 0 ? `${challenge} (${challengeCooldowns[challenge]}s)` : challenge}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg text-gray-400 mb-2 text-center">Players in the game:</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {players.map(p => (
                  <span key={p} className="bg-gray-700 text-yellow-400 font-semibold px-4 py-2 rounded-full">
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <ChallengeModal isOpen={isModalOpen} bombSips={bombSips} bombTimer={bombTimer}>
              {renderChallenge()}
            </ChallengeModal>
        </>
      )}
    </main>
  );
}