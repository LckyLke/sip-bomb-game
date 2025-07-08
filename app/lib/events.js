import { getRandom } from './utils';

// --- EXPANDED RULE SET ---
const possibleRules = [
  // Original Rules
  { 
    id: 't-rex', 
    text: 'T-Rex Arms: Keep your elbows tucked to your sides at all times.' 
  },
  {
    id: 'yes-no-ok',
    text: "You cannot say the words 'yes', 'no', or 'ok'. If you do, you drink."
  },
  { 
    id: 'no-pointing', 
    text: 'No Pointing: You cannot point at anyone or anything with your fingers.' 
  },
  { 
    id: 'green-man', 
    text: 'Little Green Man: Before you drink, you must remove an imaginary little green man from your cup and place him on the table. After you drink, you must put him back.' 
  },
  {
    id: 'question-master',
    text: '{player} is the Question Master. If you answer any of their questions, you drink.',
    requiresPlayer: true
  },
  // New Rules
  {
    id: 'thumb-master',
    text: '{player} is the Thumb Master. When they secretly place their thumb on the table, everyone else must do the same. The last person to do so drinks.',
    requiresPlayer: true
  },
  {
    id: 'no-first-names',
    text: "No First Names: You can't call anyone by their first name. Give everyone nicknames or be creative."
  },
  {
    id: 'viking-master',
    text: "{player} is the Viking Master. When they make horns on their head with their fingers, everyone must start rowing an imaginary Viking ship. The last person to start rowing drinks.",
    requiresPlayer: true
  },
  {
    id: 'left-hand-drink',
    text: "Weak Hand Challenge: You must only hold your drink and drink with your non-dominant hand."
  },
  {
    id: 'no-swearing',
    text: "The Care Bear Stare: No swearing is allowed. The penalty for cursing is a drink."
  },
  {
    id: 'the-jester',
    text: "{player} is the Jester. They are not allowed to laugh or smile. If they do, they drink.",
    requiresPlayer: true
  },
  {
    id: 'the-parrot',
    text: "{player} is the Parrot. They must repeat the last word of the previous person's sentence before they are allowed to speak.",
    requiresPlayer: true
  },
  {
    id: 'compliment-rule',
    text: "The Encourager: Before you take a drink, you must give a genuine compliment to another player."
  },
  {
    id: 'no-phone',
    text: "Digital Detox: No touching your phone. The first person to be caught using their phone gets a penalty drink."
  }
];

// --- MAIN EVENT GENERATION LOGIC ---

export const generateRandomEvent = (players, currentRules) => {
  // We can add a 'weight' to make some events more or less common
  const eventTypes = [
      'drink', 'drink', 'drink', // drink is most common
      'new_rule', 'new_rule', 
      'mini_game', 
      'timer_and_sips_doubled'
    ];
  const type = getRandom(eventTypes);

  switch (type) {
    case 'drink': {
      // --- EXPANDED DRINK SCENARIOS ---
      const drinkScenarios = [
        {
          title: 'A Thirsty Ghost Appears!',
          generate: (players) => {
            const numPlayersToDrink = Math.random() < 0.5 && players.length > 1 ? 2 : 1;
            const sips = Math.floor(Math.random() * 3) + 2;
            const selectedPlayers = [...players].sort(() => 0.5 - Math.random()).slice(0, numPlayersToDrink);
            const playersText = selectedPlayers.join(' and ');
            return {
              message: `${playersText}, you must drink ${sips} sips! The ghost demands it.`,
            }
          }
        },
        {
          title: 'Waterfall!',
          generate: (players) => {
            const starter = getRandom(players);
            return {
              message: `${starter} starts a WATERFALL! Everyone start drinking. You can only stop drinking after the person to your right stops. ${starter} can stop whenever they want!`,
            }
          }
        },
        {
          title: 'Social!',
          generate: (players) => {
            const player = getRandom(players);
            return {
              message: `${player}, pick another player to have a drink with you. You both take 4 sips. Choose wisely!`,
            }
          }
        },
        {
          title: 'Category Calamity!',
          generate: (players) => {
            const categories = [
              { name: 'wearing black', sips: 2 },
              { name: 'who have a pet', sips: 3 },
              { name: 'with siblings', sips: 2 },
              { name: 'whose birthday is in the next 3 months', sips: 4 },
            ];
            const category = getRandom(categories);
            return {
              message: `Everyone ${category.name}, take ${category.sips} sips!`,
            }
          }
        },
        {
          title: 'Unity!',
          generate: (players) => {
            return { message: `This one's for the team. Everyone drinks 2 sips together!` };
          }
        }
      ];

      const scenario = getRandom(drinkScenarios);
      return {
        type: 'drink',
        title: scenario.title,
        ...scenario.generate(players),
        buttonText: 'Cheers!'
      };
    }
    
    case 'new_rule': {
      const availableRules = possibleRules.filter(r => !currentRules.some(cr => cr.id === r.id));
      
      if (availableRules.length === 0) {
        return {
            type: 'drink',
            title: 'Rule Overload!',
            message: 'You have too many rules! Everyone take 1 sip to celebrate your big brains!',
            buttonText: 'Phew!'
        };
      }

      let newRule = getRandom(availableRules);
      let message = `A new decree has been issued! From now on: "${newRule.text}". Forgetting means you drink!`;

      if (newRule.requiresPlayer) {
        const player = getRandom(players);
        // Create a new object for the specific instance of the rule
        newRule = { 
            ...newRule, 
            text: newRule.text.replace('{player}', player),
            player: player // Store which player is assigned
        };
        message = `A new challenger appears! ${newRule.text}. Don't forget who has the power!`;
      }
      
      return {
        type: 'new_rule',
        title: 'A NEW RULE IS BORN!',
        message: message,
        newRule: newRule,
        buttonText: 'We obey!'
      };
    }

    case 'timer_and_sips_doubled': {
        return {
            type: 'timer_and_sips_doubled',
            title: 'DOUBLE TROUBLE!',
            message: "The bomb's timer AND the number of sips have been doubled! More time, but the stakes are higher.",
            buttonText: 'Yikes!'
        };
    }
    
    case 'mini_game': {
        // --- EXPANDED MINI-GAME LIBRARY ---
        const miniGames = [
            {
                title: 'Floor is Lava!',
                message: 'QUICK! The floor is lava! The last person to get both their feet off the ground has to take 5 sips!',
                buttonText: "I'm safe!"
            },
            {
                title: 'Most Likely To...',
                message: "On the count of three, everyone point to the person 'Most Likely to Become a Supervillain'. The person with the most votes drinks 4 sips.",
                buttonText: 'It wasn\'t me!'
            },
            {
                title: 'Rhyme Time!',
                message: "The player who triggered this event says a word. Go clockwise, each player must say a word that rhymes. The first to fail or repeat a word drinks 5 sips!",
                buttonText: 'Let\'s rhyme!'
            },
            {
                title: 'Categories!',
                message: "Let's play Categories! The category is 'Types of Cereal'. Go clockwise, naming one. The first to hesitate for too long or name a repeat loses and drinks 5 sips!",
                buttonText: 'I love cereal!'
            },
            {
                title: 'Staring Contest!',
                message: 'Two players are chosen at random for an epic STARE-DOWN. The first to blink, laugh, or look away loses and must take 6 sips!',
                buttonText: 'Let them fight!'
            },
            {
                title: 'Rock Paper Scissors CHAMPION!',
                message: "Everyone find a partner for Rock-Paper-Scissors. Losers drink 2 sips and are out. Winners find new partners. This continues until only one champion remains. The champion may give out 10 sips, divided however they choose!",
                buttonText: 'To victory!'
            }
        ];

        return {
            type: 'mini_game',
            ...getRandom(miniGames)
        };
    }

    default:
      // This should ideally never be reached
      return {
          type: 'drink',
          title: 'Cosmic Glitch!',
          message: 'The universe hiccuped. Everyone drink 1 sip to restore balance.',
          buttonText: 'To balance!'
      };
  }
};