'use client';

import { useState, useEffect } from 'react';

// A vastly expanded and more creative list of challenges.
// All challenges are framed as a task for the group to succeed or fail at together.
const challenges = [
    // --- Individual Feats (Player 1 performs for the group) ---
    { text: "{player1}, do 10 push-ups. The group judges your form!", players: 1 },
    { text: "{player1}, hold a plank until the next challenge starts. The group decides if you held it.", players: 1 },
    { text: "{player1}, do your best dance move for 15 seconds. Was it glorious?", players: 1 },
    { text: "{player1}, balance on one foot for 30 seconds without wobbling too much.", players: 1 },
    { text: "{player1}, hold a wall-sit for 45 seconds. The group's legs are counting on you!", players: 1 },
    { text: "{player1}, tell a joke. If at least half the group genuinely laughs, you succeed.", players: 1 },
    { text: "{player1}, do your best impression of a celebrity. The group must guess correctly within 15 seconds.", players: 1 },
    { text: "{player1}, sing the chorus of 'I Will Always Love You' with passion. The group will be the judge.", players: 1 },
    { text: "{player1}, invent a new handshake and teach it to one other person. Perform it flawlessly.", players: 1 },

    // --- Two-Player Challenges (Two players compete or cooperate) ---
    { text: "{player1} and {player2}, have a thumb war. The group decides who showed the most spirit.", players: 2 },
    { text: "{player1} and {player2}, have a staring contest for 30 seconds. No laughing!", players: 2 },
    { text: "{player1} and {player2}, play a best-of-3 game of Rock, Paper, Scissors.", players: 2 },
    { text: "{player1} and {player2}, link arms and spin in a circle 5 times, then try to walk in a straight line.", players: 2 },
    { text: "{player1} must act as a statue, and {player2} has 20 seconds to try and make them laugh without touching them.", players: 2 },
    { text: "{player1} and {player2}, build the tallest tower you can in 30 seconds using only items on the table.", players: 2 },

    // --- Full Group Challenges (Everyone participates) ---
    { text: "The floor is lava! Everyone must get their feet off the floor in 5 seconds.", players: 'all' },
    { text: "Everyone, waterfall! The person who started the game begins.", players: 'all'},
    { text: "The last person to touch their nose causes the group to fail this challenge.", players: 'all' },
    { text: "The group must form a human conga line and travel around the room for 30 seconds.", players: 'all' },
    { text: "Teamwork! The group must successfully perform 'the wave' three times in a row.", players: 'all' },
    { text: "Everyone, find and touch something blue within 7 seconds.", players: 'all' },
    { text: "The group must build a human pyramid. (At least two levels high! Be safe!)", players: 'all' },
    { text: "Everyone, stand in a circle. The group must balance a bottle/can on their feet and pass it around the circle.", players: 'all' },
    { text: "Silent challenge! No one can talk or make noise for the next minute. First person to make a sound fails it for everyone.", players: 'all' },
    { text: "Everyone, point to the person you think would win in a fight. That person must lead the group in 5 synchronized star jumps.", players: 'all' }
];


export default function PhysicalChallenge({ players, onComplete }) {
    const [challenge, setChallenge] = useState(null);

    useEffect(() => {
        if (!players || players.length === 0) return;

        // Filter for challenges that are possible with the current number of players
        const availableChallenges = challenges.filter(c => {
            if (c.players === 1 && players.length >= 1) return true;
            if (c.players === 2 && players.length >= 2) return true;
            if (c.players === 'all') return true;
            return false;
        });

        if (availableChallenges.length === 0) {
            // Fallback in case no challenges match (e.g., 1 player, but all challenges are for 2+)
            setChallenge({ text: "Not enough players for a special challenge. Take a celebration sip!", players: 'all' });
            return;
        }

        const selected = availableChallenges[Math.floor(Math.random() * availableChallenges.length)];
        let text = selected.text;
        
        // Populate player names into the challenge text
        if (selected.players === 1) {
            const player1 = players[Math.floor(Math.random() * players.length)];
            text = text.replace('{player1}', player1);
        } else if (selected.players === 2) {
            // This logic assumes players.length is already >= 2 due to the filter above
            const p1Index = Math.floor(Math.random() * players.length);
            let p2Index = Math.floor(Math.random() * players.length);
            while (p1Index === p2Index) {
                p2Index = Math.floor(Math.random() * players.length);
            }
            text = text.replace('{player1}', players[p1Index]).replace('{player2}', players[p2Index]);
        }
        
        setChallenge({ ...selected, text });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Runs only once when the component mounts

    if (!challenge) return null;

    return (
        <div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">PHYSICAL CHALLENGE!</h2>
            <p className="text-xl mb-8">{challenge.text}</p>
            <p className="text-gray-400 mb-6">Did the group succeed? The group decides!</p>
            <div className="flex justify-center gap-4">
                <button 
                    onClick={() => onComplete({ success: true, sipsChange: -4 })} 
                    className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
                >
                    Success!
                </button>
                <button 
                    onClick={() => onComplete({ success: false, sipsIncrease: 4 })} 
                    className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
                >
                    Failure!
                </button>
            </div>
        </div>
    );
}