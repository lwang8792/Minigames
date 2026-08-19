/* ── Shared game data ─────────────────────────────────────── */

window.GameData = {

  /* Connections puzzles — pool of real puzzles, one chosen at random */
  connectionsPuzzles: [
    {
      groups: [
        { name: 'Planets', words: ['Mercury', 'Venus', 'Saturn', 'Neptune'] },
        { name: 'Card games', words: ['Bridge', 'Poker', 'Solitaire', 'Rummy'] },
        { name: 'Types of dance', words: ['Salsa', 'Waltz', 'Tango', 'Foxtrot'] },
        { name: '_____ bar', words: ['Candy', 'Gold', 'Crow', 'Handle'] }
      ]
    },
    {
      groups: [
        { name: 'Pasta shapes', words: ['Penne', 'Rigatoni', 'Fusilli', 'Farfalle'] },
        { name: 'Musical instruments', words: ['Trumpet', 'Violin', 'Cello', 'Oboe'] },
        { name: 'Shades of blue', words: ['Navy', 'Cobalt', 'Teal', 'Azure'] },
        { name: 'Things that are round', words: ['Globe', 'Wheel', 'Clock', 'Pizza'] }
      ]
    },
    {
      groups: [
        { name: 'Dog breeds', words: ['Poodle', 'Beagle', 'Boxer', 'Collie'] },
        { name: 'Units of measurement', words: ['Gallon', 'Meter', 'Pound', 'Kelvin'] },
        { name: 'Greek letters', words: ['Alpha', 'Delta', 'Omega', 'Sigma'] },
        { name: 'Famous ___', words: ['Amos', 'Five', 'Dave', 'Grouse'] }
      ]
    },
    {
      groups: [
        { name: 'Things in a wallet', words: ['Cash', 'License', 'Receipt', 'Card'] },
        { name: 'Olympic sports', words: ['Fencing', 'Rowing', 'Judo', 'Archery'] },
        { name: 'Types of cloud', words: ['Cirrus', 'Cumulus', 'Stratus', 'Nimbus'] },
        { name: 'Horror movie villains', words: ['Freddy', 'Jason', 'Chucky', 'Jigsaw'] }
      ]
    },
    {
      groups: [
        { name: 'Breakfast foods', words: ['Waffle', 'Pancake', 'Omelet', 'Bagel'] },
        { name: 'Parts of a book', words: ['Spine', 'Chapter', 'Index', 'Cover'] },
        { name: 'Dances', words: ['Mambo', 'Rumba', 'Samba', 'Polka'] },
        { name: 'Words before "fish"', words: ['Sword', 'Cat', 'Angel', 'Star'] }
      ]
    },
    {
      groups: [
        { name: 'Fruits', words: ['Mango', 'Papaya', 'Guava', 'Lychee'] },
        { name: 'Types of hat', words: ['Fedora', 'Beret', 'Beanie', 'Turban'] },
        { name: 'Chess pieces', words: ['Bishop', 'Knight', 'Rook', 'Pawn'] },
        { name: '___ house', words: ['Court', 'Ware', 'Green', 'Fire'] }
      ]
    },
    {
      groups: [
        { name: 'Bodies of water', words: ['Lake', 'River', 'Ocean', 'Creek'] },
        { name: 'Footwear', words: ['Sandal', 'Loafer', 'Boot', 'Clog'] },
        { name: 'Music genres', words: ['Jazz', 'Blues', 'Punk', 'Disco'] },
        { name: 'Words that follow "black"', words: ['Berry', 'Board', 'Smith', 'Bird'] }
      ]
    },
    {
      groups: [
        { name: 'Vegetables', words: ['Carrot', 'Celery', 'Turnip', 'Radish'] },
        { name: 'Parts of a car', words: ['Bumper', 'Fender', 'Hood', 'Trunk'] },
        { name: 'Currencies', words: ['Dollar', 'Pound', 'Euro', 'Franc'] },
        { name: 'Robin ___', words: ['Hood', 'Son', 'Williams', 'Eggs'] }
      ]
    },
    {
      groups: [
        { name: 'Kitchen appliances', words: ['Blender', 'Toaster', 'Mixer', 'Grinder'] },
        { name: 'Zodiac signs', words: ['Gemini', 'Pisces', 'Virgo', 'Libra'] },
        { name: 'Types of fabric', words: ['Silk', 'Denim', 'Linen', 'Velvet'] },
        { name: 'Words for "fast"', words: ['Quick', 'Swift', 'Rapid', 'Fleet'] }
      ]
    },
    {
      groups: [
        { name: 'Ice cream flavors', words: ['Vanilla', 'Mocha', 'Mint', 'Mango'] },
        { name: 'Tools', words: ['Hammer', 'Wrench', 'Pliers', 'Drill'] },
        { name: 'US states', words: ['Texas', 'Oregon', 'Alaska', 'Idaho'] },
        { name: '___ cream', words: ['Ice', 'Sun', 'Sour', 'Whipped'] }
      ]
    },
    {
      groups: [
        { name: 'Flowers', words: ['Daisy', 'Orchid', 'Tulip', 'Lotus'] },
        { name: 'Board games', words: ['Clue', 'Risk', 'Sorry', 'Life'] },
        { name: 'Precious stones', words: ['Ruby', 'Pearl', 'Jade', 'Opal'] },
        { name: 'Also a first name', words: ['Rose', 'Grace', 'Amber', 'Ivy'] }
      ]
    },
    {
      groups: [
        { name: 'Things at a beach', words: ['Shell', 'Wave', 'Sand', 'Tide'] },
        { name: 'Elements', words: ['Iron', 'Gold', 'Neon', 'Lead'] },
        { name: 'Types of bread', words: ['Rye', 'Wheat', 'Sourdough', 'Pumpernickel'] },
        { name: 'Rock bands', words: ['Queen', 'Rush', 'Cream', 'Kiss'] }
      ]
    },
    {
      groups: [
        { name: 'Spices', words: ['Cumin', 'Thyme', 'Sage', 'Clove'] },
        { name: 'Mythical creatures', words: ['Dragon', 'Griffin', 'Phoenix', 'Hydra'] },
        { name: 'Math terms', words: ['Cosine', 'Matrix', 'Vector', 'Factor'] },
        { name: 'Marvel heroes', words: ['Thor', 'Blade', 'Storm', 'Vision'] }
      ]
    },
    {
      groups: [
        { name: 'Trees', words: ['Maple', 'Cedar', 'Birch', 'Willow'] },
        { name: 'Dances', words: ['Waltz', 'Swing', 'Twist', 'Hustle'] },
        { name: 'Synonyms for "steal"', words: ['Swipe', 'Pinch', 'Lift', 'Nab'] },
        { name: 'Apple ___', words: ['Sauce', 'Jack', 'Seed', 'Pie'] }
      ]
    },
    {
      groups: [
        { name: 'Things in the sky', words: ['Cloud', 'Star', 'Comet', 'Rainbow'] },
        { name: 'Types of jacket', words: ['Blazer', 'Parka', 'Bomber', 'Vest'] },
        { name: 'Card game terms', words: ['Bluff', 'Fold', 'Deal', 'Ace'] },
        { name: '___ ball', words: ['Basket', 'Snow', 'Foot', 'Base'] }
      ]
    },
    {
      groups: [
        { name: 'Dairy products', words: ['Butter', 'Yogurt', 'Cheese', 'Cream'] },
        { name: 'Materials', words: ['Marble', 'Granite', 'Slate', 'Quartz'] },
        { name: 'Dances', words: ['Floss', 'Shimmy', 'Moonwalk', 'Robot'] },
        { name: 'Tooth ___', words: ['Brush', 'Paste', 'Fairy', 'Ache'] }
      ]
    },
    {
      groups: [
        { name: 'Nuts', words: ['Almond', 'Cashew', 'Pecan', 'Walnut'] },
        { name: 'Emotions', words: ['Joy', 'Anger', 'Fear', 'Disgust'] },
        { name: 'Types of shark', words: ['Tiger', 'Bull', 'Hammerhead', 'Nurse'] },
        { name: 'Double letters', words: ['Boo', 'Bee', 'Too', 'See'] }
      ]
    },
    {
      groups: [
        { name: 'Pizza toppings', words: ['Olive', 'Pepper', 'Onion', 'Mushroom'] },
        { name: 'Modes of transport', words: ['Canoe', 'Subway', 'Scooter', 'Trolley'] },
        { name: 'Hairstyles', words: ['Braid', 'Mohawk', 'Mullet', 'Ponytail'] },
        { name: 'Green things', words: ['Grass', 'Lime', 'Frog', 'Emerald'] }
      ]
    },
    {
      groups: [
        { name: 'Weather', words: ['Thunder', 'Hail', 'Sleet', 'Drizzle'] },
        { name: 'Containers', words: ['Barrel', 'Crate', 'Basket', 'Bucket'] },
        { name: 'Dog commands', words: ['Sit', 'Stay', 'Fetch', 'Heel'] },
        { name: '___ light', words: ['Flash', 'Spot', 'Moon', 'Star'] }
      ]
    },
    {
      groups: [
        { name: 'Berries', words: ['Blueberry', 'Cranberry', 'Raspberry', 'Strawberry'] },
        { name: 'Reptiles', words: ['Gecko', 'Iguana', 'Cobra', 'Chameleon'] },
        { name: 'Things that spin', words: ['Top', 'Fan', 'Wheel', 'Tornado'] },
        { name: 'Super ___', words: ['Hero', 'Man', 'Market', 'Nova'] }
      ]
    }
  ],

  makeConnectionsPuzzle: function () {
    var puzzlePool = this.connectionsPuzzles;
    var chosen = puzzlePool[Math.floor(Math.random() * puzzlePool.length)];

    var tiles = [];
    var groups = [];
    var id = 0;

    for (var g = 0; g < chosen.groups.length; g++) {
      var tileIds = [];
      for (var i = 0; i < chosen.groups[g].words.length; i++) {
        tiles.push({
          id: id,
          text: chosen.groups[g].words[i],
          state: 'available'
        });
        tileIds.push(id);
        id++;
      }
      groups.push({ name: chosen.groups[g].name, tileIds: tileIds });
    }

    return { tiles: tiles, groups: groups };
  },

  /* Wordle word list — from MenuScreen.cpp playWordle() */
  wordList: [
    "apple", "beach", "chair", "clock", "cloud",
    "dress", "earth", "field", "floor", "glass",
    "heart", "horse", "house", "knife", "light",
    "money", "music", "night", "ocean", "paper",
    "phone", "piano", "plant", "radio", "river",
    "shirt", "shoes", "smile", "stone", "table",
    "train", "truck", "voice", "watch", "water",
    "wheel", "world", "bread", "fruit", "sugar",
    "begin", "bring", "build", "carry", "catch",
    "cause", "check", "close", "count", "dance",
    "drink", "drive", "fight", "focus", "guess",
    "laugh", "learn", "leave", "maybe", "order",
    "paint", "party", "pause", "point", "print",
    "raise", "reach", "share", "sleep", "speak",
    "spend", "stand", "start", "study", "teach",
    "thank", "think", "throw", "touch", "angry",
    "basic", "black", "blind", "brave", "brief",
    "broad", "brown", "cheap", "clean", "clear",
    "empty", "fresh", "great", "green", "happy",
    "heavy", "large", "quiet", "smart", "uncut"
  ],

  /* Sudoku puzzle string — from MenuScreen.cpp playSudoku() */
  sudokuPuzzle:
    "530070000" +
    "600195000" +
    "098000060" +
    "800060003" +
    "400803001" +
    "700020006" +
    "060000280" +
    "000419005" +
    "000080079",

  /* Memory Match symbols */
  memoryMatchSymbols: [
    "🍎","🍌","🍇","🍓","🍒","🍉","🍍","🥝"
  ],

  /* Current logged-in user (set by login.js) */
  currentUser: null
};
