'use client';

import { useState, useEffect } from 'react';

// Helper to shuffle array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export default function TriviaChallenge({ players, onComplete }) {
    const [question, setQuestion] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [isAnswered, setIsAnswered] = useState(false);
    const [timer, setTimer] = useState(15);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setSelectedPlayer(players[Math.floor(Math.random() * players.length)]);
        
        async function fetchTrivia() {
            for (let i = 0; i < 5; i++) { // Retry up to 5 times
                try {
                    const response = await fetch('https://opentdb.com/api.php?amount=1&type=multiple');
                    const data = await response.json();
    
                    if (data.response_code === 0 && data.results?.length) {
                        const result = data.results[0];
                        setQuestion(result);
                        setOptions(shuffleArray([...result.incorrect_answers, result.correct_answer]));
                        setLoading(false);
                        return; // Success
                    }
                    console.warn(`Trivia API error (code: ${data.response_code}). Retrying...`);
                } catch (error) {
                    console.error(`Fetch trivia attempt ${i + 1} failed.`, error);
                }
                // Wait 1 second before the next attempt
                await new Promise(res => setTimeout(res, 1200));
            }

            console.error("Failed to fetch trivia after 5 attempts.");
            onComplete({ success: true, sipsChange: -1 }); // Fallback
            setLoading(false);
        }

        fetchTrivia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (loading || isAnswered) return;
        if (timer === 0) {
            setIsAnswered(true);
            setTimeout(() => onComplete({ success: false, instantSips: 2, sipsIncrease: 4 }), 1500);
            return;
        }
        const intervalId = setInterval(() => setTimer(t => t - 1), 1000);
        return () => clearInterval(intervalId);
    }, [timer, loading, isAnswered, onComplete]);

    const handleAnswer = (answer) => {
        setIsAnswered(true);
        const isCorrect = answer === question.correct_answer;
        setTimeout(() => {
            if (isCorrect) {
                onComplete({ success: true, sipsChange: -5 });
            } else {
                onComplete({ success: false, instantSips: 2, sipsIncrease: 4 });
            }
        }, 1500);
    };

    if (loading) return <p>Loading Trivia Question...</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">TRIVIA TIME!</h2>
            <p className="text-xl mb-4">
                <span className="font-bold text-red-500">{selectedPlayer}</span>, you have {timer} seconds to answer!
            </p>
            <p className="text-lg mb-6" dangerouslySetInnerHTML={{ __html: question.question }} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((option, index) => (
                    <button 
                        key={index} 
                        disabled={isAnswered}
                        onClick={() => handleAnswer(option)}
                        className={`p-4 rounded-lg font-semibold transition-all
                            ${isAnswered 
                                ? (option === question.correct_answer ? 'bg-green-500' : 'bg-red-500')
                                : 'bg-blue-600 hover:bg-blue-500'
                            }
                            disabled:opacity-70 disabled:cursor-not-allowed`}
                        dangerouslySetInnerHTML={{ __html: option }} 
                    />
                ))}
            </div>
        </div>
    );
}