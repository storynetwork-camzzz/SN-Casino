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
let currentUser = null;
let userData    = {};
let soundOn     = true;
let sessionStart = Date.now();
let currentBet  = 100;
let currentGame = null;
let coinSymbol  = '🪙';

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
];

// ════════════════════════════════════════════════
// SHOP ITEMS  (min 10,000 except one free per category)
// ════════════════════════════════════════════════
const SHOP_THEMES = [
  {id:'default',  name:'Deep Space',    preview:'🌌', desc:'Classic dark blue theme — Free!',        price:0,
   colors:{blue:'#0000ff',dark:'#02020a',glow:'rgba(0,0,255,.45)',particle:'#0000ff',gridColor:'rgba(0,0,255,.04)'}},
  {id:'gold',     name:'Gold Rush',     preview:'✨', desc:'Rich gold & black luxury',               price:15000,
   colors:{blue:'#cc9900',dark:'#080500',glow:'rgba(200,150,0,.45)',particle:'#ffaa00',gridColor:'rgba(200,150,0,.05)'}},
  {id:'neon',     name:'Neon City',     preview:'🌃', desc:'Cyberpunk neon cyan glow',               price:20000,
   colors:{blue:'#00ffff',dark:'#020814',glow:'rgba(0,255,255,.4)',particle:'#00ccff',gridColor:'rgba(0,255,255,.04)'}},
  {id:'forest',   name:'Dark Forest',   preview:'🌲', desc:'Deep emerald green theme',               price:18000,
   colors:{blue:'#00bb44',dark:'#020a04',glow:'rgba(0,180,60,.4)',particle:'#00cc55',gridColor:'rgba(0,180,60,.04)'}},
  {id:'blood',    name:'Blood Moon',    preview:'🩸', desc:'Dark crimson & black',                   price:22000,
   colors:{blue:'#cc0022',dark:'#0a0202',glow:'rgba(200,0,30,.45)',particle:'#ff0033',gridColor:'rgba(200,0,30,.05)'}},
  {id:'purple',   name:'Void Purple',   preview:'🔮', desc:'Deep cosmic purple haze',                price:25000,
   colors:{blue:'#9900ff',dark:'#060010',glow:'rgba(150,0,255,.45)',particle:'#aa22ff',gridColor:'rgba(150,0,255,.05)'}},
  {id:'rose',     name:'Rose Gold',     preview:'🌹', desc:'Elegant pink & rose gold',               price:30000,
   colors:{blue:'#ff6699',dark:'#0a0205',glow:'rgba(255,80,140,.4)',particle:'#ff88bb',gridColor:'rgba(255,80,140,.04)'}},
  {id:'arctic',   name:'Arctic Ice',    preview:'❄️', desc:'Frosty white & icy blue',               price:35000,
   colors:{blue:'#88ddff',dark:'#020810',glow:'rgba(100,200,255,.4)',particle:'#aaeeff',gridColor:'rgba(100,200,255,.04)'}},
  {id:'sunset',   name:'Sunset Blaze',  preview:'🌅', desc:'Warm orange sunset vibes',               price:28000,
   colors:{blue:'#ff6600',dark:'#0a0300',glow:'rgba(255,100,0,.45)',particle:'#ff8833',gridColor:'rgba(255,100,0,.04)'}},
  {id:'galaxy',   name:'Galaxy Core',   preview:'🌠', desc:'Deep galaxy purple & pink',              price:40000,
   colors:{blue:'#cc44ff',dark:'#04000e',glow:'rgba(180,0,255,.45)',particle:'#dd66ff',gridColor:'rgba(180,0,255,.04)'}},
  {id:'toxic',    name:'Toxic Green',   preview:'☢️', desc:'Radioactive neon green',                 price:32000,
   colors:{blue:'#44ff00',dark:'#000a00',glow:'rgba(50,255,0,.45)',particle:'#66ff22',gridColor:'rgba(50,255,0,.04)'}},
  {id:'midnight', name:'Midnight Blue', preview:'🌙', desc:'Deep navy midnight sky',                 price:20000,
   colors:{blue:'#2244cc',dark:'#01010a',glow:'rgba(20,40,200,.45)',particle:'#3366ff',gridColor:'rgba(20,40,200,.04)'}},
  {id:'lava',     name:'Lava World',    preview:'🌋', desc:'Fiery red-orange molten theme',          price:45000,
   colors:{blue:'#ff2200',dark:'#0a0100',glow:'rgba(255,30,0,.5)',particle:'#ff4400',gridColor:'rgba(255,30,0,.05)'}},
  {id:'chrome',   name:'Chrome',        preview:'⚙️', desc:'Sleek metallic silver & white',          price:50000,
   colors:{blue:'#cccccc',dark:'#050507',glow:'rgba(200,200,220,.35)',particle:'#aaaacc',gridColor:'rgba(200,200,200,.04)'}},
];

const SHOP_BG_FX = [
  {id:'fx_none',     name:'None',          preview:'⬛', desc:'No special effect — Free!',             price:0},
  {id:'fx_stars',    name:'Starfield',     preview:'⭐', desc:'Shooting stars fly across screen',      price:12000},
  {id:'fx_matrix',   name:'Matrix Rain',   preview:'🟩', desc:'Green code rains down like The Matrix', price:25000},
  {id:'fx_confetti', name:'Confetti',      preview:'🎊', desc:'Colourful confetti fills the screen',   price:18000},
  {id:'fx_fire',     name:'Fire Embers',   preview:'🔥', desc:'Glowing embers float upward',           price:30000},
  {id:'fx_bubbles',  name:'Neon Bubbles',  preview:'🫧', desc:'Glowing bubbles drift up the screen',   price:20000},
  {id:'fx_snow',     name:'Snow Drift',    preview:'❄️', desc:'Gentle snowflakes fall down',           price:15000},
  {id:'fx_aurora',   name:'Aurora',        preview:'🌌', desc:'Northern lights shimmer beautifully',   price:50000},
  {id:'fx_lightning',name:'Lightning',     preview:'⚡', desc:'Electric lightning crackles overhead',  price:40000},
  {id:'fx_rain',     name:'Neon Rain',     preview:'🌧️', desc:'Neon colored rain streaks fall',       price:22000},
];

const SHOP_DECKS = [
  {id:'classic',      name:'Classic',       preview:'🂡', desc:'Standard red & black — Free!',         price:0},
  {id:'gold_deck',    name:'Gold Deck',     preview:'💛', desc:'Gilded gold fronts & backs',           price:15000},
  {id:'space',        name:'Space Deck',    preview:'🚀', desc:'Cosmic star suits',                    price:18000},
  {id:'dragon',       name:'Dragon Deck',   preview:'🐉', desc:'Mythical dragon suits',                price:25000},
  {id:'neon_deck',    name:'Neon Deck',     preview:'🌈', desc:'Electric neon suits',                  price:30000},
  {id:'ice_deck',     name:'Ice Deck',      preview:'🧊', desc:'Frozen crystal suits',                 price:35000},
  {id:'fire_deck',    name:'Fire Deck',     preview:'🔥', desc:'Blazing inferno suits',                price:40000},
  {id:'diamond_deck', name:'Diamond Deck',  preview:'💎', desc:'Ultra rare diamond suits',             price:75000},
  {id:'shadow_deck',  name:'Shadow Deck',   preview:'🌑', desc:'Dark shadow suits with glow edges',    price:50000},
  {id:'rainbow_deck', name:'Rainbow Deck',  preview:'🌈', desc:'Every suit a different vivid color',   price:60000},
];

const SHOP_COINS = [
  {id:'coin_default', name:'Classic',       preview:'🪙', desc:'Original gold coin — Free!',           price:0},
  {id:'coin_blue',    name:'Blue Gem',      preview:'💎', desc:'Shimmering blue crystal',              price:12000},
  {id:'coin_fire',    name:'Fire Coin',     preview:'🔥', desc:'Blazing hot token',                    price:15000},
  {id:'coin_star',    name:'Star Token',    preview:'⭐', desc:'Stellar gold star',                    price:10000},
  {id:'coin_heart',   name:'Heart',         preview:'❤️', desc:'Lucky love token',                    price:10000},
  {id:'coin_skull',   name:'Skull',         preview:'💀', desc:'Dark side currency',                   price:18000},
  {id:'coin_moon',    name:'Moon Coin',     preview:'🌙', desc:'Lunar silver token',                   price:20000},
  {id:'coin_crown',   name:'Crown',         preview:'👑', desc:'Royal VIP coin',                       price:35000},
  {id:'coin_alien',   name:'Alien Chip',    preview:'👾', desc:'Extraterrestrial credits',             price:25000},
  {id:'coin_rainbow', name:'Rainbow Token', preview:'🌈', desc:'Legendary prismatic coin',             price:60000},
  {id:'coin_diamond', name:'Diamond',       preview:'💠', desc:'Ultra rare diamond currency',          price:80000},
  {id:'coin_lightning',name:'Lightning',    preview:'⚡', desc:'Electric charged token',              price:45000},
];

const SHOP_AVATARS = [
  {id:'av_default',   name:'Mystery',       preview:'❓', desc:'The classic mystery player — Free!',   price:0},
  {id:'av_shark',     name:'Card Shark',    preview:'🦈', desc:'A true predator at the tables',        price:20000},
  {id:'av_robot',     name:'RoboGambler',   preview:'🤖', desc:'Cold, calculated, always betting',     price:25000},
  {id:'av_wizard',    name:'The Wizard',    preview:'🧙', desc:'Ancient magic powers your bets',       price:30000},
  {id:'av_cat',       name:'Lucky Cat',     preview:'🐱', desc:'Nine lives, nine chances to win',      price:18000},
  {id:'av_skull',     name:'Dead Man',      preview:'💀', desc:'Nothing to lose anymore',              price:22000},
  {id:'av_alien',     name:'Area 52',       preview:'👽', desc:'Bets in currencies you\'ve never seen',price:35000},
  {id:'av_dragon',    name:'Dragon Lord',   preview:'🐲', desc:'Commands the wheel with fire',         price:50000},
  {id:'av_demon',     name:'Demon Dealer',  preview:'😈', desc:'The house always wins... or does it?', price:40000},
  {id:'av_crown',     name:'High Roller',   preview:'👑', desc:'Born to gamble, born to win',         price:100000},
];

// ════════════════════════════════════════════════
// CARD DECK THEMING
// ════════════════════════════════════════════════
const DECK_THEMES = {
  classic:      { redSuit:'#cc0000',  blackSuit:'#111111', rankColor:null,     backGrad:'linear-gradient(135deg,#1a0000,#440000)',    rankBg:null },
  gold_deck:    { redSuit:'#cc7700',  blackSuit:'#886600', rankColor:'#aa6600',backGrad:'linear-gradient(135deg,#3a2800,#aa7700)',    rankBg:'rgba(255,200,0,.08)' },
  space:        { redSuit:'#8888ff',  blackSuit:'#4444cc', rankColor:'#aaaaff',backGrad:'linear-gradient(135deg,#000020,#000080)',    rankBg:'rgba(50,50,200,.08)' },
  dragon:       { redSuit:'#ff3300',  blackSuit:'#006600', rankColor:'#cc2200',backGrad:'linear-gradient(135deg,#1a0010,#660033)',    rankBg:'rgba(150,0,50,.08)' },
  neon_deck:    { redSuit:'#ff00aa',  blackSuit:'#00ffcc', rankColor:'#ff00ff',backGrad:'linear-gradient(135deg,#0a0020,#200040)',    rankBg:'rgba(255,0,200,.06)' },
  ice_deck:     { redSuit:'#66ccff',  blackSuit:'#0088cc', rankColor:'#aaddff',backGrad:'linear-gradient(135deg,#001020,#003060)',    rankBg:'rgba(100,200,255,.06)' },
  fire_deck:    { redSuit:'#ff4400',  blackSuit:'#ff8800', rankColor:'#ff6600',backGrad:'linear-gradient(135deg,#200500,#601000)',    rankBg:'rgba(255,80,0,.08)' },
  diamond_deck: { redSuit:'#ff66cc',  blackSuit:'#66aaff', rankColor:'#ffffff',backGrad:'linear-gradient(135deg,#080820,#181840)',    rankBg:'rgba(150,150,255,.08)' },
  shadow_deck:  { redSuit:'#aa44ff',  blackSuit:'#4488ff', rankColor:'#ddaaff',backGrad:'linear-gradient(135deg,#050510,#0a0a28)',    rankBg:'rgba(100,0,200,.06)' },
  rainbow_deck: { redSuit:'#ff4466',  blackSuit:'#44aaff', rankColor:'#ffee44',backGrad:'linear-gradient(135deg,#0a001a,#001a0a)',    rankBg:'rgba(200,100,255,.06)' },
};

function getDeckTheme(){
  const eq=(userData.equippedItems||{}).carddecks||'classic';
  return DECK_THEMES[eq]||DECK_THEMES.classic;
}
function getBackStyle(){ return getDeckTheme().backGrad; }

function cardHTML(c, hidden=false){
  if(hidden) return `<div class="playing-card back" style="background:${getBackStyle()}"></div>`;
  const dt = getDeckTheme();
  const red = isRed(c.suit);
  const suitColor = red ? dt.redSuit : dt.blackSuit;
  const rankColor = dt.rankColor || (red ? dt.redSuit : dt.blackSuit);
  const bgStyle = dt.rankBg ? `background:${dt.rankBg};` : '';
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
function fmtCoins(n){return Number(n).toLocaleString();}
function fmtTime(ms){const s=Math.floor(ms/1000),m=Math.floor(s/60),h=Math.floor(m/60);return h>0?h+'h '+(m%60)+'m':m>0?m+'m '+(s%60)+'s':s+'s';}

function toast(msg,dur=3000){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),dur);
}

// ════════════════════════════════════════════════
// SOUND SYSTEM
// ════════════════════════════════════════════════
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
function getAudioCtx(){ if(!audioCtx) audioCtx = new AudioCtx(); return audioCtx; }

function playSound(type){
  if(!soundOn) return;
  try{
    const ctx = getAudioCtx();
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.connect(ctx.destination);
    if(type==='win'){
      [523,659,784,1047].forEach((freq,i)=>{
        const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);
        o.frequency.value=freq;o.type='sine';
        g.gain.setValueAtTime(0,now+i*.08);g.gain.linearRampToValueAtTime(.3,now+i*.08+.04);g.gain.exponentialRampToValueAtTime(.001,now+i*.08+.25);
        o.start(now+i*.08);o.stop(now+i*.08+.25);
      });
    } else if(type==='bigwin'){
      [523,659,784,1047,1319].forEach((freq,i)=>{
        const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);
        o.frequency.value=freq;o.type='square';
        g.gain.setValueAtTime(0,now+i*.07);g.gain.linearRampToValueAtTime(.2,now+i*.07+.05);g.gain.exponentialRampToValueAtTime(.001,now+i*.07+.4);
        o.start(now+i*.07);o.stop(now+i*.07+.4);
      });
    } else if(type==='lose'){
      [300,250,200].forEach((freq,i)=>{
        const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);
        o.frequency.value=freq;o.type='sawtooth';
        g.gain.setValueAtTime(0,now+i*.1);g.gain.linearRampToValueAtTime(.25,now+i*.1+.05);g.gain.exponentialRampToValueAtTime(.001,now+i*.1+.2);
        o.start(now+i*.1);o.stop(now+i*.1+.2);
      });
    } else if(type==='click'){
      const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);
      o.frequency.value=660;o.type='sine';
      g.gain.setValueAtTime(.15,now);g.gain.exponentialRampToValueAtTime(.001,now+.06);
      o.start(now);o.stop(now+.06);
    } else if(type==='coin'){
      [880,1100].forEach((freq,i)=>{
        const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);
        o.frequency.value=freq;o.type='sine';
        g.gain.setValueAtTime(0,now+i*.05);g.gain.linearRampToValueAtTime(.2,now+i*.05+.03);g.gain.exponentialRampToValueAtTime(.001,now+i*.05+.15);
        o.start(now+i*.05);o.stop(now+i*.05+.15);
      });
    } else if(type==='flip'){
      const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);
      o.frequency.setValueAtTime(400,now);o.frequency.linearRampToValueAtTime(600,now+.1);o.type='triangle';
      g.gain.setValueAtTime(.2,now);g.gain.exponentialRampToValueAtTime(.001,now+.12);
      o.start(now);o.stop(now+.12);
    } else if(type==='spin'){
      const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);
      o.frequency.setValueAtTime(200,now);o.frequency.linearRampToValueAtTime(600,now+.5);o.type='sawtooth';
      g.gain.setValueAtTime(.15,now);g.gain.exponentialRampToValueAtTime(.001,now+.5);
      o.start(now);o.stop(now+.5);
    } else if(type==='slot_tick'){
      const buf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*0.018),ctx.sampleRate);
      const d=buf.getChannelData(0);
      for(let i=0;i<d.length;i++){const t=i/ctx.sampleRate;d[i]=(Math.random()*2-1)*Math.exp(-t*220)*0.6;}
      const src=ctx.createBufferSource();src.buffer=buf;
      const g=ctx.createGain();g.gain.setValueAtTime(0.4,now);g.gain.exponentialRampToValueAtTime(0.001,now+0.02);
      src.connect(g);g.connect(master);src.start(now);
    } else if(type==='scratch'){
      const buf=ctx.createBuffer(1,ctx.sampleRate*.1,ctx.sampleRate);
      const d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*.3;
      const src=ctx.createBufferSource();src.buffer=buf;
      const g=ctx.createGain();g.gain.setValueAtTime(.3,now);g.gain.exponentialRampToValueAtTime(.001,now+.1);
      src.connect(g);g.connect(master);src.start(now);
    } else if(type==='peg'){
      const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);
      o.frequency.value=rand(300,600);o.type='sine';
      g.gain.setValueAtTime(.08,now);g.gain.exponentialRampToValueAtTime(.001,now+.05);
      o.start(now);o.stop(now+.05);
    } else if(type==='deal'){
      [440,550].forEach((f,i)=>{
        const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);
        o.frequency.value=f;o.type='triangle';
        g.gain.setValueAtTime(0,now+i*.06);g.gain.linearRampToValueAtTime(.18,now+i*.06+.03);g.gain.exponentialRampToValueAtTime(.001,now+i*.06+.1);
        o.start(now+i*.06);o.stop(now+i*.06+.1);
      });
    } else if(type==='roulette_tick'){
      const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);
      o.frequency.value=800;o.type='square';
      g.gain.setValueAtTime(.08,now);g.gain.exponentialRampToValueAtTime(.001,now+.03);
      o.start(now);o.stop(now+.03);
    } else if(type==='flap'){
      const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);
      o.frequency.setValueAtTime(300,now);o.frequency.linearRampToValueAtTime(600,now+.06);o.type='triangle';
      g.gain.setValueAtTime(.18,now);g.gain.exponentialRampToValueAtTime(.001,now+.1);
      o.start(now);o.stop(now+.1);
    } else if(type==='pipe'){
      const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);
      o.frequency.value=1200;o.type='sine';
      g.gain.setValueAtTime(.2,now);g.gain.exponentialRampToValueAtTime(.001,now+.15);
      o.start(now);o.stop(now+.15);
    } else if(type==='hit'){
      const buf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*0.15),ctx.sampleRate);
      const d=buf.getChannelData(0);
      for(let i=0;i<d.length;i++){const t=i/ctx.sampleRate;d[i]=(Math.random()*2-1)*Math.exp(-t*40)*0.5;}
      const src=ctx.createBufferSource();src.buffer=buf;
      const g=ctx.createGain();g.gain.setValueAtTime(0.5,now);
      src.connect(g);g.connect(master);src.start(now);
    } else if(type==='horse_gallop'){
      [200,220,180,200].forEach((freq,i)=>{
        const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);
        o.frequency.value=freq;o.type='triangle';
        g.gain.setValueAtTime(0,now+i*.08);g.gain.linearRampToValueAtTime(.12,now+i*.08+.03);g.gain.exponentialRampToValueAtTime(.001,now+i*.08+.08);
        o.start(now+i*.08);o.stop(now+i*.08+.1);
      });
    } else if(type==='wheel_spin'){
      const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(master);
      o.frequency.setValueAtTime(600,now);o.frequency.exponentialRampToValueAtTime(80,now+3);o.type='sawtooth';
      g.gain.setValueAtTime(.12,now);g.gain.exponentialRampToValueAtTime(.001,now+3);
      o.start(now);o.stop(now+3);
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

async function addCoins(amount,label=''){
  const prev=userData.coins||0;
  const next=prev+amount;
  const updates={coins:next};
  if(amount>0){
    const bw=userData.biggestWin||0;
    if(amount>bw)updates.biggestWin=amount;
    updates.totalEarned=(userData.totalEarned||0)+amount;
  } else {
    const bl=userData.biggestLoss||0;
    if(Math.abs(amount)>bl)updates.biggestLoss=Math.abs(amount);
    updates.totalLost=(userData.totalLost||0)+Math.abs(amount);
  }
  updates.totalWagered=(userData.totalWagered||0)+currentBet;
  updates.totalBets=(userData.totalBets||0)+1;
  // Track balance history for graph (last 200 bets)
  const hist=userData.balanceHistory||[];
  hist.push(next);
  if(hist.length>200)hist.shift();
  updates.balanceHistory=hist;
  await saveUserData(updates);
  checkBailout();
  if(label)toast((amount>0?'+ ':'')+(amount>0?'+':'')+fmtCoins(amount)+' '+coinSymbol+(label?' · '+label:''));
}

async function addGame(){
  await saveUserData({gamesPlayed:(userData.gamesPlayed||0)+1});
  checkAchievements();
}

function refreshCoinDisplays(){
  const c=fmtCoins(userData.coins||0);
  const icon=coinSymbol;
  ['user-coins','game-coins','lb-coins','ach-coins','shop-coins','spin-coins','stats-coins','sug-coins'].forEach(id=>{
    const el=document.getElementById(id);if(el)el.textContent=c;
  });
  // Update coin icon spans
  ['nav-coin-icon','game-coin-icon','lb-coin-icon','ach-coin-icon','shop-coin-icon','spin-coin-icon','stats-coin-icon','sug-coin-icon'].forEach(id=>{
    const el=document.getElementById(id);if(el)el.textContent=icon;
  });
}

function checkBailout(){
  const b=document.getElementById('bailout-banner');
  if(!b)return;
  b.style.display=(userData.coins||0)<500&&!userData.bailoutUsed?'block':'none';
}

async function claimBailout(){
  if((userData.coins||0)>=500||userData.bailoutUsed)return;
  await saveUserData({coins:(userData.coins||0)+1000,bailoutUsed:true});
  document.getElementById('bailout-banner').style.display='none';
  toast('💸 Bailout claimed! +1,000 coins');
  unlockAchievement('broke');
}

// ════════════════════════════════════════════════
// ACHIEVEMENTS
// ════════════════════════════════════════════════
async function unlockAchievement(id){
  const owned=userData.achievements||[];
  if(owned.includes(id))return;
  owned.push(id);
  await saveUserData({achievements:owned});
  const a=ACHIEVEMENTS.find(x=>x.id===id);
  if(a){toast('🎖 Achievement: '+a.name+'!');playSound('bigwin');}
}

async function checkAchievements(){
  const g=userData.gamesPlayed||0,c=userData.coins||0,w=userData.totalWagered||0;
  if(g>=10)unlockAchievement('games_10');
  if(g>=100)unlockAchievement('games_100');
  if(g>=500)unlockAchievement('games_500');
  if(c>=1000000)unlockAchievement('millionaire');
  if(w>=50000)unlockAchievement('total_50k');
  if(c<500)unlockAchievement('broke');
}

async function recordResult(won){
  let streak=userData.winStreak||0;
  if(won){streak++;unlockAchievement('first_win');if(streak>=3)unlockAchievement('win_streak3');}
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
  if(s)s.classList.add('active');
  if(id==='leaderboard')loadLeaderboard('coins');
  if(id==='achievements')renderAchievements();
  if(id==='shop')renderShop('themes');
  if(id==='daily-spin')initWheel();
  if(id==='stats')renderStats();
  if(id==='suggestions')initSuggestions();
  playSound('click');
}

function showGame(name){
  currentGame=name;
  showScreen('game');
  const c=document.getElementById('game-container');
  c.innerHTML='';
  const games={
    slots:buildSlots,blackjack:buildBlackjack,roulette:buildRoulette,plinko:buildPlinko,
    poker:buildPoker,dice:buildDice,scratch:buildScratch,ridebus:buildRideBus,gofish:buildGoFish,
    flappy:buildFlappy,coinflip:buildCoinFlip,minesweeper:buildMinesweeper,
    horserace:buildHorseRace,higherlow:buildHigherLow,wheelfortune:buildWheelFortune
  };
  if(games[name])games[name](c);
}

// ════════════════════════════════════════════════
// BET PANEL
// ════════════════════════════════════════════════
function buildBetPanel(container){
  const opts=[100,500,1000,5000,10000];
  const div=document.createElement('div');
  div.className='bet-panel';
  div.innerHTML=`<span class="bet-label">Bet</span><div class="bet-btns">${
    opts.map(o=>`<button class="bet-opt${o===currentBet?' active':''}" onclick="setBet(${o},this)">${fmtCoins(o)}</button>`).join('')
  }<button class="bet-opt" onclick="setBet('all',this)">ALL IN</button></div><span class="current-bet" id="current-bet-display">Bet: ${coinSymbol} ${fmtCoins(currentBet)}</span>`;
  container.appendChild(div);
}

function setBet(amount,btn){
  if(amount==='all')currentBet=Math.max(100,userData.coins||100);
  else currentBet=Math.min(amount,userData.coins||amount);
  document.querySelectorAll('.bet-opt').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  const d=document.getElementById('current-bet-display');
  if(d)d.textContent='Bet: '+coinSymbol+' '+fmtCoins(currentBet);
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
  const PAYS={'7️⃣7️⃣7️⃣':50,'💎💎💎':20,'⭐⭐⭐':10,'🎰🎰🎰':8,'🍒🍒🍒':6,'🍇🍇🍇':5,'🍊🍊🍊':4,'🍋🍋🍋':3,'🍒🍒':2};
  let spinning=false,slotTickInterval=null;

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
    <div style="margin-top:20px;padding:14px;background:rgba(0,0,255,.05);border:1px solid var(--border);border-radius:10px;">
      <div style="font-size:.65rem;font-weight:800;color:var(--muted);letter-spacing:.15em;text-transform:uppercase;margin-bottom:8px;">Pay Table</div>
      ${Object.entries(PAYS).map(([k,v])=>`<div style="font-size:.78rem;color:var(--text);margin:3px 0;">${k} → <span style="color:var(--gold);font-weight:800;">${v}x</span></div>`).join('')}
    </div>
  </div>`;
  buildBetPanel(document.getElementById('slots-bet'));

  window.spinSlots=async function(){
    if(spinning)return;
    if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    spinning=true;setLoading('spin-slots-btn',true,'Spin');
    document.getElementById('slots-result').className='result-banner';
    await saveUserData({coins:(userData.coins||0)-currentBet});
    let tickCount=0;const tickMax=32;let tickDelay=40;
    function doTick(){
      if(tickCount>=tickMax||!spinning)return;
      playSound('slot_tick');
      for(let i=0;i<3;i++)document.getElementById('r'+i).textContent=SYMBOLS[rand(0,SYMBOLS.length-1)];
      tickCount++;tickDelay=40+Math.floor((tickCount/tickMax)*140);
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
        if(slow>=3){for(let i=0;i<3;i++)document.getElementById('r'+i).textContent=reels[i];finishSpin(reels);return;}
        playSound('slot_tick');slow++;setTimeout(slowTick,180+slow*60);
      }
      slowTick();
    },1800);
  };

  function finishSpin(reels){
    const combo=reels.join('');
    let mult=PAYS[combo]||0;
    if(!mult&&reels[0]===reels[1]&&PAYS[reels[0]+reels[0]])mult=PAYS[reels[0]+reels[0]];
    const rb=document.getElementById('slots-result');
    if(mult>0){
      const win=currentBet*mult;addCoins(win,'Slots');
      rb.textContent='🎉 '+reels.join(' ')+' · '+mult+'x · +'+fmtCoins(win)+' coins!';rb.className='result-banner win';
      playSound(win>=5000?'bigwin':'win');recordResult(true);
      if(combo==='7️⃣7️⃣7️⃣'){unlockAchievement('lucky_7');toast('🎰 JACKPOT! Three 7s!');}
      if(win>=10000)unlockAchievement('big_win');
    } else {
      rb.textContent='😔 '+reels.join(' ')+' · No match. Try again!';rb.className='result-banner lose';
      playSound('lose');recordResult(false);
    }
    spinning=false;setLoading('spin-slots-btn',false,'Spin');
  }
}

// ════════════════════════════════════════════════
// GAME: BLACKJACK
// ════════════════════════════════════════════════
function buildBlackjack(c){
  let deck=[],playerHand=[],dealerHand=[],gameActive=false;
  function handValue(hand){let v=hand.reduce((s,c)=>s+cardValue(c.rank),0);let aces=hand.filter(c=>c.rank==='A').length;while(v>21&&aces-->0)v-=10;return v;}
  function renderHands(hideDealer=true){
    document.getElementById('bj-player-hand').innerHTML=playerHand.map(c=>cardHTML(c)).join('');
    document.getElementById('bj-dealer-hand').innerHTML=dealerHand.map((c,i)=>cardHTML(c,i===1&&hideDealer)).join('');
    document.getElementById('bj-player-score').textContent='Your hand: '+handValue(playerHand);
    document.getElementById('bj-dealer-score').textContent=hideDealer?'Dealer: ?':'Dealer: '+handValue(dealerHand);
  }
  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">🃏 Blackjack</div>
    <div class="game-subtitle">Get closer to 21 than the dealer without busting · Blackjack pays 1.5x</div>
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
  </div>`;
  buildBetPanel(document.getElementById('bj-bet'));
  async function endGame(result,msg){
    gameActive=false;renderHands(false);
    const rb=document.getElementById('bj-result');rb.textContent=msg;
    ['bj-hit','bj-stand','bj-double'].forEach(id=>document.getElementById(id).disabled=true);
    document.getElementById('bj-deal').disabled=false;
    if(result==='win'){rb.className='result-banner win';await addCoins(currentBet,'Blackjack');await recordResult(true);playSound('win');}
    else if(result==='blackjack'){const win=Math.floor(currentBet*1.5);rb.className='result-banner win';await addCoins(currentBet+win,'Blackjack!');await recordResult(true);playSound('bigwin');unlockAchievement('blackjack');}
    else if(result==='push'){rb.className='result-banner push';await addCoins(currentBet,'Push');await recordResult(false);playSound('click');}
    else{rb.className='result-banner lose';await recordResult(false);playSound('lose');}
  }
  window.bjDeal=async function(){
    if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    deck=shuffleDeck(newDeck());await saveUserData({coins:(userData.coins||0)-currentBet});
    document.getElementById('bj-result').className='result-banner';
    playerHand=[deck.pop(),deck.pop()];dealerHand=[deck.pop(),deck.pop()];
    gameActive=true;renderHands(true);document.getElementById('bj-deal').disabled=true;
    ['bj-hit','bj-stand','bj-double'].forEach(id=>document.getElementById(id).disabled=false);
    playSound('deal');if(handValue(playerHand)===21)endGame('blackjack','🎉 Blackjack! You win 1.5x!');
  };
  window.bjHit=function(){if(!gameActive)return;playerHand.push(deck.pop());renderHands(true);playSound('flip');if(handValue(playerHand)>21)endGame('lose','💥 Bust!');else if(handValue(playerHand)===21)bjStand();};
  window.bjStand=function(){if(!gameActive)return;document.getElementById('bj-double').disabled=true;while(handValue(dealerHand)<17)dealerHand.push(deck.pop());const pv=handValue(playerHand),dv=handValue(dealerHand);if(dv>21)endGame('win','🎉 Dealer busts!');else if(pv>dv)endGame('win','🎉 You win! '+pv+' vs '+dv);else if(pv===dv)endGame('push','🤝 Push! '+pv+' vs '+dv);else endGame('lose','😔 Dealer wins. '+pv+' vs '+dv);};
  window.bjDouble=async function(){if(!gameActive||(userData.coins||0)<currentBet){toast('Not enough coins!');return;}await saveUserData({coins:(userData.coins||0)-currentBet});currentBet*=2;playerHand.push(deck.pop());renderHands(true);playSound('flip');if(handValue(playerHand)>21)endGame('lose','💥 Bust after double!');else bjStand();};
}

// ════════════════════════════════════════════════
// GAME: ROULETTE
// ════════════════════════════════════════════════
function buildRoulette(c){
  const RED_NUMS=[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
  let selectedBet=null,spinning=false;
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
  </div>`;
  buildBetPanel(document.getElementById('rl-bet'));
  const board=document.getElementById('rl-board');
  nums.forEach(n=>{
    const cell=document.createElement('div');
    cell.className='rb-cell '+(n===0?'num-green':RED_NUMS.includes(n)?'num-red':'num-black');
    cell.textContent=n;
    cell.onclick=()=>{document.querySelectorAll('.rb-sp-btn,.rb-cell').forEach(b=>b.classList.remove('selected'));cell.classList.add('selected');selectRlBet('num_'+n,n.toString(),null);};
    board.appendChild(cell);
  });
  window.selectRlBet=function(type,label,btn){selectedBet={type,label};document.getElementById('rl-selected').textContent='Selected: '+label;document.querySelectorAll('.rb-sp-btn,.rb-cell').forEach(b=>b.classList.remove('selected'));if(btn)btn.classList.add('selected');playSound('click');};
  window.spinRoulette=async function(){
    if(spinning)return;if(!selectedBet){toast('Pick a bet first!');return;}if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    spinning=true;setLoading('rl-spin-btn',true,'Spinning...');document.getElementById('rl-result').className='result-banner';
    await saveUserData({coins:(userData.coins||0)-currentBet});
    const ballEl=document.getElementById('rl-ball-display');ballEl.style.display='flex';
    let frame=0;const total=50;let tickDelay=40;
    function rlTick(){
      frame++;if(frame>35)tickDelay=90;if(frame>45)tickDelay=140;
      const tmp=nums[rand(0,nums.length-1)];document.getElementById('rl-landed').textContent=tmp;
      playSound('roulette_tick');
      if(frame>=total){
        const landed=nums[rand(0,nums.length-1)];document.getElementById('rl-landed').textContent=landed;
        document.querySelectorAll('.rb-cell').forEach(cell=>{cell.classList.toggle('landed',parseInt(cell.textContent)===landed);});
        const isRed=RED_NUMS.includes(landed);let mult=0;const b=selectedBet.type;
        if(b.startsWith('num_')&&parseInt(b.split('_')[1])===landed)mult=36;
        else if(b==='red'&&isRed)mult=2;else if(b==='black'&&!isRed&&landed!==0)mult=2;
        else if(b==='even'&&landed!==0&&landed%2===0)mult=2;else if(b==='odd'&&landed%2===1)mult=2;
        else if(b==='low'&&landed>=1&&landed<=18)mult=2;else if(b==='high'&&landed>=19&&landed<=36)mult=2;
        else if(b==='dozen1'&&landed>=1&&landed<=12)mult=3;else if(b==='dozen2'&&landed>=13&&landed<=24)mult=3;else if(b==='dozen3'&&landed>=25&&landed<=36)mult=3;
        const rb=document.getElementById('rl-result');
        if(mult>0){const win=currentBet*mult;addCoins(win,'Roulette');rb.textContent='🎉 Landed '+landed+'! '+selectedBet.label+' wins · +'+fmtCoins(win)+' coins!';rb.className='result-banner win';playSound(win>=5000?'bigwin':'win');recordResult(true);if(landed===0)unlockAchievement('roulette_0');if(win>=10000)unlockAchievement('big_win');}
        else{rb.textContent='😔 Landed '+landed+'. '+selectedBet.label+' loses.';rb.className='result-banner lose';playSound('lose');recordResult(false);}
        spinning=false;setLoading('rl-spin-btn',false,'Spin');return;
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
  const MULTS=[10,5,3,2,1,0.5,0.2,0.5,1,2,3,5,10];let dropping=false;
  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">🔵 Plinko</div>
    <div class="game-subtitle">Drop the ball · Higher multipliers on the outside!</div>
    <div id="pk-bet"></div>
    <button class="btn" id="pk-drop-btn" onclick="dropPlinko()" style="max-width:180px;margin-bottom:12px;"><span class="btn-text">Drop Ball</span></button>
    <div class="result-banner" id="pk-result"></div>
    <div style="position:relative;display:flex;justify-content:center;"><canvas id="plinko-canvas" width="520" height="500"></canvas></div>
    <div class="plinko-mults" id="plinko-mults-row">${MULTS.map((m,i)=>`<span class="pm" id="pm${i}" style="color:${m>=5?'#ff4444':m>=2?'var(--gold)':'var(--muted)'}">${m}x</span>`).join('')}</div>
  </div>`;
  buildBetPanel(document.getElementById('pk-bet'));
  const canvas=document.getElementById('plinko-canvas');const ctx=canvas.getContext('2d');
  const PW=520,PH=500,ROWS=10,PGAP=44,TOP=50,PEGS=[];
  for(let r=0;r<ROWS;r++){const count=r+3;const xStart=(PW-(count-1)*PGAP)/2;for(let i=0;i<count;i++)PEGS.push({x:xStart+i*PGAP,y:TOP+r*42});}
  const BUCKET_COUNT=MULTS.length,bucketW=PW/BUCKET_COUNT,bucketY=PH-40;
  function drawBoard(ball=null){
    ctx.clearRect(0,0,PW,PH);ctx.fillStyle='#030310';ctx.fillRect(0,0,PW,PH);
    MULTS.forEach((m,i)=>{const bx=i*bucketW;const color=m>=5?'rgba(255,50,50,.25)':m>=2?'rgba(255,200,0,.2)':'rgba(0,0,255,.1)';ctx.fillStyle=color;ctx.fillRect(bx+2,bucketY,bucketW-4,PH-bucketY-2);ctx.strokeStyle=m>=5?'rgba(255,50,50,.5)':m>=2?'rgba(255,200,0,.4)':'rgba(0,0,255,.3)';ctx.lineWidth=1;ctx.strokeRect(bx+2,bucketY,bucketW-4,PH-bucketY-2);});
    PEGS.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);ctx.fillStyle='rgba(100,120,255,.8)';ctx.fill();ctx.strokeStyle='rgba(0,0,255,.4)';ctx.lineWidth=1;ctx.stroke();});
    if(ball){const grad=ctx.createRadialGradient(ball.x-3,ball.y-3,1,ball.x,ball.y,12);grad.addColorStop(0,'#ffffff');grad.addColorStop(0.3,'#ffdd00');grad.addColorStop(1,'rgba(180,100,0,.8)');ctx.beginPath();ctx.arc(ball.x,ball.y,11,0,Math.PI*2);ctx.fillStyle=grad;ctx.shadowColor='rgba(255,215,0,.9)';ctx.shadowBlur=20;ctx.fill();ctx.shadowBlur=0;}
  }
  drawBoard();
  window.dropPlinko=async function(){
    if(dropping)return;if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    document.getElementById('pk-drop-btn').disabled=true;document.getElementById('pk-result').className='result-banner';
    document.querySelectorAll('.pm').forEach(e=>e.style.background='');
    await saveUserData({coins:(userData.coins||0)-currentBet});dropping=true;playSound('spin');
    let bx=PW/2+(Math.random()-0.5)*20,by=15,vx=(Math.random()-0.5)*1.5,vy=0;
    const GRAVITY=0.35,BOUNCE_DAMP=0.55,PEG_RADIUS=14,BALL_R=11;let pegCooldown=0;
    function step(){
      vy+=GRAVITY;bx+=vx;by+=vy;
      if(bx<BALL_R){bx=BALL_R;vx=Math.abs(vx)*0.7;}if(bx>PW-BALL_R){bx=PW-BALL_R;vx=-Math.abs(vx)*0.7;}
      pegCooldown=Math.max(0,pegCooldown-1);
      for(const p of PEGS){const dx=bx-p.x,dy=by-p.y,dist=Math.sqrt(dx*dx+dy*dy);if(dist<PEG_RADIUS&&pegCooldown===0){const nx=dx/dist,ny=dy/dist,speed=Math.sqrt(vx*vx+vy*vy);const bounce=(Math.random()<0.5?-1:1);vx=bounce*Math.abs(speed*BOUNCE_DAMP)+(Math.random()-0.5)*0.8;vy=Math.abs(ny*speed*BOUNCE_DAMP)+1.5;bx=p.x+nx*(PEG_RADIUS+1);by=p.y+ny*(PEG_RADIUS+1);pegCooldown=6;playSound('peg');}}
      const spd=Math.sqrt(vx*vx+vy*vy);if(spd>8){vx=vx/spd*8;vy=vy/spd*8;}
      drawBoard({x:bx,y:by});
      if(by>=bucketY){
        const slot=Math.min(Math.floor(bx/bucketW),MULTS.length-1);const mult=MULTS[slot],win=Math.floor(currentBet*mult);
        document.getElementById('pm'+slot).style.background='rgba(255,215,0,.35)';
        const rb=document.getElementById('pk-result');
        if(mult>=1){addCoins(win,'Plinko');rb.textContent='🎉 '+mult+'x · +'+fmtCoins(win)+' coins!';rb.className='result-banner win';playSound(mult>=5?'bigwin':'win');recordResult(true);if(mult===Math.max(...MULTS))unlockAchievement('plinko_max');if(win>=10000)unlockAchievement('big_win');}
        else{if(win>0)addCoins(win,'Plinko');rb.textContent='😔 '+mult+'x · Lost most of bet.';rb.className='result-banner lose';playSound('lose');recordResult(false);}
        dropping=false;document.getElementById('pk-drop-btn').disabled=false;return;
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
  let deck=[],hand=[],held=[],dealt=false;
  function evalHand(h){
    const rankIdxs=h.map(c=>RANKS.indexOf(c.rank)).sort((a,b)=>a-b);const suits=h.map(c=>c.suit);
    const counts={};rankIdxs.forEach(r=>{counts[r]=(counts[r]||0)+1;});const vals=Object.values(counts).sort((a,b)=>b-a);
    const flush=suits.every(s=>s===suits[0]);const isRoyalStraight=JSON.stringify(rankIdxs)==='[0,9,10,11,12]';
    const normalStraight=rankIdxs[4]-rankIdxs[0]===4&&vals[0]===1;const straight=normalStraight||isRoyalStraight;const rf=flush&&isRoyalStraight;
    if(rf)return{name:'Royal Flush',mult:800};if(flush&&straight)return{name:'Straight Flush',mult:50};if(vals[0]===4)return{name:'Four of a Kind',mult:25};if(vals[0]===3&&vals[1]===2)return{name:'Full House',mult:9};if(flush)return{name:'Flush',mult:6};if(straight)return{name:'Straight',mult:4};if(vals[0]===3)return{name:'Three of a Kind',mult:3};if(vals[0]===2&&vals[1]===2)return{name:'Two Pair',mult:2};
    const pairRank=parseInt(Object.keys(counts).find(k=>counts[k]===2)||'-1');if(pairRank>=9||pairRank===0)return{name:'Jacks or Better',mult:1};return{name:'Nothing',mult:0};
  }
  function renderHand(){document.getElementById('poker-hand').innerHTML=hand.map((card,i)=>`<div class="poker-card-wrap" onclick="togglePokerHold(${i})">${cardHTML(card).replace('playing-card','playing-card'+(held[i]?' held':''))}<div class="poker-hold">${held[i]?'HELD':''}</div></div>`).join('');}
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
  </div>`;
  buildBetPanel(document.getElementById('pk2-bet'));
  window.togglePokerHold=function(i){if(!dealt)return;held[i]=!held[i];renderHand();playSound('click');};
  window.pokerDeal=async function(){
    if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    deck=shuffleDeck(newDeck());await saveUserData({coins:(userData.coins||0)-currentBet});
    hand=[deck.pop(),deck.pop(),deck.pop(),deck.pop(),deck.pop()];held=[false,false,false,false,false];dealt=true;renderHand();
    document.getElementById('poker-result').className='result-banner';document.getElementById('poker-deal-btn').disabled=true;document.getElementById('poker-draw-btn').disabled=false;playSound('deal');
  };
  window.pokerDraw=async function(){
    for(let i=0;i<5;i++)if(!held[i])hand[i]=deck.pop();
    held=[false,false,false,false,false];dealt=false;renderHand();playSound('deal');
    document.getElementById('poker-draw-btn').disabled=true;document.getElementById('poker-deal-btn').disabled=false;
    const result=evalHand(hand);const rb=document.getElementById('poker-result');
    if(result.mult>0){const win=currentBet*result.mult;await addCoins(win,'Video Poker');rb.textContent='🎉 '+result.name+'! +'+fmtCoins(win)+' coins!';rb.className='result-banner win';playSound(result.mult>=25?'bigwin':'win');await recordResult(true);if(result.name==='Royal Flush'){unlockAchievement('poker_royal');toast('👑 ROYAL FLUSH!');}if(win>=10000)unlockAchievement('big_win');}
    else{rb.textContent='😔 '+result.name+'. No win — deal again!';rb.className='result-banner lose';playSound('lose');await recordResult(false);}
  };
}

// ════════════════════════════════════════════════
// GAME: DICE
// ════════════════════════════════════════════════
function buildDice(c){
  const DICE_FACES=['','⚀','⚁','⚂','⚃','⚄','⚅'];let rolling=false,playerPick=null;
  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">🎲 Dice</div>
    <div class="game-subtitle">Pick a number (5x) or High/Low (2x).</div>
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
  </div>`;
  buildBetPanel(document.getElementById('dice-bet'));
  window.pickDice=function(val,btn){playerPick=val;document.querySelectorAll('#screen-game .rb-sp-btn').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');document.getElementById('dice-pick-label').textContent='Picked: '+(typeof val==='number'?DICE_FACES[val]+' '+val:val==='low'?'Low (1-3)':'High (4-6)');playSound('click');};
  window.rollDice=async function(){
    if(rolling)return;if(playerPick===null){toast('Pick a number or High/Low!');return;}if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    rolling=true;setLoading('dice-roll-btn',true,'Rolling...');document.getElementById('dice-result').className='result-banner';
    await saveUserData({coins:(userData.coins||0)-currentBet});playSound('spin');
    let frame=0;const iv=setInterval(async()=>{
      document.getElementById('die1').textContent=DICE_FACES[rand(1,6)];frame++;
      if(frame>22){clearInterval(iv);const d1=rand(1,6);document.getElementById('die1').textContent=DICE_FACES[d1];
        const rb=document.getElementById('dice-result');let won=false,mult=0;
        if(typeof playerPick==='number'&&d1===playerPick){won=true;mult=5;}else if(playerPick==='low'&&d1<=3){won=true;mult=2;}else if(playerPick==='high'&&d1>=4){won=true;mult=2;}
        if(won){const win=currentBet*mult;await addCoins(win,'Dice');rb.textContent='🎉 Rolled '+DICE_FACES[d1]+' '+d1+'! '+mult+'x · +'+fmtCoins(win)+' coins!';rb.className='result-banner win';playSound('win');await recordResult(true);if(win>=10000)unlockAchievement('big_win');}
        else{rb.textContent='😔 Rolled '+DICE_FACES[d1]+' '+d1+'. No match.';rb.className='result-banner lose';playSound('lose');await recordResult(false);}
        rolling=false;setLoading('dice-roll-btn',false,'Roll');}
    },80);
  };
}

// ════════════════════════════════════════════════
// GAME: SCRATCH CARD
// ════════════════════════════════════════════════
function buildScratch(c){
  let scratching=false;const EMOJIS=['🍒','💎','⭐','🎰','🍀','7️⃣','🔔','🍉'];let symGrid=[];
  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">🎟️ Scratch Card</div>
    <div class="game-subtitle">Scratch all 9 tiles · Find 3 matching symbols to win!</div>
    <div id="sc-bet"></div>
    <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;">
      <button class="btn" id="sc-new-btn" onclick="newScratch()" style="max-width:180px;"><span class="btn-text">New Card</span></button>
      <button class="btn btn-gold" onclick="revealAll()" style="max-width:180px;"><span class="btn-text">Reveal All</span></button>
    </div>
    <div class="scratch-wrap"><canvas id="scratchCanvas" width="360" height="360"></canvas></div>
    <div class="result-banner" id="sc-result"></div>
  </div>`;
  buildBetPanel(document.getElementById('sc-bet'));
  const canvas=document.getElementById('scratchCanvas');const ctx=canvas.getContext('2d');
  const PRIZE_MULTS={'🍒':2,'🔔':3,'🍉':4,'🍀':5,'⭐':8,'🎰':10,'💎':15,'7️⃣':25};
  function genCard(){
    const win=Math.random()<0.30;const winSym=EMOJIS[rand(0,EMOJIS.length-1)];symGrid=[];
    if(win){const positions=[0,1,2,3,4,5,6,7,8];const chosen=[];while(chosen.length<3){const p=positions[rand(0,positions.length-1)];if(!chosen.includes(p))chosen.push(p);}for(let i=0;i<9;i++){if(chosen.includes(i))symGrid.push({sym:winSym,scratched:false});else{let s;do{s=EMOJIS[rand(0,EMOJIS.length-1)];}while(s===winSym);symGrid.push({sym:s,scratched:false});}}}
    else{let attempts=0;do{symGrid=Array.from({length:9},()=>({sym:EMOJIS[rand(0,EMOJIS.length-1)],scratched:false}));const counts={};symGrid.forEach(s=>{counts[s.sym]=(counts[s.sym]||0)+1;});if(Math.max(...Object.values(counts))<3)break;attempts++;}while(attempts<30);}
  }
  function drawCard(){
    ctx.clearRect(0,0,360,360);ctx.fillStyle='#07071a';ctx.fillRect(0,0,360,360);
    for(let i=0;i<9;i++){const x=(i%3)*120+60,y=Math.floor(i/3)*120+60;
      if(!symGrid[i]||!symGrid[i].scratched){const grad=ctx.createLinearGradient(x-50,y-50,x+50,y+50);grad.addColorStop(0,'rgba(0,0,180,.3)');grad.addColorStop(1,'rgba(0,0,100,.2)');ctx.beginPath();ctx.roundRect(x-50,y-50,100,100,12);ctx.fillStyle=grad;ctx.fill();ctx.strokeStyle='rgba(0,0,255,.4)';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='rgba(100,120,255,.5)';ctx.font='bold 32px Montserrat';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('?',x,y);}
      else{const counts={};symGrid.forEach(s=>{counts[s.sym]=(counts[s.sym]||0)+1;});const isWinner=counts[symGrid[i].sym]>=3;ctx.beginPath();ctx.roundRect(x-50,y-50,100,100,12);ctx.fillStyle=isWinner?'rgba(0,80,0,.4)':'rgba(6,6,20,.8)';ctx.fill();ctx.strokeStyle=isWinner?'rgba(0,255,100,.5)':'rgba(0,0,255,.2)';ctx.lineWidth=2;ctx.stroke();ctx.font='44px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(symGrid[i].sym,x,y);}
    }
  }
  window.newScratch=async function(){if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}await saveUserData({coins:(userData.coins||0)-currentBet});genCard();document.getElementById('sc-result').className='result-banner';drawCard();scratching=true;playSound('click');};
  window.revealAll=function(){if(!scratching&&symGrid.length===0)return;symGrid.forEach(s=>s.scratched=true);drawCard();scratching=false;checkScratch();};
  function scratch(e){if(!scratching)return;const rect=canvas.getBoundingClientRect();const scaleX=canvas.width/rect.width,scaleY=canvas.height/rect.height;const x=((e.clientX||(e.touches&&e.touches[0].clientX)||0)-rect.left)*scaleX;const y=((e.clientY||(e.touches&&e.touches[0].clientY)||0)-rect.top)*scaleY;const col=Math.floor(x/120),row=Math.floor(y/120),idx=row*3+col;if(idx>=0&&idx<9&&!symGrid[idx].scratched){symGrid[idx].scratched=true;drawCard();playSound('scratch');if(symGrid.every(s=>s.scratched)){scratching=false;checkScratch();}}}
  canvas.addEventListener('mousemove',e=>{if(e.buttons)scratch(e);});canvas.addEventListener('touchmove',e=>{e.preventDefault();scratch(e);},{passive:false});canvas.addEventListener('click',scratch);
  async function checkScratch(){const counts={};symGrid.forEach(s=>{counts[s.sym]=(counts[s.sym]||0)+1;});const winSym=Object.keys(counts).find(k=>counts[k]>=3);const rb=document.getElementById('sc-result');if(winSym){const mult=PRIZE_MULTS[winSym]||2,win=currentBet*mult;await addCoins(win,'Scratch Card');rb.textContent='🎉 3x '+winSym+'! '+mult+'x · +'+fmtCoins(win)+' coins!';rb.className='result-banner win';playSound(win>=5000?'bigwin':'win');await recordResult(true);unlockAchievement('scratch_3');if(win>=10000)unlockAchievement('big_win');}else{rb.textContent='😔 No 3-of-a-kind. Better luck next time!';rb.className='result-banner lose';playSound('lose');await recordResult(false);}}
  symGrid=Array.from({length:9},()=>({sym:'?',scratched:false}));drawCard();
}

// ════════════════════════════════════════════════
// GAME: RIDE THE BUS
// ════════════════════════════════════════════════
function buildRideBus(c){
  let deck=[],cardHistory=[],stage=0,active=false,winnings=0;
  const QUESTIONS=['Question 1: Red or Black?','Question 2: Higher or Lower?','Question 3: Inside or Outside?','Question 4: Suit?'];
  const QOPTS=[['🔴 Red','⚫ Black'],['⬆️ Higher','⬇️ Lower'],['↔️ Inside','↕️ Outside'],['♠ Spades','♥ Hearts','♦ Diamonds','♣ Clubs']];
  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">🚌 Ride the Bus</div>
    <div class="game-subtitle">Answer 4 card questions in a row · Win doubles each stage!</div>
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
  </div>`;
  buildBetPanel(document.getElementById('bus-bet'));
  function renderCards(){const row=document.getElementById('bus-stage-row');row.innerHTML='';cardHistory.forEach((card,i)=>{const el=document.createElement('div');el.innerHTML=cardHTML(card);const cardEl=el.firstChild;if(i===cardHistory.length-1){cardEl.style.boxShadow='0 0 16px var(--blue-glow)';cardEl.style.borderColor='var(--blue)';}row.appendChild(cardEl);});}
  function updateChoices(){document.getElementById('bus-question').textContent=QUESTIONS[stage]||'';document.getElementById('bus-streak').textContent=`Stage: ${stage} / 4  ·  Potential win: ${coinSymbol} ${fmtCoins(winnings)}`;const ch=document.getElementById('bus-choices');ch.innerHTML='';if(stage<4&&active){QOPTS[stage].forEach(opt=>{const b=document.createElement('button');b.className='bus-choice';b.textContent=opt;b.onclick=()=>busGuess(opt);ch.appendChild(b);});document.getElementById('bus-cashout-btn').style.display=stage>0?'block':'none';}}
  window.startBus=async function(){if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}deck=shuffleDeck(newDeck());await saveUserData({coins:(userData.coins||0)-currentBet});cardHistory=[];stage=0;active=true;winnings=currentBet*2;document.getElementById('bus-result').className='result-banner';document.getElementById('bus-start-btn').style.display='none';renderCards();updateChoices();playSound('deal');};
  window.busGuess=async function(choice){
    if(!active||stage>=4)return;document.querySelectorAll('.bus-choice').forEach(b=>b.disabled=true);
    const card=deck.pop();cardHistory.push(card);renderCards();playSound('flip');
    const prev=cardHistory.length>=2?cardHistory[cardHistory.length-2]:null;const prevVal=prev?RANKS.indexOf(prev.rank):0;const currVal=RANKS.indexOf(card.rank);
    let correct=false;const cleanChoice=choice.replace(/[^a-zA-Z\s]/g,'').trim().split(' ').pop().toLowerCase();
    if(stage===0){correct=(cleanChoice==='red'&&isRed(card.suit))||(cleanChoice==='black'&&!isRed(card.suit));}
    else if(stage===1){correct=(cleanChoice==='higher'&&currVal>=prevVal)||(cleanChoice==='lower'&&currVal<=prevVal);}
    else if(stage===2){if(cardHistory.length<3){correct=true;}else{const c1=RANKS.indexOf(cardHistory[cardHistory.length-3].rank);const c2=RANKS.indexOf(cardHistory[cardHistory.length-2].rank);const lo=Math.min(c1,c2),hi=Math.max(c1,c2);correct=(cleanChoice==='inside'&&currVal>lo&&currVal<hi)||(cleanChoice==='outside'&&(currVal<lo||currVal>hi));if(lo===hi)correct=true;}}
    else if(stage===3){const suitMap={'spades':'♠','hearts':'♥','diamonds':'♦','clubs':'♣'};correct=card.suit===(suitMap[cleanChoice]||'');}
    const rb=document.getElementById('bus-result');
    if(correct){stage++;winnings=currentBet*Math.pow(2,stage+1);rb.textContent='✅ Correct! Got '+card.rank+card.suit+'. Stage '+stage+'/4 · Potential: '+fmtCoins(winnings);rb.className='result-banner win';playSound('coin');
      if(stage===4){await addCoins(winnings,'Ride the Bus');rb.textContent='🎉 You rode the full bus! Won '+fmtCoins(winnings)+' coins!';active=false;document.getElementById('bus-choices').innerHTML='';document.getElementById('bus-question').textContent='You won! 🎉';document.getElementById('bus-cashout-btn').style.display='none';document.getElementById('bus-start-btn').style.display='block';document.getElementById('bus-streak').textContent='Stage: 4/4 · Won: '+coinSymbol+' '+fmtCoins(winnings);await recordResult(true);unlockAchievement('bus_5');if(winnings>=10000)unlockAchievement('big_win');playSound('bigwin');}else{updateChoices();}}
    else{rb.textContent='❌ Wrong! Card was '+card.rank+card.suit+'. You lose.';rb.className='result-banner lose';playSound('lose');active=false;document.getElementById('bus-choices').innerHTML='';document.getElementById('bus-question').textContent='Better luck next time!';document.getElementById('bus-cashout-btn').style.display='none';document.getElementById('bus-start-btn').style.display='block';document.getElementById('bus-streak').textContent='Stage: '+stage+'/4 · Lost it all!';await recordResult(false);}
  };
  window.busCashout=async function(){if(!active||stage===0)return;const cashAmt=currentBet*Math.pow(2,stage);active=false;await addCoins(cashAmt,'Bus cashout');document.getElementById('bus-result').textContent='💰 Cashed out! +'+fmtCoins(cashAmt)+' coins!';document.getElementById('bus-result').className='result-banner win';document.getElementById('bus-choices').innerHTML='';document.getElementById('bus-question').textContent='';document.getElementById('bus-cashout-btn').style.display='none';document.getElementById('bus-start-btn').style.display='block';playSound('win');await recordResult(true);};
}

// ════════════════════════════════════════════════
// GAME: GO FISH
// ════════════════════════════════════════════════
function buildGoFish(c){
  let deck=[],playerHand=[],cpuHand=[],playerBooks=[],cpuBooks=[],selectedRank=null,gameActive=false,playerTurn=true;
  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">🐟 Go Fish</div>
    <div class="game-subtitle">Collect sets of 4 (books) · Most books wins · Win pays 3x bet</div>
    <div id="gf-bet"></div>
    <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
      <div style="padding:8px 14px;background:rgba(0,0,255,.08);border:1px solid var(--border);border-radius:8px;font-size:.75rem;"><span style="color:var(--muted);">CPU Books:</span> <span id="gf-cpu-books" style="color:#fff;font-weight:800;">0</span><span id="gf-cpu-book-ranks" style="color:var(--gold);margin-left:6px;"></span></div>
      <div style="padding:8px 14px;background:rgba(0,255,100,.06);border:1px solid rgba(0,255,100,.2);border-radius:8px;font-size:.75rem;"><span style="color:var(--muted);">Your Books:</span> <span id="gf-books" style="color:#44ffaa;font-weight:800;">0</span><span id="gf-book-ranks" style="color:var(--gold);margin-left:6px;"></span></div>
    </div>
    <div id="gf-log" class="fish-msg">Start a game to play!</div>
    <div class="fish-hand" id="gf-hand"></div>
    <div id="gf-selected-label" style="font-size:.78rem;font-weight:800;color:var(--gold);min-height:22px;margin:6px 0;"></div>
    <div style="display:flex;gap:10px;margin-top:10px;flex-wrap:wrap;">
      <button class="btn btn-green" id="gf-start-btn" onclick="startGoFish()" style="max-width:140px;"><span class="btn-text">Deal</span></button>
      <button class="btn" id="gf-ask-btn" onclick="askCpu()" style="max-width:180px;" disabled><span class="btn-text">Ask CPU</span></button>
    </div>
    <div class="result-banner" id="gf-result"></div>
  </div>`;
  buildBetPanel(document.getElementById('gf-bet'));
  function checkBooks(hand,books){const counts={};hand.forEach(cd=>{counts[cd.rank]=(counts[cd.rank]||0)+1;});Object.entries(counts).forEach(([r,n])=>{if(n>=4){books.push(r);hand.splice(0,hand.length,...hand.filter(cd=>cd.rank!==r));}});}
  function render(msg){
    document.getElementById('gf-books').textContent=playerBooks.length;document.getElementById('gf-book-ranks').textContent=playerBooks.join(' ');document.getElementById('gf-cpu-books').textContent=cpuBooks.length;document.getElementById('gf-cpu-book-ranks').textContent=cpuBooks.join(' ');
    if(msg)document.getElementById('gf-log').textContent=msg;
    document.getElementById('gf-hand').innerHTML=playerHand.map(card=>{const dt=getDeckTheme();const red=isRed(card.suit);const sc=red?dt.redSuit:dt.blackSuit;const rc=dt.rankColor||sc;const bg=dt.rankBg?`background:${dt.rankBg};`:'';return`<div class="fish-card${selectedRank===card.rank?' selected':''}" style="${bg}border-color:${sc}44;" onclick="selectFishCard('${card.rank}')"><span class="card-rank" style="color:${rc}">${card.rank}</span><span class="card-suit" style="color:${sc}">${card.suit}</span></div>`;}).join('');
    document.getElementById('gf-selected-label').textContent=selectedRank?'Asking for: '+selectedRank+'s':'Select a card to ask for that rank.';
    if(gameActive&&deck.length===0&&playerHand.length===0&&cpuHand.length===0)endGame();
  }
  function endGame(){gameActive=false;const win=playerBooks.length>cpuBooks.length,tie=playerBooks.length===cpuBooks.length;const rb=document.getElementById('gf-result');if(win){const prize=currentBet*3;addCoins(prize,'Go Fish');rb.textContent='🎉 You win! '+playerBooks.length+' books vs '+cpuBooks.length+' · +'+fmtCoins(prize)+' coins!';rb.className='result-banner win';playSound('bigwin');recordResult(true);if(playerBooks.length>=1)unlockAchievement('fish_book');}else if(tie){addCoins(currentBet,'Go Fish tie');rb.textContent='🤝 Tie! '+playerBooks.length+' books each · Bet returned.';rb.className='result-banner push';playSound('click');recordResult(false);}else{rb.textContent='😔 CPU wins. '+playerBooks.length+' vs '+cpuBooks.length+' books.';rb.className='result-banner lose';playSound('lose');recordResult(false);}document.getElementById('gf-start-btn').style.display='block';document.getElementById('gf-ask-btn').disabled=true;}
  window.startGoFish=async function(){if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}await saveUserData({coins:(userData.coins||0)-currentBet});deck=shuffleDeck(newDeck());playerHand=[];cpuHand=[];playerBooks=[];cpuBooks=[];selectedRank=null;gameActive=true;playerTurn=true;for(let i=0;i<7;i++){playerHand.push(deck.pop());cpuHand.push(deck.pop());}checkBooks(playerHand,playerBooks);checkBooks(cpuHand,cpuBooks);document.getElementById('gf-result').className='result-banner';document.getElementById('gf-start-btn').style.display='none';document.getElementById('gf-ask-btn').disabled=false;playSound('deal');render('Game started! Pick a card rank and ask the CPU.');};
  window.selectFishCard=function(rank){if(!gameActive||!playerTurn)return;selectedRank=rank;render(null);playSound('click');};
  window.askCpu=async function(){
    if(!gameActive||!selectedRank||!playerTurn)return;document.getElementById('gf-ask-btn').disabled=true;playerTurn=false;
    const matches=cpuHand.filter(cd=>cd.rank===selectedRank);let msg='';
    if(matches.length>0){matches.forEach(cd=>{playerHand.push(cd);cpuHand.splice(cpuHand.indexOf(cd),1);});checkBooks(playerHand,playerBooks);msg='Got '+matches.length+' '+selectedRank+'(s) from CPU! ';playSound('coin');selectedRank=null;if(deck.length===0&&playerHand.length===0&&cpuHand.length===0){render(msg);endGame();return;}render(msg+'Your turn again!');playerTurn=true;document.getElementById('gf-ask-btn').disabled=false;}
    else{if(deck.length>0){const drawn=deck.pop();playerHand.push(drawn);checkBooks(playerHand,playerBooks);msg='Go Fish! Drew a '+drawn.rank+drawn.suit+'. ';playSound('flip');}else msg='Go Fish! Deck is empty. ';selectedRank=null;render(msg+'CPU\'s turn...');setTimeout(()=>{if(gameActive)cpuTurn();},1200);}
  };
  function cpuTurn(){if(cpuHand.length===0){if(deck.length===0){render('CPU has no cards. Game over!');endGame();return;}cpuHand.push(deck.pop());}const cpuRanks=[...new Set(cpuHand.map(cd=>cd.rank))];const askRank=cpuRanks[rand(0,cpuRanks.length-1)];const matches=playerHand.filter(cd=>cd.rank===askRank);let msg='CPU asked for '+askRank+'s... ';if(matches.length>0){matches.forEach(cd=>{cpuHand.push(cd);playerHand.splice(playerHand.indexOf(cd),1);});checkBooks(cpuHand,cpuBooks);msg+='Got '+matches.length+' from you! CPU goes again.';render(msg);if(gameActive&&deck.length+cpuHand.length>0)setTimeout(()=>{if(gameActive)cpuTurn();},1000);}else{if(deck.length>0){const drawn=deck.pop();cpuHand.push(drawn);checkBooks(cpuHand,cpuBooks);msg+='Go Fish! Drew from deck.'}else msg+='Go Fish! Deck empty.';render(msg+' Your turn!');playerTurn=true;document.getElementById('gf-ask-btn').disabled=false;}if(deck.length===0&&playerHand.length===0&&cpuHand.length===0)endGame();}
}

// ════════════════════════════════════════════════
// GAME: FLAPPY BET
// ════════════════════════════════════════════════
function buildFlappy(c){
  let gameRunning=false,gameOver=false,betPlaced=false,bird,pipes,frame,score,multiplier,animId;
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
  </div>`;
  buildBetPanel(document.getElementById('fl-bet'));
  const canvas=document.getElementById('flappy-canvas');const ctx=canvas.getContext('2d');
  const keyHandler=function(e){if((e.code==='Space'||e.key===' ')&&gameRunning)flappyFlap();};
  document.addEventListener('keydown',keyHandler);
  function initGame(){bird={x:80,y:H/2,vy:0,radius:16};pipes=[];frame=0;score=0;multiplier=1;gameOver=false;gameRunning=true;}
  function drawGame(){
    const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#020a20');sky.addColorStop(1,'#030515');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
    ctx.fillStyle='rgba(255,255,255,.3)';for(let i=0;i<30;i++){const sx=(i*137+frame*0.2)%W,sy=(i*79)%H;ctx.beginPath();ctx.arc(sx,sy,0.8,0,Math.PI*2);ctx.fill();}
    ctx.fillStyle='#0a1a0a';ctx.fillRect(0,H-30,W,30);ctx.fillStyle='#1a3a1a';ctx.fillRect(0,H-32,W,4);
    for(const p of pipes){const topGrad=ctx.createLinearGradient(p.x,0,p.x+PIPE_W,0);topGrad.addColorStop(0,'#1a4a1a');topGrad.addColorStop(0.5,'#2d8a2d');topGrad.addColorStop(1,'#1a4a1a');ctx.fillStyle=topGrad;ctx.fillRect(p.x,0,PIPE_W,p.topH);ctx.fillStyle='#3aa83a';ctx.fillRect(p.x-4,p.topH-20,PIPE_W+8,20);const botY=p.topH+PIPE_GAP;ctx.fillStyle=topGrad;ctx.fillRect(p.x,botY,PIPE_W,H-botY-30);ctx.fillStyle='#3aa83a';ctx.fillRect(p.x-4,botY,PIPE_W+8,20);}
    const bx=bird.x,by=bird.y,r=bird.radius;const angle=Math.min(Math.max(bird.vy*0.08,-0.5),0.8);ctx.save();ctx.translate(bx,by);ctx.rotate(angle);const bGrad=ctx.createRadialGradient(-2,-2,2,0,0,r);bGrad.addColorStop(0,'#ffe066');bGrad.addColorStop(0.7,'#ffaa00');bGrad.addColorStop(1,'#cc7700');ctx.fillStyle=bGrad;ctx.beginPath();ctx.ellipse(0,0,r,r*0.85,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffcc00';ctx.beginPath();ctx.ellipse(-4,4,r*0.6,r*0.35,0.3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(r*0.4,-r*0.2,r*0.28,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(r*0.48,-r*0.18,r*0.15,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ff8800';ctx.beginPath();ctx.moveTo(r*0.8,0);ctx.lineTo(r*1.3,r*0.1);ctx.lineTo(r*0.8,r*0.25);ctx.closePath();ctx.fill();ctx.restore();
    ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(8,8,220,52);ctx.fillStyle='#fff';ctx.font='bold 14px Montserrat';ctx.textAlign='left';ctx.fillText('Pipes: '+score,16,28);const cm=getCurrentMult(score);ctx.fillStyle='#ffdd00';ctx.fillText('Mult: '+cm+'x  →  '+fmtCoins(Math.floor(currentBet*cm)),16,48);
  }
  function gameLoop(){
    if(!gameRunning)return;frame++;
    if(frame%90===0){const topH=rand(60,H-PIPE_GAP-80);pipes.push({x:W,topH,passed:false});}
    for(const p of pipes){p.x-=PIPE_SPEED;if(!p.passed&&p.x+PIPE_W<bird.x){p.passed=true;score++;multiplier=getCurrentMult(score);playSound('pipe');document.getElementById('fl-mult-display').textContent='Multiplier: '+multiplier+'x';if(score>=10)unlockAchievement('flappy_10');if(score>=25)unlockAchievement('flappy_25');}}
    pipes=pipes.filter(p=>p.x+PIPE_W>0);bird.vy+=GRAVITY;bird.y+=bird.vy;
    const bLeft=bird.x-bird.radius,bRight=bird.x+bird.radius,bTop=bird.y-bird.radius,bBottom=bird.y+bird.radius;
    if(bBottom>=H-30||bTop<=0){crash();return;}
    for(const p of pipes){if(bRight>p.x&&bLeft<p.x+PIPE_W){if(bTop<p.topH||bBottom>p.topH+PIPE_GAP){crash();return;}}}
    drawGame();animId=requestAnimationFrame(gameLoop);
  }
  function crash(){
    gameRunning=false;gameOver=true;playSound('hit');
    ctx.fillStyle='rgba(255,0,0,.3)';ctx.fillRect(0,0,W,H);
    setTimeout(()=>{drawGame();ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(0,0,W,H);ctx.fillStyle='#ff4444';ctx.font='bold 36px Montserrat';ctx.textAlign='center';ctx.fillText('CRASHED!',W/2,H/2-20);ctx.fillStyle='#fff';ctx.font='bold 18px Montserrat';ctx.fillText('Pipes: '+score,W/2,H/2+20);},100);
    const rb=document.getElementById('fl-result');rb.textContent='💥 Crashed after '+score+' pipes! Lost '+fmtCoins(currentBet)+' coins.';rb.className='result-banner lose';
    document.getElementById('fl-cashout-btn').style.display='none';document.getElementById('fl-start-btn').style.display='block';document.getElementById('fl-mult-display').textContent='Multiplier: —';
    playSound('lose');recordResult(false);
  }
  window.flappyFlap=function(){if(!gameRunning)return;bird.vy=FLAP_FORCE;playSound('flap');};
  window.flappyStart=async function(){if(gameRunning)return;if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}await saveUserData({coins:(userData.coins||0)-currentBet});document.getElementById('fl-result').className='result-banner';document.getElementById('fl-start-btn').style.display='none';document.getElementById('fl-cashout-btn').style.display='block';document.getElementById('fl-mult-display').textContent='Multiplier: 1x';betPlaced=true;initGame();animId=requestAnimationFrame(gameLoop);};
  window.flappyCashout=async function(){if(!gameRunning||gameOver||score===0){if(score===0)toast('Pass at least 1 pipe first!');return;}gameRunning=false;cancelAnimationFrame(animId);const mult=getCurrentMult(score);const win=Math.floor(currentBet*mult);await addCoins(win,'Flappy Bet');const rb=document.getElementById('fl-result');rb.textContent='💰 Cashed out! '+score+' pipes · '+mult+'x · +'+fmtCoins(win)+' coins!';rb.className='result-banner win';document.getElementById('fl-cashout-btn').style.display='none';document.getElementById('fl-start-btn').style.display='block';document.getElementById('fl-mult-display').textContent='Multiplier: —';playSound(mult>=5?'bigwin':'win');await recordResult(true);if(win>=10000)unlockAchievement('big_win');};
  const origShow=window.showScreen;window.showScreen=function(id){document.removeEventListener('keydown',keyHandler);if(animId)cancelAnimationFrame(animId);gameRunning=false;window.showScreen=origShow;origShow(id);};
  ctx.fillStyle='#020a20';ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(255,255,255,.6)';ctx.font='bold 22px Montserrat';ctx.textAlign='center';ctx.fillText('🐦 Press Start to Play!',W/2,H/2-10);ctx.fillStyle='rgba(255,255,255,.3)';ctx.font='14px Montserrat';ctx.fillText('Click / Space to flap',W/2,H/2+20);
}

// ════════════════════════════════════════════════
// GAME: COIN FLIP
// ════════════════════════════════════════════════
function buildCoinFlip(c){
  let flipping=false,streak=0,coinFlipWins=0;
  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">🪙 Coin Flip</div>
    <div class="game-subtitle">50/50 · Streak bonuses: 3 in a row = 2.5x, 5 = 4x, 7 = 8x!</div>
    <div id="cf-bet"></div>
    <div style="display:flex;gap:16px;margin:20px 0;flex-wrap:wrap;">
      <button class="btn btn-green" id="cf-heads" onclick="flipCoin('heads',this)" style="max-width:160px;font-size:1.1rem;"><span class="btn-text">👑 Heads</span></button>
      <button class="btn btn-red" id="cf-tails" onclick="flipCoin('tails',this)" style="max-width:160px;font-size:1.1rem;"><span class="btn-text">🪙 Tails</span></button>
    </div>
    <div class="coin-display" id="coin-display" style="font-size:5rem;text-align:center;margin:10px 0;transition:transform .3s;user-select:none;">🪙</div>
    <div style="font-size:.85rem;color:var(--gold);font-weight:800;text-align:center;margin-bottom:8px;" id="cf-streak">Streak: 0</div>
    <div class="result-banner" id="cf-result"></div>
  </div>`;
  buildBetPanel(document.getElementById('cf-bet'));
  window.flipCoin=async function(choice,btn){
    if(flipping)return;if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    flipping=true;['cf-heads','cf-tails'].forEach(id=>document.getElementById(id).disabled=true);
    await saveUserData({coins:(userData.coins||0)-currentBet});
    document.getElementById('cf-result').className='result-banner';
    const coinEl=document.getElementById('coin-display');
    let t=0;const iv=setInterval(()=>{coinEl.textContent=t%2===0?'👑':'🪙';coinEl.style.transform='rotateY('+t*60+'deg)';t++;},80);
    setTimeout(async()=>{
      clearInterval(iv);const result=Math.random()<0.5?'heads':'tails';coinEl.textContent=result==='heads'?'👑':'🪙';coinEl.style.transform='rotateY(0)';
      const won=result===choice;const rb=document.getElementById('cf-result');
      if(won){
        streak++;coinFlipWins++;let mult=1;if(streak>=7)mult=8;else if(streak>=5)mult=4;else if(streak>=3)mult=2.5;else mult=1.5;
        const win=Math.floor(currentBet*mult);await addCoins(win,'Coin Flip');rb.textContent='🎉 '+result.toUpperCase()+'! '+mult+'x · +'+fmtCoins(win)+' coins! Streak: '+streak;rb.className='result-banner win';playSound(streak>=3?'bigwin':'win');await recordResult(true);if(win>=10000)unlockAchievement('big_win');
        if(coinFlipWins>=10)unlockAchievement('coin_flip_10');
      } else {
        streak=0;rb.textContent='😔 '+result.toUpperCase()+'! Bad luck.';rb.className='result-banner lose';playSound('lose');await recordResult(false);
      }
      document.getElementById('cf-streak').textContent='Streak: '+streak+(streak>=3?' 🔥':'');
      flipping=false;['cf-heads','cf-tails'].forEach(id=>document.getElementById(id).disabled=false);
    },1200);
  };
}

// ════════════════════════════════════════════════
// GAME: MINESWEEPER
// ════════════════════════════════════════════════
function buildMinesweeper(c){
  const GRID=5,MINES=5,TOTAL=GRID*GRID;
  let grid=[],revealed=0,gameActive=false,betPaid=false,tilesCleared=0;
  function getMult(safe){const m=[0,1.1,1.3,1.6,2,2.5,3.2,4,5,6.5,8,10,13,17,22,28,36,46,60,80,100];return m[Math.min(safe,m.length-1)];}
  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">💣 Minesweeper</div>
    <div class="game-subtitle">Reveal safe tiles · Avoid the 5 bombs · Cash out anytime!</div>
    <div id="ms-bet"></div>
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:14px;">
      <button class="btn btn-green" id="ms-start-btn" onclick="startMine()" style="max-width:160px;"><span class="btn-text">New Game</span></button>
      <button class="btn btn-gold" id="ms-cashout-btn" onclick="mineCashout()" style="max-width:160px;" disabled><span class="btn-text">Cash Out</span></button>
      <div style="font-size:.85rem;font-weight:800;color:var(--gold);" id="ms-mult-display">—</div>
    </div>
    <div class="mine-grid" id="mine-grid"></div>
    <div class="result-banner" id="ms-result"></div>
  </div>`;
  buildBetPanel(document.getElementById('ms-bet'));
  function initGrid(){grid=Array.from({length:TOTAL},(_,i)=>({idx:i,mine:false,revealed:false}));let placed=0;while(placed<MINES){const i=rand(0,TOTAL-1);if(!grid[i].mine){grid[i].mine=true;placed++;}}}
  function renderGrid(){
    const container=document.getElementById('mine-grid');container.innerHTML='';
    grid.forEach((cell,i)=>{
      const btn=document.createElement('button');btn.className='mine-cell'+(cell.revealed?(cell.mine?' mine-bomb':' mine-safe'):'');
      if(cell.revealed){btn.textContent=cell.mine?'💣':'✅';btn.disabled=true;}else{btn.textContent='?';if(gameActive)btn.onclick=()=>revealCell(i);}
      container.appendChild(btn);
    });
  }
  async function revealCell(i){
    if(!gameActive||grid[i].revealed)return;
    grid[i].revealed=true;
    if(grid[i].mine){
      gameActive=false;grid.forEach(c=>{if(c.mine)c.revealed=true;});renderGrid();
      const rb=document.getElementById('ms-result');rb.textContent='💥 BOOM! You hit a mine! Lost '+fmtCoins(currentBet)+' coins.';rb.className='result-banner lose';
      document.getElementById('ms-cashout-btn').disabled=true;document.getElementById('ms-start-btn').disabled=false;
      playSound('lose');await recordResult(false);tilesCleared=0;
    } else {
      revealed++;tilesCleared++;renderGrid();playSound('coin');
      const mult=getMult(revealed);document.getElementById('ms-mult-display').textContent='Mult: '+mult+'x  →  '+coinSymbol+' '+fmtCoins(Math.floor(currentBet*mult));
      document.getElementById('ms-cashout-btn').disabled=false;
      if(revealed===TOTAL-MINES){gameActive=false;const win=Math.floor(currentBet*getMult(revealed));await addCoins(win,'Minesweeper');document.getElementById('ms-result').textContent='🎉 All safe tiles found! +'+fmtCoins(win)+' coins!';document.getElementById('ms-result').className='result-banner win';document.getElementById('ms-cashout-btn').disabled=true;document.getElementById('ms-start-btn').disabled=false;playSound('bigwin');await recordResult(true);if(win>=10000)unlockAchievement('big_win');}
      if(tilesCleared>=20)unlockAchievement('mine_sweep');
    }
  }
  window.startMine=async function(){if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}await saveUserData({coins:(userData.coins||0)-currentBet});initGrid();revealed=0;gameActive=true;betPaid=true;document.getElementById('ms-result').className='result-banner';document.getElementById('ms-cashout-btn').disabled=true;document.getElementById('ms-start-btn').disabled=false;document.getElementById('ms-mult-display').textContent='Pick a tile!';renderGrid();playSound('click');};
  window.mineCashout=async function(){if(!gameActive||revealed===0){toast('Reveal at least 1 tile first!');return;}gameActive=false;const mult=getMult(revealed);const win=Math.floor(currentBet*mult);await addCoins(win,'Minesweeper');grid.forEach(c=>{if(c.mine)c.revealed=true;});renderGrid();document.getElementById('ms-result').textContent='💰 Cashed out! '+revealed+' tiles · '+mult+'x · +'+fmtCoins(win)+' coins!';document.getElementById('ms-result').className='result-banner win';document.getElementById('ms-cashout-btn').disabled=true;document.getElementById('ms-start-btn').disabled=false;document.getElementById('ms-mult-display').textContent='—';playSound(mult>=5?'bigwin':'win');await recordResult(true);};
  renderGrid();
}

// ════════════════════════════════════════════════
// GAME: HORSE RACING
// ════════════════════════════════════════════════
function buildHorseRace(c){
  const HORSES=[{name:'Thunder',emoji:'🐎',color:'#ff4444',odds:2},{name:'Lightning',emoji:'🏇',color:'#ffaa00',odds:3},{name:'Storm',emoji:'🐴',color:'#44aaff',odds:4},{name:'Blaze',emoji:'🦄',color:'#aa44ff',odds:5},{name:'Shadow',emoji:'🐎',color:'#888888',odds:8}];
  let racing=false,picked=null,animId=null;
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
  </div>`;
  buildBetPanel(document.getElementById('hr-bet'));
  const canvas=document.getElementById('horse-canvas');const ctx=canvas.getContext('2d');const W=560,H=200;
  let positions=[0,0,0,0,0],speeds=[],finished=-1;
  function drawRace(){
    ctx.fillStyle='#0a1a00';ctx.fillRect(0,0,W,H);
    // Track lanes
    HORSES.forEach((h,i)=>{const y=20+i*36;ctx.fillStyle='rgba(0,50,0,.3)';ctx.fillRect(0,y,W,30);ctx.strokeStyle='rgba(255,255,255,.1)';ctx.lineWidth=1;ctx.strokeRect(0,y,W,30);// Finish line
      ctx.strokeStyle='rgba(255,255,255,.6)';ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(W-20,y);ctx.lineTo(W-20,y+30);ctx.stroke();ctx.setLineDash([]);
      // Horse
      const px=30+positions[i]*(W-60);ctx.font='20px serif';ctx.textAlign='left';ctx.fillText(h.emoji,px,y+22);ctx.font='bold 10px Montserrat';ctx.fillStyle=h.color;ctx.fillText(h.name,Math.max(0,px-10),y+34);
    });
    ctx.fillStyle='rgba(255,255,255,.8)';ctx.font='bold 11px Montserrat';ctx.textAlign='right';ctx.fillText('FINISH',W-4,14);
  }
  window.pickHorse=function(i,btn){picked=i;document.querySelectorAll('.horse-btn').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');document.getElementById('hr-pick-label').textContent='Betting on: '+HORSES[i].emoji+' '+HORSES[i].name+' ('+HORSES[i].odds+'x)';playSound('click');};
  window.startRace=async function(){
    if(racing)return;if(picked===null){toast('Pick a horse first!');return;}if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    await saveUserData({coins:(userData.coins||0)-currentBet});racing=true;finished=-1;positions=[0,0,0,0,0];
    document.getElementById('hr-race-btn').disabled=true;document.getElementById('hr-result').className='result-banner';
    // Determine winner weighted by odds (lower odds = more likely to win)
    const totalWeight=HORSES.reduce((s,h)=>s+1/h.odds,0);let r=Math.random()*totalWeight;let winner=0;for(let i=0;i<HORSES.length;i++){r-=1/HORSES[i].odds;if(r<=0){winner=i;break;}}
    speeds=HORSES.map((_,i)=>{const base=0.006+Math.random()*0.008;return i===winner?base+0.002:base;});
    let frame=0;
    function raceLoop(){
      frame++;positions=positions.map((p,i)=>Math.min(p+speeds[i]*(0.8+Math.random()*0.4),1));
      if(frame%4===0)playSound('horse_gallop');
      drawRace();
      const finishedIdx=positions.findIndex(p=>p>=1);
      if(finishedIdx>=0){
        racing=false;cancelAnimationFrame(animId);
        const rb=document.getElementById('hr-result');
        if(finishedIdx===picked){const win=currentBet*HORSES[picked].odds;addCoins(win,'Horse Racing');rb.textContent='🎉 '+HORSES[finishedIdx].name+' wins! '+HORSES[picked].odds+'x · +'+fmtCoins(win)+' coins!';rb.className='result-banner win';playSound('bigwin');recordResult(true);unlockAchievement('horse_win');if(win>=10000)unlockAchievement('big_win');}
        else{rb.textContent='😔 '+HORSES[finishedIdx].name+' wins! Your horse '+HORSES[picked].name+' lost.';rb.className='result-banner lose';playSound('lose');recordResult(false);}
        document.getElementById('hr-race-btn').disabled=false;return;
      }
      animId=requestAnimationFrame(raceLoop);
    }
    drawRace();animId=requestAnimationFrame(raceLoop);
  };
  drawRace();
}

// ════════════════════════════════════════════════
// GAME: HIGHER OR LOWER
// ════════════════════════════════════════════════
function buildHigherLow(c){
  let deck=[],currentCard=null,streak=0,gameActive=false,totalWin=0;
  function getMultForStreak(s){const m=[0,1.5,2,3,4.5,6.5,10,15,22,35,55];return m[Math.min(s,m.length-1)];}
  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">🎯 Higher or Lower</div>
    <div class="game-subtitle">Guess if the next card is higher or lower · Build your streak for bigger wins!</div>
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
  </div>`;
  buildBetPanel(document.getElementById('hl-bet'));
  window.hlStart=async function(){
    if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    deck=shuffleDeck(newDeck());await saveUserData({coins:(userData.coins||0)-currentBet});
    currentCard=deck.pop();streak=0;gameActive=true;totalWin=0;
    document.getElementById('hl-current-card').innerHTML=cardHTML(currentCard);
    document.getElementById('hl-streak').textContent='0';document.getElementById('hl-potential').textContent='Potential: —';
    document.getElementById('hl-result').className='result-banner';
    ['hl-higher-btn','hl-lower-btn'].forEach(id=>document.getElementById(id).disabled=false);
    document.getElementById('hl-cashout-btn').disabled=true;document.getElementById('hl-start-btn').disabled=true;
    playSound('deal');
  };
  window.hlGuess=async function(guess){
    if(!gameActive)return;['hl-higher-btn','hl-lower-btn','hl-cashout-btn'].forEach(id=>document.getElementById(id).disabled=true);
    const prevRank=RANKS.indexOf(currentCard.rank);const nextCard=deck.pop();const nextRank=RANKS.indexOf(nextCard.rank);currentCard=nextCard;
    document.getElementById('hl-current-card').innerHTML=cardHTML(currentCard);playSound('flip');
    let correct=false;if(guess==='higher'&&nextRank>=prevRank)correct=true;else if(guess==='lower'&&nextRank<=prevRank)correct=true;
    const rb=document.getElementById('hl-result');
    if(correct){
      streak++;const mult=getMultForStreak(streak);const potential=Math.floor(currentBet*mult);
      document.getElementById('hl-streak').textContent=streak;document.getElementById('hl-potential').textContent='Potential: '+coinSymbol+' '+fmtCoins(potential);
      rb.textContent='✅ Correct! '+nextCard.rank+nextCard.suit+' · Streak: '+streak+' · '+mult+'x potential';rb.className='result-banner win';playSound('coin');
      ['hl-higher-btn','hl-lower-btn'].forEach(id=>document.getElementById(id).disabled=false);document.getElementById('hl-cashout-btn').disabled=false;
      if(streak>=5)unlockAchievement('higher_streak');if(deck.length===0){hlCashout();return;}
    } else {
      gameActive=false;rb.textContent='❌ Wrong! '+nextCard.rank+nextCard.suit+' — streak broken at '+streak+'. Better luck next time!';rb.className='result-banner lose';playSound('lose');await recordResult(false);streak=0;document.getElementById('hl-streak').textContent='0';document.getElementById('hl-potential').textContent='—';document.getElementById('hl-start-btn').disabled=false;
    }
  };
  window.hlCashout=async function(){if(!gameActive||streak===0){toast('Get at least 1 correct first!');return;}gameActive=false;const mult=getMultForStreak(streak);const win=Math.floor(currentBet*mult);await addCoins(win,'Higher or Lower');document.getElementById('hl-result').textContent='💰 Cashed out! Streak '+streak+' · '+mult+'x · +'+fmtCoins(win)+' coins!';document.getElementById('hl-result').className='result-banner win';['hl-higher-btn','hl-lower-btn','hl-cashout-btn'].forEach(id=>document.getElementById(id).disabled=true);document.getElementById('hl-start-btn').disabled=false;playSound(mult>=5?'bigwin':'win');await recordResult(true);if(win>=10000)unlockAchievement('big_win');};
}

// ════════════════════════════════════════════════
// GAME: WHEEL OF FORTUNE
// ════════════════════════════════════════════════
function buildWheelFortune(c){
  const SEGMENTS=[
    {label:'0.5x',mult:0.5,color:'#660000'},{label:'1.5x',mult:1.5,color:'#003366'},{label:'2x',mult:2,color:'#004400'},
    {label:'0.5x',mult:0.5,color:'#660000'},{label:'3x',mult:3,color:'#005588'},{label:'1.5x',mult:1.5,color:'#003366'},
    {label:'BUST',mult:0,color:'#440000'},{label:'2x',mult:2,color:'#004400'},{label:'5x',mult:5,color:'#886600'},
    {label:'1x',mult:1,color:'#002244'},{label:'BUST',mult:0,color:'#440000'},{label:'10x',mult:10,color:'#aa4400'},
    {label:'1.5x',mult:1.5,color:'#003366'},{label:'BUST',mult:0,color:'#440000'},{label:'2x',mult:2,color:'#004400'},
    {label:'25x',mult:25,color:'#886600'}
  ];
  let spinning=false,angle=0;
  c.innerHTML=`<div class="game-wrap">
    <div class="game-title">🎡 Wheel of Fortune</div>
    <div class="game-subtitle">Spin the wheel · Land on a multiplier · 25x jackpot slot!</div>
    <div id="wf-bet"></div>
    <div style="position:relative;display:flex;justify-content:center;align-items:center;flex-direction:column;">
      <div style="font-size:2rem;position:absolute;top:-8px;z-index:10;filter:drop-shadow(0 0 6px gold);">▼</div>
      <canvas id="wf-canvas" width="400" height="400" style="border-radius:50%;border:3px solid var(--gold);box-shadow:0 0 30px rgba(255,200,0,.3);"></canvas>
    </div>
    <div class="result-banner" id="wf-result" style="margin-top:16px;"></div>
    <button class="btn" id="wf-spin-btn" onclick="spinWheelFortune()" style="max-width:200px;margin-top:12px;"><span class="btn-text">Spin!</span></button>
  </div>`;
  buildBetPanel(document.getElementById('wf-bet'));
  const canvas=document.getElementById('wf-canvas');const ctx=canvas.getContext('2d');const cx=200,cy=200,r=185;
  function drawWheel(a){
    ctx.clearRect(0,0,400,400);const slice=(Math.PI*2)/SEGMENTS.length;
    SEGMENTS.forEach((seg,i)=>{const start=a+i*slice,end=start+slice;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,start,end);ctx.closePath();ctx.fillStyle=seg.color;ctx.fill();ctx.strokeStyle='rgba(255,200,0,.4)';ctx.lineWidth=2;ctx.stroke();ctx.save();ctx.translate(cx,cy);ctx.rotate(start+slice/2);ctx.textAlign='right';ctx.fillStyle='#fff';ctx.font='bold '+(seg.label.length>3?'11':'13')+'px Montserrat';ctx.fillText(seg.label,r-10,5);ctx.restore();});
    ctx.beginPath();ctx.arc(cx,cy,20,0,Math.PI*2);ctx.fillStyle='#02020a';ctx.fill();ctx.strokeStyle='var(--gold)';ctx.lineWidth=3;ctx.stroke();
  }
  drawWheel(0);
  window.spinWheelFortune=async function(){
    if(spinning)return;if((userData.coins||0)<currentBet){toast('Not enough coins!');return;}
    spinning=true;setLoading('wf-spin-btn',true,'Spinning...');document.getElementById('wf-result').className='result-banner';
    await saveUserData({coins:(userData.coins||0)-currentBet});playSound('wheel_spin');
    const target=rand(0,SEGMENTS.length-1);const slice=(Math.PI*2)/SEGMENTS.length;
    const spins=8;const finalAngle=spins*Math.PI*2+(Math.PI*2-(target*slice)-(slice/2))-Math.PI/2;
    const startA=angle,dur=4000,startT=Date.now();
    function easeOut(t){return 1-Math.pow(1-t,4);}
    function frame(){const elapsed=Date.now()-startT,progress=Math.min(elapsed/dur,1);angle=startA+finalAngle*easeOut(progress);drawWheel(angle);
      if(progress<1){requestAnimationFrame(frame);}else{
        const seg=SEGMENTS[target];const rb=document.getElementById('wf-result');spinning=false;setLoading('wf-spin-btn',false,'Spin!');
        if(seg.mult>0){const win=Math.floor(currentBet*seg.mult);addCoins(win,'Wheel of Fortune');rb.textContent='🎉 '+seg.label+'! +'+fmtCoins(win)+' coins!';rb.className='result-banner win';playSound(seg.mult>=5?'bigwin':'win');recordResult(true);if(win>=10000)unlockAchievement('big_win');if(seg.mult>=25)unlockAchievement('wheel_jackpot');}
        else{rb.textContent='💀 BUST! Better luck next time.';rb.className='result-banner lose';playSound('lose');recordResult(false);}
      }
    }
    requestAnimationFrame(frame);
  };
}

// ════════════════════════════════════════════════
// LEADERBOARD
// ════════════════════════════════════════════════
async function loadLeaderboard(type){
  document.querySelectorAll('.lb-tab').forEach((t,i)=>t.classList.toggle('active',['coins','won','games','time'][i]===type));
  const list=document.getElementById('lb-list');
  list.innerHTML=`<div style="color:var(--muted);padding:20px;text-align:center;font-size:.8rem;">Loading...</div>`;
  try{
    const snap=await db.ref('users').get();
    if(!snap.exists()){list.innerHTML=`<div style="color:var(--muted);padding:20px;text-align:center;">No players yet.</div>`;return;}
    let players=[];snap.forEach(child=>{players.push({uid:child.key,...child.val()});});
    const field={coins:'coins',won:'biggestWin',games:'gamesPlayed',time:'timeSpent'}[type];
    players.sort((a,b)=>(b[field]||0)-(a[field]||0));
    const medals=['🥇','🥈','🥉'];
    list.innerHTML=players.slice(0,20).map((p,i)=>{
      const isYou=p.uid===currentUser?.uid;
      const av=(SHOP_AVATARS.find(a=>a.id===(p.equippedItems?.avatars))||SHOP_AVATARS[0]).preview;
      const val=type==='coins'?coinSymbol+' '+fmtCoins(p.coins||0):type==='won'?'💥 '+fmtCoins(p.biggestWin||0):type==='games'?'🎮 '+fmtCoins(p.gamesPlayed||0)+' games':'⏱ '+fmtTime(p.timeSpent||0);
      return`<div class="lb-row${isYou?' lb-you':''}"><span class="lb-rank${i<3?' '+['gold','silver','bronze'][i]:''}">${medals[i]||i+1}</span><span class="lb-avatar">${av}</span><span class="lb-username">${p.username||'?'}${isYou?' (You)':''}</span><span class="lb-val">${val}</span></div>`;
    }).join('')||`<div style="color:var(--muted);padding:20px;text-align:center;">No data.</div>`;
  }catch(e){list.innerHTML=`<div style="color:var(--red);padding:20px;text-align:center;">Could not load leaderboard.</div>`;}
}
window.showLbTab=function(type){loadLeaderboard(type);};

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
  const earned=userData.totalEarned||0;
  const lost=userData.totalLost||0;
  const net=earned-lost;
  const bets=userData.totalBets||0;
  const bigWin=userData.biggestWin||0;
  const bigLoss=userData.biggestLoss||0;

  document.getElementById('stat-earned').textContent=coinSymbol+' '+fmtCoins(earned);
  document.getElementById('stat-lost').textContent=coinSymbol+' '+fmtCoins(lost);
  const netEl=document.getElementById('stat-net');
  netEl.textContent=(net>=0?'+':'')+coinSymbol+' '+fmtCoins(net);
  netEl.className='stat-value '+(net>=0?'green':'red');
  document.getElementById('stat-bets').textContent=fmtCoins(bets);
  document.getElementById('stat-bigwin').textContent=coinSymbol+' '+fmtCoins(bigWin);
  document.getElementById('stat-bigloss').textContent=coinSymbol+' '+fmtCoins(bigLoss);

  // Draw line graph
  const history=userData.balanceHistory||[];
  const canvas=document.getElementById('statsGraph');
  if(!canvas)return;
  const W=canvas.parentElement.offsetWidth||800;
  canvas.width=Math.max(W-20,300);canvas.height=300;
  const ctx=canvas.getContext('2d');
  const cW=canvas.width,cH=canvas.height;
  ctx.clearRect(0,0,cW,cH);ctx.fillStyle='#03031a';ctx.fillRect(0,0,cW,cH);

  if(history.length<2){
    ctx.fillStyle='rgba(255,255,255,.3)';ctx.font='16px Montserrat';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Play some games to see your balance graph!',cW/2,cH/2);return;
  }

  const PAD=40;const gW=cW-PAD*2;const gH=cH-PAD*2;
  const minVal=Math.min(...history);const maxVal=Math.max(...history);const range=Math.max(maxVal-minVal,1);

  // Grid lines
  ctx.strokeStyle='rgba(255,255,255,.06)';ctx.lineWidth=1;
  for(let i=0;i<=4;i++){const y=PAD+gH*(1-i/4);ctx.beginPath();ctx.moveTo(PAD,y);ctx.lineTo(PAD+gW,y);ctx.stroke();}

  // Y axis labels
  ctx.fillStyle='rgba(255,255,255,.4)';ctx.font='10px Montserrat';ctx.textAlign='right';ctx.textBaseline='middle';
  for(let i=0;i<=4;i++){const val=minVal+range*(i/4);const y=PAD+gH*(1-i/4);ctx.fillText(fmtCoins(Math.round(val)),PAD-5,y);}

  // Area fill under line
  ctx.beginPath();
  history.forEach((v,i)=>{const x=PAD+gW*(i/(history.length-1));const y=PAD+gH*(1-(v-minVal)/range);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.lineTo(PAD+gW,PAD+gH);ctx.lineTo(PAD,PAD+gH);ctx.closePath();
  const areaGrad=ctx.createLinearGradient(0,PAD,0,PAD+gH);
  areaGrad.addColorStop(0,'rgba(0,100,255,.2)');areaGrad.addColorStop(1,'rgba(0,0,255,.02)');
  ctx.fillStyle=areaGrad;ctx.fill();

  // Line with color based on trend
  ctx.beginPath();
  history.forEach((v,i)=>{const x=PAD+gW*(i/(history.length-1));const y=PAD+gH*(1-(v-minVal)/range);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  const lineGrad=ctx.createLinearGradient(PAD,0,PAD+gW,0);
  lineGrad.addColorStop(0,'#4466ff');lineGrad.addColorStop(0.5,'#44aaff');lineGrad.addColorStop(1,history[history.length-1]>=history[0]?'#44ff88':'#ff4444');
  ctx.strokeStyle=lineGrad;ctx.lineWidth=2.5;ctx.lineJoin='round';ctx.stroke();

  // Dots for first/last
  [[0,history[0]],[history.length-1,history[history.length-1]]].forEach(([i,v])=>{
    const x=PAD+gW*(i/(history.length-1));const y=PAD+gH*(1-(v-minVal)/range);
    ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fillStyle=i===history.length-1?(v>=history[0]?'#44ff88':'#ff4444'):'#aaaaff';ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.7)';ctx.font='bold 10px Montserrat';ctx.textAlign=i===0?'left':'right';ctx.textBaseline='bottom';ctx.fillText(coinSymbol+fmtCoins(v),x+(i===0?6:-6),y-4);
  });
}

// ════════════════════════════════════════════════
// SUGGESTIONS
// ════════════════════════════════════════════════
let suggestionsListener=null;
let allSuggestions=[];
let currentFilter='all';

function initSuggestions(){
  // Character counter
  const textarea=document.getElementById('sug-body');
  if(textarea){
    textarea.addEventListener('input',()=>{const len=textarea.value.length;const el=document.getElementById('sug-char');if(el)el.textContent=len;});
  }
  // Start live listener
  if(suggestionsListener)suggestionsListener();
  const ref=db.ref('suggestions').orderByChild('timestamp').limitToLast(100);
  suggestionsListener=ref.on('value',snap=>{
    allSuggestions=[];if(snap.exists()){snap.forEach(child=>{allSuggestions.unshift({id:child.key,...child.val()});});}
    renderSuggestions();
  });
}

function filterSuggestions(cat){
  currentFilter=cat;
  document.querySelectorAll('.sug-filter').forEach(b=>b.classList.toggle('active',b.textContent.toLowerCase().includes(cat==='all'?'all':cat)));
  renderSuggestions();
}
window.filterSuggestions=filterSuggestions;

function renderSuggestions(){
  const list=document.getElementById('suggestions-list');if(!list)return;
  const filtered=currentFilter==='all'?allSuggestions:allSuggestions.filter(s=>s.category===currentFilter);
  if(filtered.length===0){list.innerHTML='<div class="sug-empty">No suggestions yet in this category. Be the first!</div>';return;}
  const CAT_LABELS={game:'🎮',feature:'✨',shop:'🛒',bug:'🐛',other:'💡'};
  list.innerHTML=filtered.map(s=>{
    const date=new Date(s.timestamp);const dateStr=date.toLocaleDateString()+' '+date.toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'});
    return`<div class="sug-card">
      <div class="sug-card-header">
        <span class="sug-cat-badge">${CAT_LABELS[s.category]||'💡'} ${s.category}</span>
        <span class="sug-card-title">${escHtml(s.title||'(no title)')}</span>
        <span class="sug-card-meta">${escHtml(s.username||'?')} · ${dateStr}</span>
      </div>
      <div class="sug-card-body">${escHtml(s.body||'')}</div>
    </div>`;
  }).join('');
}

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
    document.getElementById('sug-title').value='';document.getElementById('sug-body').value='';document.getElementById('sug-char').textContent='0';
    toast('✅ Suggestion submitted! Thanks!');playSound('coin');
  }catch(e){toast('Error submitting: '+e.message);}
};

// ════════════════════════════════════════════════
// SHOP
// ════════════════════════════════════════════════
function renderShop(tab){
  document.querySelectorAll('.shop-tab').forEach(t=>{t.classList.toggle('active',t.textContent.toLowerCase().replace(/[^a-z]/g,'').includes(tab.toLowerCase().replace(/[^a-z]/g,'')));});
  const owned=userData.ownedItems||[];const equipped=userData.equippedItems||{};
  let items,tabKey;
  if(tab==='themes'){items=SHOP_THEMES;tabKey='themes';}
  else if(tab==='bgfx'){items=SHOP_BG_FX;tabKey='bgfx';}
  else if(tab==='carddecks'){items=SHOP_DECKS;tabKey='carddecks';}
  else if(tab==='avatars'){items=SHOP_AVATARS;tabKey='avatars';}
  else{items=SHOP_COINS;tabKey='coinskinsshop';}

  document.getElementById('shop-grid').innerHTML=items.map(item=>{
    const isOwned=owned.includes(item.id)||item.price===0;const isEquipped=equipped[tabKey]===item.id;
    let preview='';
    if(tab==='themes'){const t=SHOP_THEMES.find(x=>x.id===item.id);const bg=t?t.colors.dark:'#02020a',cl=t?t.colors.blue:'#0000ff';preview=`<div style="width:100%;height:70px;border-radius:8px;margin-bottom:10px;background:${bg};border:1px solid ${cl}44;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,${cl}22,transparent 70%);"></div><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:1.8rem;">${item.preview}</div><div style="position:absolute;bottom:6px;right:8px;width:16px;height:16px;border-radius:50%;background:${cl};box-shadow:0 0 8px ${cl};"></div></div>`;}
    else if(tab==='bgfx'){preview=`<div style="font-size:2.5rem;margin-bottom:10px;">${item.preview}</div>`;}
    else if(tab==='carddecks'){const dt=DECK_THEMES[item.id]||DECK_THEMES.classic;preview=`<div style="width:52px;height:76px;border-radius:8px;margin:0 auto 10px;background:${dt.backGrad};border:1px solid rgba(255,255,255,.2);display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.4);"><span style="color:${dt.redSuit};font-size:1rem;font-weight:900">A♥</span><span style="color:${dt.blackSuit};font-size:.8rem;font-weight:900">K♠</span></div>`;}
    else if(tab==='avatars'){preview=`<div style="font-size:3rem;margin-bottom:10px;">${item.preview}</div>`;}
    else{const skins={coin_default:'🪙',coin_blue:'💎',coin_fire:'🔥',coin_star:'⭐',coin_heart:'❤️',coin_skull:'💀',coin_moon:'🌙',coin_crown:'👑',coin_alien:'👾',coin_rainbow:'🌈',coin_diamond:'💠',coin_lightning:'⚡'};preview=`<div style="font-size:2.8rem;margin-bottom:10px;">${skins[item.id]||'🪙'}</div>`;}
    return`<div class="shop-card${isEquipped?' equipped':isOwned?' owned':''}">
      ${preview}
      <div class="shop-name">${item.name}</div>
      <div class="shop-desc">${item.desc}</div>
      <div class="shop-price">${item.price===0?'Free':coinSymbol+' '+fmtCoins(item.price)}</div>
      ${isEquipped?`<button class="btn btn-gold" style="font-size:.7rem;padding:8px;margin-top:0;" disabled><span class="btn-text">✓ Active</span></button>`:isOwned?`<button class="btn btn-green" style="font-size:.7rem;padding:8px;margin-top:0;" onclick="equipItem('${tabKey}','${item.id}','${tab}')"><span class="btn-text">Equip</span></button>`:`<button class="btn" style="font-size:.7rem;padding:8px;margin-top:0;" onclick="buyItem('${item.id}',${item.price},'${tab}','${tabKey}')"><span class="btn-text">Buy ${coinSymbol} ${fmtCoins(item.price)}</span></button>`}
    </div>`;
  }).join('');
}

window.showShopTab=function(tab){renderShop(tab);};

window.buyItem=async function(id,price,tab,tabKey){
  if((userData.coins||0)<price){toast('Not enough coins!');return;}
  const owned=[...(userData.ownedItems||[]),id];await saveUserData({coins:(userData.coins||0)-price,ownedItems:owned});
  playSound('coin');toast('✅ Purchased!');renderShop(tab);
};

window.equipItem=async function(tabKey,id,tab){
  const eq={...(userData.equippedItems||{}),[tabKey]:id};await saveUserData({equippedItems:eq});
  if(tabKey==='themes')applyTheme(id);if(tabKey==='coinskinsshop')applyCoinSkin(id);if(tabKey==='bgfx')applyBgFx(id);
  playSound('coin');toast('✅ Equipped!');renderShop(tab);
};

function applyCoinSkin(id){
  const skins={coin_default:'🪙',coin_blue:'💎',coin_fire:'🔥',coin_star:'⭐',coin_heart:'❤️',coin_skull:'💀',coin_moon:'🌙',coin_crown:'👑',coin_alien:'👾',coin_rainbow:'🌈',coin_diamond:'💠',coin_lightning:'⚡'};
  coinSymbol=skins[id]||'🪙';refreshCoinDisplays();
  document.querySelectorAll('.current-bet').forEach(el=>{el.textContent='Bet: '+coinSymbol+' '+el.textContent.replace(/^.*?\s/,'').replace(/[^0-9,]/g,'');});
}

function applyTheme(id){
  const t=SHOP_THEMES.find(x=>x.id===id)||SHOP_THEMES[0];const col=t.colors;
  document.documentElement.style.setProperty('--blue',col.blue);document.documentElement.style.setProperty('--blue-glow',col.glow);document.documentElement.style.setProperty('--dark',col.dark);
  window._themeParticleColor=col.particle;window._themeGridColor=col.gridColor;
}

function applyBgFx(id){
  window._bgFxId=id;
  // Re-init the fx particles
  if(window._fxReinit)window._fxReinit(id);
}

// ════════════════════════════════════════════════
// DAILY SPIN
// ════════════════════════════════════════════════
const SPIN_PRIZES=[500,1000,2500,5000,250,750,100,3000,10000,1500];
const SPIN_COLORS=['#0000ff','#0022cc','#0044aa','#1100aa','#2200aa','#001188','#001166','#0033bb','#0055cc','#0044dd'];
let wheelAngle=0,wheelSpinning=false;

function initWheel(){
  const canvas=document.getElementById('wheelCanvas');if(!canvas)return;
  drawWheelCanvas(canvas.getContext('2d'),wheelAngle);
  const today=new Date().toDateString();const btn=document.getElementById('spin-btn');
  if(btn){const alreadySpun=userData.lastSpin===today;btn.disabled=alreadySpun;if(btn.querySelector('.btn-text'))btn.querySelector('.btn-text').textContent=alreadySpun?'Come back tomorrow!':'Spin the Wheel!';}
}

function drawWheelCanvas(ctx,angle){
  const cx=200,cy=200,r=180;ctx.clearRect(0,0,400,400);const slice=Math.PI*2/SPIN_PRIZES.length;
  SPIN_PRIZES.forEach((prize,i)=>{const start=angle+i*slice,end=start+slice;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,start,end);ctx.closePath();ctx.fillStyle=SPIN_COLORS[i];ctx.fill();ctx.strokeStyle='rgba(0,0,100,.5)';ctx.lineWidth=2;ctx.stroke();ctx.save();ctx.translate(cx,cy);ctx.rotate(start+slice/2);ctx.textAlign='right';ctx.fillStyle='#fff';ctx.font='bold 12px Montserrat';ctx.fillText(coinSymbol+fmtCoins(prize),r-8,5);ctx.restore();});
  ctx.beginPath();ctx.arc(cx,cy,22,0,Math.PI*2);ctx.fillStyle='#02020a';ctx.fill();ctx.strokeStyle='rgba(0,0,255,.6)';ctx.lineWidth=3;ctx.stroke();
}

window.spinWheel=async function(){
  if(wheelSpinning)return;const today=new Date().toDateString();
  if(userData.lastSpin===today){toast('Already spun today! Come back tomorrow.');return;}
  wheelSpinning=true;document.getElementById('spin-btn').disabled=true;document.getElementById('spin-result').textContent='';playSound('spin');
  const canvas=document.getElementById('wheelCanvas');const ctx=canvas.getContext('2d');
  const target=rand(0,SPIN_PRIZES.length-1);const slice=Math.PI*2/SPIN_PRIZES.length;const spins=5;
  const finalAngle=spins*Math.PI*2+(Math.PI*2-(target*slice)-(slice/2))-(Math.PI/2);
  const startAngle=wheelAngle,dur=4500,startT=Date.now();
  function easeOut(t){return 1-Math.pow(1-t,4);}
  function frame(){const elapsed=Date.now()-startT,progress=Math.min(elapsed/dur,1);wheelAngle=startAngle+finalAngle*easeOut(progress);drawWheelCanvas(ctx,wheelAngle);
    if(progress<1){requestAnimationFrame(frame);}else{const prize=SPIN_PRIZES[target];document.getElementById('spin-result').textContent='🎉 You won '+fmtCoins(prize)+' coins!';addCoins(prize,'Daily Spin');const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);const wasYesterday=userData.lastSpin===yesterday.toDateString();const newStreak=wasYesterday?(userData.spinStreak||0)+1:1;saveUserData({lastSpin:today,spinStreak:newStreak});if(newStreak>=7)unlockAchievement('daily_7');playSound(prize>=5000?'bigwin':'win');wheelSpinning=false;document.getElementById('daily-banner').style.display='none';if(document.getElementById('spin-btn'))document.getElementById('spin-btn').querySelector('.btn-text').textContent='Come back tomorrow!';}
  }
  requestAnimationFrame(frame);
};

// ════════════════════════════════════════════════
// AUTH
// ════════════════════════════════════════════════
function switchTab(tab){
  document.getElementById('tab-login').classList.toggle('active',tab==='login');document.getElementById('tab-signup').classList.toggle('active',tab==='signup');
  document.getElementById('panel-login').classList.toggle('active',tab==='login');document.getElementById('panel-signup').classList.toggle('active',tab==='signup');
  clearMsg('login-msg');clearMsg('signup-msg');
}
const AUTH_ERRORS={'auth/email-already-in-use':'Username taken.','auth/weak-password':'Password too short.','auth/network-request-failed':'Network error.','auth/user-not-found':'No account found.','auth/wrong-password':'Wrong password.','auth/invalid-credential':'Wrong username or password.','auth/too-many-requests':'Too many attempts.'};

async function doSignup(){
  const username=document.getElementById('signup-username').value.trim().toLowerCase().replace(/[^a-z0-9_]/g,'');
  const password=document.getElementById('signup-password').value;const confirm=document.getElementById('signup-confirm').value;
  document.getElementById('signup-username').value=username;
  if(!username||username.length<3)return showMsg('signup-msg','Username must be 3+ characters.','error');
  if(password.length<6)return showMsg('signup-msg','Password must be 6+ characters.','error');
  if(password!==confirm)return showMsg('signup-msg','Passwords don\'t match.','error');
  setLoading('signup-btn',true,'Create Account');
  try{
    const cred=await auth.createUserWithEmailAndPassword(username+'@sncasino.app',password);
    const uid=cred.user.uid,now=Date.now();
    const snap=await db.ref('usernames/'+username).get();
    if(snap.exists()){await cred.user.delete();showMsg('signup-msg','Username taken.','error');setLoading('signup-btn',false,'Create Account');return;}
    await db.ref('users/'+uid).set({username,coins:10000,role:'user',createdAt:now,lastLogin:now,totalEarned:0,totalLost:0,gamesPlayed:0,biggestWin:0,biggestLoss:0,timeSpent:0,totalWagered:0,totalBets:0,achievements:[],ownedItems:[],equippedItems:{},balanceHistory:[10000]});
    await db.ref('usernames/'+username).set(uid);
  }catch(e){showMsg('signup-msg',AUTH_ERRORS[e.code]||e.message,'error');setLoading('signup-btn',false,'Create Account');}
}

async function doLogin(){
  const username=document.getElementById('login-username').value.trim().toLowerCase();const password=document.getElementById('login-password').value;
  if(!username)return showMsg('login-msg','Enter username.','error');if(!password)return showMsg('login-msg','Enter password.','error');
  setLoading('login-btn',true,'Enter Casino');
  try{await auth.signInWithEmailAndPassword(username+'@sncasino.app',password);}
  catch(e){showMsg('login-msg',AUTH_ERRORS[e.code]||e.message,'error');setLoading('login-btn',false,'Enter Casino');}
}

async function doSignOut(){
  const spent=(userData.timeSpent||0)+(Date.now()-sessionStart);
  try{await db.ref('users/'+currentUser.uid+'/timeSpent').set(spent);}catch(e){}
  await auth.signOut();showScreen('auth');
}

// ════════════════════════════════════════════════
// AUTH STATE
// ════════════════════════════════════════════════
auth.onAuthStateChanged(async(user)=>{
  if(user){
    currentUser=user;sessionStart=Date.now();
    const snap=await db.ref('users/'+user.uid).get();
    if(snap.exists()){
      userData=snap.val();const name=userData.username||'Player';
      ['user-name','game-username'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent='@'+name;});
      const wn=document.getElementById('welcome-name');if(wn)wn.textContent=name;
      if(userData.equippedItems?.themes)applyTheme(userData.equippedItems.themes);
      if(userData.equippedItems?.coinskinsshop)applyCoinSkin(userData.equippedItems.coinskinsshop);
      if(userData.equippedItems?.bgfx){window._bgFxId=userData.equippedItems.bgfx;}
      refreshCoinDisplays();
      const today=new Date().toDateString();const db_banner=document.getElementById('daily-banner');
      if(db_banner)db_banner.style.display=userData.lastSpin===today?'none':'block';
      checkBailout();await saveUserData({lastLogin:Date.now()});
    }
    showScreen('lobby');
  }else{currentUser=null;userData={};showScreen('auth');}
});

// ════════════════════════════════════════════════
// CANVAS BACKGROUND (BG FX fully rewritten)
// ════════════════════════════════════════════════
(function(){
  const canvas=document.getElementById('bgCanvas');const ctx=canvas.getContext('2d');
  let W,H,particles=[],fxPool=[];

  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;reinitAll();}

  // ── Base Particle ──
  class Particle{
    constructor(){this.reset(true);}
    reset(init){this.x=Math.random()*W;this.y=init?Math.random()*H:H+10;this.vy=-(0.15+Math.random()*0.4);this.vx=(Math.random()-.5)*.15;this.size=0.8+Math.random()*1.8;this.alpha=.08+Math.random()*.35;this.life=0;this.maxLife=250+Math.random()*350;}
    update(){this.x+=this.vx;this.y+=this.vy;this.life++;if(this.y<-10||this.life>this.maxLife)this.reset(false);}
    draw(){const f=Math.min(this.life/50,1)*Math.min((this.maxLife-this.life)/50,1);ctx.globalAlpha=this.alpha*f;ctx.fillStyle=window._themeParticleColor||'#0000ff';ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);ctx.fill();}
  }

  // ── Stars ──
  class Star{constructor(){this.reset();}reset(){this.x=Math.random()*W;this.y=Math.random()*H;this.len=60+Math.random()*120;this.speed=4+Math.random()*6;this.alpha=0.5+Math.random()*0.5;this.life=0;this.maxLife=60+Math.random()*60;}update(){this.x+=this.speed;this.y+=this.speed*0.4;this.life++;if(this.x>W+this.len||this.life>this.maxLife)this.reset();}draw(){const f=1-this.life/this.maxLife;ctx.globalAlpha=this.alpha*f;ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(this.x,this.y);ctx.lineTo(this.x-this.len,this.y-this.len*0.4);ctx.stroke();}}

  // ── Matrix ──
  let matrixCols=[];let matrixTimer=0;
  function initMatrix(){matrixCols=[];const cols=Math.floor(W/14);for(let i=0;i<cols;i++)matrixCols.push({x:i*14,y:Math.random()*H,speed:2+Math.random()*4,chars:'01アイウエオカキサシスセタチツ'.split(''),alpha:0.4+Math.random()*0.6});}
  function drawMatrix(){
    ctx.globalAlpha=1;ctx.fillStyle='rgba(0,8,0,.18)';ctx.fillRect(0,0,W,H);
    ctx.font='13px monospace';
    matrixCols.forEach(col=>{col.y+=col.speed;if(col.y>H+20)col.y=-20;
      ctx.globalAlpha=col.alpha;ctx.fillStyle='#00ff44';ctx.fillText(col.chars[Math.floor(Math.random()*col.chars.length)],col.x,col.y);
      ctx.globalAlpha=col.alpha*0.3;for(let i=1;i<=6;i++){if(col.y-i*14>0){ctx.fillStyle=`hsl(130,100%,${40-i*5}%)`;ctx.fillText(col.chars[Math.floor(Math.random()*col.chars.length)],col.x,col.y-i*14);}}
    });
  }

  // ── Confetti ──
  class Confetti{constructor(){this.reset();}reset(){this.x=Math.random()*W;this.y=-20;this.vx=(Math.random()-.5)*3;this.vy=1.5+Math.random()*3;this.rot=Math.random()*Math.PI*2;this.rotV=(Math.random()-.5)*.15;this.w=6+Math.random()*10;this.h=4+Math.random()*6;this.hue=Math.random()*360;}update(){this.x+=this.vx+Math.sin(this.y*.02)*.5;this.y+=this.vy;this.rot+=this.rotV;if(this.y>H+20)this.reset();}draw(){ctx.globalAlpha=0.75;ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.rot);ctx.fillStyle=`hsl(${this.hue},90%,60%)`;ctx.fillRect(-this.w/2,-this.h/2,this.w,this.h);ctx.restore();}}

  // ── Fire ──
  class Ember{constructor(){this.reset();}reset(){this.x=Math.random()*W;this.y=H+10;this.vx=(Math.random()-.5)*1.5;this.vy=-(1.5+Math.random()*3);this.size=1.5+Math.random()*3;this.alpha=0.5+Math.random()*.5;this.life=0;this.maxLife=120+Math.random()*80;this.hue=rand(0,45);}update(){this.x+=this.vx+Math.sin(this.life*.08)*.5;this.y+=this.vy;this.life++;if(this.y<-10||this.life>this.maxLife)this.reset();}draw(){const f=1-this.life/this.maxLife;ctx.globalAlpha=this.alpha*f;ctx.fillStyle=`hsl(${this.hue},100%,${50+f*30}%)`;ctx.beginPath();ctx.arc(this.x,this.y,this.size*f+0.5,0,Math.PI*2);ctx.fill();}}

  // ── Bubbles ──
  class Bubble{constructor(){this.reset();}reset(){this.x=Math.random()*W;this.y=H+20;this.r=8+Math.random()*20;this.vy=-(0.5+Math.random()*1.5);this.vx=(Math.random()-.5)*.5;this.alpha=0.12+Math.random()*.2;this.hue=rand(180,260);}update(){this.x+=this.vx+Math.sin(this.y*.02)*.4;this.y+=this.vy;if(this.y<-this.r*2)this.reset();}draw(){ctx.globalAlpha=this.alpha;ctx.strokeStyle=`hsl(${this.hue},100%,70%)`;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=this.alpha*.3;ctx.fillStyle=`hsl(${this.hue},100%,80%)`;ctx.fill();}}

  // ── Snow ──
  class Snowflake{constructor(){this.reset(true);}reset(init){this.x=Math.random()*W;this.y=init?Math.random()*H:-10;this.r=1.5+Math.random()*3.5;this.vy=0.5+Math.random()*1.5;this.vx=(Math.random()-.5)*.4;this.alpha=0.4+Math.random()*.4;this.wobble=Math.random()*Math.PI*2;}update(){this.y+=this.vy;this.wobble+=.02;this.x+=this.vx+Math.sin(this.wobble)*.5;if(this.y>H+10)this.reset(false);}draw(){ctx.globalAlpha=this.alpha;ctx.fillStyle='#eef8ff';ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fill();}}

  // ── Aurora ──
  let auroraT=0;
  function drawAurora(){
    auroraT+=0.004;
    for(let band=0;band<5;band++){
      const y=H*0.1+band*H*0.1+Math.sin(auroraT+band*1.3)*40;
      const grad=ctx.createLinearGradient(0,y-80,0,y+80);
      const hues=[160,175,195,140,210];
      grad.addColorStop(0,'transparent');grad.addColorStop(0.35,`hsla(${hues[band]},100%,55%,.05)`);grad.addColorStop(0.6,`hsla(${hues[band]},100%,60%,.13)`);grad.addColorStop(1,'transparent');
      ctx.globalAlpha=1;
      for(let x=0;x<W;x+=3){const wave=Math.sin(x*.006+auroraT*(band+1)*.25)*60;ctx.fillStyle=grad;ctx.fillRect(x,y+wave-80,3,160);}
    }
  }

  // ── Lightning ──
  let lightningTimer=0;
  function drawLightning(){
    lightningTimer++;if(lightningTimer%90!==0&&lightningTimer%90!==2&&lightningTimer%90!==4)return;
    ctx.globalAlpha=0.6;ctx.strokeStyle='rgba(180,180,255,.9)';ctx.lineWidth=2;ctx.shadowColor='rgba(150,150,255,1)';ctx.shadowBlur=15;
    let x=rand(W*.1,W*.9),y=0;ctx.beginPath();ctx.moveTo(x,y);
    while(y<H*.7){y+=rand(20,50);x+=rand(-40,40);ctx.lineTo(x,y);}ctx.stroke();ctx.shadowBlur=0;
  }

  // ── Neon Rain ──
  class NeonRain{constructor(){this.reset();}reset(){this.x=Math.random()*W;this.y=-rand(0,H);this.len=rand(20,80);this.speed=6+Math.random()*8;this.hue=rand(160,300);this.alpha=0.3+Math.random()*.4;}update(){this.y+=this.speed;if(this.y-this.len>H)this.reset();}draw(){const grad=ctx.createLinearGradient(this.x,this.y-this.len,this.x,this.y);grad.addColorStop(0,'transparent');grad.addColorStop(1,`hsla(${this.hue},100%,70%,${this.alpha})`);ctx.globalAlpha=1;ctx.strokeStyle=grad;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(this.x,this.y-this.len);ctx.lineTo(this.x,this.y);ctx.stroke();}}

  function buildFxPool(id){
    fxPool=[];
    if(id==='fx_stars')for(let i=0;i<25;i++)fxPool.push(new Star());
    else if(id==='fx_confetti')for(let i=0;i<80;i++)fxPool.push(new Confetti());
    else if(id==='fx_fire')for(let i=0;i<70;i++)fxPool.push(new Ember());
    else if(id==='fx_bubbles')for(let i=0;i<45;i++)fxPool.push(new Bubble());
    else if(id==='fx_snow')for(let i=0;i<90;i++)fxPool.push(new Snowflake(true));
    else if(id==='fx_rain')for(let i=0;i<60;i++)fxPool.push(new NeonRain());
    else if(id==='fx_matrix')initMatrix();
  }

  function reinitAll(){particles=Array.from({length:70},()=>new Particle());const fx=window._bgFxId||'fx_none';if(fx!=='fx_none')buildFxPool(fx);}

  // Expose re-init for when bgfx changes mid-session
  window._fxReinit=function(id){fxPool=[];if(id!=='fx_none')buildFxPool(id);};

  function loop(){
    ctx.globalAlpha=1;ctx.clearRect(0,0,W,H);
    const darkColor=getComputedStyle(document.documentElement).getPropertyValue('--dark').trim()||'#02020a';
    ctx.fillStyle=darkColor;ctx.fillRect(0,0,W,H);
    // Grid
    ctx.strokeStyle=window._themeGridColor||'rgba(0,0,255,.04)';ctx.lineWidth=1;const s=50;
    for(let x=0;x<W;x+=s){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=s){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    // Glow
    const blueColor=getComputedStyle(document.documentElement).getPropertyValue('--blue').trim()||'#0000ff';
    const g=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.min(W,H)*.5);g.addColorStop(0,blueColor+'18');g.addColorStop(1,'transparent');ctx.globalAlpha=1;ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    // Base particles
    particles.forEach(p=>{p.update();p.draw();});ctx.globalAlpha=1;
    // FX overlay
    const fx=window._bgFxId||'fx_none';
    if(fx==='fx_matrix'){drawMatrix();}
    else if(fx==='fx_aurora'){drawAurora();}
    else if(fx==='fx_lightning'){drawLightning();}
    else{fxPool.forEach(p=>{p.update();p.draw();});}
    ctx.globalAlpha=1;requestAnimationFrame(loop);
  }

  window.addEventListener('resize',resize);resize();loop();
})();

// ════════════════════════════════════════════════
// ENTER KEY
// ════════════════════════════════════════════════
document.addEventListener('keydown',e=>{
  if(e.key!=='Enter')return;
  const authScr=document.getElementById('screen-auth');if(!authScr||!authScr.classList.contains('active'))return;
  const p=document.querySelector('.panel.active');if(!p)return;
  if(p.id==='panel-login')doLogin();else doSignup();
});

window.addEventListener('beforeunload',()=>{
  if(currentUser&&userData){const spent=(userData.timeSpent||0)+(Date.now()-sessionStart);try{db.ref('users/'+currentUser.uid+'/timeSpent').set(spent);}catch(e){}}
});
