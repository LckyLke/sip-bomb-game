'use client';

import { useState, useEffect } from 'react';

const questions  = [
    "What's the real reason your last relationship ended?",
    "Have you ever emotionally or physically cheated on a partner?",
    "What's a secret you've kept from your parents that they still don't know?",
    "Who in this room would you least want to be stuck on a desert island with and why?",
    "What's the cringiest thing you've ever done to get a crush's attention?",
    "Have you ever faked being sick to get out of work, school, or a date?",
    "What's the most embarrassing thing on your current web browser history?",
    "Describe your most awkward date in detail.",
    "What's the biggest lie you've ever told that you got away with?",
    "If you had to read the last text message you sent out loud, what would it say?",
    "What is your biggest insecurity?",
    "Who was your most recent social media stalk? Why were you looking?",
    "What's the worst rumor you've ever spread about someone?",
    "Have you ever been in love with someone who didn't love you back?",
    "What's one thing you would change about your physical appearance if you could?",
    "What's the most illegal thing you've ever done?",
    "If you could swap lives with anyone in this room, who would it be and why?",
    "What's a password you've used that's really embarrassing?",
    "What's a secret you know about someone in this room?",
    "How many people have you ghosted in your life?",
    "What's the most desperate thing you've done for money?",
    "Have you ever peed in a swimming pool as an adult?",
    "What's the most overrated thing that all your friends seem to love?",
    "What is the actual number of people you've been intimate with?",
    "What's an opinion you have that you're afraid to voice publicly?",
    "If you had to date someone in this room, who would you choose?",
    "Have you ever snooped through a partner's or friend's phone?",
    "What's the first thing you would do if you were the opposite gender for a day?",
    "What's something you do when you're alone that you would be horrified if anyone saw?",
    "When was the last time you lied to someone in this room?",
    "What's the weirdest dream you've ever had?",
    "Have you ever practiced kissing in a mirror?",
    "What's the thirstiest DM you've ever sent?",
    "Who is your 'hall pass'?",
    "What's the worst physical pain you've ever been in?",
    "Do you have a backup plan if your current relationship or life path fails?",
    "What's a lie you have on your resume or LinkedIn profile?",
    "Who is the last person you fantasized about?",
    "What's the biggest misconception people have about you?",
    "Have you ever stolen something? What was it?",
    "What's a smell you secretly enjoy?",
    "What celebrity crush would you be most embarrassed to admit?",
    "If you could see anyone in this room's search history, whose would it be?",
    "Have you ever regifted a present?",
    "What's your most controversial 'hot take'?",
    "How long is the longest you've gone without showering?",
    "What's a secret you've never told anyone before, ever?",
    "What is the worst thing a guest has ever done in your house?",
    "Out of everyone in this room, who do you think is the worst-dressed?",
    "What's your biggest turn-off in a person?",
    "Have you ever had a crush on a friend's partner?",
    "What's a food you pretend to like but secretly hate?",
    "What is the most childish thing you still do?",
    "If you had to block one person in this room on social media, who would it be?",
    "What's something you've done that you still feel guilty about?",
    "What's the lowest grade you ever got on a test you tried hard for?",
    "What's the weirdest thing you've ever eaten?",
    "Have you ever sent a text about someone to that same person by accident?",
    "What's the real reason you downloaded a dating app?",
    "Describe the moment you lost your innocence.",
    "What's the biggest amount of money you've ever lost or wasted?",
    "What do you really think about your partner's best friend?",
    "If your pets could talk, what's the most embarrassing thing they would say about you?",
    "What is your biggest regret in life so far?",
    "Have you ever thought about what you would say at an ex's wedding?",
    "What is your most toxic trait?",
    "What is a popular movie or TV show that you think is terrible?",
    "Who in this room is most likely to become a millionaire?",
    "What is the longest you have held a grudge?",
    "What is the most embarrassing song on your Spotify or Apple Music?",
    "Have you ever picked your nose and eaten it as an adult?",
    "If you found a wallet on the street, would you take the cash before returning it?",
    "What's something you are really snobby or pretentious about?",
    "What's an irrational fear you have?",
    "If you could have a 'free pass' to do one thing without any consequences, what would you do?",
    "Who was the worst kisser you've ever kissed?",
    "Have you ever made a fake social media account to stalk someone?",
    "What's a weird physical feature you find attractive in others?",
    "If you had to be brutally honest, what is one thing you would change about your best friend?",
    "Have you ever pretended to not see someone you know in public to avoid talking to them?",
    "What's your 'go-to' fantasy when you're bored?",
    "Who do you think is the most annoying celebrity?",
    "What's a job you would absolutely never do, no matter how much it paid?",
    "If you could listen in on any one person's thoughts for a day, who would it be?",
    "Have you ever been fired from a job?",
    "What's your worst habit?",
    "Who in this room do you trust the least?",
    "Have you ever been the 'other person' in someone's relationship?",
    "What is your screen time on your phone for today/yesterday?",
    "What's something you've said about someone in this room behind their back?",
    "What do you hate most about the person to your left?",
    "What is your body count?",
    "What's a family secret you were told never to repeat?",
    "Have you ever been walked in on while doing something private?",
    "What's your biggest financial secret?",
    "If you were invisible, who is the first person you would go watch?",
    "What's the worst advice you have ever given someone?",
    "Have you ever considered breaking up with your current partner? If so, why?",
    "Who do you think about most when you are alone?",
] 

export default function TruthChallenge({ players, onComplete, usedQuestions = [] }) {
    const [question, setQuestion] = useState('');
    const [player, setPlayer] = useState('');

    useEffect(() => {
        setPlayer(players[Math.floor(Math.random() * players.length)]);
        
        // Filter out already used questions
        const availableQuestions = questions.filter(q => !usedQuestions.includes(q));
        
        // If all questions have been used, reset and use all questions
        const questionsToUse = availableQuestions.length > 0 ? availableQuestions : questions;
        
        const selectedQuestion = questionsToUse[Math.floor(Math.random() * questionsToUse.length)];
        setQuestion(selectedQuestion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleComplete = (result) => {
        // Include the question in the result so parent can track it
        onComplete({
            ...result,
            usedQuestion: question
        });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">TRUTH!</h2>
            <p className="text-xl mb-6">
                <span className="font-bold text-red-500">{player}</span>, you must answer this question truthfully or the whole team pays the price.
            </p>
            <p className="text-2xl font-semibold mb-8">&quot;{question}&quot;</p>
            <div className="flex justify-center gap-4">
                <button onClick={() => handleComplete({ success: true, sipsChange: -5 })} className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-lg">
                    Truth Answered!
                </button>
                <button onClick={() => handleComplete({ success: false, instantSips: 3, sipsIncrease: 5 })} className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-lg text-lg">
                    Refuse to Answer!
                </button>
            </div>
        </div>
    );
}