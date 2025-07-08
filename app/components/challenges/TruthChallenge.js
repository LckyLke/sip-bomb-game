'use client';

import { useState, useEffect } from 'react';

const questions = [
    "What's the most childish thing you still do?",
    "Who in this room would you least want to be stuck on a desert island with and why?",
    "What's a secret you've never told your parents?",
    "Have you ever re-gifted a present? What was it?",
    "What's the spiciest secret you're willing to share with the group right now?",
    "Describe your most awkward date.",
];

export default function TruthChallenge({ players, onComplete }) {
    const [question, setQuestion] = useState('');
    const [player, setPlayer] = useState('');

    useEffect(() => {
        setPlayer(players[Math.floor(Math.random() * players.length)]);
        setQuestion(questions[Math.floor(Math.random() * questions.length)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">TRUTH!</h2>
            <p className="text-xl mb-6">
                <span className="font-bold text-red-500">{player}</span>, you must answer this question truthfully or the whole team pays the price.
            </p>
            <p className="text-2xl font-semibold mb-8">&quot;{question}&quot;</p>
            <div className="flex justify-center gap-4">
                <button onClick={() => onComplete({ success: true, sipsChange: -5 })} className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-lg">
                    Truth Answered!
                </button>
                <button onClick={() => onComplete({ success: false, instantSips: 3, sipsIncrease: 5 })} className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-lg text-lg">
                    Refuse to Answer!
                </button>
            </div>
        </div>
    );
}