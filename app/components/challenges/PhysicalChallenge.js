'use client';

import { useState, useEffect } from 'react';

const challenges = [
    { text: "{player1}, do 10 push-ups.", players: 1 },
    { text: "{player1}, hold a plank until the next challenge starts.", players: 1 },
    { text: "The last person to touch their nose has to take 3 sips.", players: 'all' },
    { text: "{player1} and {player2}, have a thumb war. The loser takes 2 sips.", players: 2 },
    { text: "Everyone, waterfall! The person who started the game begins.", players: 'all'},
    { text: "{player1}, do your best dance move for 15 seconds.", players: 1}
];

export default function PhysicalChallenge({ players, onComplete }) {
    const [challenge, setChallenge] = useState(null);

    useEffect(() => {
        const selected = challenges[Math.floor(Math.random() * challenges.length)];
        let text = selected.text;
        
        if (selected.players === 1) {
            text = text.replace('{player1}', players[Math.floor(Math.random() * players.length)]);
        } else if (selected.players === 2 && players.length >= 2) {
            const p1Index = Math.floor(Math.random() * players.length);
            let p2Index = Math.floor(Math.random() * players.length);
            while (p1Index === p2Index) {
                p2Index = Math.floor(Math.random() * players.length);
            }
            text = text.replace('{player1}', players[p1Index]).replace('{player2}', players[p2Index]);
        }
        setChallenge({ ...selected, text });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!challenge) return null;

    return (
        <div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">PHYSICAL CHALLENGE!</h2>
            <p className="text-xl mb-8">{challenge.text}</p>
            <p className="text-gray-400 mb-6">Did the group succeed? The group decides!</p>
            <div className="flex justify-center gap-4">
                <button onClick={() => onComplete({ success: true, sipsChange: -4 })} className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-lg">
                    Success!
                </button>
                <button onClick={() => onComplete({ success: false, sipsIncrease: 4 })} className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-lg text-lg">
                    Failure!
                </button>
            </div>
        </div>
    );
}