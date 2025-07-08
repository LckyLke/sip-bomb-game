'use client';

import { useState, useEffect } from 'react';

const prompts = [
    { words: ["Green", "Tasty"], players: 2 },
    { words: ["Sharp", "Shiny"], players: 2 },
    { words: ["Big", "Scary"], players: 3 },
    { words: ["Fast", "Expensive"], players: 2 },
    { words: ["Soft", "Warm"], players: 3 },
];

export default function HarmonyChallenge({ players, onComplete }) {
    const [prompt, setPrompt] = useState(null);
    const [selectedPlayers, setSelectedPlayers] = useState([]);

    useEffect(() => {
        const selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        // Ensure we have enough players for the prompt
        const numPlayersToSelect = Math.min(selectedPrompt.players, players.length);
        
        // Shuffle players and pick the first few
        const shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
        setSelectedPlayers(shuffledPlayers.slice(0, numPlayersToSelect));
        setPrompt(selectedPrompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    if (!prompt) return null;

    return (
        <div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">HARMONY!</h2>
            <p className="text-xl mb-4">The following players must secretly think of a single word that fits both descriptions:</p>
            <div className="flex justify-center gap-2 mb-4">
                {selectedPlayers.map(p => (
                    <span key={p} className="bg-blue-500 text-white font-semibold px-3 py-1 rounded-full">{p}</span>
                ))}
            </div>
            <div className="flex justify-center gap-4 text-3xl font-bold my-6">
                <span className="text-red-400">{prompt.words[0]}</span>
                <span className="text-gray-400">&</span>
                <span className="text-green-400">{prompt.words[1]}</span>
            </div>
            <p className="text-gray-400 mb-6">On the count of three, say your word aloud. If more than half agree, you pass!</p>
            <div className="flex justify-center gap-4">
                <button onClick={() => onComplete({ success: true, sipsChange: -6 })} className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-lg">
                    We Passed!
                </button>
                <button onClick={() => onComplete({ success: false, instantSips: 2, sipsIncrease: 3 })} className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-lg text-lg">
                    We Failed!
                </button>
            </div>
        </div>
    );
}