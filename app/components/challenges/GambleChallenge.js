'use client';

import { useState } from 'react';

const outcomes = [
    { message: "Good Karma! Defuse 5 sips!", sipsChange: -5 },
    { message: "Lady Luck Smiles! Defuse 3 sips.", sipsChange: -3 },
    { message: "Risky Business! Add 3 sips to the bomb.", sipsIncrease: 3 },
    { message: "Disaster! Add 5 sips to the bomb!", sipsIncrease: 5 },
    { message: "Team Spirit! Everyone takes a sip. Bomb is unchanged.", instantSips: 1, sipsChange: 0 },
    { message: "Jackpot! The bomb is defused by 8 sips!", sipsChange: -8 },
    { message: "Double Trouble! The bomb's sips are DOUBLED!", sipsMultiplier: 2 },
];

export default function GambleChallenge({ onComplete }) {
    const [result, setResult] = useState(null);

    const handleGamble = () => {
        const selectedOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        setResult(selectedOutcome);

        // A little delay to show the result before continuing
        setTimeout(() => {
            if (selectedOutcome.sipsMultiplier) {
                // Special case for multiplier
                onComplete({ success: false, sipsMultiplier: selectedOutcome.sipsMultiplier });
            } else {
                onComplete({ 
                    success: (selectedOutcome.sipsChange || 0) < 0, 
                    sipsChange: selectedOutcome.sipsChange, 
                    sipsIncrease: selectedOutcome.sipsIncrease, 
                    instantSips: selectedOutcome.instantSips 
                });
            }
        }, 2500);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">FEELING LUCKY?</h2>
            {!result ? (
                <>
                    <p className="text-lg mb-6">Press the button to test your fate. Will you help or hinder the team?</p>
                    <button 
                        onClick={handleGamble}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-8 rounded-lg text-xl transition-transform transform hover:scale-105"
                    >
                        SPIN THE WHEEL
                    </button>
                </>
            ) : (
                <div>
                    <p className="text-2xl font-bold animate-pulse">{result.message}</p>
                </div>
            )}
        </div>
    );
}

// NOTE: You'll need to update `handleChallengeComplete` in `GameBoard.js` to handle `sipsMultiplier`.
// Find the line `const newSipCount = bombSips + sipsChange + sipsIncrease;` and update it like this:
/*
    let newSipCount = bombSips + sipsChange + sipsIncrease;
    if (result.sipsMultiplier) {
        newSipCount = Math.ceil(bombSips * result.sipsMultiplier);
        showNotification(`DANGER! Bomb sips multiplied to ${newSipCount}!`);
    }
*/