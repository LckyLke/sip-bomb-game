'use client';

import { useState, useEffect } from 'react';

// A vastly expanded and more creative list of challenges.
// All challenges are framed as a task for the group to succeed or fail at together.
const challenges = [
    // --- One For All (A single player performs for the group's success) ---
    { text: "{player1}, do 10 push-ups. The group judges your form! If the form is good, the group wins.", players: 1 },
    { text: "{player1}, hold a plank for 30 seconds. If you drop, the whole group fails the challenge.", players: 1, duration: 30 },
    { text: "{player1}, do your best dance move for 15 seconds. The group must give a standing ovation for it to count.", players: 1, duration: 15 },
    { text: "{player1}, balance on one foot for 30 seconds. If you put your foot down, the challenge is lost.", players: 1, duration: 30 },
    { text: "{player1}, hold a wall-sit for 45 seconds. Your victory is the group's victory!", players: 1, duration: 45 },
    { text: "{player1}, tell a joke. If at least half the group genuinely laughs, the group succeeds.", players: 1 },
    { text: "{player1}, do your best impression of a celebrity. The group must guess correctly within 20 seconds to win.", players: 1, duration: 20 },
    { text: "{player1}, sing the chorus of 'Bohemian Rhapsody' with passion. The group's applause determines success.", players: 1 },
    { text: "{player1}, invent a new handshake and teach it to one other person. You both must perform it flawlessly.", players: 1 },
    { text: "{player1}, say the alphabet backwards in 25 seconds. The group can't help!", players: 1, duration: 25 },
    { text: "{player1}, without using your hands, get a cookie from your forehead to your mouth. The group's fate rests on your skill!", players: 1 },
    { text: "{player1}, a member of the group will whisper a random object in the room to you. You have 30 seconds to describe it so the rest of the group can guess it. You cannot say what it is, what it's made of, or what letters are in its name.", players: 1, duration: 30 },
    { text: "{player1}, stack 5 coins on their edge in 60 seconds. If the tower falls, so do the group's hopes.", players: 1, duration: 60 },
    { text: "{player1}, draw a recognizable boat with your eyes closed. If the group can't tell what it is, you all fail.", players: 1 },
    { text: "{player1}, say 'Red Lorry, Yellow Lorry' five times fast without messing up. The group decides if you were clear enough.", players: 1 },

    // --- Two to Tango (Two players must cooperate for the group's success) ---
    { text: "{player1} and {player2}, have a staring contest for 30 seconds. If either of you laugh or look away, the group fails.", players: 2, duration: 30 },
    { text: "{player1} and {player2}, play Rock, Paper, Scissors. To win, you must successfully TIE three times in a row within 60 seconds.", players: 2, duration: 60 },
    { text: "{player1} and {player2}, link arms and spin in a circle 5 times, then you must both walk in a straight line without falling over.", players: 2 },
    { text: "{player1} will act as a statue. {player2} has 20 seconds to try and make them laugh without touching them. If {player1} laughs, the group fails.", players: 2, duration: 20 },
    { text: "{player1} and {player2}, build the tallest free-standing tower you can in 45 seconds using only items on the table. If it falls, you fail.", players: 2, duration: 45 },
    { text: "{player1} and {player2}, stand back-to-back. You must successfully high-five by swinging your arms around at the same time. You have three tries.", players: 2 },
    { text: "{player1} sits on the floor. {player2} must help them stand up using only their hands (no other body contact).", players: 2 },
    { text: "{player1} will have their eyes closed. {player2} must guide them with verbal commands to retrieve a specific object from across the room.", players: 2, duration: 45 },
    { text: "Back-to-back drawing! {player1} will be shown a simple drawing (e.g., a house, a flower). They must describe it to {player2} who will try to draw it without seeing the original. The drawings must be reasonably similar for the group to win.", players: 2, duration: 60 },
    { text: "{player1} and {player2}, you must make the group laugh with a 30-second improvised comedy sketch. A majority vote of laughter means success.", players: 2, duration: 30 },
    { text: "{player1} and {player2}, must perfectly mirror each other's movements for 30 seconds. {player1} leads, {player2} mirrors. If the mirror is broken, the challenge is lost.", players: 2, duration: 30 },

    // --- All In (The entire group must work together to succeed) ---
    { text: "The floor is lava! Everyone must get their feet off the floor in 5 seconds. If anyone is touching the floor, the group fails.", players: 'all', duration: 5 },
    { text: "The last person to touch their nose causes the group to fail this challenge. GO!", players: 'all' },
    { text: "The group must form a human conga line and travel around the room for 30 seconds without breaking the chain.", players: 'all', duration: 30 },
    { text: "Teamwork! The group must successfully perform 'the wave' three times in a row.", players: 'all' },
    { text: "Everyone, find and touch something blue within 7 seconds. Anyone who fails, fails the group.", players: 'all', duration: 7 },
    { text: "The group must build a human pyramid. (At least two levels high! Be safe!)", players: 'all' },
    { text: "Silent challenge! No one can talk or make a sound for 60 seconds. First person to make a noise fails it for everyone.", players: 'all', duration: 60 },
    { text: "Everyone, point to the person you think would win in a fight. That person must lead the group in 5 synchronized star jumps.", players: 'all' },
    { text: "Human Knot! Everyone stand in a circle, reach across and grab the hands of two different people. Now, untangle yourselves into a single circle without letting go. You have 2 minutes.", players: 'all', duration: 120 },
    { text: "Silent Lineup! The group must arrange themselves in order of their birthdays (Jan 1st to Dec 31st) without speaking or writing anything. You have 60 seconds.", players: 'all', duration: 60 },
    { text: "Group Story! Going in a circle, each person adds ONE word to a story. The group must complete a coherent sentence of at least 10 words.", players: 'all' },
    { text: "Keep the balloon up! The group must keep a balloon (or crumpled piece of paper) in the air for 60 seconds. You cannot hold it.", players: 'all', duration: 60 },
    { text: "Category Masters! The person who started the game names a category (e.g., 'Car Brands', 'Types of Fruit'). Everyone must go in a circle and name something from that category. No repeats, and no pausing for more than 3 seconds. The circle must be completed twice.", players: 'all' },
    { text: "Synchronized Clap! The group must all clap at the exact same time. You have three attempts to achieve perfect sync.", players: 'all' },
    { text: "One-Legged Army! The entire group must balance on their left leg for 15 seconds. If anyone puts their foot down, the group fails.", players: 'all', duration: 15 },
    { text: "Group Hum! Everyone hums the tune to 'Twinkle Twinkle Little Star' together for 15 seconds. The challenge is to start, stay, and end in sync.", players: 'all', duration: 15 },
    { text: "Trust Fall Circle! Form a tight circle. One person stands in the middle, crosses their arms, and falls, being caught and gently pushed by the group. Everyone who wants a turn gets one. The group wins if everyone feels safe and supported.", players: 'all' },
    { text: "The 'Yes' Game! For the next 2 minutes, every player must start every sentence they say with the word 'Yes'. The first person to forget fails the challenge for the group.", players: 'all', duration: 120 }
];

export default function PhysicalChallenge({ players, onComplete }) {
    const [challenge, setChallenge] = useState(null);
    const [timer, setTimer] = useState(null);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [timerReady, setTimerReady] = useState(false);
    const [timerFinished, setTimerFinished] = useState(false);

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
            text = text.replace(/{player1}/g, player1);
        } else if (selected.players === 2) {
            // This logic assumes players.length is already >= 2 due to the filter above
            const p1Index = Math.floor(Math.random() * players.length);
            let p2Index = Math.floor(Math.random() * players.length);
            while (p1Index === p2Index) {
                p2Index = Math.floor(Math.random() * players.length);
            }
            text = text.replace(/{player1}/g, players[p1Index]).replace(/{player2}/g, players[p2Index]);
        }
        
        setChallenge({ ...selected, text });
        
        if (selected.duration) {
            setTimer(selected.duration);
            setTimerReady(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Runs only once when the component mounts

    useEffect(() => {
        if (!isTimerActive || timer === null) return;

        if (timer === 0) {
            setIsTimerActive(false);
            setTimerFinished(true);
            return;
        }

        const intervalId = setInterval(() => {
            setTimer(t => t - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [isTimerActive, timer]);

    const handleStartTimer = () => {
        setTimerReady(false);
        setIsTimerActive(true);
    };

    if (!challenge) return null;

    return (
        <div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">PHYSICAL CHALLENGE!</h2>
            <p className="text-xl mb-8">{challenge.text}</p>
            {isTimerActive && (
                <div className="my-6">
                    <div className="text-6xl font-mono font-bold text-white animate-pulse">
                        {timer}
                    </div>
                </div>
            )}
            {timerReady && (
                <div className="my-6">
                    <button
                        onClick={handleStartTimer}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
                    >
                        Start Timer!
                    </button>
                </div>
            )}
            {(timerFinished || !challenge.duration) && (
                <>
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
                </>
            )}
        </div>
    );
}