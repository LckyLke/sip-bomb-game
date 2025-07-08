'use client';

import { useState, useEffect } from 'react';

export default function HarmonyChallenge({ players, onComplete }) {
    const [prompt, setPrompt] = useState(null);
    const [selectedPlayers, setSelectedPlayers] = useState([]);

    useEffect(() => {
        const fetchAdjectives = async () => {
            try {
                const response = await fetch('/adjectives.txt');
                const text = await response.text();
                const adjectives = text.split('\n').filter(adj => adj.trim() !== '');

                // Get two random different adjectives
                const adj1Index = Math.floor(Math.random() * adjectives.length);
                let adj2Index = Math.floor(Math.random() * adjectives.length);
                while (adj1Index === adj2Index) {
                    adj2Index = Math.floor(Math.random() * adjectives.length);
                }
                const selectedAdjectives = [adjectives[adj1Index], adjectives[adj2Index]];

                // Get random number of players (from 2 to players.length)
                const minPlayers = 2;
                const maxPlayers = players.length;
                const numPlayersToSelect = Math.floor(Math.random() * (maxPlayers - minPlayers + 1)) + minPlayers;
                
                // Shuffle players and pick the first few
                const shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
                setSelectedPlayers(shuffledPlayers.slice(0, numPlayersToSelect));
                setPrompt({ words: selectedAdjectives });
            } catch (error) {
                console.error("Failed to load adjectives:", error);
                // Handle error, maybe set a default prompt or show an error message
            }
        };

        fetchAdjectives();
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