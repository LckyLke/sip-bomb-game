'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Bomb from './Bomb';
import ChallengeModal from './ChallengeModal';
import RandomEventModal from './RandomEventModal';
import { generateRandomEvent } from '../lib/events';
import { getRandom } from '../lib/utils';

// Dynamically import challenges to keep initial bundle small
import TriviaChallenge from './challenges/TriviaChallenge';
import GambleChallenge from './challenges/GambleChallenge';
import PhysicalChallenge from './challenges/PhysicalChallenge';
import FriendshipChallenge from './challenges/FriendshipChallenge';
import HarmonyChallenge from './challenges/HarmonyChallenge';
import TruthChallenge from './challenges/TruthChallenge';

// Helper function to get a random element from an array
// const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper function to get 2 random challenges, optionally excluding one
const getRandomChallenges = (allChallenges, count = 2, exclude = null) => {
  const availableOptions = exclude ? allChallenges.filter(c => c !== exclude) : allChallenges;
  const shuffled = [...availableOptions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

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
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [isTimerChanged, setIsTimerChanged] = useState(false);
  const [gameMessage, setGameMessage] = useState({ text: '', type: 'win' });
  const [sipDistribution, setSipDistribution] = useState(null);

  // Challenge State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [notification, setNotification] = useState('');
  const [availableChallenges, setAvailableChallenges] = useState([]);

  // Random Event State
  const [randomEvent, setRandomEvent] = useState(null);
  const [gameRules, setGameRules] = useState([]);

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
      
      // Randomize initial settings based on player count
      const numPlayers = decodedPlayers.length;
      setBombSips(Math.floor(Math.random() * 11) + 5 * numPlayers + 5); // e.g., 4 players: 25-35 sips
      setBombTimer(Math.floor(Math.random() * 121) + 180); // 3-5 minutes
      setIsGameActive(true);

      // Initialize with 2 random challenges
      setAvailableChallenges(getRandomChallenges(challengeComponents));
    }
  }, [searchParams]);

  // Game timer countdown
  useEffect(() => {
    if (!isGameActive || isTimerPaused) return;

    if (bombTimer <= 0) {
      setIsGameActive(false);

      const distribution = players.reduce((acc, player) => {
        acc[player] = 0;
        return acc;
      }, {});

      for (let i = 0; i < bombSips; i++) {
        const randomPlayer = players[Math.floor(Math.random() * players.length)];
        distribution[randomPlayer]++;
      }
      
      setSipDistribution(distribution);
      setGameMessage({ text: `BOOM! The bomb exploded! The final ${bombSips} sips have been distributed.`, type: 'loss' });
      return;
    }

    const timerId = setInterval(() => {
      setBombTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isGameActive, bombTimer, bombSips, players, isTimerPaused]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000); // Notification disappears after 3 seconds
  };

  const handleChallengeSelect = (challengeType) => {
    if (!isGameActive) return;
    if (challengeType === 'Physical') {
      setIsTimerPaused(true);
    }
    setCurrentChallenge(challengeType);
    setIsModalOpen(true);
  };

  const handleChallengeComplete = (result) => {
    setIsModalOpen(false);

    // Resume timer if it was a physical challenge
    if (currentChallenge === 'Physical') {
      setIsTimerPaused(false);
    }

    // Generate new random challenges for next round, excluding the one just completed
    setAvailableChallenges(getRandomChallenges(challengeComponents, 2, currentChallenge));
    
    setCurrentChallenge(null);

    // Scale sips rewards/punishments with player count
    const sipsScale = Math.max(1, Math.floor(players.length / 2));

    let sipsChange = 0;
    let sipsIncrease = 0;
    
    // Process result
    if (result.sipsMultiplier || result.timerMultiplier) {
      if (result.sipsMultiplier) {
          const newSipCount = Math.ceil(bombSips * result.sipsMultiplier);
          setBombSips(newSipCount);
          showNotification(`DANGER! Bomb sips multiplied to ${newSipCount}!`);
      }
    } else {
      if (result.success) {
        sipsChange = result.sipsChange || -3 * sipsScale; // Default reward
        showNotification(`Success! Bomb sips reduced by ${-sipsChange}!`);
      } else {
        sipsIncrease = result.sipsIncrease || 3 * sipsScale; // Default punishment
        showNotification(`Failure! Bomb sips increased by ${sipsIncrease}!`);
      }
      const newSipCount = bombSips + sipsChange + sipsIncrease;
      setBombSips(newSipCount);
    }
    
    // Handle timer effects
    if (result.timerChange) {
        setBombTimer(prev => {
            const newTime = Math.max(0, prev + result.timerChange);
            if (newTime !== prev) {
                setIsTimerChanged(true);
                setTimeout(() => setIsTimerChanged(false), 500);
            }
            return newTime;
        });
        showNotification(result.timerChange > 0 ? 
            `Time added: +${result.timerChange}s!` : 
            `Time lost: ${Math.abs(result.timerChange)}s!`);
    }
    
    if (result.timerMultiplier) {
        setBombTimer(prev => {
            const newTime = Math.ceil(prev * result.timerMultiplier);
            if (newTime !== prev) {
                setIsTimerChanged(true);
                setTimeout(() => setIsTimerChanged(false), 500);
            }
            return newTime;
        });
        showNotification(`Timer ${result.timerMultiplier > 1 ? 'extended' : 'reduced'} by ${result.timerMultiplier}x!`);
    }
    
    if (result.timerFreeze) {
        showNotification(`Timer frozen for ${result.timerFreeze} seconds!`);
        setIsTimerPaused(true);
        setTimeout(() => setIsTimerPaused(false), result.timerFreeze * 1000);
    }

    const finalSipCount = bombSips + sipsChange + sipsIncrease;
    if (result.sipsMultiplier) {
        if (Math.ceil(bombSips * result.sipsMultiplier) <= 0) {
            setIsGameActive(false);
            setGameMessage({ text: 'CONGRATULATIONS! You defused the Sip Bomb!', type: 'win' });
            setBombSips(0);
        }
    } else if (finalSipCount <= 0) {
        setIsGameActive(false);
        setGameMessage({ text: 'CONGRATULATIONS! You defused the Sip Bomb!', type: 'win' });
        setBombSips(0);
    }

    // Check for random event after a challenge is completed
    const EVENT_PROBABILITY = 0.25; // 25% chance (1 in 4)
    if (isGameActive && Math.random() < EVENT_PROBABILITY) {
      const event = generateRandomEvent(players, gameRules);
      if (event) {
        setRandomEvent(event);
        setIsTimerPaused(true);
      }
    }
  };

  const handleCloseEventModal = () => {
    if (!randomEvent) return;

    if (randomEvent.type === 'new_rule') {
      setGameRules(prevRules => [...prevRules, randomEvent.newRule]);
      showNotification('A new rule has been added!');
    }
    if (randomEvent.type === 'timer_and_sips_doubled') {
      setBombTimer(timer => timer * 2);
      setBombSips(sips => sips * 2);
      showNotification(`Double trouble! Time and sips have been doubled!`);
    }

    setRandomEvent(null);
    if (isGameActive) {
      setIsTimerPaused(false);
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
      {/* Restart Button - only show during active gameplay */}
      {isGameActive && (
        <Link href="/" className="fixed top-4 right-4 z-50 bg-gray-700 hover:bg-gray-600 text-yellow-400 hover:text-yellow-300 p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </Link>
      )}

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
            <p className="text-xl text-gray-300 mb-6">{gameMessage.text}</p>
            {sipDistribution && (
              <div className="mb-6">
                <h3 className="text-2xl text-yellow-400 font-bold mb-4">Final Sip Count:</h3>
                <ul className="text-lg text-white list-none p-0">
                  {Object.entries(sipDistribution).sort((a, b) => b[1] - a[1]).map(([player, sips]) => (
                    <li key={player} className="mb-2">
                      <span className="font-bold text-yellow-300">{player}:</span> {sips} sips
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Link href="/" className="mt-8 inline-block bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors hover:bg-yellow-400">
                Play Again
            </Link>
        </div>
      ) : (
        <>
            <Bomb sips={bombSips} timeLeft={bombTimer} isTimerChanged={isTimerChanged} />
            <div className="mt-8 text-center w-full max-w-2xl">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Choose Your Challenge!</h3>
              <div className="grid grid-cols-2 gap-4">
                {availableChallenges.map(challenge => (
                  <button 
                    key={challenge}
                    onClick={() => handleChallengeSelect(challenge)}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg transition-transform transform hover:scale-105"
                  >
                    {challenge}
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

            {gameRules.length > 0 && (
              <div className="fixed bottom-4 right-4 bg-gray-800 bg-opacity-80 p-4 rounded-lg shadow-lg max-w-xs z-40 border border-yellow-500">
                <h4 className="font-bold text-yellow-400 mb-2 border-b border-gray-600 pb-1">Active Rules:</h4>
                <ul className="text-sm text-white list-disc list-inside space-y-1">
                  {gameRules.map(rule => <li key={rule.id}>{rule.abbreviation}</li>)}
                </ul>
              </div>
            )}

            <ChallengeModal isOpen={isModalOpen} bombSips={bombSips} bombTimer={bombTimer}>
              {renderChallenge()}
            </ChallengeModal>
            <RandomEventModal isOpen={!!randomEvent} event={randomEvent} onClose={handleCloseEventModal} />
        </>
      )}
    </main>
  );
}