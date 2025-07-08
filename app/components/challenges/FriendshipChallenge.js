'use client';

import { useState, useEffect } from 'react';

const questions = [
    "What is {playerB}'s go-to coffee or tea order?",
    "What is {playerB}'s favorite season and why?",
    "If {playerB} could only eat one type of cuisine for the rest of their life, what would it be?",
    "What is {playerB}'s all-time favorite movie?",
    "What's a movie {playerB} secretly loves but would be embarrassed to admit?",
    "What TV show has {playerB} re-watched the most times?",
    "Who is {playerB}'s ultimate celebrity crush?",
    "What is {playerB}'s go-to karaoke song?",
    "Is {playerB} a dog person or a cat person?",
    "What would be {playerB}'s 'death row' final meal?",
    "What is {playerB}'s favorite board game or video game?",
    "What's {playerB}'s favorite type of weather?",
    "What is a food that {playerB} absolutely refuses to eat?",
    "What is {playerB}'s favorite band or musical artist?",
    "What is {playerB}'s favorite holiday?",
    "What is {playerB}'s go-to comfort food?",
    "Is {playerB} a morning person or a night owl?",
    "What is something guaranteed to make {playerB} laugh?",
    "What is {playerB}'s biggest pet peeve?",
    "How does {playerB} *actually* relax and de-stress?",
    "Is {playerB} more of a planner or a 'go with the flow' type?",
    "What is {playerB}'s spirit animal?",
    "What's {playerB}'s 'tell' when they're bluffing or telling a little white lie?",
    "Is {playerB} a texter or a caller?",
    "What's a small, weird thing that brings {playerB} immense joy?",
    "How competitive is {playerB} on a scale of 1 to 10?",
    "What's a word or phrase {playerB} uses way too often?",
    "Is {playerB} an introvert, extrovert, or ambivert?",
    "What is {playerB}'s love language? (Acts of service, gifts, quality time, etc.)",
    "What is {playerB}'s go-to dance move?",
    "How does {playerB} act when they are hangry (hungry + angry)?",
    "If {playerB} could have any superpower, what would it be?",
    "If {playerB} won the lottery tomorrow, what's the first thing they would buy?",
    "If {playerB} could have dinner with any three people, living or dead, who would they choose?",
    "In a zombie apocalypse, what would {playerB}'s role be in the survivor group?",
    "If {playerB}'s life were a movie, what genre would it be and who would play them?",
    "If {playerB} could be a master of any skill instantly, what would they choose?",
    "If {playerB} could live in any fictional world (from a book, movie, or TV show), where would it be?",
    "If {playerB} had to be a character in a horror movie, would they be the final survivor, the first to go, or the killer?",
    "What would be {playerB}'s dream vacation?",
    "If {playerB} could time travel, would they go to the past or the future?",
    "What would be the title of {playerB}'s autobiography?",
    "If {playerB} were a professional wrestler, what would their stage name be?",
    "What did {playerB} want to be when they grew up?",
    "What was {playerB}'s favorite cartoon as a kid?",
    "What is {playerB}'s proudest accomplishment?",
    "What's a story from their childhood that {playerB} tells all the time?",
    "What was {playerB}'s first-ever job?",
    "Who was {playerB}'s first celebrity crush?",
    "What was the first concert {playerB} ever attended?",
    "What is {playerB}'s most embarrassing moment they've told you about?",
    "What is {playerB}'s favorite memory of the two of you?",
    "What fashion trend did {playerB} embrace that they now deeply regret?",
    "What was {playerB}'s first screen name or email address?",
    "What is the weirdest thing {playerB} has ever eaten?",
    "What is {playerB}'s biggest, most irrational fear?",
    "What's a secret talent {playerB} has that most people don't know about?",
    "What's the best gift {playerB} has ever received?",
    "What's the one household chore {playerB} despises the most?",
    "If you checked {playerB}'s search history, what would be the weirdest thing you'd find?",
    "What is the most prized possession {playerB} owns?",
    "What is something {playerB} is surprisingly good at?",
    "What is something {playerB} is terrible at, but loves doing anyway?",
    "What is the most out-of-character thing you've ever seen {playerB} do?",
    "What is an inside joke between the two of you that {playerB} would find hilarious?",
    "What does {playerB} think is their best physical feature?",
    "What's a little, specific thing you do that you know annoys {playerB}?",
    "What is {playerB}'s 'unpopular opinion' that they will defend to the death?",
    "What is {playerB}'s most-used emoji?",
    "Is {playerB} an alarm 'snoozer' or do they get up right away?",
    "How does {playerB} take their eggs?",
    "What's the one app on {playerB}'s phone they couldn't live without?",
    "Is {playerB} more likely to lose their keys or their phone?",
    "What is something {playerB} always procrastinates on?",
    "What is {playerB}'s go-to snack when watching a movie at home?",
    "Can {playerB} keep a houseplant alive?",
    "Is {playerB} an online shopper or an in-store shopper?",
    "What is the messiest part of {playerB}'s room or home?",
    "Does {playerB} prefer a night in or a night out?",
    "Would {playerB} rather be too hot or too cold?",
    "Comedy club or live music concert: which would {playerB} choose?",
    "What's {playerB}'s most controversial pizza topping opinion?",
    "Does {playerB} prefer sweet or savory breakfast foods?",
    "Would {playerB} rather have the ability to fly or be invisible?",
    "Texting or FaceTime: what is {playerB}'s preferred method of communication?",
    "Does {playerB} prefer books or the movie adaptations of them?",
    "Window seat or aisle seat on a plane for {playerB}?",
    "What is {playerB}'s favorite type of dessert?",
    "If {playerB} was arrested with no explanation, what would you assume they did?",
    "If {playerB} had a warning label, what would it say?",
    "What's a weird food combination that {playerB} genuinely loves?",
    "If {playerB} had to enter a talent show right now, what would their act be?",
    "If {playerB} were a type of pasta, what shape would they be?",
    "What fictional character does {playerB} relate to the most?",
    "If {playerB}'s personality was a flavor of ice cream, what would it be?",
    "What's {playerB}'s go-to excuse for getting out of plans?",
    "If {playerB} had to survive on vending machine food for a week, what would be their top pick?",
    "What animal would {playerB} most likely be reincarnated as?",
    "What quality does {playerB} admire most in other people?",
    "What social cause is {playerB} most passionate about?",
    "What is a piece of advice {playerB} always gives but struggles to follow themselves?",
    "What is a major dealbreaker for {playerB} in a relationship?",
    "Who is the person {playerB} would call first with amazing news?",
    "What's a movie or song that always makes {playerB} cry?",
    "What scent is the most nostalgic for {playerB}?",
    "What is a skill that {playerB} is currently trying to learn?",
    "What is a subject that {playerB} wishes they knew more about?",
    "What does {playerB} consider their greatest strength?",
    "At a party, where would you most likely find {playerB}?",
    "What is {playerB}'s 'tell' when they are getting bored in a conversation?",
    "What is your funniest memory with {playerB}?",
    "What's an argument that {playerB} will always get into and defend their side passionately?",
    "Who in their life makes {playerB} laugh the hardest?",
    "Is {playerB} a stickler for rules or more of a rule-bender?",
    "How does {playerB} act when meeting new people for the first time?",
    "What's the best compliment you've ever given {playerB}?",
    "What is the title of the group chat {playerB} uses the most?",
    "If you needed to be bailed out of jail, would {playerB} be your first call?"
] 

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
            <p className="text-2xl font-semibold mb-8">&quot;{question}&quot;</p>
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