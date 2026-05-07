// ════════════════════════════════════════════════
// FIREBASE INIT
// ════════════════════════════════════════════════
const firebaseConfig = {
  apiKey:"AIzaSyD4nh1T4uX_DzQAGi-LRsk7ZkVaYG9XNhg",
  authDomain:"sn-casino.firebaseapp.com",
  databaseURL:"https://sn-casino-default-rtdb.firebaseio.com",
  projectId:"sn-casino",
  storageBucket:"sn-casino.firebasestorage.app",
  messagingSenderId:"651203570717",
  appId:"1:651203570717:web:3bfef376a7eaa3950a2af4"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.database();

// ════════════════════════════════════════════════
// STATE
// ════════════════════════════════════════════════
let currentUser  = null;
let userData     = {};
let soundOn      = true;
let sessionStart = Date.now();
let currentBet   = 100;
let currentGame  = null;
let coinSymbol   = '🪙';

// Owner UID for moderation features
const OWNER_UID = 'Xs86zRgqpOdNw2tCEfBWgGlTnNL2';

// ════════════════════════════════════════════════
// ACHIEVEMENTS
// ════════════════════════════════════════════════
const ACHIEVEMENTS = [
  {id:'first_win',    icon:'🏅', name:'First Win',         desc:'Win your first game'},
  {id:'broke',        icon:'💸', name:'Broke!',            desc:'Drop below 500 coins'},
  {id:'millionaire',  icon:'💰', name:'Millionaire',       desc:'Reach 1,000,000 coins'},
  {id:'big_win',      icon:'💥', name:'Big Winner',        desc:'Win 10,000+ coins in one game'},
  {id:'lucky_7',      icon:'7️⃣',  name:'Lucky 7s',         desc:'Hit three 7s on slots'},
  {id:'blackjack',    icon:'🃏', name:'Blackjack!',        desc:'Hit a natural blackjack'},
  {id:'games_10',     icon:'🎮', name:'Getting Started',   desc:'Play 10 games'},
  {id:'games_100',    icon:'🕹️', name:'Dedicated',         desc:'Play 100 games'},
  {id:'games_500',    icon:'🎖', name:'Veteran',           desc:'Play 500 games'},
  {id:'daily_7',      icon:'📅', name:'Week Streak',       desc:'Claim daily spin 7 days in a row'},
  {id:'roulette_0',   icon:'🎡', name:'Zero Hero',         desc:'Hit 0 on roulette'},
  {id:'plinko_max',   icon:'🔵', name:'Plinko Max',        desc:'Hit the highest Plinko multiplier'},
  {id:'bus_5',        icon:'🚌', name:'Bus Rider',         desc:'Survive all 4 stages in Ride the Bus'},
  {id:'fish_book',    icon:'🐟', name:'Full Shelf',        desc:'Complete a book in Go Fish'},
  {id:'scratch_3',    icon:'🎟️', name:'Triple Match',      desc:'Match 3 in Scratch Card'},
  {id:'poker_royal',  icon:'👑', name:'Royal Flush',       desc:'Hit a Royal Flush in Video Poker'},
  {id:'total_50k',    icon:'💎', name:'High Roller',       desc:'Wager 50,000 coins total'},
  {id:'win_streak3',  icon:'🔥', name:'On Fire',           desc:'Win 3 games in a row'},
  {id:'flappy_10',    icon:'🐦', name:'Bird Brain',        desc:'Pass 10 pipes in Flappy Bet'},
  {id:'flappy_25',    icon:'🦅', name:'Eagle Eye',         desc:'Pass 25 pipes in Flappy Bet'},
  {id:'coin_flip_10', icon:'🪙', name:'Call It',           desc:'Win 10 coin flips'},
  {id:'mine_sweep',   icon:'💣', name:'Mine Sweeper',      desc:'Clear 20 tiles in Minesweeper'},
  {id:'horse_win',    icon:'🐎', name:'Pick a Winner',     desc:'Win a Horse Race bet'},
  {id:'higher_streak',icon:'🎯', name:'Streak Reader',     desc:'Get a 5-card streak in Higher or Lower'},
  {id:'wheel_jackpot',icon:'🎡', name:'Wheel Winner',      desc:'Hit the top prize on Wheel of Fortune'},
  {id:'ttt_win',      icon:'❌', name:'Tic-Tac-Toe Champ', desc:'Win a game of Tic-Tac-Toe'},
];

// ════════════════════════════════════════════════
// SHOP ITEMS
// ════════════════════════════════════════════════
const SHOP_THEMES = [
  // FREE / STARTER
  {id:'default',   name:'Deep Space',    preview:'🌌', desc:'Classic dark blue theme — Free!',              price:0,
   colors:{blue:'#0000ff',dark:'#02020a',glow:'rgba(0,0,255,.55)',particle:'#0000ff',gridColor:'rgba(0,0,255,.18)'}},
  // STANDARD
  {id:'gold',      name:'Gold Rush',     preview:'✨', desc:'Rich gold & black luxury',                      price:15000,
   colors:{blue:'#cc9900',dark:'#080500',glow:'rgba(200,150,0,.55)',particle:'#ffaa00',gridColor:'rgba(200,150,0,.18)'}},
  {id:'neon',      name:'Neon City',     preview:'🌃', desc:'Cyberpunk neon cyan glow',                      price:20000,
   colors:{blue:'#00ffff',dark:'#020814',glow:'rgba(0,255,255,.5)',particle:'#00ccff',gridColor:'rgba(0,255,255,.18)'}},
  {id:'forest',    name:'Dark Forest',   preview:'🌲', desc:'Deep emerald green theme',                      price:18000,
   colors:{blue:'#00bb44',dark:'#020a04',glow:'rgba(0,180,60,.5)',particle:'#00cc55',gridColor:'rgba(0,180,60,.18)'}},
  {id:'blood',     name:'Blood Moon',    preview:'🩸', desc:'Dark crimson & black',                          price:22000,
   colors:{blue:'#cc0022',dark:'#0a0202',glow:'rgba(200,0,30,.55)',particle:'#ff0033',gridColor:'rgba(200,0,30,.18)'}},
  {id:'purple',    name:'Void Purple',   preview:'🔮', desc:'Deep cosmic purple haze',                       price:25000,
   colors:{blue:'#9900ff',dark:'#060010',glow:'rgba(150,0,255,.55)',particle:'#aa22ff',gridColor:'rgba(150,0,255,.18)'}},
  {id:'rose',      name:'Rose Gold',     preview:'🌹', desc:'Elegant pink & rose gold',                      price:30000,
   colors:{blue:'#ff6699',dark:'#0a0205',glow:'rgba(255,80,140,.5)',particle:'#ff88bb',gridColor:'rgba(255,80,140,.18)'}},
  {id:'arctic',    name:'Arctic Ice',    preview:'❄️', desc:'Frosty white & icy blue',                      price:35000,
   colors:{blue:'#88ddff',dark:'#020810',glow:'rgba(100,200,255,.5)',particle:'#aaeeff',gridColor:'rgba(100,200,255,.18)'}},
  {id:'sunset',    name:'Sunset Blaze',  preview:'🌅', desc:'Warm orange sunset vibes',                      price:28000,
   colors:{blue:'#ff6600',dark:'#0a0300',glow:'rgba(255,100,0,.55)',particle:'#ff8833',gridColor:'rgba(255,100,0,.18)'}},
  {id:'galaxy',    name:'Galaxy Core',   preview:'🌠', desc:'Deep galaxy purple & pink',                     price:40000,
   colors:{blue:'#cc44ff',dark:'#04000e',glow:'rgba(180,0,255,.55)',particle:'#dd66ff',gridColor:'rgba(180,0,255,.18)'}},
  {id:'toxic',     name:'Toxic Green',   preview:'☢️', desc:'Radioactive neon green',                        price:32000,
   colors:{blue:'#44ff00',dark:'#000a00',glow:'rgba(50,255,0,.55)',particle:'#66ff22',gridColor:'rgba(50,255,0,.18)'}},
  {id:'midnight',  name:'Midnight Blue', preview:'🌙', desc:'Deep navy midnight sky',                        price:20000,
   colors:{blue:'#2244cc',dark:'#01010a',glow:'rgba(20,40,200,.55)',particle:'#3366ff',gridColor:'rgba(20,40,200,.18)'}},
  {id:'lava',      name:'Lava World',    preview:'🌋', desc:'Fiery red-orange molten theme',                 price:45000,
   colors:{blue:'#ff2200',dark:'#0a0100',glow:'rgba(255,30,0,.6)',particle:'#ff4400',gridColor:'rgba(255,30,0,.18)'}},
  {id:'chrome',    name:'Chrome',        preview:'⚙️', desc:'Sleek metallic silver & white',                 price:50000,
   colors:{blue:'#cccccc',dark:'#050507',glow:'rgba(200,200,220,.45)',particle:'#aaaacc',gridColor:'rgba(200,200,200,.18)'}},
  // PREMIUM
  {id:'neonpink',  name:'Neon Pink',     preview:'💗', desc:'Hot electric pink everything',                  price:75000,
   colors:{blue:'#ff00cc',dark:'#0a0006',glow:'rgba(255,0,200,.55)',particle:'#ff44cc',gridColor:'rgba(255,0,200,.18)'}},
  {id:'deepocean', name:'Deep Ocean',    preview:'🌊', desc:'Dark teal deep-sea vibes',                      price:80000,
   colors:{blue:'#006688',dark:'#010810',glow:'rgba(0,120,160,.55)',particle:'#0099bb',gridColor:'rgba(0,120,160,.18)'}},
  {id:'cyberred',  name:'Cyber Red',     preview:'🔴', desc:'Hard-edged neon red cyberpunk',                 price:90000,
   colors:{blue:'#ff1144',dark:'#0a0002',glow:'rgba(255,10,50,.55)',particle:'#ff3366',gridColor:'rgba(255,10,50,.18)'}},
  {id:'obsidian',  name:'Obsidian',      preview:'🪨', desc:'Near-black with barely-visible dark teal',      price:85000,
   colors:{blue:'#224444',dark:'#010404',glow:'rgba(20,80,80,.55)',particle:'#336666',gridColor:'rgba(20,80,80,.18)'}},
  {id:'solarflare',name:'Solar Flare',   preview:'☀️', desc:'Blazing yellow-white solar energy',             price:95000,
   colors:{blue:'#ffee00',dark:'#0a0900',glow:'rgba(255,220,0,.55)',particle:'#ffdd44',gridColor:'rgba(255,220,0,.18)'}},
  {id:'acidgreen', name:'Acid Green',    preview:'🧪', desc:'Sickly bright acid green laboratory',           price:100000,
   colors:{blue:'#aaff00',dark:'#020800',glow:'rgba(150,255,0,.55)',particle:'#ccff44',gridColor:'rgba(150,255,0,.18)'}},
  {id:'pasteldream',name:'Pastel Dream', preview:'🌸', desc:'Soft lavender pastel dreamscape',               price:120000,
   colors:{blue:'#cc99ff',dark:'#070410',glow:'rgba(180,130,255,.5)',particle:'#ddbbff',gridColor:'rgba(180,130,255,.18)'}},
  {id:'inferno',   name:'Inferno',       preview:'🔥', desc:'Deep black with white-hot flame cores',         price:150000,
   colors:{blue:'#ff6600',dark:'#080200',glow:'rgba(255,80,0,.6)',particle:'#ff9922',gridColor:'rgba(255,80,0,.2)'}},
  // LEGEND TIER
  {id:'prismatic', name:'Prismatic',     preview:'🌈', desc:'Shifts through every color — pure legend status', price:250000, tier:'legend',
   colors:{blue:'#ff44ff',dark:'#040004',glow:'rgba(200,0,200,.55)',particle:'#ff88ff',gridColor:'rgba(200,0,200,.18)'}},
  {id:'voidblack', name:'Void Black',    preview:'⬛', desc:'Pure void — the darkest theme imaginable',       price:300000, tier:'legend',
   colors:{blue:'#333355',dark:'#000000',glow:'rgba(30,30,80,.55)',particle:'#444466',gridColor:'rgba(30,30,80,.18)'}},
  {id:'abyssal',   name:'Abyssal',       preview:'🕳️', desc:'The abyss stares back. Deep crimson void.',     price:400000, tier:'legend',
   colors:{blue:'#880022',dark:'#010000',glow:'rgba(120,0,30,.55)',particle:'#aa0033',gridColor:'rgba(120,0,30,.18)'}},
  // MYTHIC TIER
  {id:'heavenwhite',name:'Heaven White', preview:'☁️', desc:'Pure divine white light. Nearly blinding.',     price:500000, tier:'mythic',
   colors:{blue:'#eeeeff',dark:'#080810',glow:'rgba(220,220,255,.55)',particle:'#ffffff',gridColor:'rgba(220,220,255,.25)'}},
  {id:'holographic',name:'Holographic', preview:'💿', desc:'Shimmering holographic rainbow iridescence',     price:600000, tier:'mythic',
   colors:{blue:'#00ffcc',dark:'#030308',glow:'rgba(0,255,200,.5)',particle:'#44ffdd',gridColor:'rgba(0,255,200,.2)'}},
  // DIVINE TIER
  {id:'godmode',   name:'GODMODE',       preview:'⚡', desc:'The ultimate theme. You have ascended.',         price:1000000, tier:'divine',
   colors:{blue:'#ffffff',dark:'#000005',glow:'rgba(255,255,255,.65)',particle:'#ffffff',gridColor:'rgba(255,255,255,.28)'}},
  {id:'legendary', name:'LEGENDARY',     preview:'👑', desc:'Forged from myth. No one has seen this. Until now.', price:1000000, tier:'divine',
   colors:{blue:'#ffd700',dark:'#040200',glow:'rgba(255,200,0,.65)',particle:'#ffee44',gridColor:'rgba(255,200,0,.25)'}},
  // NEW THEMES
  {id:'slime',     name:'Toxic Slime',   preview:'🟢', desc:'Gross glowing slime drips everywhere',          price:28000,
   colors:{blue:'#39ff14',dark:'#010800',glow:'rgba(57,255,20,.55)',particle:'#66ff33',gridColor:'rgba(57,255,20,.18)'}},
  {id:'copper',    name:'Copper Oxide',  preview:'🟤', desc:'Aged oxidized copper & teal patina',             price:32000,
   colors:{blue:'#3ddc97',dark:'#010a06',glow:'rgba(61,220,151,.5)',particle:'#5eeebb',gridColor:'rgba(61,220,151,.18)'}},
  {id:'bubblegum', name:'Bubblegum',     preview:'🩷', desc:'Sweet pastel pink & hot magenta pop',           price:25000,
   colors:{blue:'#ff69b4',dark:'#0a0007',glow:'rgba(255,105,180,.55)',particle:'#ff8acc',gridColor:'rgba(255,105,180,.18)'}},
  {id:'acid',      name:'Acid Trip',     preview:'🌀', desc:'Warped swirling psychedelic rainbow',            price:55000,
   colors:{blue:'#ff00ff',dark:'#040004',glow:'rgba(255,0,255,.55)',particle:'#ff55ff',gridColor:'rgba(255,0,255,.2)'}},
  {id:'rust',      name:'Rust Belt',     preview:'🦀', desc:'Industrial orange-brown rust & grime',          price:22000,
   colors:{blue:'#c44b16',dark:'#080200',glow:'rgba(196,75,22,.55)',particle:'#e06030',gridColor:'rgba(196,75,22,.18)'}},
  {id:'cobalt',    name:'Cobalt Strike', preview:'🔵', desc:'Deep rich cobalt blue military tech',           price:38000,
   colors:{blue:'#0047ab',dark:'#000408',glow:'rgba(0,71,171,.6)',particle:'#1166cc',gridColor:'rgba(0,71,171,.18)'}},
  {id:'amethyst',  name:'Amethyst',      preview:'💜', desc:'Rich violet amethyst crystal glow',             price:45000,
   colors:{blue:'#9966cc',dark:'#050010',glow:'rgba(153,102,204,.55)',particle:'#bb88ee',gridColor:'rgba(153,102,204,.18)'}},
  {id:'terminator',name:'Terminator',   preview:'🤖', desc:'Red-eye machine vision scanner mode',           price:60000,
   colors:{blue:'#ff3300',dark:'#050000',glow:'rgba(255,50,0,.6)',particle:'#ff5511',gridColor:'rgba(255,50,0,.2)'}},
  {id:'moonrise',  name:'Moonrise',      preview:'🌕', desc:'Warm amber moonlight glow',                     price:42000,
   colors:{blue:'#ffaa33',dark:'#050300',glow:'rgba(255,170,51,.5)',particle:'#ffcc66',gridColor:'rgba(255,170,51,.18)'}},
  {id:'deepmars',  name:'Deep Mars',     preview:'🔴', desc:'Dusty red Martian landscape at dusk',          price:48000,
   colors:{blue:'#cc4411',dark:'#060100',glow:'rgba(204,68,17,.55)',particle:'#dd6633',gridColor:'rgba(204,68,17,.18)'}},
  {id:'hacker',    name:'Hacker',        preview:'💚', desc:'Bright green terminal hacker console',          price:35000,
   colors:{blue:'#00ff41',dark:'#000800',glow:'rgba(0,255,65,.55)',particle:'#33ff66',gridColor:'rgba(0,255,65,.18)'}},
  {id:'lavablue',  name:'Lava & Blue',   preview:'🌊', desc:'Hot lava meets cold ocean — dual clash',       price:65000,
   colors:{blue:'#0077ff',dark:'#020408',glow:'rgba(0,119,255,.55)',particle:'#3399ff',gridColor:'rgba(0,119,255,.18)'}},
  {id:'stardust',  name:'Stardust',      preview:'🌟', desc:'Faint golden stardust shimmer everywhere',      price:70000,
   colors:{blue:'#ffd700',dark:'#060500',glow:'rgba(255,215,0,.45)',particle:'#ffe066',gridColor:'rgba(255,215,0,.15)'}},
  {id:'synthwave', name:'Synthwave',     preview:'🎹', desc:'80s retro pink & purple sunset grid',          price:80000,
   colors:{blue:'#ff44aa',dark:'#050010',glow:'rgba(255,68,170,.55)',particle:'#ff77cc',gridColor:'rgba(255,68,170,.2)'}},
  {id:'wraith',    name:'Wraith',        preview:'👻', desc:'Pale ghost-white on pitch black void',          price:85000,
   colors:{blue:'#ccccff',dark:'#010104',glow:'rgba(200,200,255,.5)',particle:'#ddddff',gridColor:'rgba(200,200,255,.18)'}},
  // LEGEND TIER (new)
  {id:'eclipse',   name:'Eclipse',       preview:'🌒', desc:'Solar eclipse — darkness with a burning ring', price:400000, tier:'legend',
   colors:{blue:'#ffaa00',dark:'#000000',glow:'rgba(255,170,0,.65)',particle:'#ffcc33',gridColor:'rgba(255,170,0,.22)'}},
  {id:'genesis',   name:'Genesis',       preview:'🌍', desc:'Primordial swirling cosmic genesis',            price:450000, tier:'legend',
   colors:{blue:'#00ddff',dark:'#000508',glow:'rgba(0,221,255,.6)',particle:'#33eeff',gridColor:'rgba(0,221,255,.2)'}},
  // MYTHIC TIER (new)
  {id:'fractured', name:'FRACTURED',     preview:'💠', desc:'Reality cracked. Everything is glitching.',     price:700000, tier:'mythic',
   colors:{blue:'#00ffff',dark:'#000008',glow:'rgba(0,255,255,.65)',particle:'#55ffff',gridColor:'rgba(0,255,255,.25)'}},
  {id:'abyss2',    name:'HOLLOW ABYSS',  preview:'🌑', desc:'You fell in. You cannot climb out.',            price:750000, tier:'mythic',
   colors:{blue:'#550088',dark:'#000000',glow:'rgba(85,0,136,.65)',particle:'#7700aa',gridColor:'rgba(85,0,136,.22)'}},
  // DIVINE TIER (new)
  {id:'omnivoid',  name:'OMNIVOID',      preview:'🕳️', desc:'Beyond existence. No one should have this.',   price:5000000, tier:'divine',
   colors:{blue:'#ffffff',dark:'#000000',glow:'rgba(255,255,255,.8)',particle:'#ffffff',gridColor:'rgba(255,255,255,.3)'}},
  {id:'creator',   name:'THE CREATOR',   preview:'🌌', desc:'You built this casino. Now you rule it.',       price:10000000, tier:'divine',
   colors:{blue:'#ff00ff',dark:'#000000',glow:'rgba(255,0,255,.7)',particle:'#ff55ff',gridColor:'rgba(255,0,255,.28)'}},
];

const SHOP_BG_FX = [
  {id:'fx_none',      name:'None',           preview:'⬛', desc:'No special effect — Free!',                   price:0},
  {id:'fx_stars',     name:'Starfield',      preview:'⭐', desc:'Shooting stars fly across the screen',        price:12000},
  {id:'fx_matrix',    name:'Matrix Rain',    preview:'🟩', desc:'Green code rains down like The Matrix',       price:25000},
  {id:'fx_confetti',  name:'Confetti',       preview:'🎊', desc:'Colorful confetti fills the screen',          price:18000},
  {id:'fx_fire',      name:'Fire Embers',    preview:'🔥', desc:'Glowing embers float upward',                 price:30000},
  {id:'fx_bubbles',   name:'Neon Bubbles',   preview:'🫧', desc:'Glowing bubbles drift up the screen',         price:20000},
  {id:'fx_snow',      name:'Snow Drift',     preview:'❄️', desc:'Gentle snowflakes fall down',                 price:15000},
  {id:'fx_aurora',    name:'Aurora',         preview:'🌌', desc:'Northern lights shimmer beautifully',         price:50000},
  {id:'fx_lightning', name:'Lightning',      preview:'⚡', desc:'Electric lightning crackles overhead',        price:40000},
  {id:'fx_rain',      name:'Neon Rain',      preview:'🌧️', desc:'Neon colored rain streaks fall',             price:22000},
  // PREMIUM
  {id:'fx_meteor',    name:'Meteor Shower',  preview:'☄️', desc:'Blazing meteors streak across the sky',       price:60000},
  {id:'fx_fireflies', name:'Fireflies',      preview:'✨', desc:'Warm glowing fireflies drift around',         price:45000},
  {id:'fx_sakura',    name:'Sakura Petals',  preview:'🌸', desc:'Gentle pink cherry blossom petals fall',      price:55000},
  {id:'fx_lava',      name:'Lava Lamp',      preview:'🫠', desc:'Slow hypnotic lava blobs rise and fall',      price:70000},
  {id:'fx_glitch',    name:'Digital Glitch', preview:'📺', desc:'Screen tears and digital artifacts crackle',  price:80000},
  {id:'fx_vortex',    name:'Vortex',         preview:'🌀', desc:'Spiraling particle vortex pulls you in',       price:90000},
  {id:'fx_rainbow',   name:'Rainbow Waves',  preview:'🌈', desc:'Rippling rainbow waves flow across screen',   price:100000},
  // LEGEND
  {id:'fx_storm',     name:'Thunderstorm',   preview:'⛈️', desc:'Violent lightning storm rages overhead',      price:200000, tier:'legend'},
  {id:'fx_portal',    name:'Portal Rift',    preview:'🌐', desc:'A glowing dimensional rift tears open',       price:350000, tier:'legend'},
  // DIVINE
  {id:'fx_cosmic',    name:'COSMIC RIFT',    preview:'🔮', desc:'Reality itself breaks apart. Legendary.',     price:1000000, tier:'divine'},
  // NEW BG EFFECTS
  {id:'fx_galaxy',    name:'Galaxy Spiral',  preview:'🌌', desc:'A slow galaxy arm spirals in the background', price:35000},
  {id:'fx_bloodrain', name:'Blood Rain',     preview:'🩸', desc:'Crimson droplets streak down the screen',     price:55000},
  {id:'fx_heartbeat', name:'Heartbeat Pulse',preview:'💓', desc:'Screen pulses with a living heartbeat',       price:40000},
  {id:'fx_spiders',   name:'Web Crawl',      preview:'🕷️', desc:'Spiderwebs slowly grow across the screen',   price:65000},
  {id:'fx_neonlines', name:'Neon Grid Lines',preview:'📐', desc:'Glowing neon grid lines flow across screen',  price:48000},
  {id:'fx_butterflies',name:'Butterflies',   preview:'🦋', desc:'Glowing butterflies flutter across screen',   price:58000},
  {id:'fx_dice',      name:'Falling Dice',   preview:'🎲', desc:'Casino dice tumble down the background',      price:45000},
  // LEGEND
  {id:'fx_apocalypse',name:'Apocalypse',     preview:'☄️', desc:'End-of-world meteor impacts and fire rain',   price:500000, tier:'legend'},
  {id:'fx_timewarp',  name:'Time Warp',      preview:'⏳', desc:'Reality bends — clocks melt and time breaks',price:600000, tier:'legend'},
  // DIVINE
  {id:'fx_godhand',   name:'GOD\'S HAND',    preview:'🤲', desc:'A divine hand reaches from behind reality.',  price:5000000, tier:'divine'},
];

const SHOP_DECKS = [
  {id:'classic',       name:'Classic',        preview:'🂡', desc:'Standard red & black — Free!',               price:0},
  {id:'gold_deck',     name:'Gold Deck',      preview:'💛', desc:'Gilded gold fronts & backs',                 price:15000},
  {id:'space',         name:'Space Deck',     preview:'🚀', desc:'Cosmic star suits',                          price:18000},
  {id:'dragon',        name:'Dragon Deck',    preview:'🐉', desc:'Mythical dragon suits',                      price:25000},
  {id:'neon_deck',     name:'Neon Deck',      preview:'🌈', desc:'Electric neon suits',                        price:30000},
  {id:'ice_deck',      name:'Ice Deck',       preview:'🧊', desc:'Frozen crystal suits',                       price:35000},
  {id:'fire_deck',     name:'Fire Deck',      preview:'🔥', desc:'Blazing inferno suits',                      price:40000},
  {id:'diamond_deck',  name:'Diamond Deck',   preview:'💎', desc:'Ultra rare diamond suits',                   price:75000},
  {id:'shadow_deck',   name:'Shadow Deck',    preview:'🌑', desc:'Dark shadow suits with glow edges',          price:50000},
  {id:'rainbow_deck',  name:'Rainbow Deck',   preview:'🌈', desc:'Every suit a different vivid color',         price:60000},
  // PREMIUM
  {id:'bone_deck',     name:'Bone Deck',      preview:'💀', desc:'Skeletal ivory & decay aesthetic',           price:80000},
  {id:'pixel_deck',    name:'Pixel Deck',     preview:'👾', desc:'Retro 8-bit pixelated suits',                price:70000},
  {id:'angel_deck',    name:'Angel Deck',     preview:'😇', desc:'Pure white & gold holy suits',               price:90000},
  {id:'emerald_deck',  name:'Emerald Deck',   preview:'💚', desc:'Deep rich emerald jewel suits',              price:85000},
  {id:'cursed_deck',   name:'Cursed Deck',    preview:'🩸', desc:'Dark blood-red cursed suits',                price:100000},
  {id:'galaxy_deck',   name:'Galaxy Deck',    preview:'🌌', desc:'Nebula swirl cosmic suits',                  price:120000},
  {id:'glitch_deck',   name:'Glitch Deck',    preview:'📺', desc:'Corrupted digital glitch suits',             price:150000},
  // LEGEND
  {id:'blood_deck',    name:'Blood Deck',     preview:'🔴', desc:'Deep crimson — soaked in glory',             price:300000, tier:'legend'},
  // MYTHIC
  {id:'mythic_deck',   name:'MYTHIC Deck',    preview:'⚔️', desc:'Forged in the fires of legend itself',       price:500000, tier:'mythic'},
  // DIVINE
  {id:'divine_deck',   name:'DIVINE Deck',    preview:'✨', desc:'Cards touched by gods. Unmistakable.',        price:1000000, tier:'divine'},
  // NEW DECKS
  {id:'sakura_deck',   name:'Sakura Deck',    preview:'🌸', desc:'Delicate pink cherry blossom suits',          price:22000},
  {id:'toxic_deck',    name:'Toxic Deck',     preview:'☢️', desc:'Radioactive neon-green glowing suits',        price:35000},
  {id:'ocean_deck',    name:'Ocean Deck',     preview:'🌊', desc:'Deep-sea aqua & coral suits',                 price:28000},
  {id:'cyber_deck',    name:'Cyber Deck',     preview:'🤖', desc:'Cold chrome machine-vision suits',            price:42000},
  {id:'desert_deck',   name:'Desert Deck',    preview:'🏜️', desc:'Warm sandy dunes & sunset suits',            price:32000},
  {id:'lava_deck',     name:'Lava Deck',      preview:'🌋', desc:'Molten rock orange & black suits',            price:48000},
  {id:'storm_deck',    name:'Storm Deck',     preview:'⛈️', desc:'Dark clouds, lightning bolt suits',          price:55000},
  {id:'casino_deck',   name:'Casino Royale',  preview:'🃏', desc:'Classic casino green felt & gold suits',      price:40000},
  {id:'haunted_deck',  name:'Haunted Deck',   preview:'🎃', desc:'Spooky Halloween ghost & pumpkin suits',      price:50000},
  {id:'chrome_deck',   name:'Chrome Deck',    preview:'⚙️', desc:'Sleek metallic silver mirror suits',          price:65000},
  {id:'nuke_deck',     name:'Nuke Deck',      preview:'💣', desc:'Explosive red-and-yellow hazard suits',       price:70000},
  // LEGEND
  {id:'reaper_deck',   name:'REAPER Deck',    preview:'☠️', desc:'The grim reaper dealt these personally.',     price:400000, tier:'legend'},
  {id:'titan_deck',    name:'TITAN Deck',     preview:'🗿', desc:'Carved from stone — ancient & powerful.',     price:450000, tier:'legend'},
  // MYTHIC
  {id:'cosmos_deck',   name:'COSMOS Deck',    preview:'🌠', desc:'Forged from the fabric of space-time itself.',price:750000, tier:'mythic'},
  // DIVINE
  {id:'genesis_deck',  name:'GENESIS Deck',   preview:'🌍', desc:'The first deck. The only deck. Absolute.',    price:5000000, tier:'divine'},
];

const SHOP_COINS = [
  {id:'coin_default',   name:'Classic',        preview:'🪙', desc:'Original gold coin — Free!',                price:0},
  {id:'coin_blue',      name:'Blue Gem',        preview:'💎', desc:'Shimmering blue crystal',                  price:12000},
  {id:'coin_fire',      name:'Fire Coin',       preview:'🔥', desc:'Blazing hot token',                        price:15000},
  {id:'coin_star',      name:'Star Token',      preview:'⭐', desc:'Stellar gold star',                        price:10000},
  {id:'coin_heart',     name:'Heart',           preview:'❤️', desc:'Lucky love token',                        price:10000},
  {id:'coin_skull',     name:'Skull',           preview:'💀', desc:'Dark side currency',                       price:18000},
  {id:'coin_moon',      name:'Moon Coin',       preview:'🌙', desc:'Lunar silver token',                       price:20000},
  {id:'coin_crown',     name:'Crown',           preview:'👑', desc:'Royal VIP coin',                           price:35000},
  {id:'coin_alien',     name:'Alien Chip',      preview:'👾', desc:'Extraterrestrial credits',                 price:25000},
  {id:'coin_rainbow',   name:'Rainbow Token',   preview:'🌈', desc:'Legendary prismatic coin',                 price:60000},
  {id:'coin_diamond',   name:'Diamond',         preview:'💠', desc:'Ultra rare diamond currency',              price:80000},
  {id:'coin_lightning', name:'Lightning',       preview:'⚡', desc:'Electric charged token',                  price:45000},
  // PREMIUM
  {id:'coin_gem',       name:'Gem',             preview:'💗', desc:'Radiant deep pink gemstone',               price:90000},
  {id:'coin_infinity',  name:'Infinity',        preview:'♾️', desc:'The coin that never stops',                price:100000},
  {id:'coin_toxic',     name:'Toxic',           preview:'☢️', desc:'Radioactive glowing chip',                 price:110000},
  {id:'coin_angel',     name:'Angel Coin',      preview:'😇', desc:'Blessed divine currency',                  price:120000},
  {id:'coin_devil',     name:'Devil Coin',      preview:'😈', desc:'Cursed infernal token',                    price:120000},
  {id:'coin_ghost',     name:'Ghost Coin',      preview:'👻', desc:'Spectral haunted currency',                price:130000},
  {id:'coin_nebula',    name:'Nebula',          preview:'🌌', desc:'Cosmic dust condensed into coin form',     price:150000},
  // LEGEND
  {id:'coin_vortex',    name:'Vortex Coin',     preview:'🌀', desc:'Swirling dimensional currency',            price:250000, tier:'legend'},
  // MYTHIC
  {id:'coin_prismatic', name:'PRISMATIC',       preview:'🔮', desc:'Shifts color with every transaction',      price:500000, tier:'mythic'},
  // DIVINE
  {id:'coin_omnipotent',name:'OMNIPOTENT',      preview:'🌩️', desc:'The currency of gods. Pure power.',        price:1000000, tier:'divine'},

  {id:'coin_starstruck',name:'STARSTRUCK',      preview:'🌟', desc:'Only The Goats Have This Divine Currency',        price:1000000000, tier:'divine'},
  // NEW COIN SKINS
  {id:'coin_clover',    name:'Lucky Clover',    preview:'🍀', desc:'Irish luck in every flip',                 price:12000},
  {id:'coin_bomb',      name:'Ticking Bomb',    preview:'💣', desc:'High risk, high reward token',             price:18000},
  {id:'coin_eye',       name:'Eye of Truth',    preview:'👁️', desc:'Sees all — the all-seeing wager',         price:22000},
  {id:'coin_rose',      name:'Rose Coin',       preview:'🌹', desc:'Elegant thorny rose token',                price:16000},
  {id:'coin_trophy',    name:'Trophy',          preview:'🏆', desc:'Only winners carry this',                  price:30000},
  {id:'coin_volcano',   name:'Volcano Token',   preview:'🌋', desc:'Explosive molten reward',                  price:35000},
  {id:'coin_snowflake', name:'Snowflake',        preview:'❄️', desc:'Ice cold calculated winnings',            price:20000},
  {id:'coin_sun',       name:'Solar Coin',      preview:'☀️', desc:'Bright blazing energy currency',          price:28000},
  {id:'coin_comet',     name:'Comet',           preview:'☄️', desc:'Blazing fast — get paid instantly',        price:32000},
  {id:'coin_spider',    name:'Spider Chip',     preview:'🕷️', desc:'Spun from pure webbed gold',              price:38000},
  {id:'coin_trident',   name:'Trident',         preview:'🔱', desc:'Command the seas of fortune',             price:45000},
  {id:'coin_black',     name:'Blackout',        preview:'🖤', desc:'Pure darkness. Nothing to see here.',      price:55000},
  {id:'coin_axe',       name:'Battle Axe',      preview:'🪓', desc:'Hack through your losses',                 price:60000},
  {id:'coin_hypno',     name:'Hypno Coin',      preview:'🌀', desc:'Stare long enough, you believe you won',  price:70000},
  {id:'coin_pixel',     name:'Pixel Coin',      preview:'🎮', desc:'8-bit retro arcade token',                 price:42000},
  {id:'coin_dagger',    name:'Dagger',          preview:'🗡️', desc:'Sharp returns, sharper losses',           price:80000},
  // LEGEND
  {id:'coin_supernova', name:'SUPERNOVA',       preview:'💥', desc:'A dying star, reborn as your currency',   price:300000, tier:'legend'},
  {id:'coin_draconus',  name:'DRACONUS',        preview:'🐉', desc:'Dragon-forged gold. Ancient & deadly.',   price:400000, tier:'legend'},
  // MYTHIC
  {id:'coin_eclipse',   name:'ECLIPSE TOKEN',   preview:'🌒', desc:'Minted during a total solar eclipse.',    price:700000, tier:'mythic'},
  // DIVINE
  {id:'coin_singularity',name:'SINGULARITY',    preview:'🌑', desc:'A coin that devours everything near it.', price:5000000, tier:'divine'},
  {id:'coin_alpha',     name:'ALPHA CHIP',      preview:'🅰️', desc:'There is only one. You somehow have it.', price:10000000, tier:'divine'},
];

const SHOP_AVATARS = [
  {id:'av_default',    name:'Mystery',         preview:'❓', desc:'The classic mystery player — Free!',       price:0},
  {id:'av_shark',      name:'Card Shark',      preview:'🦈', desc:'A true predator at the tables',            price:20000},
  {id:'av_robot',      name:'RoboGambler',     preview:'🤖', desc:'Cold, calculated, always betting',         price:25000},
  {id:'av_wizard',     name:'The Wizard',      preview:'🧙', desc:'Ancient magic powers your bets',           price:30000},
  {id:'av_cat',        name:'Lucky Cat',       preview:'🐱', desc:'Nine lives, nine chances to win',          price:18000},
  {id:'av_skull',      name:'Dead Man',        preview:'💀', desc:'Nothing to lose anymore',                  price:22000},
  {id:'av_alien',      name:'Area 52',         preview:'👽', desc:'Bets in currencies you\'ve never seen',    price:35000},
  {id:'av_dragon',     name:'Dragon Lord',     preview:'🐲', desc:'Commands the wheel with fire',             price:50000},
  {id:'av_demon',      name:'Demon Dealer',    preview:'😈', desc:'The house always wins... or does it?',     price:40000},
  {id:'av_crown',      name:'High Roller',     preview:'👑', desc:'Born to gamble, born to win',              price:100000},
  // PREMIUM
  {id:'av_phoenix',    name:'Phoenix',         preview:'🦅', desc:'Burns down, rises richer every time',      price:120000},
  {id:'av_samurai',    name:'Samurai',         preview:'⚔️', desc:'Disciplined. Precise. Deadly at cards.',  price:130000},
  {id:'av_vampire',    name:'Vampire',         preview:'🧛', desc:'Been gambling since the 14th century',     price:140000},
  {id:'av_cyborg',     name:'Cyborg',          preview:'🦾', desc:'Calculates exact odds in nanoseconds',     price:150000},
  {id:'av_oracle',     name:'Oracle',          preview:'🔮', desc:'Sees the next card before it\'s dealt',    price:175000},
  {id:'av_specter',    name:'Specter',         preview:'👁️', desc:'Watches every table. Silently winning.',  price:200000},
  // LEGEND
  {id:'av_titan',      name:'Titan',           preview:'🗿', desc:'Immovable. Unbeatable. A true legend.',    price:350000, tier:'legend'},
  {id:'av_god',        name:'God',             preview:'⚡', desc:'Created the casino. Now plays in it.',     price:500000, tier:'legend'},
  // MYTHIC
  {id:'av_immortal',   name:'IMMORTAL',        preview:'♾️', desc:'Has never lost. Will never lose.',         price:750000, tier:'mythic'},
  // DIVINE
  {id:'av_theone',     name:'THE ONE',         preview:'🌟', desc:'There is no description. You just know.',  price:1000000000000, tier:'divine'},
  {id:'av_pirate',     name:'Sea Dog',         preview:'🏴‍☠️', desc:'Plunders every pot at the table',       price:15000},
  {id:'av_clown',      name:'The Joker',       preview:'🤡', desc:'Nobody knows what he\'ll bet next',        price:18000},
  {id:'av_cowboy',     name:'Lone Ranger',     preview:'🤠', desc:'Rides into every casino guns blazing',     price:20000},
  {id:'av_ninja',      name:'Shadow Blade',    preview:'🥷', desc:'Vanishes before you see the win',          price:25000},
  {id:'av_wolf',       name:'Lone Wolf',       preview:'🐺', desc:'Howls at the jackpot every night',         price:22000},
  {id:'av_fox',        name:'Sly Fox',         preview:'🦊', desc:'Cunning, clever, never caught bluffing',   price:28000},
  {id:'av_penguin',    name:'Cold Caller',     preview:'🐧', desc:'Ice cool. Never tilts. Always calls.',     price:20000},
  {id:'av_bear',       name:'The Bear',        preview:'🐻', desc:'Hibernates between sessions, wins big',    price:25000},
  {id:'av_panda',      name:'Lucky Panda',     preview:'🐼', desc:'Adorably dangerous at the blackjack table',price:22000},
  {id:'av_octopus',    name:'Eight Arms',      preview:'🐙', desc:'Plays eight games at once somehow',        price:35000},
  {id:'av_snake',      name:'The Viper',       preview:'🐍', desc:'Strikes fast. You\'ll never see it coming',price:30000},
  {id:'av_eagle',      name:'Sky Hunter',      preview:'🦅', desc:'Spots the winning hand from a mile away',  price:40000},
  {id:'av_unicorn',    name:'Unicorn',         preview:'🦄', desc:'Mythically lucky. Impossibly rare.',       price:50000},
  {id:'av_witch',      name:'Dark Witch',      preview:'🧙‍♀️', desc:'Hexes opponents. Blesses her own cards.',price:55000},
  {id:'av_knight',     name:'Iron Knight',     preview:'🧟', desc:'Undead and still collecting winnings',     price:48000},
  {id:'av_astronaut',  name:'Space Cowboy',    preview:'👨‍🚀', desc:'Bets from the cosmos, wins in orbit',   price:60000},
  {id:'av_hacker',     name:'Hackerman',       preview:'💻', desc:'Knows every card before it\'s dealt',      price:65000},
  {id:'av_jester',     name:'Royal Jester',    preview:'🎭', desc:'Plays the fool — but always wins',         price:45000},
  {id:'av_gladiator',  name:'Gladiator',       preview:'⚔️', desc:'Every game is a fight to the death',      price:70000},
  {id:'av_monk',       name:'The Monk',        preview:'🧘', desc:'Transcends tilt. Pure mental fortitude.',  price:75000},
  {id:'av_detective',  name:'The Detective',   preview:'🕵️', desc:'Always reads the opponent perfectly',     price:80000},
  {id:'av_reaper',     name:'Grim Reaper',     preview:'💀', desc:'Your chips aren\'t safe anywhere',        price:100000},
  {id:'av_mermaid',    name:'Deep Siren',      preview:'🧜', desc:'Lures opponents into bad bets beautifully',price:90000},
  {id:'av_warlock',    name:'Warlock Prime',   preview:'🧝', desc:'Ancient magic + modern strategy',         price:110000},
  // PREMIUM
  {id:'av_overlord',   name:'Overlord',        preview:'😤', desc:'Rules every table with iron authority',   price:150000},
  {id:'av_sentinel',   name:'Sentinel',        preview:'🛡️', desc:'Unbreakable defense, flawless patience', price:175000},
  // LEGEND (new)
  {id:'av_doomslayer',  name:'DOOMSLAYER',     preview:'🔥', desc:'Slays bad luck before it hits',          price:400000, tier:'legend'},
  {id:'av_voidwalker',  name:'VOID WALKER',    preview:'🌑', desc:'Steps between dimensions to find the win',price:500000, tier:'legend'},
  // MYTHIC (new)
  {id:'av_archon',      name:'THE ARCHON',     preview:'🔱', desc:'Rules above gods. Answers to no one.',   price:800000, tier:'mythic'},
  {id:'av_primalforce', name:'PRIMAL FORCE',   preview:'💥', desc:'The raw power of the universe, gambling.',price:950000, tier:'mythic'},
  // DIVINE (new)
  {id:'av_cosmos',      name:'COSMOS',         preview:'🌌', desc:'You are the universe. The casino is you.',price:5000000, tier:'divine'},
  {id:'av_absolute',    name:'THE ABSOLUTE',   preview:'🔮', desc:'Beyond all limits. Beyond all others.',  price:10000000, tier:'divine'},
];

// ════════════════════════════════════════════════
// CARD DECK THEMING
// ════════════════════════════════════════════════
const DECK_THEMES = {
  classic:       {redSuit:'#cc0000', blackSuit:'#111111', rankColor:null,      backGrad:'linear-gradient(135deg,#1a0000,#440000)',  rankBg:null},
  gold_deck:     {redSuit:'#cc7700', blackSuit:'#886600', rankColor:'#aa6600', backGrad:'linear-gradient(135deg,#3a2800,#aa7700)',  rankBg:'rgba(255,200,0,.08)'},
  space:         {redSuit:'#8888ff', blackSuit:'#4444cc', rankColor:'#aaaaff', backGrad:'linear-gradient(135deg,#000020,#000080)',  rankBg:'rgba(50,50,200,.08)'},
  dragon:        {redSuit:'#ff3300', blackSuit:'#006600', rankColor:'#cc2200', backGrad:'linear-gradient(135deg,#1a0010,#660033)',  rankBg:'rgba(150,0,50,.08)'},
  neon_deck:     {redSuit:'#ff00aa', blackSuit:'#00ffcc', rankColor:'#ff00ff', backGrad:'linear-gradient(135deg,#0a0020,#200040)',  rankBg:'rgba(255,0,200,.06)'},
  ice_deck:      {redSuit:'#66ccff', blackSuit:'#0088cc', rankColor:'#aaddff', backGrad:'linear-gradient(135deg,#001020,#003060)',  rankBg:'rgba(100,200,255,.06)'},
  fire_deck:     {redSuit:'#ff4400', blackSuit:'#ff8800', rankColor:'#ff6600', backGrad:'linear-gradient(135deg,#200500,#601000)',  rankBg:'rgba(255,80,0,.08)'},
  diamond_deck:  {redSuit:'#ff66cc', blackSuit:'#66aaff', rankColor:'#ffffff', backGrad:'linear-gradient(135deg,#080820,#181840)',  rankBg:'rgba(150,150,255,.08)'},
  shadow_deck:   {redSuit:'#aa44ff', blackSuit:'#4488ff', rankColor:'#ddaaff', backGrad:'linear-gradient(135deg,#050510,#0a0a28)',  rankBg:'rgba(100,0,200,.06)'},
  rainbow_deck:  {redSuit:'#ff4466', blackSuit:'#44aaff', rankColor:'#ffee44', backGrad:'linear-gradient(135deg,#0a001a,#001a0a)',  rankBg:'rgba(200,100,255,.06)'},
  bone_deck:     {redSuit:'#ccaa88', blackSuit:'#aa8866', rankColor:'#ddccaa', backGrad:'linear-gradient(135deg,#1a1408,#2a2010)',  rankBg:'rgba(200,180,140,.06)'},
  pixel_deck:    {redSuit:'#ff4444', blackSuit:'#4444ff', rankColor:'#44ff44', backGrad:'linear-gradient(135deg,#001400,#000020)',  rankBg:'rgba(0,255,0,.06)'},
  angel_deck:    {redSuit:'#ffccaa', blackSuit:'#aaccff', rankColor:'#ffeedd', backGrad:'linear-gradient(135deg,#202030,#303050)',  rankBg:'rgba(255,240,220,.08)'},
  emerald_deck:  {redSuit:'#44ff88', blackSuit:'#22cc66', rankColor:'#88ffaa', backGrad:'linear-gradient(135deg,#001a08,#003018)',  rankBg:'rgba(0,200,80,.06)'},
  cursed_deck:   {redSuit:'#cc0000', blackSuit:'#880000', rankColor:'#ff3333', backGrad:'linear-gradient(135deg,#1a0000,#300000)',  rankBg:'rgba(200,0,0,.08)'},
  galaxy_deck:   {redSuit:'#ff44cc', blackSuit:'#4444ff', rankColor:'#cc88ff', backGrad:'linear-gradient(135deg,#04000e,#080020)',  rankBg:'rgba(180,0,255,.06)'},
  glitch_deck:   {redSuit:'#00ff88', blackSuit:'#ff0088', rankColor:'#88ffff', backGrad:'linear-gradient(135deg,#020010,#001008)',  rankBg:'rgba(0,255,150,.06)'},
  blood_deck:    {redSuit:'#ff0000', blackSuit:'#880000', rankColor:'#ff4444', backGrad:'linear-gradient(135deg,#200000,#400000)',  rankBg:'rgba(255,0,0,.1)'},
  mythic_deck:   {redSuit:'#ff8800', blackSuit:'#cc44ff', rankColor:'#ffdd44', backGrad:'linear-gradient(135deg,#100008,#040010)',  rankBg:'rgba(200,100,255,.08)'},
  divine_deck:   {redSuit:'#ffd700', blackSuit:'#ffffff', rankColor:'#ffd700', backGrad:'linear-gradient(135deg,#0a0800,#181400)',  rankBg:'rgba(255,215,0,.1)'},
  // NEW DECK THEMES
  sakura_deck:   {redSuit:'#ff99bb', blackSuit:'#cc6688', rankColor:'#ffbbdd', backGrad:'linear-gradient(135deg,#1a0010,#2a0020)',  rankBg:'rgba(255,150,200,.06)'},
  toxic_deck:    {redSuit:'#39ff14', blackSuit:'#22cc00', rankColor:'#88ff44', backGrad:'linear-gradient(135deg,#001400,#002800)',  rankBg:'rgba(57,255,20,.08)'},
  ocean_deck:    {redSuit:'#00bbdd', blackSuit:'#006688', rankColor:'#44ddff', backGrad:'linear-gradient(135deg,#000a10,#001828)',  rankBg:'rgba(0,180,220,.06)'},
  cyber_deck:    {redSuit:'#cccccc', blackSuit:'#888888', rankColor:'#ffffff', backGrad:'linear-gradient(135deg,#050508,#0a0a10)',  rankBg:'rgba(200,200,220,.06)'},
  desert_deck:   {redSuit:'#cc8833', blackSuit:'#886622', rankColor:'#ffaa55', backGrad:'linear-gradient(135deg,#1a0e00,#2e1800)',  rankBg:'rgba(200,130,50,.06)'},
  lava_deck:     {redSuit:'#ff4400', blackSuit:'#cc2200', rankColor:'#ff8833', backGrad:'linear-gradient(135deg,#1a0200,#300800)',  rankBg:'rgba(255,60,0,.08)'},
  storm_deck:    {redSuit:'#aabbff', blackSuit:'#556699', rankColor:'#ddeeFF', backGrad:'linear-gradient(135deg,#010510,#020a18)',  rankBg:'rgba(100,130,255,.06)'},
  casino_deck:   {redSuit:'#cc0000', blackSuit:'#006600', rankColor:'#ffd700', backGrad:'linear-gradient(135deg,#012a01,#041804)',  rankBg:'rgba(0,100,0,.08)'},
  haunted_deck:  {redSuit:'#ff8800', blackSuit:'#440066', rankColor:'#ffaa33', backGrad:'linear-gradient(135deg,#100005,#1a0030)',  rankBg:'rgba(150,0,100,.06)'},
  chrome_deck:   {redSuit:'#eeeeee', blackSuit:'#aaaaaa', rankColor:'#ffffff', backGrad:'linear-gradient(135deg,#080808,#141414)',  rankBg:'rgba(220,220,220,.05)'},
  nuke_deck:     {redSuit:'#ffcc00', blackSuit:'#ff6600', rankColor:'#ffee44', backGrad:'linear-gradient(135deg,#1a0e00,#2a1400)',  rankBg:'rgba(255,180,0,.08)'},
  reaper_deck:   {redSuit:'#cc00cc', blackSuit:'#440044', rankColor:'#ff44ff', backGrad:'linear-gradient(135deg,#0a000a,#180018)',  rankBg:'rgba(200,0,200,.08)'},
  titan_deck:    {redSuit:'#886633', blackSuit:'#554422', rankColor:'#bbaa77', backGrad:'linear-gradient(135deg,#100a00,#1e1200)',  rankBg:'rgba(140,100,50,.06)'},
  cosmos_deck:   {redSuit:'#ff66ff', blackSuit:'#4466ff', rankColor:'#ffaaff', backGrad:'linear-gradient(135deg,#02000a,#06000e)',  rankBg:'rgba(200,100,255,.06)'},
  genesis_deck:  {redSuit:'#00ffaa', blackSuit:'#0088ff', rankColor:'#ffffff', backGrad:'linear-gradient(135deg,#000a06,#000510)',  rankBg:'rgba(0,255,180,.08)'},
};

function getDeckTheme(){
  const eq = (userData.equippedItems||{}).carddecks || 'classic';
  return DECK_THEMES[eq] || DECK_THEMES.classic;
}
function getBackStyle(){ return getDeckTheme().backGrad; }

function cardHTML(c, hidden=false){
  if(hidden) return `<div class="playing-card back" style="background:${getBackStyle()}"></div>`;
  const dt = getDeckTheme();
  const red = isRed(c.suit);
  const suitColor  = red ? dt.redSuit  : dt.blackSuit;
  const rankColor  = dt.rankColor || (red ? dt.redSuit : dt.blackSuit);
  const bgStyle    = dt.rankBg ? `background:${dt.rankBg};` : '';
  return `<div class="playing-card" style="${bgStyle}border:1px solid ${suitColor}22;">
    <span class="card-rank" style="color:${rankColor}">${c.rank}</span>
    <span class="card-suit" style="color:${suitColor}">${c.suit}</span>
    <span class="card-rank-br" style="color:${rankColor}">${c.rank}</span>
  </div>`;
}

// ════════════════════════════════════════════════
// UTILS
// ════════════════════════════════════════════════
function rand(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function showMsg(id,text,type){const el=document.getElementById(id);if(!el)return;el.textContent=text;el.className='msg '+type;}
function clearMsg(id){const el=document.getElementById(id);if(!el)return;el.className='msg';el.textContent='';}
function setLoading(id,loading,label){const b=document.getElementById(id);if(!b)return;b.disabled=loading;const t=b.querySelector('.btn-text');if(t)t.textContent=loading?'Please wait...':label;}
function fmtNum(n,suffix,div){return (n/div).toFixed(2).replace(/\.?0+$/,'')+suffix;}
function fmtCoins(n){
  n=Number(n);
  if(!isFinite(n)) return '∞';
  if(n>=1e303) return fmtNum(n,'Ce',1e300);   // Centillion
  if(n>=1e123) return fmtNum(n,'Sg',1e120);   // Sexagintillion
  if(n>=1e120) return fmtNum(n,'Sx',1e120);   // Sexvigintillion (10^120, rough)
  if(n>=1e102) return fmtNum(n,'Td',1e102);   // Trigintaduillion (10^102)
  if(n>=1e99)  return fmtNum(n,'Du',1e99);    // Duotrigintillion (Googol range)
  if(n>=1e96)  return fmtNum(n,'Ug',1e96);    // Untrigintillion
  if(n>=1e93)  return fmtNum(n,'Tg',1e93);    // Trigintillion
  if(n>=1e90)  return fmtNum(n,'Ng',1e90);    // Novemvigintillion
  if(n>=1e87)  return fmtNum(n,'Og',1e87);    // Octovigintillion
  if(n>=1e84)  return fmtNum(n,'Sv',1e84);    // Septemvigintillion
  if(n>=1e81)  return fmtNum(n,'Xv',1e81);    // Sexvigintillion
  if(n>=1e78)  return fmtNum(n,'Qv',1e78);    // Quinvigintillion
  if(n>=1e75)  return fmtNum(n,'Qv',1e75);    // Quattuorvigintillion
  if(n>=1e72)  return fmtNum(n,'Tv',1e72);    // Trevigintillion
  if(n>=1e69)  return fmtNum(n,'Dv',1e69);    // Duovigintillion
  if(n>=1e66)  return fmtNum(n,'Uv',1e66);    // Unvigintillion
  if(n>=1e63)  return fmtNum(n,'Vg',1e63);    // Vigintillion
  if(n>=1e60)  return fmtNum(n,'NV',1e60);    // Novemdecillion
  if(n>=1e57)  return fmtNum(n,'OD',1e57);    // Octodecillion
  if(n>=1e54)  return fmtNum(n,'SD',1e54);    // Septendecillion
  if(n>=1e51)  return fmtNum(n,'SxD',1e51);   // Sexdecillion
  if(n>=1e48)  return fmtNum(n,'QnD',1e48);   // Quindecillion
  if(n>=1e45)  return fmtNum(n,'QdD',1e45);   // Quattuordecillion
  if(n>=1e42)  return fmtNum(n,'TrD',1e42);   // Tredecillion
  if(n>=1e39)  return fmtNum(n,'DuD',1e39);   // Duodecillion
  if(n>=1e36)  return fmtNum(n,'UdD',1e36);   // Undecillion
  if(n>=1e33)  return fmtNum(n,'De',1e33);    // Decillion
  if(n>=1e30)  return fmtNum(n,'No',1e30);    // Nonillion
  if(n>=1e27)  return fmtNum(n,'Oc',1e27);    // Octillion
  if(n>=1e24)  return fmtNum(n,'Sp',1e24);    // Septillion
  if(n>=1e21)  return fmtNum(n,'Sx',1e21);    // Sextillion
  if(n>=1e18)  return fmtNum(n,'Qi',1e18);    // Quintillion
  if(n>=1e15)  return fmtNum(n,'Q',1e15);     // Quadrillion
  if(n>=1e12)  return fmtNum(n,'T',1e12);     // Trillion
  if(n>=1e9)   return fmtNum(n,'B',1e9);      // Billion
  if(n>=1e6)   return fmtNum(n,'M',1e6);      // Million
  if(n>=1e5)   return fmtNum(n,'K',1e3);      // Thousand
  return n.toLocaleString();
}
function fmtPrice(n){
  n=Number(n);
  if(!isFinite(n)) return '∞';
  if(n>=1e303) return fmtNum(n,'Ce',1e300);
  if(n>=1e120) return fmtNum(n,'Sx',1e120);
  if(n>=1e99)  return fmtNum(n,'Du',1e99);
  if(n>=1e63)  return fmtNum(n,'Vg',1e63);
  if(n>=1e33)  return fmtNum(n,'De',1e33);
  if(n>=1e18)  return fmtNum(n,'Qi',1e18);
  if(n>=1e15)  return fmtNum(n,'Q',1e15);
  if(n>=1e12)  return fmtNum(n,'T',1e12);
  if(n>=1e9)   return fmtNum(n,'B',1e9);
  if(n>=1e6)   return fmtNum(n,'M',1e6);
  return n.toLocaleString();
}
function fmtTime(ms){const s=Math.floor(ms/1000),m=Math.floor(s/60),h=Math.floor(m/60);return h>0?h+'h '+(m%60)+'m':m>0?m+'m '+(s%60)+'s':s+'s';}

function toast(msg,dur=3000){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),dur);
}

// Build a collapsible How To Play info card
function buildInfoCard(title, rows, tip=''){
  const id = 'info_'+Math.random().toString(36).slice(2);
  const rowsHtml = rows.map(r=>`<div class="info-card-row"><span>${r[0]}</span><span>${r[1]}</span></div>`).join('');
  const tipHtml  = tip ? `<div class="info-card-tip">${tip}</div>` : '';
  return `<div class="info-card">
    <button class="info-card-toggle" onclick="toggleInfo('${id}',this)">
      ℹ️ &nbsp;How to Play &amp; Odds
      <span class="info-arrow">▼</span>
    </button>
    <div class="info-card-body" id="${id}">
      <div class="info-card-title">${title}</div>
      ${rowsHtml}
      ${tipHtml}
    </div>
  </div>`;
}
window.toggleInfo = function(id, btn){
  const body = document.getElementById(id);
  const open = body.classList.toggle('open');
  btn.classList.toggle('open', open);
};

// ════════════════════════════════════════════════
// SOUND SYSTEM
// ════════════════════════════════════════════════
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
function getAudioCtx(){ if(!audioCtx) audioCtx = new AudioCtx(); return audioCtx; }

function playSound(type){
  if(!soundOn) return;
  try{
    const ctx=getAudioCtx(); const now=ctx.currentTime;
    const master=ctx.createGain(); master.connect(ctx.destination);
    if(type==='win'){
      [523,659,784,1047].forEach((freq,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);o.frequency.value=freq;o.type='sine';g.gain.setValueAtTime(0,now+i*.08);g.gain.linearRampToValueAtTime(.3,now+i*.08+.04);g.gain.exponentialRampToValueAtTime(.001,now+i*.08+.25);o.start(now+i*.08);o.stop(now+i*.08+.25);});
    } else if(type==='bigwin'){
      [523,659,784,1047,1319].forEach((freq,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);o.frequency.value=freq;o.type='square';g.gain.setValueAtTime(0,now+i*.07);g.gain.linearRampToValueAtTime(.2,now+i*.07+.05);g.gain.exponentialRampToValueAtTime(.001,now+i*.07+.4);o.start(now+i*.07);o.stop(now+i*.07+.4);});
    } else if(type==='lose'){
      [300,250,200].forEach((freq,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);o.frequency.value=freq;o.type='sawtooth';g.gain.setValueAtTime(0,now+i*.1);g.gain.linearRampToValueAtTime(.25,now+i*.1+.05);g.gain.exponentialRampToValueAtTime(.001,now+i*.1+.2);o.start(now+i*.1);o.stop(now+i*.1+.2);});
    } else if(type==='click'){
      const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);o.frequency.value=660;o.type='sine';g.gain.setValueAtTime(.15,now);g.gain.exponentialRampToValueAtTime(.001,now+.06);o.start(now);o.stop(now+.06);
    } else if(type==='coin'){
      [880,1100].forEach((freq,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);o.frequency.value=freq;o.type='sine';g.gain.setValueAtTime(0,now+i*.05);g.gain.linearRampToValueAtTime(.2,now+i*.05+.03);g.gain.exponentialRampToValueAtTime(.001,now+i*.05+.15);o.start(now+i*.05);o.stop(now+i*.05+.15);});
    } else if(type==='flip'){
      const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);o.frequency.setValueAtTime(400,now);o.frequency.linearRampToValueAtTime(600,now+.1);o.type='triangle';g.gain.setValueAtTime(.2,now);g.gain.exponentialRampToValueAtTime(.001,now+.12);o.start(now);o.stop(now+.12);
    } else if(type==='spin'){
      const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);o.frequency.setValueAtTime(200,now);o.frequency.linearRampToValueAtTime(600,now+.5);o.type='sawtooth';g.gain.setValueAtTime(.15,now);g.gain.exponentialRampToValueAtTime(.001,now+.5);o.start(now);o.stop(now+.5);
    } else if(type==='slot_tick'){
      const buf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*0.018),ctx.sampleRate);const d=buf.getChannelData(0);for(let i=0;i<d.length;i++){const t=i/ctx.sampleRate;d[i]=(Math.random()*2-1)*Math.exp(-t*220)*0.6;}const src=ctx.createBufferSource();src.buffer=buf;const g=ctx.createGain();g.gain.setValueAtTime(0.4,now);g.gain.exponentialRampToValueAtTime(0.001,now+0.02);src.connect(g);g.connect(master);src.start(now);
    } else if(type==='scratch'){
      const buf=ctx.createBuffer(1,ctx.sampleRate*.1,ctx.sampleRate);const d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*.3;const src=ctx.createBufferSource();src.buffer=buf;const g=ctx.createGain();g.gain.setValueAtTime(.3,now);g.gain.exponentialRampToValueAtTime(.001,now+.1);src.connect(g);g.connect(master);src.start(now);
    } else if(type==='peg'){
      const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);o.frequency.value=rand(300,600);o.type='sine';g.gain.setValueAtTime(.08,now);g.gain.exponentialRampToValueAtTime(.001,now+.05);o.start(now);o.stop(now+.05);
    } else if(type==='deal'){
      [440,550].forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);o.frequency.value=f;o.type='triangle';g.gain.setValueAtTime(0,now+i*.06);g.gain.linearRampToValueAtTime(.18,now+i*.06+.03);g.gain.exponentialRampToValueAtTime(.001,now+i*.06+.1);o.start(now+i*.06);o.stop(now+i*.06+.1);});
    } else if(type==='roulette_tick'){
      const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);o.frequency.value=800;o.type='square';g.gain.setValueAtTime(.08,now);g.gain.exponentialRampToValueAtTime(.001,now+.03);o.start(now);o.stop(now+.03);
    } else if(type==='flap'){
      const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);o.frequency.setValueAtTime(300,now);o.frequency.linearRampToValueAtTime(600,now+.06);o.type='triangle';g.gain.setValueAtTime(.18,now);g.gain.exponentialRampToValueAtTime(.001,now+.1);o.start(now);o.stop(now+.1);
    } else if(type==='pipe'){
      const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);o.frequency.value=1200;o.type='sine';g.gain.setValueAtTime(.2,now);g.gain.exponentialRampToValueAtTime(.001,now+.15);o.start(now);o.stop(now+.15);
    } else if(type==='hit'){
      const buf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*0.15),ctx.sampleRate);const d=buf.getChannelData(0);for(let i=0;i<d.length;i++){const t=i/ctx.sampleRate;d[i]=(Math.random()*2-1)*Math.exp(-t*40)*0.5;}const src=ctx.createBufferSource();src.buffer=buf;const g=ctx.createGain();g.gain.setValueAtTime(0.5,now);src.connect(g);g.connect(master);src.start(now);
    } else if(type==='horse_gallop'){
      [200,220,180,200].forEach((freq,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);o.frequency.value=freq;o.type='triangle';g.gain.setValueAtTime(0,now+i*.08);g.gain.linearRampToValueAtTime(.12,now+i*.08+.03);g.gain.exponentialRampToValueAtTime(.001,now+i*.08+.08);o.start(now+i*.08);o.stop(now+i*.08+.1);});
    } else if(type==='wheel_spin'){
      const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);o.frequency.setValueAtTime(600,now);o.frequency.exponentialRampToValueAtTime(80,now+3);o.type='sawtooth';g.gain.setValueAtTime(.12,now);g.gain.exponentialRampToValueAtTime(.001,now+3);o.start(now);o.stop(now+3);
    }
  }catch(e){}
}

function toggleSound(){
  soundOn=!soundOn;
  document.querySelectorAll('.sound-btn').forEach(b=>b.textContent=soundOn?'🔊':'🔇');
}

// ════════════════════════════════════════════════
// FIREBASE USER OPS
// ════════════════════════════════════════════════
async function saveUserData(updates){
  if(!currentUser)return;
  Object.assign(userData,updates);
  await db.ref('users/'+currentUser.uid).update(updates);
  refreshCoinDisplays();
}

// addCoins: amount is the payout received (always positive for wins, 0 for full loss)
// Bet is deducted BEFORE calling this. So addCoins(200) on a 100 bet = net +100.
async function addCoins(amount, label=''){
  const prev = userData.coins || 0;
  const next = prev + amount;
  const updates = {coins: next};
  if(amount > 0){
    const bw = userData.biggestWin || 0;
    if(amount > bw) updates.biggestWin = amount;
    updates.totalEarned = (userData.totalEarned||0) + amount;
  }
  updates.totalWagered = (userData.totalWagered||0) + currentBet;
  updates.totalBets    = (userData.totalBets||0) + 1;
  const hist = userData.balanceHistory || [];
  hist.push(next);
  if(hist.length > 200) hist.shift();
  updates.balanceHistory = hist;
  await saveUserData(updates);
  checkBailoutLive();
  if(label) toast((amount>0?'+':'')+fmtCoins(amount)+' '+coinSymbol+(label?' · '+label:''));
}

// trackLoss: call with the bet amount lost (positive number)
async function trackLoss(amount){
  if(!amount || amount <= 0) return;
  const bl = userData.biggestLoss || 0;
  const updates = {};
  if(amount > bl) updates.biggestLoss = amount;
  updates.totalLost = (userData.totalLost||0) + amount;
  await saveUserData(updates);
}

async function addGame(){
  await saveUserData({gamesPlayed:(userData.gamesPlayed||0)+1});
  checkAchievements();
}

function refreshCoinDisplays(){
  const c    = fmtCoins(userData.coins||0);
  const icon = coinSymbol;
  ['user-coins','game-coins','lb-coins','ach-coins','shop-coins','spin-coins','stats-coins','sug-coins','gs-coins','send-coins','cred-coins','bank-coins','beg-coins'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.textContent=c;
  });
  ['nav-coin-icon','game-coin-icon','lb-coin-icon','ach-coin-icon','shop-coin-icon','spin-coin-icon','stats-coin-icon','sug-coin-icon','gs-coin-icon','send-coin-icon','cred-coin-icon','bank-coin-icon','beg-coin-icon'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.textContent=icon;
  });
}

function checkBailoutLive(){
  const b=document.getElementById('bailout-banner');
  if(!b) return;
  const coins=userData.coins||0;
  // Auto-give 1000 coins if under 100
  if(coins<100&&currentUser){
    const newCoins=coins+1000;
    saveUserData({coins:newCoins}).then(()=>{
      toast('💰 Auto-refill! +1,000 coins (you had under 100)');
    });
  }
  b.style.display=(coins<500&&!userData.bailoutUsed)?'block':'none';
}
// keep old name as alias for backward compat
function checkBailout(){ checkBailoutLive(); }

async function claimBailout(){
  if((userData.coins||0)>=500||userData.bailoutUsed) return;
  const newCount = (userData.bailoutCount||0) + 1;
  await saveUserData({coins:(userData.coins||0)+1000, bailoutUsed:true, bailoutCount:newCount});
  document.getElementById('bailout-banner').style.display='none';
  toast('💸 Bailout claimed! +1,000 coins');
  unlockAchievement('broke');
}

// ════════════════════════════════════════════════
// ACHIEVEMENTS
// ════════════════════════════════════════════════
async function unlockAchievement(id){
  const owned = userData.achievements || [];
  if(owned.includes(id)) return;
  owned.push(id);
  await saveUserData({achievements:owned});
  const a = ACHIEVEMENTS.find(x=>x.id===id);
  if(a){ toast('🎖 Achievement: '+a.name+'!'); playSound('bigwin'); }
}

async function checkAchievements(){
  const g=userData.gamesPlayed||0, c=userData.coins||0, w=userData.totalWagered||0;
  if(g>=10)  unlockAchievement('games_10');
  if(g>=100) unlockAchievement('games_100');
  if(g>=500) unlockAchievement('games_500');
  if(c>=1000000) unlockAchievement('millionaire');
  if(w>=50000)   unlockAchievement('total_50k');
  if(c<500)      unlockAchievement('broke');
}

async function recordResult(won){
  let streak = userData.winStreak||0;
  if(won){ streak++; unlockAchievement('first_win'); if(streak>=3) unlockAchievement('win_streak3'); }
  else streak=0;
  await saveUserData({winStreak:streak});
  await addGame();
}

// ════════════════════════════════════════════════
// SCREEN ROUTING
// ════════════════════════════════════════════════
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const s=document.getElementById('screen-'+id);
  if(s) s.classList.add('active');
  if(id==='leaderboard')  initLeaderboard();
  if(id==='achievements') renderAchievements();
  if(id==='shop')         renderShop('themes');
  if(id==='daily-spin')   initWheel();
  if(id==='stats')        renderStats();
  if(id==='globalstats')  renderGlobalStats();
  if(id==='suggestions')  initSuggestions();
  if(id==='send')         initSendCoins();
  if(id==='bank')         initBank();
  if(id==='begging')      initBegging();
  if(id==='lobby')        { checkBailoutLive(); showLobbyTab('main'); }
  playSound('click');
}

function showLobbyTab(tab){
  playSound('click');
  const main=document.getElementById('lobby-tab-main');
  const games=document.getElementById('lobby-tab-games');
  const btnMain=document.getElementById('nav-main-btn');
  const btnGames=document.getElementById('nav-games-btn');
  if(!main||!games) return;
  if(tab==='games'){
    main.style.display='none'; games.style.display='block';
    if(btnMain) btnMain.classList.remove('active-nav');
    if(btnGames) btnGames.classList.add('active-nav');
  } else {
    main.style.display='block'; games.style.display='none';
    if(btnMain) btnMain.classList.add('active-nav');
    if(btnGames) btnGames.classList.remove('active-nav');
  }
}

let lastLobbyTab='main';

function showGame(name){
  currentGame=name;
  // detect which lobby tab was active before going into a game
  const gamesTab=document.getElementById('lobby-tab-games');
  lastLobbyTab=(gamesTab&&gamesTab.style.display==='block')?'games':'main';
  showScreen('game');
  const c=document.getElementById('game-container');
  c.innerHTML='';
  const games={
    slots:buildSlots, blackjack:buildBlackjack, roulette:buildRoulette, plinko:buildPlinko,
    poker:buildPoker, dice:buildDice, scratch:buildScratch, ridebus:buildRideBus, gofish:buildGoFish,
    flappy:buildFlappy, coinflip:buildCoinFlip, minesweeper:buildMinesweeper,
    horserace:buildHorseRace, higherlow:buildHigherLow, wheelfortune:buildWheelFortune
  };
  if(games[name]) games[name](c);
}

function lockBets(locked){
  document.querySelectorAll('.bet-opt').forEach(b=>b.disabled=locked);
  const ci=document.getElementById('custom-bet-input');
  if(ci) ci.disabled=locked;
}
function buildBetPanel(container){
  const opts=[100,500,1000,5000,10000];
  const div=document.createElement('div');
  div.className='bet-panel';
  div.innerHTML=`<span class="bet-label">Bet</span><div class="bet-btns">${
    opts.map(o=>`<button class="bet-opt${o===currentBet?' active':''}" onclick="setBet(${o},this)">${fmtCoins(o)}</button>`).join('')
  }<button class="bet-opt" onclick="setBet('all',this)">ALL IN</button></div>
  <div style="display:flex;align-items:center;gap:8px;margin-top:6px;">
    <span style="font-size:.72rem;color:var(--muted);white-space:nowrap;">Custom:</span>
    <input id="custom-bet-input" type="number" min="1" placeholder="Custom amount..." style="flex:1;min-width:0;background:rgba(0,0,50,.5);border:1px solid var(--border);border-radius:6px;color:#fff;font-size:.8rem;padding:5px 8px;font-family:Montserrat;" oninput="setCustomBet(this)"/>
  </div>
  <span class="current-bet" id="current-bet-display">Bet: ${coinSymbol} ${fmtCoins(currentBet)}</span>`;
  container.appendChild(div);
}

function setBet(amount, btn){
  if(amount==='all') currentBet=Math.max(1,userData.coins||1);
  else currentBet=Math.min(amount, userData.coins||amount);
  currentBet=Math.max(1,currentBet);
  document.querySelectorAll('.bet-opt').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  const ci=document.getElementById('custom-bet-input');
  if(ci) ci.value='';
  const d=document.getElementById('current-bet-display');
  if(d) d.textContent='Bet: '+coinSymbol+' '+fmtCoins(currentBet);
}

function setCustomBet(input){
  let val=parseInt(input.value)||0;
  const max=userData.coins||0;
  if(val>max){val=max;input.value=val;}
  if(val<1) return;
  currentBet=val;
  document.querySelectorAll('.bet-opt').forEach(b=>b.classList.remove('active'));
  const d=document.getElementById('current-bet-display');
  if(d) d.textContent='Bet: '+coinSymbol+' '+fmtCoins(currentBet);
}

// ════════════════════════════════════════════════
// CARD UTILS
// ════════════════════════════════════════════════
const SUITS=['♠','♥','♦','♣'];
const RANKS=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
function newDeck(){const d=[];for(const s of SUITS)for(const r of RANKS)d.push({suit:s,rank:r});return d;}
function shuffleDeck(d){for(let i=d.length-1;i>0;i--){const j=rand(0,i);[d[i],d[j]]=[d[j],d[i]];}return d;}
function cardValue(r){if(['J','Q','K'].includes(r))return 10;if(r==='A')return 11;return parseInt(r);}
function isRed(s){return s==='♥'||s==='♦';}

// ════════════════════════════════════════════════
// GAME: SLOTS
// ════════════════════════════════════════════════
function buildSlots(c){
  const SYMBOLS=['🍒','🍋','🍊','🍇','⭐','💎','7️⃣','🎰'];
  const REEL_WEIGHTS=[30,20,18,15,10,6,3,4];
  // mult = total payout multiplier on your bet (includes stake return)
  const PAYS={'7️⃣7️⃣7️⃣':50,'💎💎💎':20,'⭐⭐⭐':10,'🎰🎰🎰':8,'🍒🍒🍒':6,'🍇🍇🍇':5,'🍊🍊🍊':4,'🍋🍋🍋':3,'🍒🍒':2};
  let spinning=false, slotTickInterval=null;

  function weightedSpin(){
    const total=REEL_WEIGHTS.reduce((a,b)=>a+b,0);
    let r=Math.random()*total;
    for(let i=0;i<SYMBOLS.length;i++){r-=REEL_WEIGHTS[i];if(r<=0)return SYMBOLS[i];}
    return SYMBOLS[SYMBOLS.length-1];
  }

  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">🎰 Slots</div>
    <div class="game-subtitle">Match symbols to win · Three 7s = 50x jackpot!</div>
    <div id="slots-bet"></div>
    <div class="slots-display">
      <div class="slot-reel" id="r0">🍒</div>
      <div class="slot-reel" id="r1">🍋</div>
      <div class="slot-reel" id="r2">🍊</div>
    </div>
    <div class="result-banner" id="slots-result"></div>
    <button class="btn" id="spin-slots-btn" onclick="spinSlots()" style="max-width:200px;margin:0 auto;"><span class="btn-text">Spin</span></button>
    ${buildInfoCard('Slots Payouts (total return on bet)', [
      ['🍒🍒 Two Cherries','2x your bet'],
      ['🍋🍋🍋 Three Lemons','3x your bet'],
      ['🍊🍊🍊 Three Oranges','4x your bet'],
      ['🍇🍇🍇 Three Grapes','5x your bet'],
      ['🍒🍒🍒 Three Cherries','6x your bet'],
      ['🎰🎰🎰 Three Slots','8x your bet'],
      ['⭐⭐⭐ Three Stars','10x your bet'],
      ['💎💎💎 Three Diamonds','20x your bet'],
      ['7️⃣7️⃣7️⃣ Three 7s — JACKPOT','50x your bet'],
    ], '<strong>Tip:</strong> The game has a 35% forced-win chance each spin so you get action! All payouts include your stake back — so 3x on a 100 bet = 300 coins returned.')}
  </div>`;
  buildBetPanel(document.getElementById('slots-bet'));

  window.spinSlots = async function(){
    if(spinning) return;
    if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    spinning=true; setLoading('spin-slots-btn',true,'Spin'); lockBets(true);
    document.getElementById('slots-result').className='result-banner';
    const betAmt = currentBet;
    await saveUserData({coins:(userData.coins||0)-betAmt});
    let tickCount=0; const tickMax=32; let tickDelay=40;
    function doTick(){
      if(tickCount>=tickMax||!spinning) return;
      playSound('slot_tick');
      for(let i=0;i<3;i++) document.getElementById('r'+i).textContent=SYMBOLS[rand(0,SYMBOLS.length-1)];
      tickCount++; tickDelay=40+Math.floor((tickCount/tickMax)*140);
      slotTickInterval=setTimeout(doTick,tickDelay);
    }
    doTick();
    const forceWin=Math.random()<0.35;
    let reels;
    if(forceWin){
      const winCombos=Object.keys(PAYS);
      const combo=winCombos[rand(0,winCombos.length-1)];
      const parts=[...combo.matchAll(/[\u{1F000}-\u{1FFFF}][\uFE0F\u20E3]?|[\u{2600}-\u{27BF}][\uFE0F]?|[0-9]\uFE0F?\u20E3/gu)].map(m=>m[0]);
      reels=parts.length===3?parts:[weightedSpin(),weightedSpin(),weightedSpin()];
    } else {
      let attempts=0;
      do{reels=[weightedSpin(),weightedSpin(),weightedSpin()];attempts++;}
      while(reels[0]===reels[1]&&reels[1]===reels[2]&&attempts<20);
    }
    setTimeout(()=>{
      clearTimeout(slotTickInterval);
      let slow=0;
      function slowTick(){
        if(slow>=3){for(let i=0;i<3;i++) document.getElementById('r'+i).textContent=reels[i]; finishSpin(reels,betAmt); return;}
        playSound('slot_tick'); slow++; setTimeout(slowTick,180+slow*60);
      }
      slowTick();
    },1800);
  };

  function finishSpin(reels,betAmt){
    const combo=reels.join('');
    let mult=PAYS[combo]||0;
    if(!mult&&reels[0]===reels[1]&&PAYS[reels[0]+reels[0]]) mult=PAYS[reels[0]+reels[0]];
    const rb=document.getElementById('slots-result');
    if(mult>0){
      const payout=betAmt*mult;
      addCoins(payout,'Slots');
      rb.textContent='🎉 '+reels.join(' ')+' · '+mult+'x · +'+fmtCoins(payout)+' coins!';
      rb.className='result-banner win';
      playSound(payout>=5000?'bigwin':'win'); recordResult(true);
      if(combo==='7️⃣7️⃣7️⃣'){unlockAchievement('lucky_7');toast('🎰 JACKPOT! Three 7s!');}
      if(payout>=10000) unlockAchievement('big_win');
    } else {
      trackLoss(betAmt);
      rb.textContent='😔 '+reels.join(' ')+' · No match. Lost '+fmtCoins(betAmt)+' coins.';
      rb.className='result-banner lose'; playSound('lose'); recordResult(false);
    }
    spinning=false; setLoading('spin-slots-btn',false,'Spin'); lockBets(false);
  }
}

// ════════════════════════════════════════════════
// GAME: BLACKJACK
// ════════════════════════════════════════════════
function buildBlackjack(c){
  let deck=[],playerHand=[],dealerHand=[],gameActive=false,betAmt=0;
  function handValue(hand){
    let v=hand.reduce((s,c)=>s+cardValue(c.rank),0);
    let aces=hand.filter(c=>c.rank==='A').length;
    while(v>21&&aces-->0) v-=10;
    return v;
  }
  function renderHands(hideDealer=true){
    document.getElementById('bj-player-hand').innerHTML=playerHand.map(c=>cardHTML(c)).join('');
    document.getElementById('bj-dealer-hand').innerHTML=dealerHand.map((c,i)=>cardHTML(c,i===1&&hideDealer)).join('');
    document.getElementById('bj-player-score').textContent='Your hand: '+handValue(playerHand);
    document.getElementById('bj-dealer-score').textContent=hideDealer?'Dealer: ?':'Dealer: '+handValue(dealerHand);
  }
  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">🃏 Blackjack</div>
    <div class="game-subtitle">Get closer to 21 than the dealer without going over</div>
    <div id="bj-bet"></div>
    <div style="margin-bottom:8px;font-size:.7rem;font-weight:700;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;" id="bj-dealer-score">Dealer: —</div>
    <div class="cards-row" id="bj-dealer-hand"></div>
    <div style="margin:12px 0 8px;font-size:.7rem;font-weight:700;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;" id="bj-player-score">Your hand: —</div>
    <div class="cards-row" id="bj-player-hand"></div>
    <div class="result-banner" id="bj-result"></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;">
      <button class="btn btn-green" id="bj-deal" onclick="bjDeal()" style="max-width:140px;"><span class="btn-text">Deal</span></button>
      <button class="btn" id="bj-hit" onclick="bjHit()" style="max-width:120px;" disabled><span class="btn-text">Hit</span></button>
      <button class="btn btn-red" id="bj-stand" onclick="bjStand()" style="max-width:120px;" disabled><span class="btn-text">Stand</span></button>
      <button class="btn btn-gold" id="bj-double" onclick="bjDouble()" style="max-width:140px;" disabled><span class="btn-text">Double Down</span></button>
    </div>
    ${buildInfoCard('Blackjack Payouts', [
      ['Regular Win (beat dealer)','2x your bet (stake + profit)'],
      ['Blackjack (A + 10-card)','2.5x your bet'],
      ['Push (tie)','Bet returned'],
      ['Double Down','Double bet, one more card, then stand'],
      ['Bust (over 21)','Lose your bet'],
    ], '<strong>Tip:</strong> Always stand on 17+. Double down on 11 when dealer shows 2–10. Blackjack pays 1.5x profit on top of your stake returned.')}
  </div>`;
  buildBetPanel(document.getElementById('bj-bet'));

  async function endGame(result, msg){
    gameActive=false; renderHands(false);
    ['bj-hit','bj-stand','bj-double'].forEach(id=>document.getElementById(id).disabled=true);
    document.getElementById('bj-deal').disabled=false; lockBets(false);
    const rb=document.getElementById('bj-result');
    if(result==='win'){
      const payout=betAmt*2;
      rb.textContent=msg+' +'+fmtCoins(payout)+' returned! (net +'+fmtCoins(betAmt)+')';
      rb.className='result-banner win';
      await addCoins(payout,'Blackjack');
      await recordResult(true); playSound('win');
    } else if(result==='blackjack'){
      const payout=Math.floor(betAmt*2.5);
      rb.textContent=msg+' +'+fmtCoins(payout)+' returned! (net +'+fmtCoins(payout-betAmt)+')';
      rb.className='result-banner win';
      await addCoins(payout,'Blackjack!');
      await recordResult(true); playSound('bigwin'); unlockAchievement('blackjack');
    } else if(result==='push'){
      rb.textContent=msg+' Bet of '+fmtCoins(betAmt)+' returned.';
      rb.className='result-banner push';
      await addCoins(betAmt,'Push');
      await recordResult(false); playSound('click');
    } else {
      rb.textContent=msg+' Lost '+fmtCoins(betAmt)+' coins.';
      rb.className='result-banner lose';
      await trackLoss(betAmt);
      await recordResult(false); playSound('lose');
    }
  }

  window.bjDeal=async function(){
    if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    deck=shuffleDeck(newDeck());
    betAmt=currentBet;
    await saveUserData({coins:(userData.coins||0)-betAmt});
    lockBets(true);
    document.getElementById('bj-result').className='result-banner';
    playerHand=[deck.pop(),deck.pop()]; dealerHand=[deck.pop(),deck.pop()];
    gameActive=true; renderHands(true);
    document.getElementById('bj-deal').disabled=true;
    ['bj-hit','bj-stand','bj-double'].forEach(id=>document.getElementById(id).disabled=false);
    playSound('deal');
    if(handValue(playerHand)===21) endGame('blackjack','🎉 Blackjack! You win 2.5x!');
  };
  window.bjHit=function(){
    if(!gameActive) return;
    playerHand.push(deck.pop()); renderHands(true); playSound('flip');
    if(handValue(playerHand)>21) endGame('lose','💥 Bust!');
    else if(handValue(playerHand)===21) bjStand();
  };
  window.bjStand=function(){
    if(!gameActive) return;
    document.getElementById('bj-double').disabled=true;
    while(handValue(dealerHand)<17) dealerHand.push(deck.pop());
    const pv=handValue(playerHand), dv=handValue(dealerHand);
    if(dv>21)      endGame('win','🎉 Dealer busts! You win!');
    else if(pv>dv) endGame('win','🎉 You win! '+pv+' vs '+dv);
    else if(pv===dv) endGame('push','🤝 Push! '+pv+' vs '+dv);
    else           endGame('lose','😔 Dealer wins. '+pv+' vs '+dv);
  };
  window.bjDouble=async function(){
    if(!gameActive||(userData.coins||0)<betAmt){toast('Not enough coins!');return;}
    await saveUserData({coins:(userData.coins||0)-betAmt});
    betAmt*=2;
    playerHand.push(deck.pop()); renderHands(true); playSound('flip');
    if(handValue(playerHand)>21) endGame('lose','💥 Bust after double!');
    else bjStand();
  };
}

// ════════════════════════════════════════════════
// GAME: ROULETTE
// ════════════════════════════════════════════════
function buildRoulette(c){
  const RED_NUMS=[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
  let selectedBet=null, spinning=false;
  const nums=Array.from({length:37},(_,i)=>i);
  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">🎡 Roulette</div>
    <div class="game-subtitle">Pick a number or color/group · Spin the wheel</div>
    <div id="rl-bet"></div>
    <div class="rb-special">
      <button class="rb-sp-btn" onclick="selectRlBet('red','Red',this)">🔴 Red (2x)</button>
      <button class="rb-sp-btn" onclick="selectRlBet('black','Black',this)">⚫ Black (2x)</button>
      <button class="rb-sp-btn" onclick="selectRlBet('even','Even',this)">Even (2x)</button>
      <button class="rb-sp-btn" onclick="selectRlBet('odd','Odd',this)">Odd (2x)</button>
      <button class="rb-sp-btn" onclick="selectRlBet('low','1-18',this)">1-18 (2x)</button>
      <button class="rb-sp-btn" onclick="selectRlBet('high','19-36',this)">19-36 (2x)</button>
      <button class="rb-sp-btn" onclick="selectRlBet('dozen1','1st 12',this)">1st 12 (3x)</button>
      <button class="rb-sp-btn" onclick="selectRlBet('dozen2','2nd 12',this)">2nd 12 (3x)</button>
      <button class="rb-sp-btn" onclick="selectRlBet('dozen3','3rd 12',this)">3rd 12 (3x)</button>
    </div>
    <div class="roulette-board" id="rl-board"></div>
    <div id="rl-selected" style="font-size:.78rem;font-weight:800;color:var(--gold);margin:8px 0;min-height:20px;"></div>
    <div class="result-banner" id="rl-result"></div>
    <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap;margin-top:12px;">
      <button class="btn" id="rl-spin-btn" onclick="spinRoulette()" style="max-width:160px;"><span class="btn-text">Spin</span></button>
      <div id="rl-ball-display" style="display:none;align-items:center;gap:12px;">
        <span class="rb-ball"></span>
        <span id="rl-landed" style="font-size:1.2rem;font-weight:900;color:#fff;min-width:32px;text-align:center;"></span>
      </div>
    </div>
    ${buildInfoCard('Roulette Payouts (total return)', [
      ['Single Number','36x your bet'],
      ['Red / Black / Even / Odd / 1-18 / 19-36','2x your bet'],
      ['Dozen (1st/2nd/3rd 12)','3x your bet'],
      ['Green 0','36x your bet (single number bet)'],
    ], '<strong>Tip:</strong> Payouts include your stake. A 2x on a 100 bet means you get 200 back. Single number is the riskiest but pays biggest.')}
  </div>`;
  buildBetPanel(document.getElementById('rl-bet'));
  const board=document.getElementById('rl-board');
  nums.forEach(n=>{
    const cell=document.createElement('div');
    cell.className='rb-cell '+(n===0?'num-green':RED_NUMS.includes(n)?'num-red':'num-black');
    cell.textContent=n;
    cell.onclick=()=>{
      document.querySelectorAll('.rb-sp-btn,.rb-cell').forEach(b=>b.classList.remove('selected'));
      cell.classList.add('selected');
      selectRlBet('num_'+n, n.toString(), null);
    };
    board.appendChild(cell);
  });
  window.selectRlBet=function(type,label,btn){
    selectedBet={type,label};
    document.getElementById('rl-selected').textContent='Selected: '+label;
    document.querySelectorAll('.rb-sp-btn,.rb-cell').forEach(b=>b.classList.remove('selected'));
    if(btn) btn.classList.add('selected');
    playSound('click');
  };
  window.spinRoulette=async function(){
    if(spinning) return;
    if(!selectedBet){toast('Pick a bet first!');return;}
    if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    spinning=true; setLoading('rl-spin-btn',true,'Spinning...'); lockBets(true);
    document.getElementById('rl-result').className='result-banner';
    const betAmt=currentBet;
    await saveUserData({coins:(userData.coins||0)-betAmt});
    const ballEl=document.getElementById('rl-ball-display'); ballEl.style.display='flex';
    let frame=0; const total=50; let tickDelay=40;
    function rlTick(){
      frame++; if(frame>35) tickDelay=90; if(frame>45) tickDelay=140;
      document.getElementById('rl-landed').textContent=nums[rand(0,nums.length-1)];
      playSound('roulette_tick');
      if(frame>=total){
        const landed=nums[rand(0,nums.length-1)];
        document.getElementById('rl-landed').textContent=landed;
        document.querySelectorAll('.rb-cell').forEach(cell=>{cell.classList.toggle('landed',parseInt(cell.textContent)===landed);});
        const isRed=RED_NUMS.includes(landed); let mult=0; const b=selectedBet.type;
        if(b.startsWith('num_')&&parseInt(b.split('_')[1])===landed) mult=36;
        else if(b==='red'&&isRed)                        mult=2;
        else if(b==='black'&&!isRed&&landed!==0)         mult=2;
        else if(b==='even'&&landed!==0&&landed%2===0)    mult=2;
        else if(b==='odd'&&landed%2===1)                 mult=2;
        else if(b==='low'&&landed>=1&&landed<=18)        mult=2;
        else if(b==='high'&&landed>=19&&landed<=36)      mult=2;
        else if(b==='dozen1'&&landed>=1&&landed<=12)     mult=3;
        else if(b==='dozen2'&&landed>=13&&landed<=24)    mult=3;
        else if(b==='dozen3'&&landed>=25&&landed<=36)    mult=3;
        const rb=document.getElementById('rl-result');
        if(mult>0){
          const payout=betAmt*mult;
          const netGain=payout-betAmt;
          addCoins(payout,'Roulette');
          rb.textContent='🎉 Landed '+landed+'! '+selectedBet.label+' · +'+fmtCoins(payout)+' returned! (net +'+fmtCoins(netGain)+')';
          rb.className='result-banner win';
          playSound(payout>=5000?'bigwin':'win'); recordResult(true);
          if(landed===0) unlockAchievement('roulette_0');
          if(payout>=10000) unlockAchievement('big_win');
        } else {
          trackLoss(betAmt);
          rb.textContent='😔 Landed '+landed+'. '+selectedBet.label+' loses. Lost '+fmtCoins(betAmt)+' coins.';
          rb.className='result-banner lose'; playSound('lose'); recordResult(false);
        }
        spinning=false; setLoading('rl-spin-btn',false,'Spin'); lockBets(false);
        return;
      }
      setTimeout(rlTick,tickDelay);
    }
    setTimeout(rlTick,tickDelay);
  };
}

// ════════════════════════════════════════════════
// GAME: PLINKO
// ════════════════════════════════════════════════
function buildPlinko(c){
  // Multipliers = total return on bet (0.2x means you lose most of it — shown as lose)
  const MULTS=[100000000000000000,5000000000000000000000,3000000000000000000000000000000000,2999999999999999999999999999,10000000000000000,5000000000000000000000000000000000000000000000000,67,1000000000000000000000000000000000000000000000000000000,1000000000000000,200000000000000000000,30000000000000000000000000000,5000000000000000000000000000000,1000000000000000000000000000000000000000];
  let dropping=false;
  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">🔵 Plinko</div>
    <div class="game-subtitle">Drop the ball · Higher multipliers on the outside!</div>
    <div id="pk-bet"></div>
    <button class="btn" id="pk-drop-btn" onclick="dropPlinko()" style="max-width:180px;margin-bottom:12px;"><span class="btn-text">Drop Ball</span></button>
    <div class="result-banner" id="pk-result"></div>
    <div style="position:relative;display:flex;justify-content:center;"><canvas id="plinko-canvas" width="520" height="500"></canvas></div>
    <div class="plinko-mults" id="plinko-mults-row">${MULTS.map((m,i)=>`<span class="pm" id="pm${i}" style="color:${m>=5?'#ff4444':m>=2?'var(--gold)':m<1?'#ff6688':'var(--muted)'}">${m}x</span>`).join('')}</div>
    ${buildInfoCard('Plinko Multipliers (total return on bet)', [
      ['Outside slots (10x)','Get 10× your bet back'],
      ['Near-outside (5x)','Get 5× your bet back'],
      ['3x, 2x, 1x slots','Get that multiple of your bet back'],
      ['0.5x slot','Get half your bet back (partial loss)'],
      ['0.2x slot','Get 20% of your bet back (big loss)'],
    ], '<strong>Tip:</strong> The ball physically bounces off pegs — there\'s real randomness! Aim for the outside edges for the 10x jackpot. Any slot under 1x shows as a loss.')}
  </div>`;
  buildBetPanel(document.getElementById('pk-bet'));
  const canvas=document.getElementById('plinko-canvas');
  const ctx=canvas.getContext('2d');
  const PW=520,PH=500,ROWS=10,PGAP=44,TOP=50,PEGS=[];
  for(let r=0;r<ROWS;r++){const count=r+3;const xStart=(PW-(count-1)*PGAP)/2;for(let i=0;i<count;i++) PEGS.push({x:xStart+i*PGAP,y:TOP+r*42});}
  const BUCKET_COUNT=MULTS.length, bucketW=PW/BUCKET_COUNT, bucketY=PH-40;
  function drawBoard(ball=null){
    ctx.clearRect(0,0,PW,PH); ctx.fillStyle='#030310'; ctx.fillRect(0,0,PW,PH);
    MULTS.forEach((m,i)=>{const bx=i*bucketW;const color=m>=5?'rgba(255,50,50,.28)':m>=2?'rgba(255,200,0,.22)':m<1?'rgba(255,50,80,.2)':'rgba(0,0,255,.12)';ctx.fillStyle=color;ctx.fillRect(bx+2,bucketY,bucketW-4,PH-bucketY-2);ctx.strokeStyle=m>=5?'rgba(255,50,50,.55)':m>=2?'rgba(255,200,0,.45)':m<1?'rgba(255,50,80,.4)':'rgba(0,0,255,.35)';ctx.lineWidth=1;ctx.strokeRect(bx+2,bucketY,bucketW-4,PH-bucketY-2);});
    PEGS.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);ctx.fillStyle='rgba(100,120,255,.9)';ctx.fill();ctx.strokeStyle='rgba(0,0,255,.5)';ctx.lineWidth=1;ctx.stroke();});
    if(ball){const grad=ctx.createRadialGradient(ball.x-3,ball.y-3,1,ball.x,ball.y,12);grad.addColorStop(0,'#ffffff');grad.addColorStop(0.3,'#ffdd00');grad.addColorStop(1,'rgba(180,100,0,.8)');ctx.beginPath();ctx.arc(ball.x,ball.y,11,0,Math.PI*2);ctx.fillStyle=grad;ctx.shadowColor='rgba(255,215,0,.9)';ctx.shadowBlur=20;ctx.fill();ctx.shadowBlur=0;}
  }
  drawBoard();
  window.dropPlinko=async function(){
    if(dropping) return;
    if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    document.getElementById('pk-drop-btn').disabled=true;
    document.getElementById('pk-result').className='result-banner';
    document.querySelectorAll('.pm').forEach(e=>e.style.background='');
    const betAmt=currentBet;
    await saveUserData({coins:(userData.coins||0)-betAmt});
    dropping=true; lockBets(true); playSound('spin');
    let bx=PW/2+(Math.random()-0.5)*20, by=15, vx=(Math.random()-0.5)*1.5, vy=0;
    const GRAVITY=0.35, BOUNCE_DAMP=0.55, PEG_RADIUS=14, BALL_R=11; let pegCooldown=0;
    function step(){
      vy+=GRAVITY; bx+=vx; by+=vy;
      if(bx<BALL_R){bx=BALL_R;vx=Math.abs(vx)*0.7;} if(bx>PW-BALL_R){bx=PW-BALL_R;vx=-Math.abs(vx)*0.7;}
      pegCooldown=Math.max(0,pegCooldown-1);
      for(const p of PEGS){const dx=bx-p.x,dy=by-p.y,dist=Math.sqrt(dx*dx+dy*dy);if(dist<PEG_RADIUS&&pegCooldown===0){const nx=dx/dist,ny=dy/dist,speed=Math.sqrt(vx*vx+vy*vy);const bounce=(Math.random()<0.5?-1:1);vx=bounce*Math.abs(speed*BOUNCE_DAMP)+(Math.random()-0.5)*0.8;vy=Math.abs(ny*speed*BOUNCE_DAMP)+1.5;bx=p.x+nx*(PEG_RADIUS+1);by=p.y+ny*(PEG_RADIUS+1);pegCooldown=6;playSound('peg');}}
      const spd=Math.sqrt(vx*vx+vy*vy); if(spd>8){vx=vx/spd*8;vy=vy/spd*8;}
      drawBoard({x:bx,y:by});
      if(by>=bucketY){
        const slot=Math.min(Math.floor(bx/bucketW),MULTS.length-1);
        const mult=MULTS[slot], payout=Math.floor(betAmt*mult);
        document.getElementById('pm'+slot).style.background='rgba(255,215,0,.35)';
        const rb=document.getElementById('pk-result');
        if(mult>=1){
          addCoins(payout,'Plinko');
          const netGain = payout - betAmt;
          rb.textContent='🎉 '+mult+'x · +'+fmtCoins(payout)+' returned! (net +'+fmtCoins(netGain)+')';
          rb.className='result-banner win';
          playSound(mult>=5?'bigwin':'win'); recordResult(true);
          if(mult===Math.max(...MULTS)) unlockAchievement('plinko_max');
          if(payout>=10000) unlockAchievement('big_win');
        } else {
          if(payout>0) addCoins(payout,'Plinko partial');
          trackLoss(betAmt - payout);
          rb.textContent='😔 '+mult+'x · Only '+fmtCoins(payout)+' of '+fmtCoins(betAmt)+' returned. (lost '+fmtCoins(betAmt-payout)+')';
          rb.className='result-banner lose'; playSound('lose'); recordResult(false);
        }
        dropping=false; lockBets(false); document.getElementById('pk-drop-btn').disabled=false;
        return;
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };
}

// ════════════════════════════════════════════════
// GAME: VIDEO POKER
// ════════════════════════════════════════════════
function buildPoker(c){
  let deck=[],hand=[],held=[],dealt=false,betAmt=0;
  function evalHand(h){
    const rankIdxs=h.map(c=>RANKS.indexOf(c.rank)).sort((a,b)=>a-b);
    const suits=h.map(c=>c.suit);
    const counts={}; rankIdxs.forEach(r=>{counts[r]=(counts[r]||0)+1;});
    const vals=Object.values(counts).sort((a,b)=>b-a);
    const flush=suits.every(s=>s===suits[0]);
    const isRoyalStraight=JSON.stringify(rankIdxs)==='[0,9,10,11,12]';
    const normalStraight=rankIdxs[4]-rankIdxs[0]===4&&vals[0]===1;
    const straight=normalStraight||isRoyalStraight;
    const rf=flush&&isRoyalStraight;
    if(rf)             return{name:'Royal Flush',     mult:800};
    if(flush&&straight)return{name:'Straight Flush',  mult:50};
    if(vals[0]===4)    return{name:'Four of a Kind',  mult:25};
    if(vals[0]===3&&vals[1]===2) return{name:'Full House',  mult:9};
    if(flush)          return{name:'Flush',           mult:6};
    if(straight)       return{name:'Straight',        mult:4};
    if(vals[0]===3)    return{name:'Three of a Kind', mult:3};
    if(vals[0]===2&&vals[1]===2) return{name:'Two Pair',    mult:2};
    const pairRank=parseInt(Object.keys(counts).find(k=>counts[k]===2)||'-1');
    if(pairRank>=9||pairRank===0) return{name:'Jacks or Better',mult:1};
    return{name:'Nothing',mult:0};
  }
  function renderHand(){
    document.getElementById('poker-hand').innerHTML=hand.map((card,i)=>`
      <div class="poker-card-wrap" onclick="togglePokerHold(${i})">
        ${cardHTML(card).replace('playing-card','playing-card'+(held[i]?' held':''))}
        <div class="poker-hold">${held[i]?'HELD':''}</div>
      </div>`).join('');
  }
  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">🂡 Video Poker</div>
    <div class="game-subtitle">Jacks or Better — click cards to hold them, then draw</div>
    <div id="pk2-bet"></div>
    <div class="cards-row" id="poker-hand" style="justify-content:center;gap:12px;flex-wrap:wrap;"></div>
    <div class="result-banner" id="poker-result"></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;">
      <button class="btn btn-green" id="poker-deal-btn" onclick="pokerDeal()" style="max-width:140px;"><span class="btn-text">Deal</span></button>
      <button class="btn" id="poker-draw-btn" onclick="pokerDraw()" style="max-width:140px;" disabled><span class="btn-text">Draw</span></button>
    </div>
    ${buildInfoCard('Video Poker Payouts (total return on bet)', [
      ['Royal Flush','800x'],['Straight Flush','50x'],['Four of a Kind','25x'],
      ['Full House','9x'],['Flush','6x'],['Straight','4x'],
      ['Three of a Kind','3x'],['Two Pair','2x'],['Jacks or Better','1x (stake back)'],
      ['Anything lower','Loss'],
    ], '<strong>Tip:</strong> Always hold a pair or better. Click cards to mark them HELD before drawing. Payouts include your stake back.')}
  </div>`;
  buildBetPanel(document.getElementById('pk2-bet'));
  window.togglePokerHold=function(i){if(!dealt)return;held[i]=!held[i];renderHand();playSound('click');};
  window.pokerDeal=async function(){
    if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    deck=shuffleDeck(newDeck());
    betAmt=currentBet;
    await saveUserData({coins:(userData.coins||0)-betAmt});
    hand=[deck.pop(),deck.pop(),deck.pop(),deck.pop(),deck.pop()];
    held=[false,false,false,false,false]; dealt=true; renderHand();
    document.getElementById('poker-result').className='result-banner';
    document.getElementById('poker-deal-btn').disabled=true;
    document.getElementById('poker-draw-btn').disabled=false;
    lockBets(true);
    playSound('deal');
  };
  window.pokerDraw=async function(){
    for(let i=0;i<5;i++) if(!held[i]) hand[i]=deck.pop();
    held=[false,false,false,false,false]; dealt=false; renderHand(); playSound('deal');
    document.getElementById('poker-draw-btn').disabled=true;
    document.getElementById('poker-deal-btn').disabled=false;
    lockBets(false);
    const result=evalHand(hand); const rb=document.getElementById('poker-result');
    if(result.mult>0){
      const payout=betAmt*result.mult;
      const netGain = payout - betAmt;
      await addCoins(payout,'Video Poker');
      rb.textContent='🎉 '+result.name+'! +'+fmtCoins(payout)+' returned! (net +'+fmtCoins(netGain)+')';
      rb.className='result-banner win';
      playSound(result.mult>=25?'bigwin':'win'); await recordResult(true);
      if(result.name==='Royal Flush'){unlockAchievement('poker_royal');toast('👑 ROYAL FLUSH!');}
      if(payout>=10000) unlockAchievement('big_win');
    } else {
      await trackLoss(betAmt);
      rb.textContent='😔 '+result.name+'. Lost '+fmtCoins(betAmt)+'. Deal again!';
      rb.className='result-banner lose'; playSound('lose'); await recordResult(false);
    }
  };
}

// ════════════════════════════════════════════════
// GAME: DICE
// ════════════════════════════════════════════════
function buildDice(c){
  const DICE_FACES=['','⚀','⚁','⚂','⚃','⚄','⚅'];
  let rolling=false, playerPick=null;
  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">🎲 Dice</div>
    <div class="game-subtitle">Pick a number (5x) or High/Low (2x)</div>
    <div id="dice-bet"></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
      ${[1,2,3,4,5,6].map(n=>`<button class="rb-sp-btn" onclick="pickDice(${n},this)">${DICE_FACES[n]} ${n} <span style="color:var(--gold);font-size:.65rem;">(5x)</span></button>`).join('')}
      <button class="rb-sp-btn" onclick="pickDice('low',this)">Low 1-3 (2x)</button>
      <button class="rb-sp-btn" onclick="pickDice('high',this)">High 4-6 (2x)</button>
    </div>
    <div id="dice-pick-label" style="font-size:.8rem;font-weight:800;color:var(--gold);margin-bottom:12px;min-height:20px;"></div>
    <div class="dice-display"><div class="die" id="die1">⚀</div></div>
    <div class="result-banner" id="dice-result"></div>
    <button class="btn" id="dice-roll-btn" onclick="rollDice()" style="max-width:160px;"><span class="btn-text">Roll</span></button>
    ${buildInfoCard('Dice Payouts (total return on bet)', [
      ['Exact number match','5x your bet'],
      ['High (4-6) or Low (1-3)','2x your bet'],
      ['Wrong guess','Lose your bet'],
    ], '<strong>Tip:</strong> Exact number gives 5x total return. High/Low is 2x total. Always a 1 in 6 chance for exact, 50/50 for High/Low.')}
  </div>`;
  buildBetPanel(document.getElementById('dice-bet'));
  window.pickDice=function(val,btn){
    playerPick=val;
    document.querySelectorAll('#screen-game .rb-sp-btn').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    document.getElementById('dice-pick-label').textContent='Picked: '+(typeof val==='number'?DICE_FACES[val]+' '+val:val==='low'?'Low (1-3)':'High (4-6)');
    playSound('click');
  };
  window.rollDice=async function(){
    if(rolling) return;
    if(playerPick===null){toast('Pick a number or High/Low!');return;}
    if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    rolling=true; setLoading('dice-roll-btn',true,'Rolling...'); lockBets(true);
    document.getElementById('dice-result').className='result-banner';
    const betAmt=currentBet;
    await saveUserData({coins:(userData.coins||0)-betAmt}); playSound('spin');
    let frame=0;
    const iv=setInterval(async()=>{
      document.getElementById('die1').textContent=DICE_FACES[rand(1,6)]; frame++;
      if(frame>22){
        clearInterval(iv);
        const d1=rand(1,6); document.getElementById('die1').textContent=DICE_FACES[d1];
        const rb=document.getElementById('dice-result'); let won=false, mult=0;
        if(typeof playerPick==='number'&&d1===playerPick){won=true;mult=5;}
        else if(playerPick==='low'&&d1<=3){won=true;mult=2;}
        else if(playerPick==='high'&&d1>=4){won=true;mult=2;}
        if(won){
          const payout=betAmt*mult;
          await addCoins(payout,'Dice');
          rb.textContent='🎉 Rolled '+DICE_FACES[d1]+' '+d1+'! '+mult+'x · +'+fmtCoins(payout)+' returned! (net +'+fmtCoins(payout-betAmt)+')';
          rb.className='result-banner win'; playSound('win'); await recordResult(true);
          if(payout>=10000) unlockAchievement('big_win');
        } else {
          await trackLoss(betAmt);
          rb.textContent='😔 Rolled '+DICE_FACES[d1]+' '+d1+'. No match. Lost '+fmtCoins(betAmt)+' coins.';
          rb.className='result-banner lose'; playSound('lose'); await recordResult(false);
        }
        rolling=false; setLoading('dice-roll-btn',false,'Roll'); lockBets(false);
      }
    },80);
  };
}

// ════════════════════════════════════════════════
// GAME: SCRATCH CARD
// ════════════════════════════════════════════════
function buildScratch(c){
  let scratching=false, cardPaid=false;
  const EMOJIS=['🍒','💎','⭐','🎰','🍀','7️⃣','🔔','🍉'];
  let symGrid=[];
  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">🎟️ Scratch Card</div>
    <div class="game-subtitle">Scratch all 9 tiles · Find 3 matching symbols to win!</div>
    <div id="sc-bet"></div>
    <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;">
      <button class="btn" id="sc-new-btn" onclick="newScratch()" style="max-width:180px;"><span class="btn-text">New Card</span></button>
      <button class="btn btn-gold" id="sc-reveal-btn" onclick="revealAll()" style="max-width:180px;" disabled><span class="btn-text">Reveal All</span></button>
    </div>
    <div class="scratch-wrap"><canvas id="scratchCanvas" width="360" height="360"></canvas></div>
    <div class="result-banner" id="sc-result"></div>
    ${buildInfoCard('Scratch Card Payouts (total return on bet)', [
      ['3x 🍒 Cherries','2x your bet'],['3x 🔔 Bells','3x your bet'],
      ['3x 🍉 Watermelon','4x your bet'],['3x 🍀 Clovers','5x your bet'],
      ['3x ⭐ Stars','8x your bet'],['3x 🎰 Slots','10x your bet'],
      ['3x 💎 Diamonds','15x your bet'],['3x 7️⃣ Sevens','25x your bet'],
    ], '<strong>Tip:</strong> Click individual tiles to scratch, or use Reveal All. 30% chance of a 3-of-a-kind on any card. Payouts are total coins returned.')}
  </div>`;
  buildBetPanel(document.getElementById('sc-bet'));
  const canvas=document.getElementById('scratchCanvas');
  const ctx=canvas.getContext('2d');
  const PRIZE_MULTS={'🍒':2,'🔔':3,'🍉':4,'🍀':5,'⭐':8,'🎰':10,'💎':15,'7️⃣':25};
  function genCard(){
    const win=Math.random()<0.30; const winSym=EMOJIS[rand(0,EMOJIS.length-1)]; symGrid=[];
    if(win){
      const positions=[0,1,2,3,4,5,6,7,8]; const chosen=[];
      while(chosen.length<3){const p=positions[rand(0,positions.length-1)];if(!chosen.includes(p))chosen.push(p);}
      for(let i=0;i<9;i++){if(chosen.includes(i))symGrid.push({sym:winSym,scratched:false});else{let s;do{s=EMOJIS[rand(0,EMOJIS.length-1)];}while(s===winSym);symGrid.push({sym:s,scratched:false});}}
    } else {
      let attempts=0;
      do{
        symGrid=Array.from({length:9},()=>({sym:EMOJIS[rand(0,EMOJIS.length-1)],scratched:false}));
        const counts={}; symGrid.forEach(s=>{counts[s.sym]=(counts[s.sym]||0)+1;});
        if(Math.max(...Object.values(counts))<3) break;
        attempts++;
      }while(attempts<30);
    }
  }
  function isComplete(){return symGrid.length>0&&symGrid.every(s=>s.scratched);}
  function drawCard(){
    ctx.clearRect(0,0,360,360); ctx.fillStyle='#07071a'; ctx.fillRect(0,0,360,360);
    // Only show winner highlights when all tiles are revealed
    const complete=isComplete();
    const counts={}; if(complete) symGrid.forEach(s=>{counts[s.sym]=(counts[s.sym]||0)+1;});
    for(let i=0;i<9;i++){
      const x=(i%3)*120+60, y=Math.floor(i/3)*120+60;
      if(!symGrid[i]||!symGrid[i].scratched){
        const grad=ctx.createLinearGradient(x-50,y-50,x+50,y+50);
        grad.addColorStop(0,'rgba(0,0,200,.35)'); grad.addColorStop(1,'rgba(0,0,120,.25)');
        ctx.beginPath(); ctx.roundRect(x-50,y-50,100,100,12);
        ctx.fillStyle=grad; ctx.fill();
        ctx.strokeStyle='rgba(0,0,255,.5)'; ctx.lineWidth=2; ctx.stroke();
        ctx.fillStyle='rgba(100,120,255,.6)'; ctx.font='bold 32px Montserrat';
        ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('?',x,y);
      } else {
        const isWinner=complete&&counts[symGrid[i].sym]>=3;
        ctx.beginPath(); ctx.roundRect(x-50,y-50,100,100,12);
        ctx.fillStyle=isWinner?'rgba(0,80,0,.45)':'rgba(6,6,20,.85)'; ctx.fill();
        ctx.strokeStyle=isWinner?'rgba(0,255,100,.55)':'rgba(0,0,255,.25)'; ctx.lineWidth=2; ctx.stroke();
        ctx.font='44px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(symGrid[i].sym,x,y);
      }
    }
  }
  window.newScratch=async function(){
    if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    const betAmt=currentBet;
    await saveUserData({coins:(userData.coins||0)-betAmt});
    genCard(); document.getElementById('sc-result').className='result-banner';
    cardPaid=true;
    const revBtn=document.getElementById('sc-reveal-btn');
    if(revBtn) revBtn.disabled=false;
    drawCard(); scratching=true; lockBets(true); playSound('click');
    // Store betAmt for checkScratch
    canvas._betAmt=betAmt;
  };
  window.revealAll=function(){
    if(!cardPaid){toast('Buy a card first!');return;}
    if(!scratching&&symGrid.length===0) return;
    symGrid.forEach(s=>s.scratched=true); drawCard(); scratching=false; cardPaid=false;
    const revBtn=document.getElementById('sc-reveal-btn');
    if(revBtn) revBtn.disabled=true;
    lockBets(false);
    checkScratch();
  };
  function scratch(e){
    if(!scratching) return;
    const rect=canvas.getBoundingClientRect();
    const scaleX=canvas.width/rect.width, scaleY=canvas.height/rect.height;
    const x=((e.clientX||(e.touches&&e.touches[0].clientX)||0)-rect.left)*scaleX;
    const y=((e.clientY||(e.touches&&e.touches[0].clientY)||0)-rect.top)*scaleY;
    const col=Math.floor(x/120), row=Math.floor(y/120), idx=row*3+col;
    if(idx>=0&&idx<9&&!symGrid[idx].scratched){
      symGrid[idx].scratched=true; drawCard(); playSound('scratch');
      if(symGrid.every(s=>s.scratched)){
        scratching=false; cardPaid=false;
        const revBtn=document.getElementById('sc-reveal-btn');
        if(revBtn) revBtn.disabled=true;
        lockBets(false);
        // Redraw to show highlights now that complete
        drawCard();
        checkScratch();
      }
    }
  }
  canvas.addEventListener('mousemove',e=>{if(e.buttons)scratch(e);});
  canvas.addEventListener('touchmove',e=>{e.preventDefault();scratch(e);},{passive:false});
  canvas.addEventListener('click',scratch);
  async function checkScratch(){
    const betAmt=canvas._betAmt||currentBet;
    const counts={}; symGrid.forEach(s=>{counts[s.sym]=(counts[s.sym]||0)+1;});
    // Find the winning symbol with the HIGHEST multiplier (not just first found)
    let winSym=null; let bestMult=0;
    Object.keys(counts).forEach(sym=>{
      if(counts[sym]>=3){
        const m=PRIZE_MULTS[sym]||2;
        if(m>bestMult){bestMult=m;winSym=sym;}
      }
    });
    const rb=document.getElementById('sc-result');
    if(winSym){
      const payout=betAmt*bestMult;
      await addCoins(payout,'Scratch Card');
      rb.textContent='🎉 3x '+winSym+'! '+bestMult+'x · +'+fmtCoins(payout)+' returned! (net +'+fmtCoins(payout-betAmt)+')';
      rb.className='result-banner win'; playSound(payout>=5000?'bigwin':'win');
      await recordResult(true); unlockAchievement('scratch_3');
      if(payout>=10000) unlockAchievement('big_win');
    } else {
      await trackLoss(betAmt);
      rb.textContent='😔 No 3-of-a-kind. Lost '+fmtCoins(betAmt)+' coins.';
      rb.className='result-banner lose'; playSound('lose'); await recordResult(false);
    }
  }
  symGrid=Array.from({length:9},()=>({sym:'?',scratched:false})); drawCard();
}

// ════════════════════════════════════════════════
// GAME: RIDE THE BUS
// ════════════════════════════════════════════════
function buildRideBus(c){
  let deck=[],cardHistory=[],stage=0,active=false,winnings=0,betAmt=0;
  const QUESTIONS=['Question 1: Red or Black?','Question 2: Higher or Lower?','Question 3: Inside or Outside?','Question 4: Suit?'];
  const QOPTS=[['🔴 Red','⚫ Black'],['⬆️ Higher','⬇️ Lower'],['↔️ Inside','↕️ Outside'],['♠ Spades','♥ Hearts','♦ Diamonds','♣ Clubs']];
  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">🚌 Ride the Bus</div>
    <div class="game-subtitle">Answer 4 card questions · Winnings double each stage!</div>
    <div id="bus-bet"></div>
    <div class="bus-streak" id="bus-streak">Stage: 0 / 4</div>
    <div id="bus-hint" style="font-size:.75rem;color:var(--muted);min-height:20px;margin:6px 0;"></div>
    <div class="bus-stage" id="bus-stage-row" style="justify-content:center;gap:10px;flex-wrap:wrap;margin:14px 0;min-height:110px;"></div>
    <div class="bus-question" id="bus-question">Press Start Ride to begin!</div>
    <div class="bus-choices" id="bus-choices"></div>
    <div class="result-banner" id="bus-result"></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;">
      <button class="btn btn-green" id="bus-start-btn" onclick="startBus()" style="max-width:180px;"><span class="btn-text">Start Ride</span></button>
      <button class="btn btn-gold" id="bus-cashout-btn" onclick="busCashout()" style="max-width:180px;display:none;"><span class="btn-text">Cash Out</span></button>
    </div>
    ${buildInfoCard('Ride the Bus — How to Play', [
      ['Stage 1: Red or Black?','Guess the card color — 50/50'],
      ['Stage 2: Higher or Lower?','Is next card higher or lower than last?'],
      ['Stage 3: Inside or Outside?','Is it between the 1st two cards, or outside?'],
      ['Stage 4: Suit?','Guess exact suit — 1 in 4 chance'],
      ['Complete all 4 stages','Full payout — bet × 2⁴ = 16x'],
      ['Cash out early','Lock in partial winnings any time after stage 1'],
    ], '<strong>Tip:</strong> Cash out early to secure winnings! The 4th stage (suit) is only 25% chance. Win at stage 2 = 4x, stage 3 = 8x, stage 4 = 16x of your original bet.')}
  </div>`;
  buildBetPanel(document.getElementById('bus-bet'));
  function renderCards(){
    const row=document.getElementById('bus-stage-row'); row.innerHTML='';
    cardHistory.forEach((card,i)=>{
      const el=document.createElement('div');
      el.innerHTML=cardHTML(card);
      const cardEl=el.firstChild;
      if(i===cardHistory.length-1){cardEl.style.boxShadow='0 0 18px var(--blue-glow)';cardEl.style.borderColor='var(--blue)';}
      row.appendChild(cardEl);
    });
  }
  function updateChoices(){
    document.getElementById('bus-question').textContent=QUESTIONS[stage]||'';
    document.getElementById('bus-streak').textContent=`Stage: ${stage} / 4  ·  Potential: ${coinSymbol} ${fmtCoins(winnings)}`;
    const ch=document.getElementById('bus-choices'); ch.innerHTML='';
    if(stage<4&&active){
      QOPTS[stage].forEach(opt=>{
        const b=document.createElement('button'); b.className='bus-choice'; b.textContent=opt;
        b.onclick=()=>busGuess(opt); ch.appendChild(b);
      });
      document.getElementById('bus-cashout-btn').style.display=stage>0?'block':'none';
    }
  }
  window.startBus=async function(){
    if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    deck=shuffleDeck(newDeck());
    betAmt=currentBet;
    await saveUserData({coins:(userData.coins||0)-betAmt});
    cardHistory=[]; stage=0; active=true; winnings=betAmt*2;
    document.getElementById('bus-result').className='result-banner';
    document.getElementById('bus-start-btn').style.display='none';
    lockBets(true);
    renderCards(); updateChoices(); playSound('deal');
  };
  window.busGuess=async function(choice){
    if(!active||stage>=4) return;
    document.querySelectorAll('.bus-choice').forEach(b=>b.disabled=true);
    const card=deck.pop(); cardHistory.push(card); renderCards(); playSound('flip');
    const prev=cardHistory.length>=2?cardHistory[cardHistory.length-2]:null;
    const prevVal=prev?RANKS.indexOf(prev.rank):0;
    const currVal=RANKS.indexOf(card.rank);
    let correct=false;
    const cleanChoice=choice.replace(/[^a-zA-Z\s]/g,'').trim().split(' ').pop().toLowerCase();
    if(stage===0){ correct=(cleanChoice==='red'&&isRed(card.suit))||(cleanChoice==='black'&&!isRed(card.suit)); }
    else if(stage===1){ correct=(cleanChoice==='higher'&&currVal>=prevVal)||(cleanChoice==='lower'&&currVal<=prevVal); }
    else if(stage===2){
      if(cardHistory.length<3){ correct=true; }
      else {
        const c1=RANKS.indexOf(cardHistory[cardHistory.length-3].rank);
        const c2=RANKS.indexOf(cardHistory[cardHistory.length-2].rank);
        const lo=Math.min(c1,c2), hi=Math.max(c1,c2);
        correct=(cleanChoice==='inside'&&currVal>lo&&currVal<hi)||(cleanChoice==='outside'&&(currVal<lo||currVal>hi));
        if(lo===hi) correct=true;
      }
    }
    else if(stage===3){
      const suitMap={'spades':'♠','hearts':'♥','diamonds':'♦','clubs':'♣'};
      correct=card.suit===(suitMap[cleanChoice]||'');
    }
    const rb=document.getElementById('bus-result');
    if(correct){
      stage++; winnings=betAmt*Math.pow(2,stage+1);
      rb.textContent='✅ Correct! Got '+card.rank+card.suit+'. Stage '+stage+'/4 · Potential: '+fmtCoins(winnings);
      rb.className='result-banner win'; playSound('coin');
      if(stage===4){
        // Full completion — payout the full winnings
        await addCoins(winnings,'Ride the Bus');
        rb.textContent='🎉 You rode the full bus! Won +'+fmtCoins(winnings)+' coins! (bet was '+fmtCoins(betAmt)+')';
        active=false;
        document.getElementById('bus-choices').innerHTML='';
        document.getElementById('bus-question').textContent='You won! 🎉';
        document.getElementById('bus-cashout-btn').style.display='none';
        document.getElementById('bus-start-btn').style.display='block';
        document.getElementById('bus-streak').textContent='Stage: 4/4 · Won: '+coinSymbol+' '+fmtCoins(winnings);
        lockBets(false);
        await recordResult(true); unlockAchievement('bus_5');
        if(winnings>=10000) unlockAchievement('big_win'); playSound('bigwin');
      } else { updateChoices(); }
    } else {
      await trackLoss(betAmt);
      rb.textContent='❌ Wrong! Card was '+card.rank+card.suit+'. Lost '+fmtCoins(betAmt)+' coins.';
      rb.className='result-banner lose'; playSound('lose'); active=false;
      document.getElementById('bus-choices').innerHTML='';
      document.getElementById('bus-question').textContent='Better luck next time!';
      document.getElementById('bus-cashout-btn').style.display='none';
      document.getElementById('bus-start-btn').style.display='block';
      document.getElementById('bus-streak').textContent='Stage: '+stage+'/4 · Lost it all!';
      lockBets(false);
      await recordResult(false);
    }
  };
  window.busCashout=async function(){
    if(!active||stage===0) return;
    const cashAmt=betAmt*Math.pow(2,stage);
    active=false;
    await addCoins(cashAmt,'Bus cashout');
    document.getElementById('bus-result').textContent='💰 Cashed out! +'+fmtCoins(cashAmt)+' coins!';
    document.getElementById('bus-result').className='result-banner win';
    document.getElementById('bus-choices').innerHTML='';
    document.getElementById('bus-question').textContent='';
    document.getElementById('bus-cashout-btn').style.display='none';
    document.getElementById('bus-start-btn').style.display='block';
    lockBets(false);
    playSound('win'); await recordResult(true);
  };
}

// ════════════════════════════════════════════════
// GAME: GO FISH
// ════════════════════════════════════════════════
function buildGoFish(c){
  let deck=[],playerHand=[],cpuHand=[],playerBooks=[],cpuBooks=[],selectedRank=null,gameActive=false,playerTurn=true,betAmt=0;
  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">🐟 Go Fish</div>
    <div class="game-subtitle">Collect sets of 4 (books) · Most books wins · Win pays 3x bet</div>
    <div id="gf-bet"></div>
    <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
      <div style="padding:8px 14px;background:rgba(0,0,255,.1);border:1px solid var(--border);border-radius:8px;font-size:.75rem;"><span style="color:var(--muted);">CPU Books:</span> <span id="gf-cpu-books" style="color:#fff;font-weight:800;">0</span><span id="gf-cpu-book-ranks" style="color:var(--gold);margin-left:6px;"></span></div>
      <div style="padding:8px 14px;background:rgba(0,255,100,.07);border:1px solid rgba(0,255,100,.25);border-radius:8px;font-size:.75rem;"><span style="color:var(--muted);">Your Books:</span> <span id="gf-books" style="color:#44ffaa;font-weight:800;">0</span><span id="gf-book-ranks" style="color:var(--gold);margin-left:6px;"></span></div>
    </div>
    <div id="gf-log" class="fish-msg">Start a game to play!</div>
    <div class="fish-hand" id="gf-hand"></div>
    <div id="gf-selected-label" style="font-size:.78rem;font-weight:800;color:var(--gold);min-height:22px;margin:6px 0;"></div>
    <div style="display:flex;gap:10px;margin-top:10px;flex-wrap:wrap;">
      <button class="btn btn-green" id="gf-start-btn" onclick="startGoFish()" style="max-width:140px;"><span class="btn-text">Deal</span></button>
      <button class="btn" id="gf-ask-btn" onclick="askCpu()" style="max-width:180px;" disabled><span class="btn-text">Ask CPU</span></button>
    </div>
    <div class="result-banner" id="gf-result"></div>
    ${buildInfoCard('Go Fish — How to Play', [
      ['Win condition','Most "books" (sets of 4) at game end'],
      ['Win payout','3x your bet (total return)'],
      ['Tie','Bet returned (1x)'],
      ['Loss','Lose your bet'],
      ['Each turn','Pick a card from your hand, ask CPU for that rank'],
      ['"Go Fish"','CPU doesn\'t have it — draw from deck instead'],
    ], '<strong>Tip:</strong> Ask for ranks you have 2 or 3 of already — you\'re more likely to complete a book. Books of 4 are auto-removed from your hand and scored.')}
  </div>`;
  buildBetPanel(document.getElementById('gf-bet'));
  function checkBooks(hand,books){
    const counts={}; hand.forEach(cd=>{counts[cd.rank]=(counts[cd.rank]||0)+1;});
    Object.entries(counts).forEach(([r,n])=>{
      if(n>=4){books.push(r);hand.splice(0,hand.length,...hand.filter(cd=>cd.rank!==r));}
    });
  }
  function render(msg){
    document.getElementById('gf-books').textContent=playerBooks.length;
    document.getElementById('gf-book-ranks').textContent=playerBooks.join(' ');
    document.getElementById('gf-cpu-books').textContent=cpuBooks.length;
    document.getElementById('gf-cpu-book-ranks').textContent=cpuBooks.join(' ');
    if(msg) document.getElementById('gf-log').textContent=msg;
    document.getElementById('gf-hand').innerHTML=playerHand.map(card=>{
      const dt=getDeckTheme(); const red=isRed(card.suit);
      const sc=red?dt.redSuit:dt.blackSuit; const rc=dt.rankColor||sc;
      const bg=dt.rankBg?`background:${dt.rankBg};`:'';
      return`<div class="fish-card${selectedRank===card.rank?' selected':''}" style="${bg}border-color:${sc}44;" onclick="selectFishCard('${card.rank}')">
        <span class="card-rank" style="color:${rc}">${card.rank}</span>
        <span class="card-suit" style="color:${sc}">${card.suit}</span>
      </div>`;
    }).join('');
    document.getElementById('gf-selected-label').textContent=selectedRank?'Asking for: '+selectedRank+'s':'Select a card to ask for that rank.';
    // Update ask button state
    const askBtn=document.getElementById('gf-ask-btn');
    if(askBtn){
      if(gameActive&&playerTurn&&playerHand.length===0){
        askBtn.disabled=false;
        askBtn.querySelector('.btn-text').textContent='Draw a Card';
      } else if(gameActive&&playerTurn){
        askBtn.disabled=false;
        askBtn.querySelector('.btn-text').textContent='Ask CPU';
      }
    }
    if(gameActive&&deck.length===0&&playerHand.length===0&&cpuHand.length===0) endGame();
  }
  function endGame(){
    gameActive=false;
    lockBets(false);
    const win=playerBooks.length>cpuBooks.length, tie=playerBooks.length===cpuBooks.length;
    const rb=document.getElementById('gf-result');
    if(win){
      const prize=betAmt*3;
      addCoins(prize,'Go Fish');
      rb.textContent='🎉 You win! '+playerBooks.length+' books vs '+cpuBooks.length+' · +'+fmtCoins(prize)+' coins! (net +'+fmtCoins(prize-betAmt)+')';
      rb.className='result-banner win'; playSound('bigwin'); recordResult(true);
      if(playerBooks.length>=1) unlockAchievement('fish_book');
    } else if(tie){
      addCoins(betAmt,'Go Fish tie');
      rb.textContent='🤝 Tie! '+playerBooks.length+' books each · Bet of '+fmtCoins(betAmt)+' returned.';
      rb.className='result-banner push'; playSound('click'); recordResult(false);
    } else {
      trackLoss(betAmt);
      rb.textContent='😔 CPU wins. '+playerBooks.length+' vs '+cpuBooks.length+' books. Lost '+fmtCoins(betAmt)+' coins.';
      rb.className='result-banner lose'; playSound('lose'); recordResult(false);
    }
    document.getElementById('gf-start-btn').style.display='block';
    document.getElementById('gf-ask-btn').disabled=true;
  }
  window.startGoFish=async function(){
    if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    betAmt=currentBet;
    await saveUserData({coins:(userData.coins||0)-betAmt});
    deck=shuffleDeck(newDeck()); playerHand=[]; cpuHand=[]; playerBooks=[]; cpuBooks=[]; selectedRank=null; gameActive=true; playerTurn=true;
    for(let i=0;i<7;i++){playerHand.push(deck.pop());cpuHand.push(deck.pop());}
    checkBooks(playerHand,playerBooks); checkBooks(cpuHand,cpuBooks);
    document.getElementById('gf-result').className='result-banner';
    document.getElementById('gf-start-btn').style.display='none';
    document.getElementById('gf-ask-btn').disabled=false;
    lockBets(true);
    playSound('deal'); render('Game started! Pick a card rank and ask the CPU.');
  };
  window.selectFishCard=function(rank){if(!gameActive||!playerTurn)return;selectedRank=rank;render(null);playSound('click');};
  window.askCpu=async function(){
    if(!gameActive||!playerTurn) return;
    if(playerHand.length===0){
      // Player has no cards — draw from deck or end game
      if(deck.length>0){
        const drawn=deck.pop();playerHand.push(drawn);checkBooks(playerHand,playerBooks);
        render('No cards in hand! Drew a '+drawn.rank+drawn.suit+'. Pick a card to ask for.');
      } else {
        render('No cards and deck is empty!');endGame();
      }
      return;
    }
    if(!selectedRank){toast('Select a card rank to ask for!');return;}
    document.getElementById('gf-ask-btn').disabled=true; playerTurn=false;
    const matches=cpuHand.filter(cd=>cd.rank===selectedRank); let msg='';
    if(matches.length>0){
      matches.forEach(cd=>{playerHand.push(cd);cpuHand.splice(cpuHand.indexOf(cd),1);});
      checkBooks(playerHand,playerBooks);
      msg='Got '+matches.length+' '+selectedRank+'(s) from CPU! '; playSound('coin');
      selectedRank=null;
      if(deck.length===0&&playerHand.length===0&&cpuHand.length===0){render(msg);endGame();return;}
      render(msg+'Your turn again!'); playerTurn=true; document.getElementById('gf-ask-btn').disabled=false;
    } else {
      if(deck.length>0){const drawn=deck.pop();playerHand.push(drawn);checkBooks(playerHand,playerBooks);msg='Go Fish! Drew a '+drawn.rank+drawn.suit+'. ';playSound('flip');}
      else msg='Go Fish! Deck is empty. ';
      selectedRank=null; render(msg+'CPU\'s turn...'); setTimeout(()=>{if(gameActive)cpuTurn();},1200);
    }
  };
  function cpuTurn(){
    if(cpuHand.length===0){if(deck.length===0){render('CPU has no cards. Game over!');endGame();return;}cpuHand.push(deck.pop());}
    const cpuRanks=[...new Set(cpuHand.map(cd=>cd.rank))];
    const askRank=cpuRanks[rand(0,cpuRanks.length-1)];
    const matches=playerHand.filter(cd=>cd.rank===askRank); let msg='CPU asked for '+askRank+'s... ';
    if(matches.length>0){
      matches.forEach(cd=>{cpuHand.push(cd);playerHand.splice(playerHand.indexOf(cd),1);});
      checkBooks(cpuHand,cpuBooks); msg+='Got '+matches.length+' from you! CPU goes again.';
      render(msg); if(gameActive&&deck.length+cpuHand.length>0) setTimeout(()=>{if(gameActive)cpuTurn();},1000);
    } else {
      if(deck.length>0){const drawn=deck.pop();cpuHand.push(drawn);checkBooks(cpuHand,cpuBooks);msg+='Go Fish! Drew from deck.';}
      else msg+='Go Fish! Deck empty.';
      render(msg+' Your turn!'); playerTurn=true; document.getElementById('gf-ask-btn').disabled=false;
    }
    if(deck.length===0&&playerHand.length===0&&cpuHand.length===0) endGame();
  }
}

// ════════════════════════════════════════════════
// GAME: FLAPPY BET
// ════════════════════════════════════════════════
function buildFlappy(c){
  let gameRunning=false,gameOver=false,betPlaced=false,bird,pipes,frame,score,multiplier,animId,countdownActive=false;
  const W=480,H=500,PIPE_W=60,PIPE_GAP=160,PIPE_SPEED=3,GRAVITY=0.45,FLAP_FORCE=-8;
  const MULT_TABLE=[{pipes:1,mult:1.5},{pipes:3,mult:2},{pipes:5,mult:3},{pipes:8,mult:5},{pipes:10,mult:8},{pipes:15,mult:12},{pipes:20,mult:20},{pipes:25,mult:35},{pipes:30,mult:50}];
  function getCurrentMult(pipes){let m=1;for(const row of MULT_TABLE){if(pipes>=row.pipes)m=row.mult;}return m;}
  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">🐦 Flappy Bet</div>
    <div class="game-subtitle">Bet upfront · Multiplier grows the longer you survive · Cash out anytime!</div>
    <div id="fl-bet"></div>
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:10px;flex-wrap:wrap;">
      <button class="btn btn-green" id="fl-start-btn" onclick="flappyStart()" style="max-width:160px;"><span class="btn-text">Start!</span></button>
      <button class="btn btn-gold" id="fl-cashout-btn" onclick="flappyCashout()" style="max-width:160px;display:none;"><span class="btn-text">Cash Out!</span></button>
      <div style="font-size:.85rem;font-weight:900;color:var(--gold);min-width:120px;" id="fl-mult-display">Multiplier: —</div>
    </div>
    <div style="position:relative;display:inline-block;width:100%;"><canvas id="flappy-canvas" width="${W}" height="${H}" style="border-radius:12px;border:1px solid var(--border);display:block;margin:0 auto;cursor:pointer;" onclick="flappyFlap()"></canvas></div>
    <div class="result-banner" id="fl-result"></div>
    ${buildInfoCard('Flappy Bet — Multiplier Table', [
      ['1 pipe','1.5x'],['3 pipes','2x'],['5 pipes','3x'],
      ['8 pipes','5x'],['10 pipes','8x'],['15 pipes','12x'],
      ['20 pipes','20x'],['25 pipes','35x'],['30+ pipes','50x'],
    ], '<strong>Tip:</strong> Cash out before you crash! Multiplier only grows as you pass more pipes. Click the canvas or press Space to flap. Payouts are total coins returned on your bet.')}
  </div>`;
  buildBetPanel(document.getElementById('fl-bet'));
  const canvas=document.getElementById('flappy-canvas'); const ctx=canvas.getContext('2d');
  const keyHandler=function(e){if((e.code==='Space'||e.key===' ')&&gameRunning&&!countdownActive) flappyFlap();};
  document.addEventListener('keydown',keyHandler);
  function initGame(){bird={x:80,y:H/2,vy:0,radius:16};pipes=[];frame=0;score=0;multiplier=1;gameOver=false;gameRunning=false;}
  function drawGame(){
    const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#020a20');sky.addColorStop(1,'#030515');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
    ctx.fillStyle='rgba(255,255,255,.3)';for(let i=0;i<30;i++){const sx=(i*137+frame*0.2)%W,sy=(i*79)%H;ctx.beginPath();ctx.arc(sx,sy,0.8,0,Math.PI*2);ctx.fill();}
    ctx.fillStyle='#0a1a0a';ctx.fillRect(0,H-30,W,30);ctx.fillStyle='#1a3a1a';ctx.fillRect(0,H-32,W,4);
    for(const p of pipes){const topGrad=ctx.createLinearGradient(p.x,0,p.x+PIPE_W,0);topGrad.addColorStop(0,'#1a4a1a');topGrad.addColorStop(0.5,'#2d8a2d');topGrad.addColorStop(1,'#1a4a1a');ctx.fillStyle=topGrad;ctx.fillRect(p.x,0,PIPE_W,p.topH);ctx.fillStyle='#3aa83a';ctx.fillRect(p.x-4,p.topH-20,PIPE_W+8,20);const botY=p.topH+PIPE_GAP;ctx.fillStyle=topGrad;ctx.fillRect(p.x,botY,PIPE_W,H-botY-30);ctx.fillStyle='#3aa83a';ctx.fillRect(p.x-4,botY,PIPE_W+8,20);}
    const bx=bird.x,by=bird.y,r=bird.radius;const angle=Math.min(Math.max(bird.vy*0.08,-0.5),0.8);ctx.save();ctx.translate(bx,by);ctx.rotate(angle);const bGrad=ctx.createRadialGradient(-2,-2,2,0,0,r);bGrad.addColorStop(0,'#ffe066');bGrad.addColorStop(0.7,'#ffaa00');bGrad.addColorStop(1,'#cc7700');ctx.fillStyle=bGrad;ctx.beginPath();ctx.ellipse(0,0,r,r*0.85,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffcc00';ctx.beginPath();ctx.ellipse(-4,4,r*0.6,r*0.35,0.3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(r*0.4,-r*0.2,r*0.28,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(r*0.48,-r*0.18,r*0.15,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ff8800';ctx.beginPath();ctx.moveTo(r*0.8,0);ctx.lineTo(r*1.3,r*0.1);ctx.lineTo(r*0.8,r*0.25);ctx.closePath();ctx.fill();ctx.restore();
    ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(8,8,220,52);ctx.fillStyle='#fff';ctx.font='bold 14px Montserrat';ctx.textAlign='left';ctx.fillText('Pipes: '+score,16,28);const cm=getCurrentMult(score);ctx.fillStyle='#ffdd00';ctx.fillText('Mult: '+cm+'x  →  '+fmtCoins(Math.floor(currentBet*cm)),16,48);
  }
  function gameLoop(){
    if(!gameRunning) return; frame++;
    if(frame%90===0){const topH=rand(60,H-PIPE_GAP-80);pipes.push({x:W,topH,passed:false});}
    for(const p of pipes){p.x-=PIPE_SPEED;if(!p.passed&&p.x+PIPE_W<bird.x){p.passed=true;score++;multiplier=getCurrentMult(score);playSound('pipe');document.getElementById('fl-mult-display').textContent='Multiplier: '+multiplier+'x';if(score>=10)unlockAchievement('flappy_10');if(score>=25)unlockAchievement('flappy_25');}}
    pipes=pipes.filter(p=>p.x+PIPE_W>0);bird.vy+=GRAVITY;bird.y+=bird.vy;
    const bLeft=bird.x-bird.radius,bRight=bird.x+bird.radius,bTop=bird.y-bird.radius,bBottom=bird.y+bird.radius;
    if(bBottom>=H-30||bTop<=0){crash();return;}
    for(const p of pipes){if(bRight>p.x&&bLeft<p.x+PIPE_W){if(bTop<p.topH||bBottom>p.topH+PIPE_GAP){crash();return;}}}
    drawGame(); animId=requestAnimationFrame(gameLoop);
  }
  function drawCountdown(num){
    drawGame();
    ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 90px Montserrat';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.shadowColor='rgba(0,200,255,.8)';ctx.shadowBlur=40;
    ctx.fillText(num===0?'GO!':String(num),W/2,H/2);
    ctx.shadowBlur=0;
    ctx.font='bold 18px Montserrat';ctx.fillStyle='rgba(255,255,255,.55)';
    ctx.fillText('Get Ready!',W/2,H/2+70);
  }
  function startCountdown(callback){
    countdownActive=true;let count=3;drawCountdown(count);playSound('click');
    const iv=setInterval(()=>{
      count--;
      if(count===0){drawCountdown(0);playSound('win');setTimeout(()=>{countdownActive=false;clearInterval(iv);callback();},600);}
      else{drawCountdown(count);playSound('click');}
    },800);
  }
  function crash(){
    gameRunning=false;gameOver=true;playSound('hit');
    ctx.fillStyle='rgba(255,0,0,.3)';ctx.fillRect(0,0,W,H);
    setTimeout(()=>{drawGame();ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(0,0,W,H);ctx.fillStyle='#ff4444';ctx.font='bold 36px Montserrat';ctx.textAlign='center';ctx.fillText('CRASHED!',W/2,H/2-20);ctx.fillStyle='#fff';ctx.font='bold 18px Montserrat';ctx.fillText('Pipes: '+score,W/2,H/2+20);},100);
    const rb=document.getElementById('fl-result');
    rb.textContent='💥 Crashed after '+score+' pipes! Lost '+fmtCoins(currentBet)+' coins.';
    rb.className='result-banner lose';
    document.getElementById('fl-cashout-btn').style.display='none';
    document.getElementById('fl-start-btn').style.display='block';
    document.getElementById('fl-mult-display').textContent='Multiplier: —';
    lockBets(false);
    trackLoss(currentBet);
    playSound('lose'); recordResult(false);
  }
  window.flappyFlap=function(){if(!gameRunning||countdownActive)return;bird.vy=FLAP_FORCE;playSound('flap');};
  window.flappyStart=async function(){
    if(gameRunning||countdownActive) return;
    if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    await saveUserData({coins:(userData.coins||0)-currentBet});
    document.getElementById('fl-result').className='result-banner';
    document.getElementById('fl-start-btn').style.display='none';
    document.getElementById('fl-cashout-btn').style.display='block';
    document.getElementById('fl-mult-display').textContent='Multiplier: 1x';
    lockBets(true);
    betPlaced=true; initGame();
    startCountdown(()=>{gameRunning=true;animId=requestAnimationFrame(gameLoop);});
  };
  window.flappyCashout=async function(){
    if(!gameRunning||gameOver||score===0){if(score===0)toast('Pass at least 1 pipe first!');return;}
    gameRunning=false; cancelAnimationFrame(animId);
    const mult=getCurrentMult(score); const payout=Math.floor(currentBet*mult);
    await addCoins(payout,'Flappy Bet');
    const rb=document.getElementById('fl-result');
    rb.textContent='💰 Cashed out! '+score+' pipes · '+mult+'x · +'+fmtCoins(payout)+' coins!';
    rb.className='result-banner win';
    document.getElementById('fl-cashout-btn').style.display='none';
    document.getElementById('fl-start-btn').style.display='block';
    document.getElementById('fl-mult-display').textContent='Multiplier: —';
    lockBets(false);
    playSound(mult>=5?'bigwin':'win'); await recordResult(true);
    if(payout>=10000) unlockAchievement('big_win');
  };
  const origShow=window.showScreen;
  window.showScreen=function(id){
    document.removeEventListener('keydown',keyHandler);
    if(animId) cancelAnimationFrame(animId);
    gameRunning=false; window.showScreen=origShow; origShow(id);
  };
  ctx.fillStyle='#020a20';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='rgba(255,255,255,.7)';ctx.font='bold 22px Montserrat';ctx.textAlign='center';ctx.fillText('🐦 Press Start to Play!',W/2,H/2-10);
  ctx.fillStyle='rgba(255,255,255,.4)';ctx.font='14px Montserrat';ctx.fillText('Click / Space to flap',W/2,H/2+20);
}

// ════════════════════════════════════════════════
// GAME: COIN FLIP
// ════════════════════════════════════════════════
function buildCoinFlip(c){
  let flipping=false, streak=0, coinFlipWins=0;
  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">🪙 Coin Flip</div>
    <div class="game-subtitle">50/50 · Build a streak for massive multipliers!</div>
    <div id="cf-bet"></div>
    <div style="display:flex;gap:16px;margin:20px 0;flex-wrap:wrap;">
      <button class="btn btn-green" id="cf-heads" onclick="flipCoin('heads',this)" style="max-width:160px;font-size:1.1rem;"><span class="btn-text">👑 Heads</span></button>
      <button class="btn btn-red" id="cf-tails" onclick="flipCoin('tails',this)" style="max-width:160px;font-size:1.1rem;"><span class="btn-text">🪙 Tails</span></button>
    </div>
    <div class="coin-display" id="coin-display">🪙</div>
    <div style="font-size:.85rem;color:var(--gold);font-weight:800;text-align:center;margin-bottom:8px;" id="cf-streak">Streak: 0</div>
    <div class="result-banner" id="cf-result"></div>
    ${buildInfoCard('Coin Flip Payouts (total return on bet)', [
      ['Win, no streak','1.5x your bet'],
      ['Win streak x3','2.5x your bet'],
      ['Win streak x5','4x your bet'],
      ['Win streak x7','8x your bet'],
      ['Loss','Lose your bet, streak resets to 0'],
    ], '<strong>Tip:</strong> Each win adds to your streak. Streaks carry over between flips — keep winning to unlock bigger multipliers! Payouts are total coins returned.')}
  </div>`;
  buildBetPanel(document.getElementById('cf-bet'));
  window.flipCoin=async function(choice, btn){
    if(flipping) return;
    if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    flipping=true; lockBets(true);
    ['cf-heads','cf-tails'].forEach(id=>document.getElementById(id).disabled=true);
    await saveUserData({coins:(userData.coins||0)-currentBet});
    document.getElementById('cf-result').className='result-banner';
    const coinEl=document.getElementById('coin-display');
    let t=0; const iv=setInterval(()=>{coinEl.textContent=t%2===0?'👑':'🪙';coinEl.style.transform='rotateY('+t*60+'deg)';t++;},80);
    setTimeout(async()=>{
      clearInterval(iv);
      const result=Math.random()<0.5?'heads':'tails';
      coinEl.textContent=result==='heads'?'👑':'🪙'; coinEl.style.transform='rotateY(0)';
      const won=result===choice; const rb=document.getElementById('cf-result');
      if(won){
        streak++; coinFlipWins++;
        let mult=1.5;
        if(streak>=7) mult=8; else if(streak>=5) mult=4; else if(streak>=3) mult=2.5;
        const payout=Math.floor(currentBet*mult);
        await addCoins(payout,'Coin Flip');
        rb.textContent='🎉 '+result.toUpperCase()+'! '+mult+'x · +'+fmtCoins(payout)+' returned! (net +'+fmtCoins(payout-currentBet)+') Streak: '+streak;
        rb.className='result-banner win'; playSound(streak>=3?'bigwin':'win'); await recordResult(true);
        if(payout>=10000) unlockAchievement('big_win');
        if(coinFlipWins>=10) unlockAchievement('coin_flip_10');
      } else {
        streak=0;
        await trackLoss(currentBet);
        rb.textContent='😔 '+result.toUpperCase()+'! Lost '+fmtCoins(currentBet)+' coins. Streak reset.';
        rb.className='result-banner lose'; playSound('lose'); await recordResult(false);
      }
      document.getElementById('cf-streak').textContent='Streak: '+streak+(streak>=3?' 🔥':'');
      flipping=false; lockBets(false);
      ['cf-heads','cf-tails'].forEach(id=>document.getElementById(id).disabled=false);
    },1200);
  };
}

// ════════════════════════════════════════════════
// GAME: MINESWEEPER
// ════════════════════════════════════════════════
function buildMinesweeper(c){
  const GRID=5, MINES=5, TOTAL=GRID*GRID;
  let grid=[], revealed=0, gameActive=false, betPaid=false, tilesCleared=0, betAmt=0;
  function getMult(safe){const m=[0,1.1,1.3,1.6,2,2.5,3.2,4,5,6.5,8,10,13,17,22,28,36,46,60,80,100];return m[Math.min(safe,m.length-1)];}
  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">💣 Minesweeper</div>
    <div class="game-subtitle">Reveal safe tiles · Avoid 5 bombs · Cash out anytime!</div>
    <div id="ms-bet"></div>
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:14px;">
      <button class="btn btn-green" id="ms-start-btn" onclick="startMine()" style="max-width:160px;"><span class="btn-text">New Game</span></button>
      <button class="btn btn-gold" id="ms-cashout-btn" onclick="mineCashout()" style="max-width:160px;" disabled><span class="btn-text">Cash Out</span></button>
      <div style="font-size:.85rem;font-weight:800;color:var(--gold);" id="ms-mult-display">—</div>
    </div>
    <div class="mine-grid" id="mine-grid"></div>
    <div class="result-banner" id="ms-result"></div>
    ${buildInfoCard('Minesweeper Multipliers (total return on bet)', [
      ['1 safe tile','1.1x'],['2 tiles','1.3x'],['3 tiles','1.6x'],['4 tiles','2x'],
      ['5 tiles','2.5x'],['8 tiles','5x'],['10 tiles','8x'],
      ['15 tiles','28x'],['20 safe tiles','100x'],
      ['Hit a bomb','Lose everything'],
    ], '<strong>Tip:</strong> 5×5 grid, 5 bombs = 20 safe tiles. Cash out often! The multiplier jumps significantly at 10+ tiles. Payouts are total coins returned on your bet.')}
  </div>`;
  buildBetPanel(document.getElementById('ms-bet'));
  function initGrid(){
    grid=Array.from({length:TOTAL},(_,i)=>({idx:i,mine:false,revealed:false}));
    let placed=0; while(placed<MINES){const i=rand(0,TOTAL-1);if(!grid[i].mine){grid[i].mine=true;placed++;}}
  }
  function renderGrid(){
    const container=document.getElementById('mine-grid'); container.innerHTML='';
    grid.forEach((cell,i)=>{
      const btn=document.createElement('button');
      btn.className='mine-cell'+(cell.revealed?(cell.mine?' mine-bomb':' mine-safe'):'');
      if(cell.revealed){btn.textContent=cell.mine?'💣':'✅';btn.disabled=true;}
      else{btn.textContent='?';if(gameActive) btn.onclick=()=>revealCell(i);}
      container.appendChild(btn);
    });
  }
  async function revealCell(i){
    if(!gameActive||grid[i].revealed) return;
    grid[i].revealed=true;
    if(grid[i].mine){
      gameActive=false; grid.forEach(c=>{if(c.mine)c.revealed=true;}); renderGrid();
      const rb=document.getElementById('ms-result');
      rb.textContent='💥 BOOM! You hit a mine! Lost '+fmtCoins(betAmt)+' coins.';
      rb.className='result-banner lose';
      document.getElementById('ms-cashout-btn').disabled=true;
      document.getElementById('ms-start-btn').disabled=false;
      lockBets(false);
      await trackLoss(betAmt);
      playSound('lose'); await recordResult(false); tilesCleared=0;
    } else {
      revealed++; tilesCleared++; renderGrid(); playSound('coin');
      const mult=getMult(revealed);
      document.getElementById('ms-mult-display').textContent='Mult: '+mult+'x  →  '+coinSymbol+' '+fmtCoins(Math.floor(betAmt*mult));
      document.getElementById('ms-cashout-btn').disabled=false;
      if(revealed===TOTAL-MINES){
        gameActive=false; const payout=Math.floor(betAmt*getMult(revealed));
        await addCoins(payout,'Minesweeper');
        document.getElementById('ms-result').textContent='🎉 All safe tiles found! +'+fmtCoins(payout)+' coins! (net +'+fmtCoins(payout-betAmt)+')';
        document.getElementById('ms-result').className='result-banner win';
        document.getElementById('ms-cashout-btn').disabled=true;
        document.getElementById('ms-start-btn').disabled=false;
        lockBets(false);
        playSound('bigwin'); await recordResult(true);
        if(payout>=10000) unlockAchievement('big_win');
      }
      if(tilesCleared>=20) unlockAchievement('mine_sweep');
    }
  }
  window.startMine=async function(){
    if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    betAmt=currentBet;
    await saveUserData({coins:(userData.coins||0)-betAmt});
    initGrid(); revealed=0; gameActive=true; betPaid=true;
    document.getElementById('ms-result').className='result-banner';
    document.getElementById('ms-cashout-btn').disabled=true;
    document.getElementById('ms-start-btn').disabled=false;
    document.getElementById('ms-mult-display').textContent='Pick a tile!';
    lockBets(true);
    renderGrid(); playSound('click');
  };
  window.mineCashout=async function(){
    if(!gameActive||revealed===0){toast('Reveal at least 1 tile first!');return;}
    gameActive=false; const mult=getMult(revealed); const payout=Math.floor(betAmt*mult);
    await addCoins(payout,'Minesweeper');
    grid.forEach(c=>{if(c.mine)c.revealed=true;}); renderGrid();
    document.getElementById('ms-result').textContent='💰 Cashed out! '+revealed+' tiles · '+mult+'x · +'+fmtCoins(payout)+' coins! (net +'+fmtCoins(payout-betAmt)+')';
    document.getElementById('ms-result').className='result-banner win';
    document.getElementById('ms-cashout-btn').disabled=true;
    document.getElementById('ms-start-btn').disabled=false;
    document.getElementById('ms-mult-display').textContent='—';
    lockBets(false);
    playSound(mult>=5?'bigwin':'win'); await recordResult(true);
  };
  renderGrid();
}

// ════════════════════════════════════════════════
// GAME: HORSE RACING
// ════════════════════════════════════════════════
function buildHorseRace(c){
  const HORSES=[
    {name:'Thunder', emoji:'🐎',color:'#ff4444',odds:2},
    {name:'Lightning',emoji:'🏇',color:'#ffaa00',odds:3},
    {name:'Storm',   emoji:'🐴',color:'#44aaff',odds:4},
    {name:'Blaze',   emoji:'🦄',color:'#aa44ff',odds:5},
    {name:'Shadow',  emoji:'🐎',color:'#888888',odds:8},
  ];
  let racing=false, picked=null, animId=null;
  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">🐎 Horse Racing</div>
    <div class="game-subtitle">Pick a horse · Watch the race · Higher odds = bigger win!</div>
    <div id="hr-bet"></div>
    <div class="horse-choices" id="horse-choices">
      ${HORSES.map((h,i)=>`<button class="horse-btn" onclick="pickHorse(${i},this)"><span style="font-size:1.5rem;">${h.emoji}</span><span style="font-weight:800;">${h.name}</span><span style="color:var(--gold);font-size:.75rem;">${h.odds}x odds</span></button>`).join('')}
    </div>
    <div id="hr-pick-label" style="font-size:.85rem;font-weight:800;color:var(--gold);margin:8px 0;min-height:20px;"></div>
    <canvas id="horse-canvas" width="560" height="200" style="border-radius:12px;border:1px solid var(--border);display:block;margin:0 auto;"></canvas>
    <div class="result-banner" id="hr-result"></div>
    <button class="btn" id="hr-race-btn" onclick="startRace()" style="max-width:200px;margin-top:12px;"><span class="btn-text">Start Race!</span></button>
    ${buildInfoCard('Horse Racing Payouts (total return on bet)', [
      ['Thunder (favourite)','2x your bet'],['Lightning','3x your bet'],
      ['Storm','4x your bet'],['Blaze','5x your bet'],
      ['Shadow (longshot)','8x your bet'],
      ['Pick the loser','Lose your bet'],
    ], '<strong>Tip:</strong> Odds reflect win probability — Thunder wins ~35% of the time. Shadow only wins ~10%, but pays 8x. Win chance is weighted by 1/odds ratio. Payouts are total coins returned.')}
  </div>`;
  buildBetPanel(document.getElementById('hr-bet'));
  const canvas=document.getElementById('horse-canvas'); const ctx=canvas.getContext('2d');
  const W=560,H=200; let positions=[0,0,0,0,0],speeds=[];
  function drawRace(){
    ctx.fillStyle='#0a1a00'; ctx.fillRect(0,0,W,H);
    HORSES.forEach((h,i)=>{
      const y=20+i*36;
      ctx.fillStyle='rgba(0,50,0,.35)'; ctx.fillRect(0,y,W,30);
      ctx.strokeStyle='rgba(255,255,255,.12)'; ctx.lineWidth=1; ctx.strokeRect(0,y,W,30);
      ctx.strokeStyle='rgba(255,255,255,.65)'; ctx.setLineDash([4,4]);
      ctx.beginPath(); ctx.moveTo(W-20,y); ctx.lineTo(W-20,y+30); ctx.stroke(); ctx.setLineDash([]);
      const px=30+positions[i]*(W-60);
      ctx.font='20px serif'; ctx.textAlign='left'; ctx.fillText(h.emoji,px,y+22);
      ctx.font='bold 10px Montserrat'; ctx.fillStyle=h.color; ctx.fillText(h.name,Math.max(0,px-10),y+34);
    });
    ctx.fillStyle='rgba(255,255,255,.8)'; ctx.font='bold 11px Montserrat'; ctx.textAlign='right'; ctx.fillText('FINISH',W-4,14);
  }
  window.pickHorse=function(i,btn){
    picked=i; document.querySelectorAll('.horse-btn').forEach(b=>b.classList.remove('selected')); btn.classList.add('selected');
    document.getElementById('hr-pick-label').textContent='Betting on: '+HORSES[i].emoji+' '+HORSES[i].name+' ('+HORSES[i].odds+'x)';
    playSound('click');
  };
  window.startRace=async function(){
    if(racing) return;
    if(picked===null){toast('Pick a horse first!');return;}
    if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    const betAmt=currentBet;
    await saveUserData({coins:(userData.coins||0)-betAmt});
    racing=true; positions=[0,0,0,0,0];
    document.getElementById('hr-race-btn').disabled=true;
    document.getElementById('hr-result').className='result-banner';
    lockBets(true);
    const totalWeight=HORSES.reduce((s,h)=>s+1/h.odds,0);
    let r=Math.random()*totalWeight; let winner=0;
    for(let i=0;i<HORSES.length;i++){r-=1/HORSES[i].odds;if(r<=0){winner=i;break;}}
    speeds=HORSES.map((_,i)=>{const base=0.006+Math.random()*0.008;return i===winner?base+0.002:base;});
    function raceLoop(){
      positions=positions.map((p,i)=>Math.min(p+speeds[i]*(0.8+Math.random()*0.4),1));
      if(Math.random()<0.3) playSound('horse_gallop');
      drawRace();
      const finishedIdx=positions.findIndex(p=>p>=1);
      if(finishedIdx>=0){
        racing=false; cancelAnimationFrame(animId);
        const rb=document.getElementById('hr-result');
        if(finishedIdx===picked){
          const payout=betAmt*HORSES[picked].odds;
          addCoins(payout,'Horse Racing');
          rb.textContent='🎉 '+HORSES[finishedIdx].name+' wins! '+HORSES[picked].odds+'x · +'+fmtCoins(payout)+' coins! (net +'+fmtCoins(payout-betAmt)+')';
          rb.className='result-banner win'; playSound('bigwin'); recordResult(true);
          unlockAchievement('horse_win'); if(payout>=10000) unlockAchievement('big_win');
        } else {
          trackLoss(betAmt);
          rb.textContent='😔 '+HORSES[finishedIdx].name+' wins! Your horse '+HORSES[picked].name+' lost. Lost '+fmtCoins(betAmt)+' coins.';
          rb.className='result-banner lose'; playSound('lose'); recordResult(false);
        }
        lockBets(false);
        document.getElementById('hr-race-btn').disabled=false; return;
      }
      animId=requestAnimationFrame(raceLoop);
    }
    drawRace(); animId=requestAnimationFrame(raceLoop);
  };
  drawRace();
}

// ════════════════════════════════════════════════
// GAME: HIGHER OR LOWER
// ════════════════════════════════════════════════
function buildHigherLow(c){
  let deck=[],currentCard=null,streak=0,gameActive=false,betAmt=0;
  function getMultForStreak(s){const m=[0,1.5,2,3,4.5,6.5,10,15,22,35,55];return m[Math.min(s,m.length-1)];}
  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">🎯 Higher or Lower</div>
    <div class="game-subtitle">Guess if the next card is higher or lower · Build your streak!</div>
    <div id="hl-bet"></div>
    <div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap;margin:16px 0;">
      <div id="hl-current-card" style="min-width:80px;"></div>
      <div style="flex:1;">
        <div style="font-size:.8rem;color:var(--muted);">Current streak:</div>
        <div style="font-size:1.6rem;font-weight:900;color:var(--gold);" id="hl-streak">0</div>
        <div style="font-size:.75rem;color:var(--muted);" id="hl-potential">Potential: —</div>
      </div>
    </div>
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px;">
      <button class="btn btn-green" id="hl-start-btn" onclick="hlStart()" style="max-width:160px;"><span class="btn-text">Deal Card</span></button>
      <button class="btn" id="hl-higher-btn" onclick="hlGuess('higher')" style="max-width:140px;" disabled><span class="btn-text">⬆️ Higher</span></button>
      <button class="btn btn-red" id="hl-lower-btn" onclick="hlGuess('lower')" style="max-width:140px;" disabled><span class="btn-text">⬇️ Lower</span></button>
      <button class="btn btn-gold" id="hl-cashout-btn" onclick="hlCashout()" style="max-width:140px;" disabled><span class="btn-text">💰 Cash Out</span></button>
    </div>
    <div class="result-banner" id="hl-result"></div>
    ${buildInfoCard('Higher or Lower Multipliers (total return on bet)', [
      ['Streak 1','1.5x'],['Streak 2','2x'],['Streak 3','3x'],
      ['Streak 4','4.5x'],['Streak 5','6.5x'],['Streak 6','10x'],
      ['Streak 7','15x'],['Streak 8','22x'],['Streak 9','35x'],
      ['Streak 10+','55x'],
    ], '<strong>Tip:</strong> Ace is low, King is high. Ties count as correct! Cash out before you guess wrong to lock in your multiplier. Payouts are total coins returned on your bet.')}
  </div>`;
  buildBetPanel(document.getElementById('hl-bet'));
  window.hlStart=async function(){
    if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    deck=shuffleDeck(newDeck());
    betAmt=currentBet;
    await saveUserData({coins:(userData.coins||0)-betAmt});
    currentCard=deck.pop(); streak=0; gameActive=true;
    document.getElementById('hl-current-card').innerHTML=cardHTML(currentCard);
    document.getElementById('hl-streak').textContent='0';
    document.getElementById('hl-potential').textContent='Potential: —';
    document.getElementById('hl-result').className='result-banner';
    ['hl-higher-btn','hl-lower-btn'].forEach(id=>document.getElementById(id).disabled=false);
    document.getElementById('hl-cashout-btn').disabled=true;
    document.getElementById('hl-start-btn').disabled=true;
    lockBets(true);
    playSound('deal');
  };
  window.hlGuess=async function(guess){
    if(!gameActive) return;
    ['hl-higher-btn','hl-lower-btn','hl-cashout-btn'].forEach(id=>document.getElementById(id).disabled=true);
    const prevRank=RANKS.indexOf(currentCard.rank);
    const nextCard=deck.pop(); const nextRank=RANKS.indexOf(nextCard.rank);
    currentCard=nextCard; document.getElementById('hl-current-card').innerHTML=cardHTML(currentCard); playSound('flip');
    let correct=false;
    if(guess==='higher'&&nextRank>=prevRank) correct=true;
    else if(guess==='lower'&&nextRank<=prevRank) correct=true;
    const rb=document.getElementById('hl-result');
    if(correct){
      streak++; const mult=getMultForStreak(streak); const potential=Math.floor(betAmt*mult);
      document.getElementById('hl-streak').textContent=streak;
      document.getElementById('hl-potential').textContent='Potential: '+coinSymbol+' '+fmtCoins(potential);
      rb.textContent='✅ Correct! '+nextCard.rank+nextCard.suit+' · Streak: '+streak+' · '+mult+'x potential';
      rb.className='result-banner win'; playSound('coin');
      ['hl-higher-btn','hl-lower-btn'].forEach(id=>document.getElementById(id).disabled=false);
      document.getElementById('hl-cashout-btn').disabled=false;
      if(streak>=5) unlockAchievement('higher_streak');
      if(deck.length===0){hlCashout();return;}
    } else {
      gameActive=false;
      lockBets(false);
      await trackLoss(betAmt);
      rb.textContent='❌ Wrong! '+nextCard.rank+nextCard.suit+' — streak broken at '+streak+'. Lost '+fmtCoins(betAmt)+' coins.';
      rb.className='result-banner lose'; playSound('lose'); await recordResult(false);
      streak=0; document.getElementById('hl-streak').textContent='0';
      document.getElementById('hl-potential').textContent='—';
      document.getElementById('hl-start-btn').disabled=false;
    }
  };
  window.hlCashout=async function(){
    if(!gameActive||streak===0){toast('Get at least 1 correct first!');return;}
    gameActive=false; lockBets(false); const mult=getMultForStreak(streak); const payout=Math.floor(betAmt*mult);
    await addCoins(payout,'Higher or Lower');
    document.getElementById('hl-result').textContent='💰 Cashed out! Streak '+streak+' · '+mult+'x · +'+fmtCoins(payout)+' coins! (net +'+fmtCoins(payout-betAmt)+')';
    document.getElementById('hl-result').className='result-banner win';
    ['hl-higher-btn','hl-lower-btn','hl-cashout-btn'].forEach(id=>document.getElementById(id).disabled=true);
    document.getElementById('hl-start-btn').disabled=false;
    playSound(mult>=5?'bigwin':'win'); await recordResult(true);
    if(payout>=10000) unlockAchievement('big_win');
  };
}

// ════════════════════════════════════════════════
// GAME: WHEEL OF FORTUNE  (fixed angle math)
// ════════════════════════════════════════════════
function buildWheelFortune(c){
  const SEGMENTS=[
    {label:'0.5x', mult:0.5, color:'#660000'},
    {label:'1.5x', mult:1.5, color:'#003366'},
    {label:'2x',   mult:2,   color:'#004400'},
    {label:'BUST', mult:0,   color:'#440000'},
    {label:'3x',   mult:3,   color:'#005588'},
    {label:'1.5x', mult:1.5, color:'#003366'},
    {label:'BUST', mult:0,   color:'#440000'},
    {label:'2x',   mult:2,   color:'#004400'},
    {label:'5x',   mult:5,   color:'#886600'},
    {label:'BUST', mult:0,   color:'#440000'},
    {label:'1x',   mult:1,   color:'#002244'},
    {label:'BUST', mult:0,   color:'#440000'},
    {label:'10x',  mult:10,  color:'#aa4400'},
    {label:'1.5x', mult:1.5, color:'#003366'},
    {label:'BUST', mult:0,   color:'#440000'},
    {label:'0.5x', mult:0.5, color:'#660000'},
    {label:'2x',   mult:2,   color:'#004400'},
    {label:'20x',  mult:20,  color:'#886600'},
    {label:'1x',   mult:1,   color:'#002244'},
    {label:'0.5x', mult:0.5, color:'#660000'},
  ];
  let spinning=false, currentAngle=0;
  const N=SEGMENTS.length;
  const SLICE=Math.PI*2/N;

  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">🎡 Wheel of Fortune</div>
    <div class="game-subtitle">Spin the wheel · Land on a multiplier · 25x jackpot slot!</div>
    <div id="wf-bet"></div>
    <div style="position:relative;display:flex;justify-content:center;align-items:center;flex-direction:column;">
      <div style="font-size:2rem;position:absolute;top:-8px;z-index:10;filter:drop-shadow(0 0 8px gold);">▼</div>
      <canvas id="wf-canvas" width="400" height="400" style="border-radius:50%;border:3px solid var(--gold);box-shadow:0 0 40px rgba(255,200,0,.4);"></canvas>
    </div>
    <div class="result-banner" id="wf-result" style="margin-top:16px;"></div>
    <button class="btn" id="wf-spin-btn" onclick="spinWheelFortune()" style="max-width:200px;margin-top:12px;"><span class="btn-text">Spin!</span></button>
    ${buildInfoCard('Wheel of Fortune Payouts (total return on bet)', [
      ['BUST (3 slots)','Lose your bet'],
      ['0.5x (2 slots)','Half your bet returned (partial loss)'],
      ['1x (1 slot)','Bet returned (no profit)'],
      ['1.5x (3 slots)','1.5× return'],
      ['2x (3 slots)','2× return'],
      ['3x (1 slot)','3× return'],
      ['5x (1 slot)','5× return'],
      ['10x (1 slot)','10× return'],
      ['25x — JACKPOT (1 slot)','25× return'],
    ], '<strong>Tip:</strong> The pointer at the top marks the winning segment. 0.5x and BUST show as a loss. Any result under 1x does not count as a win.')}
  </div>`;
  buildBetPanel(document.getElementById('wf-bet'));

  const canvas=document.getElementById('wf-canvas');
  const ctx=canvas.getContext('2d');
  const cx=200, cy=200, r=185;

  function drawWheel(angle){
    ctx.clearRect(0,0,400,400);
    for(let i=0;i<N;i++){
      const start=angle+i*SLICE, end=start+SLICE;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,start,end); ctx.closePath();
      ctx.fillStyle=SEGMENTS[i].color; ctx.fill();
      ctx.strokeStyle='rgba(255,200,0,.45)'; ctx.lineWidth=2; ctx.stroke();
      ctx.save(); ctx.translate(cx,cy); ctx.rotate(start+SLICE/2);
      ctx.textAlign='right'; ctx.fillStyle='#fff';
      ctx.font='bold '+(SEGMENTS[i].label.length>3?'11':'13')+'px Montserrat';
      ctx.fillText(SEGMENTS[i].label, r-10, 5);
      ctx.restore();
    }
    ctx.beginPath(); ctx.arc(cx,cy,20,0,Math.PI*2);
    ctx.fillStyle='#02020a'; ctx.fill();
    ctx.strokeStyle='var(--gold)'; ctx.lineWidth=3; ctx.stroke();
  }
  drawWheel(0);

  window.spinWheelFortune=async function(){
    if(spinning) return;
    if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    spinning=true; setLoading('wf-spin-btn',true,'Spinning...'); lockBets(true);
    document.getElementById('wf-result').className='result-banner';
    const betAmt=currentBet;
    await saveUserData({coins:(userData.coins||0)-betAmt});
    playSound('wheel_spin');

    // Pick a random winning segment index
    const winIndex=rand(0,N-1);

    // The pointer is at the TOP of the canvas which is -π/2 in canvas coordinates.
    // Segment i starts at angle: currentAngle + i*SLICE
    // We want segment winIndex's MIDDLE to be at the pointer (-π/2).
    // So we need: finalAngle + winIndex*SLICE + SLICE/2 = -π/2  (mod 2π)
    // => finalAngle = -π/2 - winIndex*SLICE - SLICE/2
    // Add extra full spins for drama, normalize so we always spin forward.
    const EXTRA_SPINS = 8;
    const targetAngleRaw = -Math.PI/2 - winIndex*SLICE - SLICE/2;
    // Make sure we always rotate forward (positive direction) from currentAngle
    let delta = (targetAngleRaw - currentAngle) % (Math.PI*2);
    // Normalize delta to be in range [0, 2π]
    if(delta <= 0) delta += Math.PI*2;
    const totalRotation = EXTRA_SPINS * Math.PI * 2 + delta;
    const startAngle = currentAngle;
    const finalAngle = startAngle + totalRotation;

    const DUR=4000, startT=Date.now();
    function easeOut(t){return 1-Math.pow(1-t,4);}
    function frame(){
      const elapsed=Date.now()-startT, progress=Math.min(elapsed/DUR,1);
      currentAngle=startAngle+totalRotation*easeOut(progress);
      drawWheel(currentAngle);
      if(progress<1){requestAnimationFrame(frame);}
      else{
        currentAngle=finalAngle;
        drawWheel(currentAngle);
        const seg=SEGMENTS[winIndex];
        const rb=document.getElementById('wf-result');
        spinning=false; setLoading('wf-spin-btn',false,'Spin!'); lockBets(false);
        if(seg.mult>=1){
          // 1x just returns stake, anything above is profit
          const payout=Math.floor(betAmt*seg.mult);
          const netGain = payout - betAmt;
          addCoins(payout,'Wheel of Fortune');
          rb.textContent='🎉 '+seg.label+'! +'+fmtCoins(payout)+' returned!'+(netGain>0?' (net +'+fmtCoins(netGain)+')':'');
          rb.className='result-banner win';
          playSound(seg.mult>=5?'bigwin':'win'); recordResult(true);
          if(payout>=10000) unlockAchievement('big_win');
          if(seg.mult>=20) unlockAchievement('wheel_jackpot');
        } else if(seg.mult>0){
          const payout=Math.floor(betAmt*seg.mult);
          if(payout>0) addCoins(payout,'Wheel partial');
          trackLoss(betAmt - payout);
          rb.textContent='😔 '+seg.label+' · Only '+fmtCoins(payout)+' of '+fmtCoins(betAmt)+' returned. (lost '+fmtCoins(betAmt-payout)+')';
          rb.className='result-banner lose'; playSound('lose'); recordResult(false);
        } else {
          trackLoss(betAmt);
          rb.textContent='💀 BUST! Lost '+fmtCoins(betAmt)+' coins.';
          rb.className='result-banner lose'; playSound('lose'); recordResult(false);
        }
      }
    }
    requestAnimationFrame(frame);
  };
}

// ════════════════════════════════════════════════
// GAME: TIC-TAC-TOE
// ════════════════════════════════════════════════
function buildTicTacToe(c){
  let board=Array(9).fill(null), gameActive=false, betAmt=0;
  const WIN_LINES=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">❌ Tic-Tac-Toe</div>
    <div class="game-subtitle">You are X · Beat the CPU (O) · Win = 2x · Draw = bet back</div>
    <div id="ttt-bet"></div>
    <div id="ttt-status" style="font-size:.85rem;font-weight:800;color:var(--gold);margin:10px 0 14px;min-height:22px;text-align:center;">Press Start to play!</div>
    <div class="ttt-grid" id="ttt-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:300px;margin:0 auto 16px;"></div>
    <div class="result-banner" id="ttt-result"></div>
    <button class="btn btn-green" id="ttt-start-btn" onclick="tttStart()" style="max-width:160px;margin-top:12px;"><span class="btn-text">Start Game</span></button>
    ${buildInfoCard('Tic-Tac-Toe Payouts', [
      ['Win (3 in a row)','2x your bet'],
      ['Draw (board full, no winner)','Bet returned'],
      ['Loss (CPU wins)','Lose your bet'],
    ], '<strong>Tip:</strong> CPU plays smart — it will try to win or block you. Take corners early!')}
  </div>`;
  buildBetPanel(document.getElementById('ttt-bet'));

  function checkWinner(b){
    for(const [a,bI,cI] of WIN_LINES){
      if(b[a]&&b[a]===b[bI]&&b[a]===b[cI]) return b[a];
    }
    return b.includes(null)?null:'draw';
  }

  function renderBoard(highlightLine=null){
    const grid=document.getElementById('ttt-grid'); if(!grid) return;
    grid.innerHTML=board.map((cell,i)=>{
      const inLine=highlightLine&&highlightLine.includes(i);
      const color=cell==='X'?'#4488ff':cell==='O'?'#ff4444':'rgba(255,255,255,.1)';
      return`<button onclick="tttMove(${i})" style="height:90px;border-radius:12px;border:2px solid ${inLine?'var(--gold)':cell?color:'rgba(0,0,255,.4)'};background:${inLine?'rgba(255,215,0,.15)':cell?color+'22':'rgba(0,0,50,.4)'};font-size:2.2rem;font-weight:900;color:${cell==='X'?'#4488ff':cell==='O'?'#ff4444':'rgba(255,255,255,.2)'};cursor:${gameActive&&!cell?'pointer':'default'};transition:all .15s;" ${!gameActive||cell?'disabled':''}>
        ${cell||'·'}
      </button>`;
    }).join('');
  }

  function cpuMove(){
    // Win if possible
    for(const [a,b,cI] of WIN_LINES){
      const line=[board[a],board[b],board[cI]];
      if(line.filter(x=>x==='O').length===2&&line.includes(null)){
        const idx=[a,b,cI][line.indexOf(null)]; return idx;
      }
    }
    // Block player
    for(const [a,b,cI] of WIN_LINES){
      const line=[board[a],board[b],board[cI]];
      if(line.filter(x=>x==='X').length===2&&line.includes(null)){
        const idx=[a,b,cI][line.indexOf(null)]; return idx;
      }
    }
    // Center
    if(!board[4]) return 4;
    // Corners
    const corners=[0,2,6,8].filter(i=>!board[i]);
    if(corners.length) return corners[Math.floor(Math.random()*corners.length)];
    // Any
    const empties=board.map((v,i)=>v===null?i:-1).filter(i=>i>=0);
    return empties[Math.floor(Math.random()*empties.length)];
  }

  function finishGame(winner){
    gameActive=false;
    const rb=document.getElementById('ttt-result');
    const status=document.getElementById('ttt-status');
    // Find winning line for highlight
    let winLine=null;
    for(const line of WIN_LINES){
      if(board[line[0]]&&board[line[0]]===board[line[1]]&&board[line[0]]===board[line[2]]){winLine=line;break;}
    }
    renderBoard(winLine);
    if(winner==='X'){
      const payout=betAmt*2;
      addCoins(payout,'Tic-Tac-Toe');
      rb.textContent='🎉 You win! +'+fmtCoins(payout)+' returned! (net +'+fmtCoins(payout-betAmt)+')';
      rb.className='result-banner win';
      status.textContent='You win! ✅';
      playSound('bigwin'); recordResult(true); unlockAchievement('ttt_win');
    } else if(winner==='draw'){
      addCoins(betAmt,'Tic-Tac-Toe draw');
      rb.textContent='🤝 Draw! Bet of '+fmtCoins(betAmt)+' returned.';
      rb.className='result-banner push';
      status.textContent='Draw! 🤝';
      playSound('click'); recordResult(false);
    } else {
      trackLoss(betAmt);
      rb.textContent='😔 CPU wins! Lost '+fmtCoins(betAmt)+' coins.';
      rb.className='result-banner lose';
      status.textContent='CPU wins! ❌';
      playSound('lose'); recordResult(false);
    }
    document.getElementById('ttt-start-btn').style.display='block'; lockBets(false);
  }

  window.tttMove=function(i){
    if(!gameActive||board[i]) return;
    board[i]='X'; playSound('click'); renderBoard();
    const res=checkWinner(board);
    if(res){finishGame(res);return;}
    // CPU turn
    gameActive=false;
    document.getElementById('ttt-status').textContent='CPU thinking...';
    setTimeout(()=>{
      const cpuIdx=cpuMove();
      if(cpuIdx!==undefined&&cpuIdx!==null) board[cpuIdx]='O';
      playSound('flip');
      const res2=checkWinner(board);
      if(res2){renderBoard();finishGame(res2);}
      else{gameActive=true;document.getElementById('ttt-status').textContent='Your turn! (X)';renderBoard();}
    },450);
  };

  window.tttStart=async function(){
    if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    betAmt=currentBet;
    await saveUserData({coins:(userData.coins||0)-betAmt});
    board=Array(9).fill(null); gameActive=true;
    document.getElementById('ttt-result').className='result-banner';
    document.getElementById('ttt-start-btn').style.display='none'; lockBets(true);
    document.getElementById('ttt-status').textContent='Your turn! (X)';
    renderBoard(); playSound('deal');
  };

  renderBoard();
}

// ════════════════════════════════════════════════
// LEADERBOARD (live real-time)
// ════════════════════════════════════════════════
let lbListener = null;
let lbCurrentType = 'coins';

function initLeaderboard(){
  lbCurrentType = 'coins';
  document.querySelectorAll('.lb-tab').forEach((t,i)=>t.classList.toggle('active',i===0));
  if(lbListener){ lbListener(); lbListener=null; }
  const list=document.getElementById('lb-list');
  list.innerHTML=`<div style="color:var(--muted);padding:20px;text-align:center;font-size:.8rem;">Loading...</div>`;
  lbListener = db.ref('users').on('value', snap => {
    renderLeaderboard(snap, lbCurrentType);
  });
}

function renderLeaderboard(snap, type){
  const list=document.getElementById('lb-list');
  if(!snap||!snap.exists()){list.innerHTML=`<div style="color:var(--muted);padding:20px;text-align:center;">No players yet.</div>`;return;}
  let players=[]; snap.forEach(child=>{players.push({uid:child.key,...child.val()});});
  const field={coins:'coins',won:'biggestWin',games:'gamesPlayed',time:'timeSpent'}[type];
  players.sort((a,b)=>(b[field]||0)-(a[field]||0));
  const medals=['🥇','🥈','🥉'];
  list.innerHTML=players.slice(0,20).map((p,i)=>{
    const isYou=p.uid===currentUser?.uid;
    const av=(SHOP_AVATARS.find(a=>a.id===(p.equippedItems?.avatars))||SHOP_AVATARS[0]).preview;
    const val=type==='coins'?coinSymbol+' '+fmtCoins(p.coins||0):type==='won'?'💥 '+fmtCoins(p.biggestWin||0):type==='games'?'🎮 '+fmtCoins(p.gamesPlayed||0)+' games':'⏱ '+fmtTime(p.timeSpent||0);
    return`<div class="lb-row${isYou?' lb-you':''}"><span class="lb-rank${i<3?' '+['gold','silver','bronze'][i]:''}">${medals[i]||i+1}</span><span class="lb-avatar">${av}</span><span class="lb-username">${p.username||'?'}${isYou?' (You)':''}</span><span class="lb-val">${val}</span></div>`;
  }).join('')||`<div style="color:var(--muted);padding:20px;text-align:center;">No data.</div>`;
}

window.showLbTab=function(type){
  lbCurrentType=type;
  document.querySelectorAll('.lb-tab').forEach((t,i)=>t.classList.toggle('active',['coins','won','games','time'][i]===type));
  // Fetch once for tab switch (listener will also update)
  db.ref('users').get().then(snap=>renderLeaderboard(snap,type));
};

// ════════════════════════════════════════════════
// ACHIEVEMENTS
// ════════════════════════════════════════════════
function renderAchievements(){
  const owned=userData.achievements||[];
  document.getElementById('ach-progress').textContent=owned.length+' / '+ACHIEVEMENTS.length+' unlocked';
  document.getElementById('ach-grid').innerHTML=ACHIEVEMENTS.map(a=>{
    const u=owned.includes(a.id);
    return`<div class="ach-card${u?' unlocked':''}">
      <div class="ach-icon">${u?a.icon:'🔒'}</div>
      <div class="ach-info"><div class="ach-name">${a.name}</div><div class="ach-desc">${a.desc}</div>
      <span class="ach-badge ${u?'unlocked':'locked'}">${u?'✓ Unlocked':'Locked'}</span></div>
    </div>`;
  }).join('');
}

// ════════════════════════════════════════════════
// STATS PAGE
// ════════════════════════════════════════════════
function renderStats(){
  const earned=userData.totalEarned||0, lost=userData.totalLost||0;
  const net=earned-lost, bets=userData.totalBets||0;
  const bigWin=userData.biggestWin||0, bigLoss=userData.biggestLoss||0;
  function setStatEl(id,text){
    const el=document.getElementById(id); if(!el) return;
    el.textContent=text;
    el.classList.toggle('big', text.length>12);
  }
  setStatEl('stat-earned',coinSymbol+' '+fmtCoins(earned));
  setStatEl('stat-lost',coinSymbol+' '+fmtCoins(lost));
  const netEl=document.getElementById('stat-net');
  if(netEl){
    netEl.textContent=(net>=0?'+':'')+coinSymbol+' '+fmtCoins(net);
    netEl.className='stat-value '+(net>=0?'green':'red')+(Math.abs(net)>=1e9?' big':'');
  }
  setStatEl('stat-bets',fmtCoins(bets));
  setStatEl('stat-bigwin',coinSymbol+' '+fmtCoins(bigWin));
  setStatEl('stat-bigloss',coinSymbol+' '+fmtCoins(bigLoss));
  const bailoutEl=document.getElementById('stat-bailouts');
  if(bailoutEl) bailoutEl.textContent=(userData.bailoutCount||0);
  const history=userData.balanceHistory||[];
  const canvas=document.getElementById('statsGraph'); if(!canvas) return;
  const W=canvas.parentElement.offsetWidth||800;
  canvas.width=Math.max(W-20,300); canvas.height=300;
  const ctx=canvas.getContext('2d'); const cW=canvas.width, cH=canvas.height;
  ctx.clearRect(0,0,cW,cH); ctx.fillStyle='#03031a'; ctx.fillRect(0,0,cW,cH);
  if(history.length<2){ctx.fillStyle='rgba(255,255,255,.3)';ctx.font='16px Montserrat';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Play some games to see your balance graph!',cW/2,cH/2);return;}
  const PAD=40, gW=cW-PAD*2, gH=cH-PAD*2;
  const minVal=Math.min(...history), maxVal=Math.max(...history), range=Math.max(maxVal-minVal,1);
  ctx.strokeStyle='rgba(255,255,255,.08)'; ctx.lineWidth=1;
  for(let i=0;i<=4;i++){const y=PAD+gH*(1-i/4);ctx.beginPath();ctx.moveTo(PAD,y);ctx.lineTo(PAD+gW,y);ctx.stroke();}
  ctx.fillStyle='rgba(255,255,255,.4)'; ctx.font='10px Montserrat'; ctx.textAlign='right'; ctx.textBaseline='middle';
  for(let i=0;i<=4;i++){const val=minVal+range*(i/4);const y=PAD+gH*(1-i/4);ctx.fillText(fmtCoins(Math.round(val)),PAD-5,y);}
  ctx.beginPath();
  history.forEach((v,i)=>{const x=PAD+gW*(i/(history.length-1));const y=PAD+gH*(1-(v-minVal)/range);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.lineTo(PAD+gW,PAD+gH); ctx.lineTo(PAD,PAD+gH); ctx.closePath();
  const areaGrad=ctx.createLinearGradient(0,PAD,0,PAD+gH);
  areaGrad.addColorStop(0,'rgba(0,100,255,.22)'); areaGrad.addColorStop(1,'rgba(0,0,255,.03)');
  ctx.fillStyle=areaGrad; ctx.fill();
  ctx.beginPath();
  history.forEach((v,i)=>{const x=PAD+gW*(i/(history.length-1));const y=PAD+gH*(1-(v-minVal)/range);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  const lineGrad=ctx.createLinearGradient(PAD,0,PAD+gW,0);
  lineGrad.addColorStop(0,'#4466ff'); lineGrad.addColorStop(0.5,'#44aaff');
  lineGrad.addColorStop(1,history[history.length-1]>=history[0]?'#44ff88':'#ff4444');
  ctx.strokeStyle=lineGrad; ctx.lineWidth=2.5; ctx.lineJoin='round'; ctx.stroke();
  [[0,history[0]],[history.length-1,history[history.length-1]]].forEach(([i,v])=>{
    const x=PAD+gW*(i/(history.length-1)); const y=PAD+gH*(1-(v-minVal)/range);
    ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2);
    ctx.fillStyle=i===history.length-1?(v>=history[0]?'#44ff88':'#ff4444'):'#aaaaff'; ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.75)'; ctx.font='bold 10px Montserrat';
    ctx.textAlign=i===0?'left':'right'; ctx.textBaseline='bottom';
    ctx.fillText(coinSymbol+fmtCoins(v),x+(i===0?6:-6),y-4);
  });
}

// ════════════════════════════════════════════════
// GLOBAL STATS
// ════════════════════════════════════════════════
async function renderGlobalStats(){
  const setEl=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val;};
  setEl('gs-players','Loading...'); setEl('gs-coins-total','...');
  try{
    const snap=await db.ref('users').get();
    if(!snap.exists()){setEl('gs-players','0');return;}
    let players=[],totalCoins=0,totalEarned=0,totalLost=0,totalBets=0,biggestWin=0,totalGames=0,totalBailouts=0;
    let allBalances=[];
    snap.forEach(child=>{
      const p=child.val();
      players.push(p);
      totalCoins+=(p.coins||0);
      totalEarned+=(p.totalEarned||0);
      totalLost+=(p.totalLost||0);
      totalBets+=(p.totalBets||0);
      totalGames+=(p.gamesPlayed||0);
      totalBailouts+=(p.bailoutCount||0);
      if((p.biggestWin||0)>biggestWin) biggestWin=p.biggestWin||0;
      const hist=p.balanceHistory||[];
      if(hist.length>0) allBalances.push({name:p.username||'?',history:hist});
    });
    setEl('gs-players', players.length);
    setEl('gs-coins-total', coinSymbol+' '+fmtCoins(totalCoins));
    setEl('gs-earned', coinSymbol+' '+fmtCoins(totalEarned));
    setEl('gs-lost', coinSymbol+' '+fmtCoins(totalLost));
    setEl('gs-bets', fmtCoins(totalBets));
    setEl('gs-bigwin', coinSymbol+' '+fmtCoins(biggestWin));
    setEl('gs-games', fmtCoins(totalGames));
    setEl('gs-bailouts', totalBailouts);
    // Draw merged balance graph
    const canvas=document.getElementById('globalStatsGraph'); if(!canvas) return;
    const W=canvas.parentElement.offsetWidth||800;
    canvas.width=Math.max(W-20,300); canvas.height=280;
    const ctx=canvas.getContext('2d'); const cW=canvas.width, cH=canvas.height;
    ctx.clearRect(0,0,cW,cH); ctx.fillStyle='#03031a'; ctx.fillRect(0,0,cW,cH);
    if(allBalances.length===0){
      ctx.fillStyle='rgba(255,255,255,.3)'; ctx.font='16px Montserrat';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('No balance data yet.',cW/2,cH/2); return;
    }
    const PAD=48, gW=cW-PAD*2, gH=cH-PAD*2-20;
    const COLORS=['#4466ff','#ff4444','#44ff88','#ffaa00','#ff44cc','#44ccff','#ffff44','#cc44ff'];
    // Find global min/max across ALL players so lines share the same scale
    let globalMin=Infinity, globalMax=-Infinity;
    allBalances.forEach(p=>p.history.forEach(v=>{if(v<globalMin)globalMin=v;if(v>globalMax)globalMax=v;}));
    const range=Math.max(globalMax-globalMin,1);
    // Grid lines
    ctx.strokeStyle='rgba(255,255,255,.07)'; ctx.lineWidth=1;
    for(let i=0;i<=4;i++){
      const y=PAD+gH*(1-i/4);
      ctx.beginPath(); ctx.moveTo(PAD,y); ctx.lineTo(PAD+gW,y); ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,.4)'; ctx.font='10px Montserrat';
      ctx.textAlign='right'; ctx.textBaseline='middle';
      ctx.fillText(fmtCoins(Math.round(globalMin+range*(i/4))),PAD-5,y);
    }
    // Draw each player's line
    allBalances.forEach((p,pi)=>{
      const hist=p.history; if(hist.length<2) return;
      ctx.beginPath();
      hist.forEach((v,i)=>{
        const x=PAD+gW*(i/(hist.length-1));
        const y=PAD+gH*(1-(v-globalMin)/range);
        if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      });
      ctx.strokeStyle=COLORS[pi%COLORS.length]; ctx.lineWidth=2;
      ctx.globalAlpha=0.75; ctx.lineJoin='round'; ctx.stroke(); ctx.globalAlpha=1;
    });
    // Legend at bottom
    const legendY=cH-12;
    ctx.font='bold 10px Montserrat'; ctx.textBaseline='middle';
    allBalances.slice(0,8).forEach((p,pi)=>{
      const x=PAD+(pi*(gW/Math.min(allBalances.length,8)));
      ctx.fillStyle=COLORS[pi%COLORS.length];
      ctx.beginPath(); ctx.arc(x,legendY,4,0,Math.PI*2); ctx.fill();
      ctx.fillText(p.name,x+8,legendY);
    });
  }catch(e){console.error('Global stats error',e);}
}
let suggestionsListener=null, allSuggestions=[], currentFilter='all', currentStatusFilter='all';

function initSuggestions(){
  const textarea=document.getElementById('sug-body');
  if(textarea){textarea.addEventListener('input',()=>{const len=textarea.value.length;const el=document.getElementById('sug-char');if(el)el.textContent=len;});}
  if(suggestionsListener) suggestionsListener();
  const ref=db.ref('suggestions').orderByChild('timestamp').limitToLast(100);
  suggestionsListener=ref.on('value',snap=>{
    allSuggestions=[]; if(snap.exists()){snap.forEach(child=>{allSuggestions.unshift({id:child.key,...child.val()});});}
    renderSuggestions();
  });
}
function filterSuggestions(cat){
  currentFilter=cat;
  document.querySelectorAll('.sug-filter:not(.sug-status-filter)').forEach(b=>b.classList.toggle('active',b.textContent.toLowerCase().includes(cat==='all'?'all':cat)));
  renderSuggestions();
}
window.filterSuggestions=filterSuggestions;
function filterSugStatus(status){
  currentStatusFilter=status;
  document.querySelectorAll('.sug-status-filter').forEach(b=>{
    const t=b.textContent.toLowerCase();
    b.classList.toggle('active',
      (status==='all'&&t.includes('all status'))||
      (status==='being_added'&&t.includes('being'))||
      (status==='added'&&t.includes('added')&&!t.includes('being'))||
      (status==='rejected'&&t.includes('rejected'))||
      (status==='open'&&t.includes('open'))
    );
  });
  renderSuggestions();
}
window.filterSugStatus=filterSugStatus;

function renderSuggestions(){
  const list=document.getElementById('suggestions-list'); if(!list) return;
  let filtered=currentFilter==='all'?allSuggestions:allSuggestions.filter(s=>s.category===currentFilter);
  if(currentStatusFilter!=='all'){
    if(currentStatusFilter==='open') filtered=filtered.filter(s=>!s.status);
    else filtered=filtered.filter(s=>s.status===currentStatusFilter);
  }
  if(filtered.length===0){list.innerHTML='<div class="sug-empty">No suggestions in this category/status. Be the first!</div>';return;}
  const CAT_LABELS={game:'🎮',feature:'✨',shop:'🛒',bug:'🐛',other:'💡'};
  const STATUS_LABELS={being_added:'🔄 Being Added',added:'✅ Added',rejected:'❌ Rejected'};
  list.innerHTML=filtered.map(s=>{
    const date=new Date(s.timestamp);
    const dateStr=date.toLocaleDateString()+' '+date.toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'});
    const statusBadge = s.status ? `<span class="sug-status-badge sug-status-${s.status}">${STATUS_LABELS[s.status]||s.status}</span>` : '<span class="sug-status-badge" style="background:rgba(255,200,0,.15);color:#ffdd44;border:1px solid rgba(255,200,0,.3);">🟡 Open</span>';
    const upvotes=s.upvotes||0;
    const hasUpvoted=(s.upvoters||{})[currentUser&&currentUser.uid]||false;
    const replyCount=s.replies?Object.keys(s.replies).length:0;
    const isOwner=currentUser&&currentUser.uid===OWNER_UID;
    const isAuthor=currentUser&&currentUser.uid===s.uid;
    return`<div class="sug-card" onclick="openSuggestion('${s.id}')" style="cursor:pointer;">
      <div class="sug-card-header">
        <span class="sug-cat-badge">${CAT_LABELS[s.category]||'💡'} ${s.category}</span>
        ${statusBadge}
        <span class="sug-card-title">${escHtml(s.title||'(no title)')}</span>
        <span class="sug-card-meta">${escHtml(s.username||'?')} · ${dateStr}</span>
      </div>
      <div class="sug-card-body">${escHtml(s.body||'')}</div>
      <div style="display:flex;gap:10px;align-items:center;margin-top:8px;flex-wrap:wrap;" onclick="event.stopPropagation()">
        <button class="sug-action-btn${hasUpvoted?' sug-upvote-active':''}" onclick="upvoteSuggestion('${s.id}')">
          👍 ${upvotes}
        </button>
        <span style="font-size:.72rem;color:var(--muted);">💬 ${replyCount} repl${replyCount===1?'y':'ies'}</span>
        ${isAuthor?`<button class="sug-action-btn sug-edit-btn" onclick="editSuggestion('${s.id}')">✏️ Edit</button>`:''}
        <span style="font-size:.7rem;color:var(--muted);margin-left:auto;">Click to open →</span>
      </div>
    </div>`;
  }).join('');
}

window.openSuggestion=function(id){
  const s=allSuggestions.find(x=>x.id===id); if(!s) return;
  const CAT_LABELS={game:'🎮',feature:'✨',shop:'🛒',bug:'🐛',other:'💡'};
  const STATUS_LABELS={being_added:'🔄 Being Added',added:'✅ Added',rejected:'❌ Rejected'};
  const isOwner=currentUser&&currentUser.uid===OWNER_UID;
  const isAuthor=currentUser&&currentUser.uid===s.uid;
  const upvotes=s.upvotes||0;
  const replies=s.replies?Object.values(s.replies).sort((a,b)=>a.timestamp-b.timestamp):[];
  const history=s.editHistory||[];
  const statusBadge=s.status?`<span class="sug-status-badge sug-status-${s.status}">${STATUS_LABELS[s.status]||s.status}</span>`:'<span class="sug-status-badge" style="background:rgba(255,200,0,.15);color:#ffdd44;border:1px solid rgba(255,200,0,.3);">🟡 Open</span>';
  const ownerSection=isOwner?`<div style="margin:16px 0;padding:14px;background:rgba(255,200,0,.07);border:1px solid rgba(255,200,0,.3);border-radius:10px;">
    <div style="font-size:.78rem;font-weight:800;color:var(--gold);margin-bottom:8px;">👑 Owner Controls</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button class="btn sug-mod-btn" onclick="setSugStatus('${s.id}','being_added')" style="font-size:.65rem;padding:5px 8px;background:rgba(0,100,255,.3);">🔄 Being Added</button>
      <button class="btn sug-mod-btn" onclick="setSugStatus('${s.id}','added')" style="font-size:.65rem;padding:5px 8px;background:rgba(0,180,0,.3);">✅ Added</button>
      <button class="btn sug-mod-btn" onclick="setSugStatus('${s.id}','rejected')" style="font-size:.65rem;padding:5px 8px;background:rgba(200,0,0,.3);">❌ Rejected</button>
      <button class="btn sug-mod-btn" onclick="deleteSuggestion('${s.id}');closeSugModal()" style="font-size:.65rem;padding:5px 8px;background:rgba(100,0,0,.4);">🗑 Delete</button>
    </div>
  </div>`:'';
  const editHistorySection=isAuthor&&history.length>0?`<div style="margin:12px 0;padding:10px;background:rgba(0,0,50,.4);border:1px solid var(--border);border-radius:8px;">
    <div style="font-size:.72rem;font-weight:800;color:var(--muted);margin-bottom:6px;">📝 Edit History</div>
    ${history.map(h=>`<div style="font-size:.7rem;color:var(--muted);margin-bottom:4px;"><span style="color:var(--gold);">${new Date(h.timestamp).toLocaleString()}</span> · ${escHtml(h.body||'')}</div>`).join('')}
  </div>`:'';
  const repliesHtml=replies.map(r=>`<div style="padding:10px 12px;background:rgba(0,0,50,.4);border:1px solid var(--border);border-radius:8px;margin-bottom:8px;">
    <div style="font-size:.72rem;color:var(--gold);font-weight:800;margin-bottom:4px;">${escHtml(r.username||'?')} · ${new Date(r.timestamp).toLocaleString()}</div>
    <div style="font-size:.82rem;color:rgba(255,255,255,.85);">${escHtml(r.body||'')}</div>
  </div>`).join('');

  const modal=document.createElement('div');
  modal.id='sug-modal';
  modal.style.cssText='position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;padding:16px;';
  modal.innerHTML=`<div style="background:#08081e;border:1px solid var(--border);border-radius:16px;max-width:600px;width:100%;max-height:90vh;overflow-y:auto;padding:24px;position:relative;">
    <button onclick="closeSugModal()" style="position:absolute;top:14px;right:14px;background:rgba(255,255,255,.1);border:none;color:#fff;font-size:1.1rem;cursor:pointer;border-radius:6px;width:32px;height:32px;">✕</button>
    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
      <span class="sug-cat-badge">${CAT_LABELS[s.category]||'💡'} ${s.category}</span>
      ${statusBadge}
    </div>
    <h3 style="font-size:1.1rem;font-weight:900;color:#fff;margin-bottom:4px;">${escHtml(s.title||'')}</h3>
    <div style="font-size:.75rem;color:var(--muted);margin-bottom:12px;">by ${escHtml(s.username||'?')} · ${new Date(s.timestamp).toLocaleString()}</div>
    <div style="font-size:.88rem;color:rgba(255,255,255,.85);line-height:1.5;margin-bottom:12px;padding:12px;background:rgba(0,0,50,.4);border-radius:8px;">${escHtml(s.body||'')}</div>
    <div style="display:flex;gap:10px;align-items:center;margin-bottom:12px;">
      <button class="sug-action-btn" onclick="upvoteSuggestion('${s.id}');closeSugModal();openSuggestion('${s.id}')">👍 ${upvotes} Upvotes</button>
      ${isAuthor?`<button class="sug-action-btn sug-edit-btn" onclick="editSuggestion('${s.id}')">✏️ Edit</button>`:''}
    </div>
    ${isOwner?`<div style="margin:16px 0;padding:14px;background:rgba(255,200,0,.07);border:1px solid rgba(255,200,0,.3);border-radius:10px;">
    <div style="font-size:.78rem;font-weight:800;color:var(--gold);margin-bottom:10px;">👑 Owner Controls</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button class="owner-ctrl-btn owner-ctrl-blue" onclick="setSugStatus('${s.id}','being_added')">🔄 Being Added</button>
      <button class="owner-ctrl-btn owner-ctrl-green" onclick="setSugStatus('${s.id}','added')">✅ Added</button>
      <button class="owner-ctrl-btn owner-ctrl-red" onclick="setSugStatus('${s.id}','rejected')">❌ Rejected</button>
      <button class="owner-ctrl-btn owner-ctrl-dark" onclick="deleteSuggestion('${s.id}');closeSugModal()">🗑 Delete</button>
    </div>
  </div>`:''}
    ${editHistorySection}
    <div style="margin-top:16px;">
      <h4 style="font-size:.85rem;font-weight:900;color:#fff;margin-bottom:10px;">💬 Replies (${replies.length})</h4>
      ${repliesHtml||'<div style="font-size:.78rem;color:var(--muted);margin-bottom:10px;">No replies yet. Be the first!</div>'}
      <textarea id="sug-reply-input" class="sug-textarea" placeholder="Write a reply..." maxlength="300" style="height:70px;margin-top:8px;"></textarea>
      <button class="btn btn-sm" onclick="submitSugReply('${s.id}')" style="margin-top:6px;"><span class="btn-text">Post Reply</span></button>
    </div>
  </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click',e=>{if(e.target===modal)closeSugModal();});
};
window.closeSugModal=function(){const m=document.getElementById('sug-modal');if(m)m.remove();};

window.upvoteSuggestion=async function(id){
  if(!currentUser){toast('Log in to upvote!');return;}
  const s=allSuggestions.find(x=>x.id===id); if(!s) return;
  const uid=currentUser.uid;
  const upvoters=s.upvoters||{};
  if(upvoters[uid]){
    // Un-upvote
    await db.ref('suggestions/'+id+'/upvoters/'+uid).remove();
    await db.ref('suggestions/'+id+'/upvotes').set(Math.max(0,(s.upvotes||1)-1));
    toast('👍 Upvote removed');
  } else {
    upvoters[uid]=true;
    await db.ref('suggestions/'+id+'/upvoters/'+uid).set(true);
    await db.ref('suggestions/'+id+'/upvotes').set((s.upvotes||0)+1);
    toast('👍 Upvoted!');
  }
};

window.submitSugReply=async function(id){
  const input=document.getElementById('sug-reply-input');
  const body=(input?input.value:'').trim();
  if(!body){toast('Write something first!');return;}
  if(!currentUser){toast('Log in to reply!');return;}
  try{
    await db.ref('suggestions/'+id+'/replies').push({username:userData.username||'?',uid:currentUser.uid,body,timestamp:Date.now()});
    toast('💬 Reply posted!'); closeSugModal();
  }catch(e){toast('Error: '+e.message);}
};

window.editSuggestion=function(id){
  const s=allSuggestions.find(x=>x.id===id); if(!s) return;
  if(!currentUser||currentUser.uid!==s.uid){toast('Not your suggestion!');return;}
  const modal=document.createElement('div');
  modal.id='sug-edit-modal';
  modal.style.cssText='position:fixed;inset:0;z-index:9001;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;padding:16px;';
  modal.innerHTML=`<div style="background:#08081e;border:1px solid var(--border);border-radius:16px;max-width:500px;width:100%;padding:24px;position:relative;">
    <button onclick="document.getElementById('sug-edit-modal').remove()" style="position:absolute;top:14px;right:14px;background:rgba(255,255,255,.1);border:none;color:#fff;font-size:1.1rem;cursor:pointer;border-radius:6px;width:32px;height:32px;">✕</button>
    <h3 style="font-size:1rem;font-weight:900;color:#fff;margin-bottom:16px;">✏️ Edit Suggestion</h3>
    <div class="form-group" style="margin-bottom:10px;">
      <label style="font-size:.78rem;color:var(--muted);">Category</label>
      <select id="edit-sug-category" class="sug-select" style="margin-top:4px;">
        <option value="game"${s.category==='game'?' selected':''}>🎮 New Game Idea</option>
        <option value="feature"${s.category==='feature'?' selected':''}>✨ New Feature</option>
        <option value="shop"${s.category==='shop'?' selected':''}>🛒 Shop Item</option>
        <option value="bug"${s.category==='bug'?' selected':''}>🐛 Bug Report</option>
        <option value="other"${s.category==='other'?' selected':''}>💡 Other</option>
      </select>
    </div>
    <div class="form-group" style="margin-bottom:10px;">
      <label style="font-size:.78rem;color:var(--muted);">Title</label>
      <input type="text" id="edit-sug-title" class="sug-input" value="${escHtml(s.title||'')}" maxlength="80" style="margin-top:4px;"/>
    </div>
    <div class="form-group" style="margin-bottom:14px;">
      <label style="font-size:.78rem;color:var(--muted);">Description</label>
      <textarea id="edit-sug-body" class="sug-textarea" maxlength="500" style="margin-top:4px;height:100px;">${escHtml(s.body||'')}</textarea>
    </div>
    <button class="btn btn-green" onclick="saveEditSuggestion('${s.id}')" style="max-width:160px;"><span class="btn-text">Save Changes</span></button>
  </div>`;
  document.body.appendChild(modal);
};

window.saveEditSuggestion=async function(id){
  const s=allSuggestions.find(x=>x.id===id); if(!s) return;
  const category=document.getElementById('edit-sug-category').value;
  const title=(document.getElementById('edit-sug-title').value||'').trim();
  const body=(document.getElementById('edit-sug-body').value||'').trim();
  if(!title||!body){toast('Fill in all fields!');return;}
  // Save edit history
  const history=s.editHistory||[];
  history.push({body:s.body,title:s.title,category:s.category,timestamp:Date.now()});
  try{
    await db.ref('suggestions/'+id).update({category,title,body,editHistory:history,edited:true,editedAt:Date.now()});
    toast('✅ Suggestion updated!');
    document.getElementById('sug-edit-modal')?.remove();
  }catch(e){toast('Error: '+e.message);}
};

window.setSugStatus=async function(id, status){
  try{
    await db.ref('suggestions/'+id+'/status').set(status);
    toast('✅ Status updated!');
  }catch(e){toast('Error: '+e.message);}
};
window.deleteSuggestion=async function(id){
  try{
    await db.ref('suggestions/'+id).remove();
    toast('🗑 Suggestion deleted.');
  }catch(e){toast('Error: '+e.message);}
};
function escHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
window.submitSuggestion=async function(){
  const title=(document.getElementById('sug-title').value||'').trim();
  const body=(document.getElementById('sug-body').value||'').trim();
  const category=document.getElementById('sug-category').value;
  if(!title){toast('Add a title for your suggestion!');return;}
  if(!body){toast('Add some detail to your suggestion!');return;}
  if(!currentUser){toast('You must be logged in!');return;}
  try{
    await db.ref('suggestions').push({username:userData.username||'?',uid:currentUser.uid,category,title,body,timestamp:Date.now()});
    document.getElementById('sug-title').value=''; document.getElementById('sug-body').value=''; document.getElementById('sug-char').textContent='0';
    toast('✅ Suggestion submitted! Thanks!'); playSound('coin');
  }catch(e){toast('Error submitting: '+e.message);}
};

// ════════════════════════════════════════════════
// BANK SYSTEM
// ════════════════════════════════════════════════
function initBank(){
  refreshCoinDisplays();
  renderBankUI();
}

function renderBankUI(){
  const coins=userData.coins||0;
  const banked=userData.bankCoins||0;
  const loan=userData.activeLoan||null;
  const setEl=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  setEl('bank-wallet-display',coinSymbol+' '+fmtCoins(coins));
  setEl('bank-saved-display',coinSymbol+' '+fmtCoins(banked));
  if(loan){
    const due=new Date(loan.dueDate);
    const remaining=loan.dueDate-Date.now();
    const repayAmt=Math.floor(loan.amount*1.1);
    setEl('bank-loan-display',coinSymbol+' '+fmtCoins(loan.amount)+' (repay: '+fmtCoins(repayAmt)+')');
    const timerEl=document.getElementById('bank-loan-timer');
    if(timerEl){
      if(remaining>0){
        const days=Math.floor(remaining/86400000),hrs=Math.floor((remaining%86400000)/3600000),mins=Math.floor((remaining%3600000)/60000);
        timerEl.textContent='⏱ Time left: '+(days>0?days+'d ':'')+hrs+'h '+mins+'m';
        timerEl.style.color=remaining<86400000?'#ff4444':'var(--gold)';
      } else {
        timerEl.textContent='⚠️ LOAN OVERDUE! Pay now or lose 2x!';
        timerEl.style.color='#ff4444';
        // Check if overdue penalty should fire
        checkLoanOverdue();
      }
    }
    // Check overdue on load
    if(remaining<=0) checkLoanOverdue();
  } else {
    setEl('bank-loan-display','None');
    const timerEl=document.getElementById('bank-loan-timer');
    if(timerEl) timerEl.textContent='';
  }
}

async function checkLoanOverdue(){
  const loan=userData.activeLoan;
  if(!loan||loan.penaltyApplied) return;
  if(Date.now()>loan.dueDate){
    const penalty=Math.floor(loan.amount*2);
    const newCoins=Math.max(0,(userData.coins||0)-penalty);
    await saveUserData({coins:newCoins,'activeLoan':null});
    toast('💀 Loan overdue! Lost '+fmtCoins(penalty)+' coins!',5000);
    renderBankUI();
  }
}

window.bankDeposit=async function(){
  const input=document.getElementById('bank-dw-amount');
  const amt=parseInt(input.value)||0;
  const msgEl=document.getElementById('bank-dw-msg');
  function setMsg(t,c){if(msgEl){msgEl.textContent=t;msgEl.className='msg '+(c||'');}}
  if(amt<=0) return setMsg('Enter a valid amount.','error');
  if(amt>(userData.coins||0)) return setMsg('Not enough coins in wallet!','error');
  await saveUserData({coins:(userData.coins||0)-amt,bankCoins:(userData.bankCoins||0)+amt});
  setMsg('✅ Deposited '+fmtCoins(amt)+' coins!','success');
  input.value=''; renderBankUI(); toast('🏦 Deposited '+fmtCoins(amt)+' '+coinSymbol);
};

window.bankWithdraw=async function(){
  const input=document.getElementById('bank-dw-amount');
  const amt=parseInt(input.value)||0;
  const msgEl=document.getElementById('bank-dw-msg');
  function setMsg(t,c){if(msgEl){msgEl.textContent=t;msgEl.className='msg '+(c||'');}}
  if(amt<=0) return setMsg('Enter a valid amount.','error');
  if(amt>(userData.bankCoins||0)) return setMsg('Not enough coins in bank!','error');
  await saveUserData({coins:(userData.coins||0)+amt,bankCoins:(userData.bankCoins||0)-amt});
  setMsg('✅ Withdrew '+fmtCoins(amt)+' coins!','success');
  input.value=''; renderBankUI(); toast('💰 Withdrew '+fmtCoins(amt)+' '+coinSymbol);
};

window.takeLoan=async function(){
  const input=document.getElementById('bank-loan-amount');
  const amt=parseInt(input.value)||0;
  const msgEl=document.getElementById('bank-loan-msg');
  function setMsg(t,c){if(msgEl){msgEl.textContent=t;msgEl.className='msg '+(c||'');}}
  if(userData.activeLoan) return setMsg('You already have an active loan! Repay it first.','error');
  if(amt<100) return setMsg('Minimum loan is 100 coins.','error');
  if(amt>50000) return setMsg('Maximum loan is 50,000 coins.','error');
  const loan={amount:amt,dueDate:Date.now()+7*24*60*60*1000,takenAt:Date.now()};
  await saveUserData({coins:(userData.coins||0)+amt,activeLoan:loan});
  setMsg('✅ Loan of '+fmtCoins(amt)+' taken! Repay within 7 days.','success');
  input.value=''; renderBankUI(); toast('💳 Loan granted: +'+fmtCoins(amt)+' '+coinSymbol);
};

window.repayLoan=async function(){
  const loan=userData.activeLoan;
  const msgEl=document.getElementById('bank-loan-msg');
  function setMsg(t,c){if(msgEl){msgEl.textContent=t;msgEl.className='msg '+(c||'');}}
  if(!loan) return setMsg('No active loan to repay.','error');
  const repayAmt=Math.floor(loan.amount*1.1);
  if((userData.coins||0)<repayAmt) return setMsg('Not enough coins to repay! Need '+fmtCoins(repayAmt)+'.','error');
  await saveUserData({coins:(userData.coins||0)-repayAmt,activeLoan:null});
  setMsg('✅ Loan repaid! ('+fmtCoins(repayAmt)+' including 10% interest)','success');
  renderBankUI(); toast('✅ Loan repaid!');
};

// ════════════════════════════════════════════════
// BEGGING SYSTEM
// ════════════════════════════════════════════════
let beggingListener=null;

function initBegging(){
  refreshCoinDisplays();
  if(beggingListener) beggingListener();
  beggingListener=db.ref('begging').orderByChild('timestamp').limitToLast(50).on('value',snap=>{
    const list=document.getElementById('begging-list'); if(!list) return;
    const posts=[]; if(snap.exists()){snap.forEach(child=>{posts.unshift({id:child.key,...child.val()});});}
    if(posts.length===0){list.innerHTML='<div class="sug-empty">No active begging posts. Be the first!</div>';return;}
    const isOwner=currentUser&&currentUser.uid===OWNER_UID;
    list.innerHTML=posts.map(p=>{
      const raised=p.raised||0, goal=p.goal||1000;
      const pct=Math.min(100,Math.floor(raised/goal*100));
      const isAuthor=currentUser&&currentUser.uid===p.uid;
      const date=new Date(p.timestamp).toLocaleDateString();
      return`<div class="sug-card">
        <div class="sug-card-header">
          <span class="sug-cat-badge">🙏 Begging</span>
          <span class="sug-card-title">${escHtml(p.username||'?')} needs coins!</span>
          <span class="sug-card-meta">${date} · Goal: ${coinSymbol} ${fmtCoins(goal)}</span>
        </div>
        <div class="sug-card-body">${escHtml(p.reason||'')}</div>
        <div style="margin:8px 0;">
          <div style="background:rgba(255,255,255,.1);border-radius:4px;height:8px;overflow:hidden;">
            <div style="background:var(--blue);height:100%;width:${pct}%;transition:width .3s;border-radius:4px;"></div>
          </div>
          <div style="font-size:.72rem;color:var(--muted);margin-top:4px;">${coinSymbol} ${fmtCoins(raised)} raised of ${fmtCoins(goal)} (${pct}%)</div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px;">
          ${!isAuthor?`<div style="display:flex;gap:6px;align-items:center;">
            <input type="range" min="1" max="100" value="10" id="donate-pct-${p.id}" oninput="updateDonatePreview('${p.id}',${goal})" style="width:100px;accent-color:var(--blue);">
            <span id="donate-preview-${p.id}" style="font-size:.75rem;color:var(--gold);min-width:80px;">${fmtCoins(Math.floor(goal*0.1))} (10%)</span>
            <button class="btn btn-green" onclick="donateBeg('${p.id}',${goal})" style="font-size:.7rem;padding:5px 10px;">Donate</button>
          </div>`:'<span style="font-size:.72rem;color:var(--muted);">Your post</span>'}
          ${(isAuthor||isOwner)?`<button class="btn sug-mod-btn" onclick="deleteBegPost('${p.id}')" style="font-size:.65rem;padding:4px 8px;background:rgba(100,0,0,.4);">🗑 Delete</button>`:''}
        </div>
      </div>`;
    }).join('');
  });
}

window.updateDonatePreview=function(id,goal){
  const slider=document.getElementById('donate-pct-'+id);
  const preview=document.getElementById('donate-preview-'+id);
  if(!slider||!preview) return;
  const pct=parseInt(slider.value);
  const amt=Math.floor(goal*(pct/100));
  preview.textContent=fmtCoins(amt)+' ('+pct+'%)';
};

window.donateBeg=async function(id,goal){
  if(!currentUser){toast('Log in to donate!');return;}
  const slider=document.getElementById('donate-pct-'+id);
  const pct=parseInt(slider?slider.value:10);
  const amt=Math.floor(goal*(pct/100));
  if(amt<=0){toast('Donation amount too small!');return;}
  if((userData.coins||0)<amt){toast('Not enough coins to donate '+fmtCoins(amt)+'!');return;}
  try{
    const snap=await db.ref('begging/'+id).get();
    if(!snap.exists()){toast('Post no longer exists!');return;}
    const post=snap.val();
    if(post.uid===currentUser.uid){toast("You can't donate to your own post!");return;}
    // Deduct from donor
    await saveUserData({coins:(userData.coins||0)-amt});
    // Credit recipient
    const recipSnap=await db.ref('users/'+post.uid+'/coins').get();
    const recipCoins=(recipSnap.exists()?recipSnap.val():0)+amt;
    await db.ref('users/'+post.uid+'/coins').set(recipCoins);
    // Update raised amount
    await db.ref('begging/'+id+'/raised').set((post.raised||0)+amt);
    toast('🙏 Donated '+fmtCoins(amt)+' coins!');
  }catch(e){toast('Error: '+e.message);}
};

window.submitBegPost=async function(){
  const reason=(document.getElementById('beg-reason').value||'').trim();
  const goal=parseInt(document.getElementById('beg-goal').value)||0;
  const msgEl=document.getElementById('beg-post-msg');
  function setMsg(t,c){if(msgEl){msgEl.textContent=t;msgEl.className='msg '+(c||'');}}
  if(!reason) return setMsg('Describe why you need coins!','error');
  if(goal<100) return setMsg('Goal must be at least 100 coins.','error');
  if(!currentUser) return setMsg('You must be logged in!','error');
  try{
    // Scan for existing post without needing a Firebase index on 'uid'
    const allSnap=await db.ref('begging').limitToLast(100).get();
    if(allSnap.exists()){
      let hasPost=false;
      allSnap.forEach(child=>{if(child.val().uid===currentUser.uid) hasPost=true;});
      if(hasPost) return setMsg('You already have an active begging post! Delete it first.','error');
    }
    await db.ref('begging').push({username:userData.username||'?',uid:currentUser.uid,reason,goal,raised:0,timestamp:Date.now()});
    document.getElementById('beg-reason').value=''; document.getElementById('beg-goal').value='';
    setMsg('✅ Post submitted!','success'); toast('🙏 Begging post created!');
  }catch(e){setMsg('Error: '+e.message,'error');}
};

window.deleteBegPost=async function(id){
  try{
    await db.ref('begging/'+id).remove();
    toast('🗑 Post deleted.');
  }catch(e){toast('Error: '+e.message);}
};

// ════════════════════════════════════════════════
// SEND COINS
// ════════════════════════════════════════════════
function initSendCoins(){
  const histEl=document.getElementById('send-history');
  if(histEl){
    const hist=userData.sendHistory||[];
    if(hist.length===0){histEl.innerHTML='<div style="color:var(--muted);font-size:.8rem;">No sends yet.</div>';}
    else{histEl.innerHTML=hist.slice().reverse().slice(0,20).map(h=>`<div class="sug-card" style="padding:8px 12px;margin-bottom:6px;font-size:.78rem;"><span style="color:var(--gold);">→ ${escHtml(h.to)}</span> <span style="color:#44ff88;">+${fmtCoins(h.amount)} ${coinSymbol}</span> <span style="color:var(--muted);">${new Date(h.time).toLocaleString()}</span></div>`).join('');}
  }
}

window.sendCoins=async function(){
  const toUsername=(document.getElementById('send-username').value||'').trim().toLowerCase();
  const amtRaw=parseInt(document.getElementById('send-amount').value||'0');
  const msgEl=document.getElementById('send-msg');
  function setMsg(t,c){if(msgEl){msgEl.textContent=t;msgEl.className='msg '+(c||'');}}
  if(!toUsername) return setMsg('Enter a username.','error');
  if(!amtRaw||amtRaw<=0) return setMsg('Enter a valid amount.','error');
  if(amtRaw>1000000) return setMsg('Max send is 1,000,000 coins.','error');
  if((userData.coins||0)<amtRaw) return setMsg('Not enough coins!','error');
  if(toUsername===(userData.username||'').toLowerCase()) return setMsg("You can't send to yourself!",'error');
  // Cooldown check: 10 minutes
  const lastSend=userData.lastSendTime||0;
  const cooldownMs=10*60*1000;
  const remaining=cooldownMs-(Date.now()-lastSend);
  if(remaining>0) return setMsg('Cooldown: wait '+fmtTime(remaining)+' before sending again.','error');
  setMsg('Sending...','');
  try{
    // Look up recipient UID
    const snap=await db.ref('usernames/'+toUsername).get();
    if(!snap.exists()) return setMsg('User not found.','error');
    const toUid=snap.val();
    // Deduct from sender
    const newCoins=(userData.coins||0)-amtRaw;
    // Credit recipient
    const recipSnap=await db.ref('users/'+toUid+'/coins').get();
    const recipCoins=(recipSnap.exists()?recipSnap.val():0)+amtRaw;
    await db.ref('users/'+toUid+'/coins').set(recipCoins);
    // Record history
    const sendHistory=[...(userData.sendHistory||[]),{to:toUsername,amount:amtRaw,time:Date.now()}];
    if(sendHistory.length>50) sendHistory.shift();
    await saveUserData({coins:newCoins,lastSendTime:Date.now(),sendHistory});
    setMsg('✅ Sent '+fmtCoins(amtRaw)+' coins to @'+toUsername+'!','success');
    toast('💸 Sent '+fmtCoins(amtRaw)+' '+coinSymbol+' to @'+toUsername);
    document.getElementById('send-username').value='';
    document.getElementById('send-amount').value='';
    initSendCoins();
  }catch(e){setMsg('Error: '+e.message,'error');}
};

// ════════════════════════════════════════════════
// SHOP
// ════════════════════════════════════════════════
function renderShop(tab){
  const tabMap={'themes':'themes','bgfx':'bgeffects','carddecks':'carddecks','coinskinsshop':'coinskins','avatars':'avatars'};
  const tabButtons=['themes','bgfx','carddecks','coinskinsshop','avatars'];
  document.querySelectorAll('.shop-tab').forEach((t,i)=>{
    t.classList.toggle('active', tabButtons[i]===tab);
  });
  const owned=userData.ownedItems||[]; const equipped=userData.equippedItems||{};
  let items, tabKey;
  if(tab==='themes')        {items=SHOP_THEMES;   tabKey='themes';}
  else if(tab==='bgfx')     {items=SHOP_BG_FX;    tabKey='bgfx';}
  else if(tab==='carddecks'){items=SHOP_DECKS;    tabKey='carddecks';}
  else if(tab==='avatars')  {items=SHOP_AVATARS;  tabKey='avatars';}
  else                      {items=SHOP_COINS;    tabKey='coinskinsshop';}

  const TIER_ORDER={common:0,uncommon:1,rare:2,legend:3,mythic:4,divine:5};
  function getTier(item){return item.tier||(item.price===0?'common':item.price<20000?'common':item.price<50000?'uncommon':item.price<150000?'rare':'legend');}
  const sorted=[...items].sort((a,b)=>{
    const ta=TIER_ORDER[getTier(a)]??0, tb=TIER_ORDER[getTier(b)]??0;
    if(ta!==tb) return ta-tb;
    return a.price-b.price;
  });
  document.getElementById('shop-grid').innerHTML=sorted.map(item=>{
    const isOwned=owned.includes(item.id)||item.price===0;
    const isEquipped=equipped[tabKey]===item.id;
    const tier=getTier(item);
const tierClass=tier?'tier-'+tier:'';
const tierLabel=tier==='divine'?'✨ DIVINE':tier==='mythic'?'⚗ MYTHIC':tier==='legend'?'🔥 LEGEND':tier==='rare'?'💠 RARE':tier==='uncommon'?'🔹 UNCOMMON':'⬜ COMMON';

    let preview='';
    if(tab==='themes'){
      const t=SHOP_THEMES.find(x=>x.id===item.id); const bg=t?t.colors.dark:'#02020a', cl=t?t.colors.blue:'#0000ff';
      preview=`<div style="width:100%;height:70px;border-radius:8px;margin-bottom:10px;background:${bg};border:1px solid ${cl}44;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,${cl}28,transparent 70%);"></div><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:1.8rem;">${item.preview}</div><div style="position:absolute;bottom:6px;right:8px;width:16px;height:16px;border-radius:50%;background:${cl};box-shadow:0 0 10px ${cl};"></div></div>`;
    } else if(tab==='bgfx'){
      preview=`<div style="font-size:2.5rem;margin-bottom:10px;">${item.preview}</div>`;
    } else if(tab==='carddecks'){
      const dt=DECK_THEMES[item.id]||DECK_THEMES.classic;
      preview=`<div style="width:52px;height:76px;border-radius:8px;margin:0 auto 10px;background:${dt.backGrad};border:1px solid rgba(255,255,255,.2);display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,.5);"><span style="color:${dt.redSuit};font-size:1rem;font-weight:900">A♥</span><span style="color:${dt.blackSuit};font-size:.8rem;font-weight:900">K♠</span></div>`;
    } else if(tab==='avatars'){
      preview=`<div style="font-size:3rem;margin-bottom:10px;">${item.preview}</div>`;
    } else {
      const skins={
        coin_default:'🪙',coin_blue:'💎',coin_fire:'🔥',coin_star:'⭐',coin_heart:'❤️',
        coin_skull:'💀',coin_moon:'🌙',coin_crown:'👑',coin_alien:'👾',coin_rainbow:'🌈',
        coin_diamond:'💠',coin_lightning:'⚡',coin_gem:'💗',coin_infinity:'♾️',coin_toxic:'☢️',
        coin_angel:'😇',coin_devil:'😈',coin_ghost:'👻',coin_nebula:'🌌',coin_vortex:'🌀',
        coin_prismatic:'🔮',coin_omnipotent:'🌩️',coin_starstruck:'🌟',
        // new skins
        coin_clover:'🍀',coin_bomb:'💣',coin_eye:'👁️',coin_rose:'🌹',coin_trophy:'🏆',
        coin_volcano:'🌋',coin_snowflake:'❄️',coin_sun:'☀️',coin_comet:'☄️',coin_spider:'🕷️',
        coin_trident:'🔱',coin_black:'🖤',coin_axe:'🪓',coin_hypno:'🌀',coin_pixel:'🎮',
        coin_dagger:'🗡️',coin_supernova:'💥',coin_draconus:'🐉',coin_eclipse:'🌒',
        coin_singularity:'🌑',coin_alpha:'🅰️'
      };
      const skinEmoji=skins[item.id]||item.preview||'🪙';
      preview=`<div style="font-size:2.8rem;margin-bottom:10px;">${skinEmoji}</div>`;
    }

    const priceClass=tier==='divine'?'price-divine':tier==='mythic'?'price-mythic':tier==='legend'?'price-legend':'';
    const priceLabel=item.price===0?'Free':coinSymbol+' '+fmtPrice(item.price);

    return`<div class="shop-card${isEquipped?' equipped':isOwned?' owned':''} ${tierClass}">
      ${tierLabel?`<span class="tier-badge ${tier}">${tierLabel}</span>`:''}
      ${preview}
      <div class="shop-name">${item.name}</div>
      <div class="shop-desc">${item.desc}</div>
      <div class="shop-price ${priceClass}">${priceLabel}</div>
      ${isEquipped
        ?`<button class="btn btn-gold" style="font-size:.7rem;padding:8px;margin-top:0;" disabled><span class="btn-text">✓ Active</span></button>`
        :isOwned
          ?`<button class="btn btn-green" style="font-size:.7rem;padding:8px;margin-top:0;" onclick="equipItem('${tabKey}','${item.id}','${tab}')"><span class="btn-text">Equip</span></button>`
          :`<button class="btn" style="font-size:.7rem;padding:8px;margin-top:0;" onclick="buyItem('${item.id}',${item.price},'${tab}','${tabKey}')"><span class="btn-text">Buy ${priceLabel}</span></button>`
      }
    </div>`;
  }).join('');
}

window.showShopTab=function(tab){renderShop(tab);};
window.buyItem=async function(id,price,tab,tabKey){
  if((userData.coins||0)<price){toast('Not enough coins!');return;}
  const owned=[...(userData.ownedItems||[]),id];
  await saveUserData({coins:(userData.coins||0)-price, ownedItems:owned});
  playSound('coin'); toast('✅ Purchased!'); renderShop(tab);
};
window.equipItem=async function(tabKey,id,tab){
  const eq={...(userData.equippedItems||{}),[tabKey]:id};
  await saveUserData({equippedItems:eq});
  if(tabKey==='themes')        applyTheme(id);
  if(tabKey==='coinskinsshop') applyCoinSkin(id);
  if(tabKey==='bgfx')          applyBgFx(id);
  playSound('coin'); toast('✅ Equipped!'); renderShop(tab);
};

function applyCoinSkin(id){
  const skins={
    coin_default:'🪙',coin_blue:'💎',coin_fire:'🔥',coin_star:'⭐',coin_heart:'❤️',
    coin_skull:'💀',coin_moon:'🌙',coin_crown:'👑',coin_alien:'👾',coin_rainbow:'🌈',
    coin_diamond:'💠',coin_lightning:'⚡',coin_gem:'💗',coin_infinity:'♾️',coin_toxic:'☢️',
    coin_angel:'😇',coin_devil:'😈',coin_ghost:'👻',coin_nebula:'🌌',coin_vortex:'🌀',
    coin_prismatic:'🔮',coin_omnipotent:'🌩️',coin_starstruck:'🌟',
    coin_clover:'🍀',coin_bomb:'💣',coin_eye:'👁️',coin_rose:'🌹',coin_trophy:'🏆',
    coin_volcano:'🌋',coin_snowflake:'❄️',coin_sun:'☀️',coin_comet:'☄️',coin_spider:'🕷️',
    coin_trident:'🔱',coin_black:'🖤',coin_axe:'🪓',coin_hypno:'🌀',coin_pixel:'🎮',
    coin_dagger:'🗡️',coin_supernova:'💥',coin_draconus:'🐉',coin_eclipse:'🌒',
    coin_singularity:'🌑',coin_alpha:'🅰️'
  };
  coinSymbol=skins[id]||'🪙'; refreshCoinDisplays();
}
function applyTheme(id){
  const t=SHOP_THEMES.find(x=>x.id===id)||SHOP_THEMES[0]; const col=t.colors;
  document.documentElement.style.setProperty('--blue',col.blue);
  document.documentElement.style.setProperty('--blue-glow',col.glow);
  document.documentElement.style.setProperty('--dark',col.dark);
  document.documentElement.style.setProperty('--border','rgba(0,0,0,0)'); // reset then set
  // Recompute border from blue
  document.documentElement.style.setProperty('--border',col.blue+'80');
  window._themeParticleColor=col.particle;
  window._themeGridColor=col.gridColor;
}
function applyBgFx(id){
  window._bgFxId=id;
  if(window._fxReinit) window._fxReinit(id);
}

// ════════════════════════════════════════════════
// DAILY SPIN
// ════════════════════════════════════════════════
const SPIN_PRIZES=[500,1000,2500,5000,250,750,100,3000,10000,1500];
const SPIN_COLORS=['#0000ff','#0022cc','#0044aa','#1100aa','#2200aa','#001188','#001166','#0033bb','#0055cc','#0044dd'];
let wheelAngle=0, wheelSpinning=false;

function initWheel(){
  const canvas=document.getElementById('wheelCanvas'); if(!canvas) return;
  drawWheelCanvas(canvas.getContext('2d'),wheelAngle);
  const today=new Date().toDateString(); const btn=document.getElementById('spin-btn');
  if(btn){const alreadySpun=userData.lastSpin===today;btn.disabled=alreadySpun;if(btn.querySelector('.btn-text'))btn.querySelector('.btn-text').textContent=alreadySpun?'Come back tomorrow!':'Spin the Wheel!';}
}
function drawWheelCanvas(ctx,angle){
  const cx=200,cy=200,r=180; ctx.clearRect(0,0,400,400);
  const slice=Math.PI*2/SPIN_PRIZES.length;
  SPIN_PRIZES.forEach((prize,i)=>{
    const start=angle+i*slice, end=start+slice;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,start,end); ctx.closePath();
    ctx.fillStyle=SPIN_COLORS[i]; ctx.fill();
    ctx.strokeStyle='rgba(0,0,100,.55)'; ctx.lineWidth=2; ctx.stroke();
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(start+slice/2);
    ctx.textAlign='right'; ctx.fillStyle='#fff'; ctx.font='bold 12px Montserrat';
    ctx.fillText(coinSymbol+fmtCoins(prize),r-8,5); ctx.restore();
  });
  ctx.beginPath(); ctx.arc(cx,cy,22,0,Math.PI*2);
  ctx.fillStyle='#02020a'; ctx.fill(); ctx.strokeStyle='rgba(0,0,255,.7)'; ctx.lineWidth=3; ctx.stroke();
}

window.spinWheel=async function(){
  if(wheelSpinning) return;
  const today=new Date().toDateString();
  if(userData.lastSpin===today){toast('Already spun today! Come back tomorrow.');return;}
  wheelSpinning=true; document.getElementById('spin-btn').disabled=true;
  document.getElementById('spin-result').textContent='';
  playSound('spin');
  const canvas=document.getElementById('wheelCanvas'); const ctx=canvas.getContext('2d');
  const target=rand(0,SPIN_PRIZES.length-1);
  const slice=Math.PI*2/SPIN_PRIZES.length; const spins=5;
  const finalAngle=spins*Math.PI*2+(Math.PI*2-(target*slice)-(slice/2))-(Math.PI/2);
  const startAngle=wheelAngle, dur=4500, startT=Date.now();
  function easeOut(t){return 1-Math.pow(1-t,4);}
  function frame(){
    const elapsed=Date.now()-startT, progress=Math.min(elapsed/dur,1);
    wheelAngle=startAngle+finalAngle*easeOut(progress); drawWheelCanvas(ctx,wheelAngle);
    if(progress<1){requestAnimationFrame(frame);}
    else{
      const prize=SPIN_PRIZES[target];
      document.getElementById('spin-result').textContent='🎉 You won '+fmtCoins(prize)+' coins!';
      addCoins(prize,'Daily Spin');
      const yesterday=new Date(); yesterday.setDate(yesterday.getDate()-1);
      const wasYesterday=userData.lastSpin===yesterday.toDateString();
      const newStreak=wasYesterday?(userData.spinStreak||0)+1:1;
      saveUserData({lastSpin:today,spinStreak:newStreak});
      if(newStreak>=7) unlockAchievement('daily_7');
      playSound(prize>=5000?'bigwin':'win'); wheelSpinning=false;
      document.getElementById('daily-banner').style.display='none';
      if(document.getElementById('spin-btn')) document.getElementById('spin-btn').querySelector('.btn-text').textContent='Come back tomorrow!';
    }
  }
  requestAnimationFrame(frame);
};

// ════════════════════════════════════════════════
// AUTH
// ════════════════════════════════════════════════
function switchTab(tab){
  document.getElementById('tab-login').classList.toggle('active',tab==='login');
  document.getElementById('tab-signup').classList.toggle('active',tab==='signup');
  document.getElementById('panel-login').classList.toggle('active',tab==='login');
  document.getElementById('panel-signup').classList.toggle('active',tab==='signup');
  clearMsg('login-msg'); clearMsg('signup-msg');
}
const AUTH_ERRORS={
  'auth/email-already-in-use':'Username taken.',
  'auth/weak-password':'Password too short.',
  'auth/network-request-failed':'Network error.',
  'auth/user-not-found':'No account found.',
  'auth/wrong-password':'Wrong password.',
  'auth/invalid-credential':'Wrong username or password.',
  'auth/too-many-requests':'Too many attempts.'
};

async function doSignup(){
  const username=document.getElementById('signup-username').value.trim().toLowerCase().replace(/[^a-z0-9_]/g,'');
  const password=document.getElementById('signup-password').value;
  const confirm=document.getElementById('signup-confirm').value;
  document.getElementById('signup-username').value=username;
  if(!username||username.length<3) return showMsg('signup-msg','Username must be 3+ characters.','error');
  if(password.length<6) return showMsg('signup-msg','Password must be 6+ characters.','error');
  if(password!==confirm) return showMsg('signup-msg','Passwords don\'t match.','error');
  setLoading('signup-btn',true,'Create Account');
  try{
    const cred=await auth.createUserWithEmailAndPassword(username+'@sncasino.app',password);
    const uid=cred.user.uid, now=Date.now();
    const snap=await db.ref('usernames/'+username).get();
    if(snap.exists()){await cred.user.delete();showMsg('signup-msg','Username taken.','error');setLoading('signup-btn',false,'Create Account');return;}
    const newUserData={
      username, coins:10000, role:'user', createdAt:now, lastLogin:now,
      totalEarned:0, totalLost:0, gamesPlayed:0, biggestWin:0, biggestLoss:0,
      timeSpent:0, totalWagered:0, totalBets:0, achievements:[], ownedItems:[],
      equippedItems:{}, balanceHistory:[10000]
    };
    await db.ref('users/'+uid).set(newUserData);
    await db.ref('usernames/'+username).set(uid);
    // FIX: Immediately populate userData so coin display is correct on first load
    userData=newUserData;
    currentUser=cred.user;
  }catch(e){showMsg('signup-msg',AUTH_ERRORS[e.code]||e.message,'error');setLoading('signup-btn',false,'Create Account');}
}

async function doLogin(){
  const username=document.getElementById('login-username').value.trim().toLowerCase();
  const password=document.getElementById('login-password').value;
  if(!username) return showMsg('login-msg','Enter username.','error');
  if(!password) return showMsg('login-msg','Enter password.','error');
  setLoading('login-btn',true,'Enter Casino');
  try{await auth.signInWithEmailAndPassword(username+'@sncasino.app',password);}
  catch(e){showMsg('login-msg',AUTH_ERRORS[e.code]||e.message,'error');setLoading('login-btn',false,'Enter Casino');}
}

async function doSignOut(){
  const spent=(userData.timeSpent||0)+(Date.now()-sessionStart);
  try{await db.ref('users/'+currentUser.uid+'/timeSpent').set(spent);}catch(e){}
  await auth.signOut(); showScreen('auth');
}

// ════════════════════════════════════════════════
// AUTH STATE
// ════════════════════════════════════════════════
auth.onAuthStateChanged(async(user)=>{
  if(user){
    currentUser=user; sessionStart=Date.now();
    const snap=await db.ref('users/'+user.uid).get();
    if(snap.exists()){
      userData=snap.val(); const name=userData.username||'Player';
      ['user-name','game-username'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent='@'+name;});
      const wn=document.getElementById('welcome-name'); if(wn) wn.textContent=name;
      if(userData.equippedItems?.themes)        applyTheme(userData.equippedItems.themes);
      if(userData.equippedItems?.coinskinsshop) applyCoinSkin(userData.equippedItems.coinskinsshop);
      if(userData.equippedItems?.bgfx)          {window._bgFxId=userData.equippedItems.bgfx; if(window._fxReinit) window._fxReinit(userData.equippedItems.bgfx);}
      refreshCoinDisplays();
      const today=new Date().toDateString();
      const db_banner=document.getElementById('daily-banner');
      if(db_banner) db_banner.style.display=userData.lastSpin===today?'none':'block';
      checkBailout(); await saveUserData({lastLogin:Date.now()});
    }
    showScreen('lobby');
  } else {
    currentUser=null; userData={}; showScreen('auth');
  }
});

// ════════════════════════════════════════════════
// CANVAS BACKGROUND
// ════════════════════════════════════════════════
(function(){
  const canvas=document.getElementById('bgCanvas'); const ctx=canvas.getContext('2d');
  let W, H, particles=[], fxPool=[];

  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;reinitAll();}

  class Particle{
    constructor(){this.reset(true);}
    reset(init){this.x=Math.random()*W;this.y=init?Math.random()*H:H+10;this.vy=-(0.15+Math.random()*0.4);this.vx=(Math.random()-.5)*.15;this.size=0.8+Math.random()*1.8;this.alpha=.12+Math.random()*.45;this.life=0;this.maxLife=250+Math.random()*350;}
    update(){this.x+=this.vx;this.y+=this.vy;this.life++;if(this.y<-10||this.life>this.maxLife)this.reset(false);}
    draw(){const f=Math.min(this.life/50,1)*Math.min((this.maxLife-this.life)/50,1);ctx.globalAlpha=this.alpha*f;ctx.fillStyle=window._themeParticleColor||'#0000ff';ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);ctx.fill();}
  }

  // Stars
  class Star{constructor(){this.reset();}reset(){this.x=Math.random()*W;this.y=Math.random()*H;this.len=60+Math.random()*120;this.speed=4+Math.random()*6;this.alpha=0.6+Math.random()*0.4;this.life=0;this.maxLife=60+Math.random()*60;}update(){this.x+=this.speed;this.y+=this.speed*0.4;this.life++;if(this.x>W+this.len||this.life>this.maxLife)this.reset();}draw(){const f=1-this.life/this.maxLife;ctx.globalAlpha=this.alpha*f;ctx.strokeStyle='rgba(255,255,255,.95)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(this.x,this.y);ctx.lineTo(this.x-this.len,this.y-this.len*0.4);ctx.stroke();}}

  // Matrix
  let matrixCols=[];
  function initMatrix(){matrixCols=[];const cols=Math.floor(W/14);for(let i=0;i<cols;i++)matrixCols.push({x:i*14,y:Math.random()*H,speed:2+Math.random()*4,chars:'01アイウエオカキサシスセタチツ'.split(''),alpha:0.55+Math.random()*0.4});}
  function drawMatrix(){
    ctx.globalAlpha=1;ctx.fillStyle='rgba(0,8,0,.18)';ctx.fillRect(0,0,W,H);
    ctx.font='13px monospace';
    matrixCols.forEach(col=>{col.y+=col.speed;if(col.y>H+20)col.y=-20;ctx.globalAlpha=col.alpha;ctx.fillStyle='#00ff44';ctx.fillText(col.chars[Math.floor(Math.random()*col.chars.length)],col.x,col.y);ctx.globalAlpha=col.alpha*0.3;for(let i=1;i<=6;i++){if(col.y-i*14>0){ctx.fillStyle=`hsl(130,100%,${40-i*5}%)`;ctx.fillText(col.chars[Math.floor(Math.random()*col.chars.length)],col.x,col.y-i*14);}}});
  }

  // Confetti
  class Confetti{constructor(){this.reset();}reset(){this.x=Math.random()*W;this.y=-20;this.vx=(Math.random()-.5)*3;this.vy=1.5+Math.random()*3;this.rot=Math.random()*Math.PI*2;this.rotV=(Math.random()-.5)*.15;this.w=6+Math.random()*10;this.h=4+Math.random()*6;this.hue=Math.random()*360;}update(){this.x+=this.vx+Math.sin(this.y*.02)*.5;this.y+=this.vy;this.rot+=this.rotV;if(this.y>H+20)this.reset();}draw(){ctx.globalAlpha=0.82;ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.rot);ctx.fillStyle=`hsl(${this.hue},90%,60%)`;ctx.fillRect(-this.w/2,-this.h/2,this.w,this.h);ctx.restore();}}

  // Fire
  class Ember{constructor(){this.reset();}reset(){this.x=Math.random()*W;this.y=H+10;this.vx=(Math.random()-.5)*1.5;this.vy=-(1.5+Math.random()*3);this.size=1.5+Math.random()*3;this.alpha=0.6+Math.random()*.4;this.life=0;this.maxLife=120+Math.random()*80;this.hue=rand(0,45);}update(){this.x+=this.vx+Math.sin(this.life*.08)*.5;this.y+=this.vy;this.life++;if(this.y<-10||this.life>this.maxLife)this.reset();}draw(){const f=1-this.life/this.maxLife;ctx.globalAlpha=this.alpha*f;ctx.fillStyle=`hsl(${this.hue},100%,${50+f*30}%)`;ctx.beginPath();ctx.arc(this.x,this.y,this.size*f+0.5,0,Math.PI*2);ctx.fill();}}

  // Bubbles
  class Bubble{constructor(){this.reset();}reset(){this.x=Math.random()*W;this.y=H+20;this.r=8+Math.random()*20;this.vy=-(0.5+Math.random()*1.5);this.vx=(Math.random()-.5)*.5;this.alpha=0.2+Math.random()*.3;this.hue=rand(180,260);}update(){this.x+=this.vx+Math.sin(this.y*.02)*.4;this.y+=this.vy;if(this.y<-this.r*2)this.reset();}draw(){ctx.globalAlpha=this.alpha;ctx.strokeStyle=`hsl(${this.hue},100%,70%)`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=this.alpha*.4;ctx.fillStyle=`hsl(${this.hue},100%,80%)`;ctx.fill();}}

  // Snow
  class Snowflake{constructor(){this.reset(true);}reset(init){this.x=Math.random()*W;this.y=init?Math.random()*H:-10;this.r=1.5+Math.random()*3.5;this.vy=0.5+Math.random()*1.5;this.vx=(Math.random()-.5)*.4;this.alpha=0.55+Math.random()*.4;this.wobble=Math.random()*Math.PI*2;}update(){this.y+=this.vy;this.wobble+=.02;this.x+=this.vx+Math.sin(this.wobble)*.5;if(this.y>H+10)this.reset(false);}draw(){ctx.globalAlpha=this.alpha;ctx.fillStyle='#eef8ff';ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fill();}}

  // Aurora
  let auroraT=0;
  function drawAurora(){auroraT+=0.004;for(let band=0;band<5;band++){const y=H*0.1+band*H*0.1+Math.sin(auroraT+band*1.3)*40;const grad=ctx.createLinearGradient(0,y-80,0,y+80);const hues=[160,175,195,140,210];grad.addColorStop(0,'transparent');grad.addColorStop(0.35,`hsla(${hues[band]},100%,55%,.08)`);grad.addColorStop(0.6,`hsla(${hues[band]},100%,60%,.18)`);grad.addColorStop(1,'transparent');ctx.globalAlpha=1;for(let x=0;x<W;x+=3){const wave=Math.sin(x*.006+auroraT*(band+1)*.25)*60;ctx.fillStyle=grad;ctx.fillRect(x,y+wave-80,3,160);}}}

  // Lightning
  let lightningTimer=0;
  function drawLightning(){lightningTimer++;if(lightningTimer%90!==0&&lightningTimer%90!==2&&lightningTimer%90!==4)return;ctx.globalAlpha=0.75;ctx.strokeStyle='rgba(180,180,255,.95)';ctx.lineWidth=2;ctx.shadowColor='rgba(150,150,255,1)';ctx.shadowBlur=20;let x=rand(W*.1,W*.9),y=0;ctx.beginPath();ctx.moveTo(x,y);while(y<H*.7){y+=rand(20,50);x+=rand(-40,40);ctx.lineTo(x,y);}ctx.stroke();ctx.shadowBlur=0;}

  // Neon Rain
  class NeonRain{constructor(){this.reset();}reset(){this.x=Math.random()*W;this.y=-rand(0,H);this.len=rand(20,80);this.speed=6+Math.random()*8;this.hue=rand(160,300);this.alpha=0.45+Math.random()*.4;}update(){this.y+=this.speed;if(this.y-this.len>H)this.reset();}draw(){const grad=ctx.createLinearGradient(this.x,this.y-this.len,this.x,this.y);grad.addColorStop(0,'transparent');grad.addColorStop(1,`hsla(${this.hue},100%,70%,${this.alpha})`);ctx.globalAlpha=1;ctx.strokeStyle=grad;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(this.x,this.y-this.len);ctx.lineTo(this.x,this.y);ctx.stroke();}}

  // Meteor Shower
  class Meteor{constructor(){this.reset();}reset(){this.x=Math.random()*W;this.y=-50;this.vx=3+Math.random()*5;this.vy=4+Math.random()*7;this.len=80+Math.random()*120;this.alpha=0.6+Math.random()*.4;this.life=0;this.maxLife=80+rand(0,60);}update(){this.x+=this.vx;this.y+=this.vy;this.life++;if(this.y>H+50||this.life>this.maxLife)this.reset();}draw(){const f=1-this.life/this.maxLife;const grad=ctx.createLinearGradient(this.x,this.y,this.x-this.vx*8,this.y-this.vy*8);grad.addColorStop(0,`rgba(255,220,150,${this.alpha*f})`);grad.addColorStop(1,'transparent');ctx.globalAlpha=1;ctx.strokeStyle=grad;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(this.x,this.y);ctx.lineTo(this.x-this.vx*8,this.y-this.vy*8);ctx.stroke();}}

  // Fireflies
  class Firefly{constructor(){this.reset();}reset(){this.x=Math.random()*W;this.y=Math.random()*H;this.vx=(Math.random()-.5)*.8;this.vy=(Math.random()-.5)*.8;this.alpha=0;this.targetAlpha=0.4+Math.random()*.5;this.phase=Math.random()*Math.PI*2;this.r=2+Math.random()*3;}update(){this.x+=this.vx+Math.sin(this.phase)*0.3;this.y+=this.vy+Math.cos(this.phase)*0.3;this.phase+=0.04;if(this.x<0)this.x=W;if(this.x>W)this.x=0;if(this.y<0)this.y=H;if(this.y>H)this.y=0;this.alpha=this.targetAlpha*(0.5+0.5*Math.sin(this.phase*2));}draw(){ctx.globalAlpha=this.alpha;ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fillStyle='#aaff66';ctx.fill();ctx.globalAlpha=this.alpha*0.3;ctx.beginPath();ctx.arc(this.x,this.y,this.r*3,0,Math.PI*2);ctx.fillStyle='#88ff44';ctx.fill();}}

  // Sakura
  class Sakura{constructor(){this.reset();}reset(){this.x=Math.random()*W;this.y=-20;this.vy=0.8+Math.random()*1.8;this.vx=(Math.random()-.5)*1.2;this.rot=Math.random()*Math.PI*2;this.rotV=(Math.random()-.5)*.06;this.size=6+Math.random()*10;this.alpha=0.55+Math.random()*.4;this.hue=330+rand(0,30);}update(){this.x+=this.vx+Math.sin(this.y*.015)*0.8;this.y+=this.vy;this.rot+=this.rotV;if(this.y>H+20)this.reset();}draw(){ctx.globalAlpha=this.alpha;ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.rot);ctx.fillStyle=`hsl(${this.hue},90%,80%)`;for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse(0,-this.size/2,this.size/4,this.size/2,i*(Math.PI*2/5),0,Math.PI*2);ctx.fill();}ctx.restore();}}

  // Lava Lamp
  class LavaBlob{constructor(){this.reset();}reset(){this.x=W*0.2+Math.random()*W*0.6;this.y=H+100;this.r=40+Math.random()*80;this.vy=-(0.3+Math.random()*0.6);this.vx=(Math.random()-.5)*0.4;this.alpha=0.12+Math.random()*.15;this.hue=rand(0,40);}update(){this.y+=this.vy;this.x+=this.vx;if(this.y<-this.r*2)this.reset();}draw(){const grad=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r);grad.addColorStop(0,`hsla(${this.hue},100%,60%,${this.alpha})`);grad.addColorStop(1,`hsla(${this.hue},100%,40%,0)`);ctx.globalAlpha=1;ctx.fillStyle=grad;ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fill();}}

  // Glitch
  let glitchTimer=0;
  function drawGlitch(){glitchTimer++;if(glitchTimer%30!==0&&glitchTimer%30!==1&&glitchTimer%30!==2)return;for(let i=0;i<rand(1,5);i++){const y=Math.random()*H;const h=rand(2,20);const offset=rand(-60,60);ctx.globalAlpha=0.3+Math.random()*.5;const imgData=ctx.getImageData(0,y,W,h);ctx.putImageData(imgData,offset,y);}ctx.globalAlpha=0.15;ctx.fillStyle=`hsl(${rand(0,360)},100%,60%)`;ctx.fillRect(0,Math.random()*H,W,rand(1,4));}

  // Vortex
  let vortexAngle=0;
  function drawVortex(){vortexAngle+=0.015;for(let i=0;i<80;i++){const a=vortexAngle+i*(Math.PI*2/80);const r=50+i*3.5;const x=W/2+Math.cos(a)*r;const y=H/2+Math.sin(a)*r;const hue=(i*4+vortexAngle*30)%360;ctx.globalAlpha=0.18+Math.sin(i*0.2)*0.08;ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);ctx.fillStyle=`hsl(${hue},100%,65%)`;ctx.fill();}}

  // Rainbow Waves
  let waveT=0;
  function drawRainbowWaves(){waveT+=0.012;for(let i=0;i<8;i++){const y=H*(i/8)+Math.sin(waveT+i)*40;ctx.globalAlpha=0.08+Math.sin(waveT*2+i)*0.04;ctx.strokeStyle=`hsl(${(i*45+waveT*20)%360},100%,65%)`;ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(0,y);for(let x=0;x<W;x+=10){ctx.lineTo(x,y+Math.sin(x*0.02+waveT+i)*30);}ctx.stroke();}}

  // Storm
  let stormTimer=0;
  function drawStorm(){stormTimer++;if(stormTimer%40===0||stormTimer%40===1||stormTimer%40===2){ctx.globalAlpha=0.7;ctx.strokeStyle='rgba(200,200,255,.9)';ctx.lineWidth=2;ctx.shadowColor='rgba(150,150,255,1)';ctx.shadowBlur=25;let x=rand(W*.1,W*.9),y=0;ctx.beginPath();ctx.moveTo(x,y);while(y<H*.8){y+=rand(15,40);x+=rand(-50,50);ctx.lineTo(x,y);}ctx.stroke();ctx.shadowBlur=0;}// Heavy rain
    ctx.globalAlpha=0.18;ctx.strokeStyle='rgba(150,180,255,.7)';ctx.lineWidth=1;for(let i=0;i<30;i++){const rx=Math.random()*W;const ry=Math.random()*H;ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx+5,ry+18);ctx.stroke();}ctx.globalAlpha=1;}

  // Portal Rift
  let portalT=0;
  function drawPortal(){portalT+=0.02;const cx2=W/2,cy2=H/2;for(let ring=0;ring<6;ring++){const r=80+ring*40+Math.sin(portalT+ring)*20;const hue=(portalT*30+ring*40)%360;ctx.globalAlpha=0.1+ring*0.02;ctx.strokeStyle=`hsl(${hue},100%,65%)`;ctx.lineWidth=3-ring*0.3;ctx.beginPath();ctx.ellipse(cx2,cy2,r,r*0.5,portalT*0.3,0,Math.PI*2);ctx.stroke();}ctx.globalAlpha=0.15;const grad=ctx.createRadialGradient(cx2,cy2,0,cx2,cy2,100);grad.addColorStop(0,`hsla(${(portalT*50)%360},100%,70%,.4)`);grad.addColorStop(1,'transparent');ctx.fillStyle=grad;ctx.beginPath();ctx.ellipse(cx2,cy2,100,50,portalT*0.3,0,Math.PI*2);ctx.fill();}

  // Cosmic Rift
  let cosmicT=0;
  function drawCosmicRift(){cosmicT+=0.008;// Multiple rifts
    for(let rift=0;rift<3;rift++){const rx=W*(0.25+rift*0.25)+Math.sin(cosmicT+rift)*80;const ry=H/2+Math.cos(cosmicT*0.7+rift)*100;for(let ring=0;ring<8;ring++){const r=30+ring*25+Math.sin(cosmicT*2+rift+ring)*15;const hue=(cosmicT*40+rift*120+ring*20)%360;ctx.globalAlpha=0.12+Math.sin(cosmicT+ring)*0.05;ctx.strokeStyle=`hsl(${hue},100%,70%)`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(rx,ry,r,0,Math.PI*2);ctx.stroke();}}ctx.globalAlpha=1;}

  // === NEW BG EFFECT CLASSES ===
  // Galaxy Spiral — slow rotating dots
  let galaxyAngle=0;
  function drawGalaxySpiral(){galaxyAngle+=0.003;for(let arm=0;arm<3;arm++){for(let i=0;i<80;i++){const a=galaxyAngle+arm*(Math.PI*2/3)+i*0.15;const r=20+i*5.5;const x=W/2+Math.cos(a)*r;const y=H/2+Math.sin(a)*r*0.45;const hue=(i*4+galaxyAngle*40)%360;ctx.globalAlpha=0.2-i*0.002;ctx.beginPath();ctx.arc(x,y,1.5+i*0.03,0,Math.PI*2);ctx.fillStyle=`hsl(${hue},80%,70%)`;ctx.fill();}}ctx.globalAlpha=1;}

  // Blood Rain
  class BloodDrop{constructor(){this.reset();}reset(){this.x=Math.random()*W;this.y=-rand(0,H);this.len=rand(25,70);this.speed=7+Math.random()*9;this.alpha=0.4+Math.random()*.5;}update(){this.y+=this.speed;if(this.y-this.len>H)this.reset();}draw(){const grad=ctx.createLinearGradient(this.x,this.y-this.len,this.x,this.y);grad.addColorStop(0,'transparent');grad.addColorStop(1,`rgba(180,0,0,${this.alpha})`);ctx.globalAlpha=1;ctx.strokeStyle=grad;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(this.x,this.y-this.len);ctx.lineTo(this.x,this.y);ctx.stroke();}}

  // Heartbeat Pulse
  let heartbeatT=0;
  function drawHeartbeat(){heartbeatT+=0.04;const pulse=0.5+0.5*Math.abs(Math.sin(heartbeatT*1.8));ctx.globalAlpha=pulse*0.18;const g=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.min(W,H)*0.6);g.addColorStop(0,'rgba(255,0,50,.9)');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);// ECG line
    ctx.globalAlpha=pulse*0.6;ctx.strokeStyle='rgba(255,60,60,.9)';ctx.lineWidth=2;ctx.beginPath();const cy=H*0.55;const step=W/100;ctx.moveTo(0,cy);for(let i=0;i<100;i++){const px=i*step;let py=cy;const phase=(heartbeatT*3+i*0.08)%(Math.PI*2);if(phase>0.8&&phase<1.2)py=cy-80;else if(phase>1.2&&phase<1.35)py=cy+40;else if(phase>1.35&&phase<1.55)py=cy-150*Math.exp(-Math.pow((phase-1.45)*8,2));ctx.lineTo(px,py);}ctx.stroke();ctx.globalAlpha=1;}

  // Web Crawl
  class WebNode{constructor(){this.x=Math.random()*W;this.y=Math.random()*H;this.vx=(Math.random()-.5)*0.3;this.vy=(Math.random()-.5)*0.3;}update(){this.x+=this.vx;this.y+=this.vy;if(this.x<0||this.x>W)this.vx*=-1;if(this.y<0||this.y>H)this.vy*=-1;}}
  let webNodes=[];
  function drawWebCrawl(){if(webNodes.length===0)for(let i=0;i<20;i++)webNodes.push(new WebNode());webNodes.forEach(n=>n.update());for(let i=0;i<webNodes.length;i++){for(let j=i+1;j<webNodes.length;j++){const dx=webNodes[i].x-webNodes[j].x,dy=webNodes[i].y-webNodes[j].y;const d=Math.sqrt(dx*dx+dy*dy);if(d<180){ctx.globalAlpha=(1-d/180)*0.25;ctx.strokeStyle='rgba(200,200,255,.8)';ctx.lineWidth=0.8;ctx.beginPath();ctx.moveTo(webNodes[i].x,webNodes[i].y);ctx.lineTo(webNodes[j].x,webNodes[j].y);ctx.stroke();}}}webNodes.forEach(n=>{ctx.globalAlpha=0.5;ctx.beginPath();ctx.arc(n.x,n.y,3,0,Math.PI*2);ctx.fillStyle='rgba(200,200,255,.7)';ctx.fill();});ctx.globalAlpha=1;}

  // Neon Grid Lines
  let gridT=0;
  function drawNeonGridLines(){gridT+=0.02;for(let i=0;i<8;i++){const offset=((gridT*60*((i%2===0)?1:-1)+i*120)%H+H)%H;ctx.globalAlpha=0.12+Math.sin(gridT+i)*0.06;ctx.strokeStyle=`hsl(${(i*45+gridT*20)%360},100%,65%)`;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,offset);ctx.lineTo(W,offset);ctx.stroke();}for(let i=0;i<6;i++){const offset=((gridT*40*((i%2===0)?1:-1)+i*150)%W+W)%W;ctx.globalAlpha=0.1+Math.sin(gridT*1.3+i)*0.05;ctx.strokeStyle=`hsl(${(i*60+gridT*15)%360},100%,65%)`;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(offset,0);ctx.lineTo(offset,H);ctx.stroke();}ctx.globalAlpha=1;}

  // Butterflies
  class Butterfly{constructor(){this.reset();}reset(){this.x=Math.random()*W;this.y=Math.random()*H;this.vx=(Math.random()-.5)*1.2;this.vy=(Math.random()-.5)*1.2;this.phase=Math.random()*Math.PI*2;this.hue=rand(200,340);this.size=10+Math.random()*14;}update(){this.phase+=0.06;this.x+=this.vx+Math.sin(this.phase*0.7)*0.8;this.y+=this.vy+Math.cos(this.phase*0.5)*0.6;if(this.x<-30)this.x=W+30;if(this.x>W+30)this.x=-30;if(this.y<-30)this.y=H+30;if(this.y>H+30)this.y=-30;}draw(){const wing=Math.abs(Math.sin(this.phase))*this.size;ctx.globalAlpha=0.65;ctx.fillStyle=`hsl(${this.hue},90%,70%)`;ctx.beginPath();ctx.ellipse(this.x-wing/2,this.y,wing,wing*0.6,Math.PI*0.1,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(this.x+wing/2,this.y,wing,wing*0.6,-Math.PI*0.1,0,Math.PI*2);ctx.fill();}}

  // Falling Dice
  class FallingDie{constructor(){this.reset();}reset(){this.x=Math.random()*W;this.y=-60;this.size=22+Math.random()*20;this.vy=1.2+Math.random()*2.5;this.vx=(Math.random()-.5)*1.5;this.rot=Math.random()*Math.PI*2;this.rotV=(Math.random()-.5)*0.06;this.face=Math.ceil(Math.random()*6);}update(){this.y+=this.vy;this.x+=this.vx;this.rot+=this.rotV;if(this.y>H+70)this.reset();}draw(){ctx.globalAlpha=0.55;ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.rot);const s=this.size;ctx.fillStyle='rgba(30,30,60,.85)';ctx.strokeStyle='rgba(100,100,255,.7)';ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(-s,-s,s*2,s*2,6);ctx.fill();ctx.stroke();ctx.fillStyle='rgba(150,180,255,.9)';const dots={1:[[0,0]],2:[[-s*.45,-s*.45],[s*.45,s*.45]],3:[[-s*.45,-s*.45],[0,0],[s*.45,s*.45]],4:[[-s*.45,-s*.45],[s*.45,-s*.45],[-s*.45,s*.45],[s*.45,s*.45]],5:[[-s*.45,-s*.45],[s*.45,-s*.45],[0,0],[-s*.45,s*.45],[s*.45,s*.45]],6:[[-s*.45,-s*.45],[s*.45,-s*.45],[-s*.45,0],[s*.45,0],[-s*.45,s*.45],[s*.45,s*.45]]};(dots[this.face]||dots[1]).forEach(([dx,dy])=>{ctx.beginPath();ctx.arc(dx,dy,s*.12,0,Math.PI*2);ctx.fill();});ctx.restore();}}

  // Apocalypse — meteors + fire
  let apocalypseTimer=0;
  class ApocMeteor{constructor(){this.reset();}reset(){this.x=Math.random()*W;this.y=-100;this.vx=2+Math.random()*6;this.vy=5+Math.random()*10;this.len=100+Math.random()*150;this.alpha=0.7+Math.random()*.3;}update(){this.x+=this.vx;this.y+=this.vy;if(this.y>H+100)this.reset();}draw(){const grad=ctx.createLinearGradient(this.x,this.y,this.x-this.vx*6,this.y-this.vy*6);grad.addColorStop(0,`rgba(255,180,50,${this.alpha})`);grad.addColorStop(1,'transparent');ctx.globalAlpha=1;ctx.strokeStyle=grad;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(this.x,this.y);ctx.lineTo(this.x-this.vx*6,this.y-this.vy*6);ctx.stroke();}}
  function drawApocalypse(){fxPool.forEach(p=>{p.update();p.draw();});// Screen shake tint
    if(Math.random()<0.03){ctx.globalAlpha=0.08;ctx.fillStyle='rgba(255,50,0,1)';ctx.fillRect(0,0,W,H);}ctx.globalAlpha=1;}

  // Time Warp
  let timeWarpT=0;
  function drawTimeWarp(){timeWarpT+=0.015;// Melting clocks / grid warp
    ctx.globalAlpha=0.12;for(let y=0;y<H;y+=50){ctx.strokeStyle=`hsl(${(timeWarpT*30+y)%360},80%,60%)`;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,y+Math.sin(timeWarpT+y*.02)*30);for(let x=0;x<W;x+=8){ctx.lineTo(x,y+Math.sin(timeWarpT+x*.015+y*.02)*30);}ctx.stroke();}// Rotating clock hands
    for(let c=0;c<5;c++){const cx=W*(0.15+c*0.18)+Math.sin(timeWarpT+c)*50;const cy=H*(0.3+c*0.12)+Math.cos(timeWarpT*0.7+c)*40;const r=25+Math.sin(timeWarpT*2+c)*10;ctx.globalAlpha=0.2;ctx.strokeStyle=`hsl(${(c*60+timeWarpT*20)%360},100%,70%)`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();const a=timeWarpT*(1+c*0.3);ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*r*.8,cy+Math.sin(a)*r*.8);ctx.stroke();}ctx.globalAlpha=1;}

  // God's Hand
  let godHandT=0;
  function drawGodHand(){godHandT+=0.01;// Divine light rays from top
    for(let ray=0;ray<12;ray++){const angle=-Math.PI/2+((ray-6)/6)*Math.PI*0.6+Math.sin(godHandT+ray*0.5)*0.1;const len=H*1.2;const ox=W/2+Math.sin(godHandT*0.3)*100;const oy=-80;ctx.globalAlpha=0.05+Math.sin(godHandT*2+ray*0.8)*0.03;const grad=ctx.createLinearGradient(ox,oy,ox+Math.cos(angle)*len,oy+Math.sin(angle)*len);grad.addColorStop(0,`rgba(255,240,180,.9)`);grad.addColorStop(1,'transparent');ctx.fillStyle=grad;const w=30+ray*5;ctx.beginPath();ctx.moveTo(ox-w/2,oy);ctx.lineTo(ox+w/2,oy);ctx.lineTo(ox+Math.cos(angle)*len+w,oy+Math.sin(angle)*len);ctx.lineTo(ox+Math.cos(angle)*len-w,oy+Math.sin(angle)*len);ctx.closePath();ctx.fill();}// Glowing center orb
    ctx.globalAlpha=0.25+Math.sin(godHandT*3)*0.1;const orb=ctx.createRadialGradient(W/2,0,0,W/2,0,200);orb.addColorStop(0,'rgba(255,250,200,.9)');orb.addColorStop(1,'transparent');ctx.fillStyle=orb;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;}

  function buildFxPool(id){
    fxPool=[];
    if(id==='fx_stars')     for(let i=0;i<30;i++) fxPool.push(new Star());
    else if(id==='fx_confetti') for(let i=0;i<90;i++) fxPool.push(new Confetti());
    else if(id==='fx_fire')     for(let i=0;i<80;i++) fxPool.push(new Ember());
    else if(id==='fx_bubbles')  for(let i=0;i<55;i++) fxPool.push(new Bubble());
    else if(id==='fx_snow')     for(let i=0;i<100;i++) fxPool.push(new Snowflake(true));
    else if(id==='fx_rain')     for(let i=0;i<70;i++) fxPool.push(new NeonRain());
    else if(id==='fx_meteor')   for(let i=0;i<15;i++) fxPool.push(new Meteor());
    else if(id==='fx_fireflies')for(let i=0;i<60;i++) fxPool.push(new Firefly());
    else if(id==='fx_sakura')   for(let i=0;i<80;i++) fxPool.push(new Sakura());
    else if(id==='fx_lava')     for(let i=0;i<18;i++) fxPool.push(new LavaBlob());
    else if(id==='fx_matrix')   initMatrix();
    // NEW EFFECTS
    else if(id==='fx_bloodrain')  for(let i=0;i<65;i++) fxPool.push(new BloodDrop());
    else if(id==='fx_butterflies')for(let i=0;i<35;i++) fxPool.push(new Butterfly());
    else if(id==='fx_dice')       for(let i=0;i<20;i++) fxPool.push(new FallingDie());
    else if(id==='fx_apocalypse') for(let i=0;i<25;i++) fxPool.push(new ApocMeteor());
  }

  function reinitAll(){
    particles=Array.from({length:80},()=>new Particle());
    const fx=window._bgFxId||'fx_none';
    if(fx!=='fx_none') buildFxPool(fx);
  }
  window._fxReinit=function(id){fxPool=[];if(id!=='fx_none')buildFxPool(id);};

  function loop(){
    ctx.globalAlpha=1; ctx.clearRect(0,0,W,H);
    const darkColor=getComputedStyle(document.documentElement).getPropertyValue('--dark').trim()||'#02020a';
    ctx.fillStyle=darkColor; ctx.fillRect(0,0,W,H);

    // Grid lines — brighter
    const gridColor=window._themeGridColor||'rgba(0,0,255,.18)';
    ctx.strokeStyle=gridColor; ctx.lineWidth=1;
    const s=50;
    for(let x=0;x<W;x+=s){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=s){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}

    // Primary center glow — stronger
    const blueColor=getComputedStyle(document.documentElement).getPropertyValue('--blue').trim()||'#0000ff';
    const g1=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.min(W,H)*.99);
    g1.addColorStop(0,blueColor+'38'); g1.addColorStop(1,'transparent');
    ctx.globalAlpha=1; ctx.fillStyle=g1; ctx.fillRect(0,0,W,H);



    // Base floating particles
    particles.forEach(p=>{p.update();p.draw();}); ctx.globalAlpha=1;

    // FX overlay — drawn on top of grid/glow but behind UI (canvas z-index=0)
    const fx=window._bgFxId||'fx_none';
    if(fx==='fx_matrix')      drawMatrix();
    else if(fx==='fx_aurora')  drawAurora();
    else if(fx==='fx_lightning') drawLightning();
    else if(fx==='fx_glitch')  {particles.forEach(p=>{p.update();p.draw();}); drawGlitch();}
    else if(fx==='fx_vortex')  drawVortex();
    else if(fx==='fx_rainbow') drawRainbowWaves();
    else if(fx==='fx_storm')   drawStorm();
    else if(fx==='fx_portal')  drawPortal();
    else if(fx==='fx_cosmic')  drawCosmicRift();
    // NEW EFFECTS
    else if(fx==='fx_galaxy')    drawGalaxySpiral();
    else if(fx==='fx_heartbeat') drawHeartbeat();
    else if(fx==='fx_spiders')   drawWebCrawl();
    else if(fx==='fx_neonlines') drawNeonGridLines();
    else if(fx==='fx_apocalypse') drawApocalypse();
    else if(fx==='fx_timewarp')  drawTimeWarp();
    else if(fx==='fx_godhand')   drawGodHand();
    else{fxPool.forEach(p=>{p.update();p.draw();});}
    ctx.globalAlpha=1;
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize',resize);
  resize();
  loop();
})();

// ════════════════════════════════════════════════
// ENTER KEY
// ════════════════════════════════════════════════
document.addEventListener('keydown',e=>{
  if(e.key!=='Enter') return;
  const authScr=document.getElementById('screen-auth'); if(!authScr||!authScr.classList.contains('active')) return;
  const p=document.querySelector('.panel.active'); if(!p) return;
  if(p.id==='panel-login') doLogin(); else doSignup();
});

window.addEventListener('beforeunload',()=>{
  if(currentUser&&userData){
    const spent=(userData.timeSpent||0)+(Date.now()-sessionStart);
    try{db.ref('users/'+currentUser.uid+'/timeSpent').set(spent);}catch(e){}
  }
});

// Mouse wheel scrolls nav buttons LEFT/RIGHT
document.querySelector('.nav-center').addEventListener('wheel', (e) => {
  e.preventDefault();
  const container = e.currentTarget;
  container.scrollLeft += e.deltaY > 0 ? 50 : -50;
});
