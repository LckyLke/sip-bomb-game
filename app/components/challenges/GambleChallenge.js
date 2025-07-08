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
    { message: "Halfway There! The bomb's sips are HALVED!", sipsMultiplier: 0.5 },
    { message: "Steady Hands! Defuse 2 sips.", sipsChange: -2 },
    { message: "Slight Miscalculation! Add 1 sip to the bomb.", sipsIncrease: 1 },
    { message: "Total System Failure! Add 7 sips to the bomb!", sipsIncrease: 7 },
    { message: "Divine Intervention! The bomb is defused by 10 sips!", sipsChange: -10 },
    { message: "Power Surge! The bomb's sips are multiplied by 1.5!", sipsMultiplier: 1.5 },
    { message: "False Alarm! The bomb is unchanged.", sipsChange: 0 },
    { message: "Cheers! Everyone takes 2 sips. Bomb is unchanged.", instantSips: 2, sipsChange: 0 },
    { message: "Good News, Bad News... Defuse 4 sips, but everyone takes a sip.", sipsChange: -4, instantSips: 1 },
    
    // New timer-based outcomes
    { message: "Time Boost! Added 30 seconds to the timer!", timerChange: 30 },
    { message: "Quick Hands! Added 15 seconds to the timer!", timerChange: 15 },
    { message: "Time Crunch! Lost 20 seconds from the timer!", timerChange: -20 },
    { message: "Panic Mode! Lost 30 seconds from the timer!", timerChange: -30 },
    { message: "Time Warp! Remaining time is DOUBLED!", timerMultiplier: 2 },
    { message: "Pressure Cooker! Remaining time is HALVED!", timerMultiplier: 0.5 },
    { message: "Temporal Jackpot! Added a full minute to the timer!", timerChange: 60 },
    { message: "Time Freeze! Timer stopped for 10 seconds!", timerFreeze: 10 },
    { message: "Borrowed Time! Added 45 seconds to the timer!", timerChange: 45 },
    { message: "Time Slip! Lost 10 seconds from the timer!", timerChange: -10 }
];

export default function GambleChallenge({ onComplete }) {
    const [result, setResult] = useState(null);

    const handleGamble = () => {
        const selectedOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        setResult(selectedOutcome);

        // A little delay to show the result before continuing
        setTimeout(() => {
            const resultPayload = {
                ...selectedOutcome,
                success: (selectedOutcome.sipsChange || 0) < 0,
            };
            onComplete(resultPayload);
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

// NOTE: You'll need to update `handleChallengeComplete` in `GameBoard.js` to handle timer effects.
// Find the line `const newSipCount = bombSips + sipsChange + sipsIncrease;` and update it like this:
/*
    let newSipCount = bombSips + sipsChange + sipsIncrease;
    if (result.sipsMultiplier) {
        newSipCount = Math.ceil(bombSips * result.sipsMultiplier);
        showNotification(`DANGER! Bomb sips multiplied to ${newSipCount}!`);
    }
    
    // Handle timer effects
    if (result.timerChange) {
        setTimeRemaining(prev => Math.max(0, prev + result.timerChange));
        showNotification(result.timerChange > 0 ? 
            `Time added: +${result.timerChange}s!` : 
            `Time lost: ${result.timerChange}s!`);
    }
    
    if (result.timerMultiplier) {
        setTimeRemaining(prev => Math.ceil(prev * result.timerMultiplier));
        showNotification(`Timer ${result.timerMultiplier > 1 ? 'extended' : 'reduced'} by ${result.timerMultiplier}x!`);
    }
    
    if (result.timerFreeze) {
        // Implement timer freeze logic - pause timer for specified seconds
        setTimerFrozen(true);
        setTimeout(() => setTimerFrozen(false), result.timerFreeze * 1000);
        showNotification(`Timer frozen for ${result.timerFreeze} seconds!`);
    }
*/