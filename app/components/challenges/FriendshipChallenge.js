'use client';

import { useState, useEffect } from 'react';

const questions = [
    "What is {playerB}'s biggest pet peeve?",
    "What would be {playerB}'s dream vacation?",
    "What is {playerB}'s go-to comfort food?",
    "If {playerB} could have any superpower, what would it be?",
    "What is {playerB}'s most embarrassing moment they've told you about?"
];

export default function FriendshipChallenge({ players, onComplete }) {
    const [question, setQuestion] = useState('');
    const [playerA, setPlayerA] = useState('');
    const [playerB, setPlayerB] = useState('');

    useEffect(() => {
        const pAIndex = Math.floor(Math.random() * players.length);
        let pBIndex = Math.floor(Math.random() * players.length);
        while (pAIndex === pBIndex) {
            pBIndex = Math.floor(Math.random() * players.length);
        }
        const pA = players[pAIndex];
        const pB = players[pBIndex];
        
        setPlayerA(pA);
        setPlayerB(pB);
        setQuestion(questions[Math.floor(Math.random() * questions.length)].replace('{playerB}', pB));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">FRIENDSHIP TEST!</h2>
            <p className="text-xl mb-6"><span className="font-bold text-red-500">{playerA}</span>, answer this question about <span className="font-bold text-blue-500">{playerB}</span>:</p>
            <p className="text-2xl font-semibold mb-8">"{question}"</p>
            <p className="text-gray-400 mb-6">{playerB}, did they get it right?</p>
            <div className="flex justify-center gap-4">
                <button onClick={() => onComplete({ success: true, sipsChange: -5 })} className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-lg">
                    Correct!
                </button>
                <button onClick={() => onComplete({ success: false, instantSips: 2, sipsIncrease: 3 })} className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-lg text-lg">
                    Wrong!
                </button>
            </div>
        </div>
    );
}