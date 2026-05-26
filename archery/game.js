/* ============================================================
   BOWMASTER PRELUDE — Complete Remake
   Canvas 960×540  |  60 fps target  |  delta-time physics
   ============================================================ */
(function () {
  'use strict';

  const canvas = document.getElementById('gameCanvas');
  const ctx    = canvas.getContext('2d');
  const W = 960, H = 540;

  // Physics
  const GRAVITY     = 0.38;
  const MAX_POWER   = 30;
  const POWER_SCALE = 0.24;

  // World layout
  const GROUND_Y = H - 38;
  const WALL_TOP = 92;
  const WALL_W   = 112;
  const WALL_HIT = 116;
  const BOW      = { x: 46, y: 158 };

  // DOM helpers
  const $ = id => document.getElementById(id);
  const hudGold = $('hudGold');
  const hudHp   = $('hudHp');
  const hudWave = $('hudWave');
  const startScreen    = $('startScreen');
  const shopScreen     = $('shopScreen');
  const gameOverScreen = $('gameOverScreen');
  const victoryScreen  = $('victoryScreen');
  const slotEls  = { normal:$('slotNormal'), fire:$('slotFire'), ice:$('slotIce'), bomb:$('slotBomb') };
  const ammoEls  = { fire:$('fireCount'), ice:$('iceCount'), bomb:$('bombCount') };

  // ── Wave definitions (20 waves) ───────────────────────────
  const WAVES = [
    [{t:'goblin',n:6,  at:1200,ev:1600}],
    [{t:'goblin',n:8,  at:900, ev:1300},{t:'runner',n:3,at:5000,ev:1500}],
    [{t:'goblin',n:6,  at:800, ev:1100},{t:'orc',   n:3,at:3500,ev:2200}],
    [{t:'runner',n:7,  at:700, ev:1000},{t:'orc',   n:4,at:3000,ev:1800}],
    [{t:'goblin',n:8,  at:600, ev:900 },{t:'orc',   n:3,at:2000,ev:1600},{t:'orc_boss',n:1,at:14000,ev:0}],
    [{t:'orc',   n:6,  at:900, ev:1600},{t:'harpy', n:4,at:2000,ev:1400}],
    [{t:'runner',n:8,  at:600, ev:950 },{t:'harpy', n:5,at:1500,ev:1200}],
    [{t:'orc',   n:7,  at:800, ev:1400},{t:'troll', n:2,at:5000,ev:3500}],
    [{t:'goblin',n:10, at:500, ev:750 },{t:'harpy', n:6,at:1200,ev:1100},{t:'troll',n:1,at:9000,ev:0}],
    [{t:'runner',n:6,  at:550, ev:850 },{t:'orc',   n:5,at:2000,ev:1300},{t:'troll_boss',n:1,at:16000,ev:0}],
    [{t:'orc',   n:8,  at:700, ev:1200},{t:'harpy', n:6,at:1500,ev:1000},{t:'troll',n:2,at:6000,ev:3000}],
    [{t:'goblin',n:12, at:400, ev:650 },{t:'runner',n:7,at:2000,ev:800 },{t:'orc',n:4,at:5000,ev:1200}],
    [{t:'orc',   n:8,  at:600, ev:1100},{t:'troll', n:3,at:3500,ev:2800},{t:'harpy',n:6,at:1800,ev:1000}],
    [{t:'runner',n:9,  at:500, ev:750 },{t:'troll', n:3,at:3000,ev:2600},{t:'harpy',n:8,at:1200,ev:900}],
    [{t:'goblin',n:10, at:400, ev:600 },{t:'orc',   n:7,at:2000,ev:1000},{t:'ogre',n:1,at:13000,ev:0}],
    [{t:'orc',   n:10, at:600, ev:1000},{t:'troll', n:4,at:3000,ev:2400},{t:'harpy',n:8,at:900,ev:900}],
    [{t:'runner',n:10, at:450, ev:700 },{t:'orc',   n:8,at:2000,ev:950 },{t:'ogre',n:1,at:12000,ev:0}],
    [{t:'goblin',n:14, at:300, ev:500 },{t:'troll', n:5,at:2500,ev:2200},{t:'harpy',n:10,at:800,ev:800}],
    [{t:'orc',   n:12, at:500, ev:900 },{t:'troll', n:5,at:2000,ev:2000},{t:'ogre',n:2,at:10000,ev:7000}],
    [{t:'goblin',n:15, at:200, ev:450 },{t:'runner',n:8,at:2000,ev:650 },{t:'orc',n:10,at:4000,ev:800},
     {t:'harpy', n:10, at:1500,ev:700 },{t:'demon_lord',n:1,at:22000,ev:0}],
  ];

  // ── Enemy definitions ─────────────────────────────────────
  const EDEFS = {
    goblin:     { hp:45,   spd:2.0,  dmg:1.5, $:6,   sz:9,  col:'#3ab83a', fly:false, lbl:'Goblin'       },
    runner:     { hp:55,   spd:2.9,  dmg:1.8, $:8,   sz:9,  col:'#cc8833', fly:false, lbl:'Wolf Rider'    },
    orc:        { hp:130,  spd:1.35, dmg:3.0, $:13,  sz:13, col:'#7755bb', fly:false, lbl:'Orc Warrior'   },
    troll:      { hp:300,  spd:0.8,  dmg:6.0, $:24,  sz:17, col:'#446688', fly:false, lbl:'Stone Troll'   },
    harpy:      { hp:70,   spd:2.3,  dmg:2.0, $:10,  sz:10, col:'#cc3388', fly:true,  lbl:'Harpy'         },
    orc_boss:   { hp:650,  spd:0.85, dmg:8.0, $:80,  sz:23, col:'#9933ff', fly:false, lbl:'ORC WARLORD',  boss:true },
    troll_boss: { hp:1300, spd:0.48, dmg:12,  $:160, sz:30, col:'#224466', fly:false, lbl:'STONE GOLEM',  boss:true },
    ogre:       { hp:950,  spd:0.6,  dmg:10,  $:130, sz:27, col:'#bb4400', fly:false, lbl:'OGRE CHIEF',   boss:true },
    demon_lord: { hp:2800, spd:0.65, dmg:16,  $:550, sz:36, col:'#cc1144', fly:false, lbl:'DEMON LORD',   boss:true },
  };

  // ── Game state ────────────────────────────────────────────
  let state = 'title';
  let gold, totalGold, killCount;
  let wallHp, maxWallHp;
  let waveNum;
  let activeType = 'normal';

  const ammo = { fire:0, ice:0, bomb:0 };

  const UP = {
    damage:    { lv:1, max:8,  cost:120, mult:1.55 },
    reload:    { lv:1, max:5,  cost:180, mult:1.65 },
    multishot: { lv:0, max:3,  cost:480, mult:2.5  },
    wallhp:    { lv:0, max:10, cost:90,  mult:1.35 },
    repair:    { lv:0, max:5,  cost:280, mult:1.8  },
    archers:   { lv:0, max:5,  cost:380, mult:2.2  },
  };

  let arrows=[], enemies=[], particles=[], floats=[], sentries=[];
  let spawnQueue=[], spawnClock=0, waveActive=false;
  let mouse={x:0,y:0}, aiming=false, lastShot=0, wallShake=0;

  const STARS = Array.from({length:90},()=>({
    x:Math.random()*W, y:Math.random()*(H*0.55),
    r:Math.random()<0.15?1.5:1, phase:Math.random()*Math.PI*2
  }));
  const TREES = Array.from({length:14},(_,i)=>({
    x:160+i*57+(Math.random()*20-10), h:55+Math.random()*30
  }));

  // ─────────────────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────────────────
  function init() {
    bindInput();
    bindShopUI();
    resetGame();
    requestAnimationFrame(loop);
  }

  function resetGame() {
    gold = 100; totalGold = 100; killCount = 0;
    wallHp = 1000; maxWallHp = 1000; waveNum = 1;
    activeType = 'normal';
    ammo.fire = 0; ammo.ice = 0; ammo.bomb = 0;
    Object.keys(UP).forEach(k => { UP[k].lv = (k==='damage'||k==='reload') ? 1 : 0; });
    arrows=[]; enemies=[]; particles=[]; floats=[]; sentries=[];
    spawnQueue=[]; spawnClock=0; waveActive=false;
    lastShot=0; wallShake=0;
    syncHUD(); syncSlots();
  }

  // ─────────────────────────────────────────────────────────
  // WAVE SYSTEM
  // ─────────────────────────────────────────────────────────
  function beginWave() {
    arrows=[]; particles=[]; floats=[];
    spawnClock=0; waveActive=true;

    sentries = [];
    for (let i=0; i<UP.archers.lv; i++) {
      sentries.push({ x:40, y:196+i*24, shotAt:-99999 });
    }

    const wIdx = Math.min(waveNum-1, WAVES.length-1);
    spawnQueue = [];
    WAVES[wIdx].forEach(grp => {
      for (let i=0; i<grp.n; i++) spawnQueue.push({type:grp.t, ms:grp.at+i*grp.ev});
    });
    spawnQueue.sort((a,b)=>a.ms-b.ms);
    state='playing';
    syncHUD();
  }

  function spawnEnemy(type) {
    const d = EDEFS[type];
    const sc = 1+(waveNum-1)*0.075;
    enemies.push({
      id:Math.random(), type, x:W+40+Math.random()*120,
      y:d.fly?(75+Math.random()*150):(GROUND_Y-d.sz),
      hp:d.hp*sc, maxHp:d.hp*sc, spd:d.spd, dmg:d.dmg,
      reward:d.$, sz:d.sz, col:d.col, fly:d.fly,
      boss:!!d.boss, lbl:d.lbl,
      frozen:0, burning:0, burnTick:0, flash:0, wFrame:0, wTimer:0, alive:true
    });
  }

  // ─────────────────────────────────────────────────────────
  // INPUT
  // ─────────────────────────────────────────────────────────
  function canvasXY(e) {
    const r = canvas.getBoundingClientRect();
    return { x:(e.clientX-r.left)*(W/r.width), y:(e.clientY-r.top)*(H/r.height) };
  }

  function bindInput() {
    $('startGameBtn').addEventListener('click', () => { startScreen.classList.remove('active'); beginWave(); });
    $('nextWaveBtn').addEventListener('click',  () => { shopScreen.classList.remove('active'); beginWave(); });
    $('restartGameBtn').addEventListener('click',() => { gameOverScreen.classList.remove('active'); resetGame(); beginWave(); });
    $('victoryHomeBtn').addEventListener('click',() => { victoryScreen.classList.remove('active'); waveNum=WAVES.length; beginWave(); });

    canvas.addEventListener('mousedown', e => {
      if (state!=='playing') return;
      if (Date.now()-lastShot < reloadMs()) return;
      mouse = canvasXY(e); aiming=true;
    });
    canvas.addEventListener('mousemove', e => { mouse = canvasXY(e); });
    canvas.addEventListener('mouseup', e => {
      if (!aiming) return;
      aiming=false;
      shootArrow(canvasXY(e));
    });
    canvas.addEventListener('mouseleave', ()=>{ aiming=false; });

    Object.keys(slotEls).forEach(t => slotEls[t].addEventListener('click', ()=>pickType(t)));
    document.addEventListener('keydown', e => {
      if (state!=='playing') return;
      const m={'1':'normal','2':'fire','3':'ice','4':'bomb'};
      if (m[e.key]) pickType(m[e.key]);
    });
  }

  function reloadMs() { return Math.max(160, 950-(UP.reload.lv-1)*160); }

  function pickType(t) {
    if (t!=='normal' && ammo[t]<=0) return;
    activeType=t;
    Object.values(slotEls).forEach(el=>el.classList.remove('active'));
    slotEls[t].classList.add('active');
  }

  // ─────────────────────────────────────────────────────────
  // SHOOTING
  // ─────────────────────────────────────────────────────────
  function shootArrow(p) {
    const dx=BOW.x-p.x, dy=BOW.y-p.y;
    const dist=Math.hypot(dx,dy);
    if (dist<8) return;
    const pwr=Math.min(MAX_POWER, dist*POWER_SCALE);
    const nx=dx/dist, ny=dy/dist;

    if (activeType!=='normal') {
      if (ammo[activeType]<=0) { pickType('normal'); return; }
      ammo[activeType]--; syncSlots();
    }

    const baseDmg = 30+(UP.damage.lv-1)*16;
    buildShots(nx*pwr, ny*pwr, UP.multishot.lv).forEach((s,i) => {
      arrows.push({ x:BOW.x, y:BOW.y, vx:s.vx, vy:s.vy, type:activeType,
        dmg:baseDmg*(i===0?1:0.75), trail:[], alive:true, sentry:false });
    });
    lastShot=Date.now();
  }

  function buildShots(vx,vy,ms) {
    const arr=[{vx,vy}];
    [[0.09,-0.09],[0.18,-0.18],[0.27,-0.27]].slice(0,ms).forEach(pair =>
      pair.forEach(a=>arr.push(rotV(vx,vy,a)))
    );
    return arr;
  }

  function rotV(vx,vy,a) {
    const c=Math.cos(a),s=Math.sin(a);
    return {vx:vx*c-vy*s, vy:vx*s+vy*c};
  }

  // ─────────────────────────────────────────────────────────
  // SENTRY AI
  // ─────────────────────────────────────────────────────────
  function tickSentries() {
    if (!enemies.length) return;
    const now=Date.now();
    const delay=Math.max(900, 2400-UP.archers.lv*280);
    const sDmg=18+UP.damage.lv*5;
    sentries.forEach(s => {
      if (now-s.shotAt<delay) return;
      const target=enemies.reduce((b,e)=>(!b||e.x<b.x?e:b),null);
      if (!target) return;
      const dx=s.x-target.x, dy=s.y-target.y;
      const d=Math.hypot(dx,dy);
      const pwr=Math.min(18, d*0.18);
      arrows.push({ x:s.x, y:s.y, vx:(dx/d)*pwr, vy:(dy/d)*pwr,
        type:'normal', dmg:sDmg, trail:[], alive:true, sentry:true });
      s.shotAt=now;
    });
  }

  // ─────────────────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────────────────
  function update(dt) {
    if (state!=='playing') return;
    const f=dt/16.667;

    spawnClock+=dt;
    while (spawnQueue.length && spawnQueue[0].ms<=spawnClock) spawnEnemy(spawnQueue.shift().type);

    tickSentries();

    if (UP.repair.lv>0 && !enemies.length && !spawnQueue.length)
      wallHp=Math.min(maxWallHp, wallHp+UP.repair.lv*0.09*f);

    // Arrows
    arrows.forEach(arr=>{
      arr.trail.push({x:arr.x,y:arr.y});
      if (arr.trail.length>14) arr.trail.shift();
      arr.x+=arr.vx*f; arr.y+=arr.vy*f; arr.vy+=GRAVITY*f;
      if (arr.y>GROUND_Y+6||arr.x>W+60||arr.y<-60) {
        arr.alive=false;
        if (arr.y>=GROUND_Y-2) burst(arr.x,GROUND_Y,'#555',5,1.5);
        return;
      }
      enemies.forEach(en=>{
        if (!arr.alive||!en.alive) return;
        if (Math.hypot(arr.x-en.x,arr.y-en.y)<en.sz+3) {
          arr.type==='bomb' ? (explode(arr.x,arr.y,95,arr.dmg), arr.alive=false)
                            : (hitEnemy(en,arr.dmg,arr.type), arr.alive=false);
        }
      });
    });
    arrows=arrows.filter(a=>a.alive);

    // Enemies
    enemies.forEach(en=>{
      if (!en.alive) return;
      if (en.frozen>0) en.frozen-=f;
      if (en.burning>0) {
        en.burning-=f; en.burnTick-=f;
        if (en.burnTick<=0) {
          en.burnTick=42;
          const bd=10+UP.damage.lv*2;
          en.hp-=bd; addFloat(en.x,en.y-18,bd,'#ff6b35');
          burst(en.x,en.y,'#ff3300',3,1);
          if (en.hp<=0) killEnemy(en);
        }
      }
      if (en.flash>0) en.flash-=f;
      en.wTimer+=f; if (en.wTimer>10){en.wFrame=(en.wFrame+1)%4;en.wTimer=0;}
      const spd=en.frozen>0?en.spd*0.32:en.spd;
      if (en.x>WALL_HIT+en.sz*0.5) {
        en.x-=spd*f;
      } else {
        wallHp-=en.dmg*0.017*f; wallShake=9;
        if (wallHp<=0){wallHp=0;defeat();}
        if (Math.random()<0.03) burst(WALL_HIT,en.y,'#ff3366',3,1.5);
        syncHUD();
      }
    });
    enemies=enemies.filter(e=>e.alive);

    particles.forEach(p=>{ p.x+=p.vx*f; p.y+=p.vy*f; p.vy+=0.15*f; p.lf-=f; });
    particles=particles.filter(p=>p.lf>0);
    floats.forEach(t=>{t.y-=0.7*f;t.lf-=f;});
    floats=floats.filter(t=>t.lf>0);
    if (wallShake>0) wallShake-=f;

    if (waveActive && !spawnQueue.length && !enemies.length) { waveActive=false; endWave(); }
    syncHUD();
  }

  function hitEnemy(en,dmg,type) {
    if (type==='fire'){en.burning=220;en.burnTick=42;burst(en.x,en.y,'#ff4400',10,2.2);}
    else if (type==='ice'){en.frozen=200;dmg*=1.25;burst(en.x,en.y,'#00e5ff',10,2.2);}
    en.hp-=dmg; en.flash=7;
    addFloat(en.x,en.y-en.sz-4,Math.round(dmg),type==='ice'?'#00e5ff':'#fff');
    burst(en.x,en.y,en.col,5,1.5);
    if (en.hp<=0) killEnemy(en);
  }

  function explode(cx,cy,r,dmg) {
    burst(cx,cy,'#ff9900',50,5.5); burst(cx,cy,'#ff3300',30,4); burst(cx,cy,'#ffee00',20,7);
    enemies.forEach(en=>{
      if (!en.alive) return;
      const d=Math.hypot(en.x-cx,en.y-cy);
      if (d<r) {
        const bd=Math.round(dmg*(1-d/r));
        en.hp-=bd; en.flash=12; en.burning=140; en.burnTick=40;
        addFloat(en.x,en.y-18,bd,'#ff6b35');
        if (en.hp<=0) killEnemy(en);
      }
    });
  }

  function killEnemy(en) {
    en.alive=false; en.hp=0;
    gold+=en.reward; totalGold+=en.reward; killCount++;
    burst(en.x,en.y,en.col,en.boss?35:14,en.boss?4.5:2.5);
    addFloat(en.x,en.y-28,'+'+en.reward+'g','#c8f542');
    if (en.boss) addFloat(en.x,en.y-48,en.lbl+' SLAIN!','#ff3366',1.5);
    syncHUD();
  }

  function burst(x,y,col,n,sz) {
    for (let i=0;i<n;i++){
      const a=Math.random()*Math.PI*2, s=Math.random()*4.5+0.8;
      particles.push({x,y,col,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1,
        lf:30+Math.random()*22,maxLf:52,sz:Math.random()*sz+0.8});
    }
  }

  function addFloat(x,y,text,col,scale=1) {
    floats.push({x,y,text:String(text),col,scale,lf:52,maxLf:52});
  }

  // ─────────────────────────────────────────────────────────
  // WAVE EVENTS
  // ─────────────────────────────────────────────────────────
  function endWave() {
    wallHp=Math.min(maxWallHp,wallHp+160);
    if (waveNum>=20) { state='victory'; victoryScreen.classList.add('active'); return; }
    waveNum++; syncHUD(); syncShopDisplay();
    shopScreen.classList.add('active'); state='shop';
  }

  function defeat() {
    state='gameover';
    $('goWave').textContent=waveNum; $('goGold').textContent=totalGold;
    gameOverScreen.classList.add('active');
  }

  // ─────────────────────────────────────────────────────────
  // SHOP
  // ─────────────────────────────────────────────────────────
  function upCost(key) {
    const u=UP[key]; return Math.round(u.cost*Math.pow(u.mult,u.lv));
  }

  function buyUp(key) {
    const u=UP[key]; if (u.lv>=u.max) return;
    const c=upCost(key); if (gold<c) return;
    gold-=c; u.lv++;
    if (key==='wallhp'){maxWallHp+=250;wallHp=Math.min(maxWallHp,wallHp+250);}
    syncHUD(); syncShopDisplay();
  }

  function buyAmmoBundle(type,cost,amt) {
    if (gold<cost) return;
    gold-=cost; ammo[type]+=amt;
    syncHUD(); syncShopDisplay(); syncSlots();
  }

  function bindShopUI() {
    document.querySelectorAll('.shop-tab').forEach(t=>{
      t.addEventListener('click',()=>{
        document.querySelectorAll('.shop-tab').forEach(x=>x.classList.remove('active'));
        document.querySelectorAll('.shop-tab-content').forEach(x=>x.classList.remove('active'));
        t.classList.add('active');
        document.getElementById('tab-'+t.dataset.tab).classList.add('active');
      });
    });
    $('buyDamage')   .addEventListener('click',()=>buyUp('damage'));
    $('buyMultishot').addEventListener('click',()=>buyUp('multishot'));
    $('buyFirerate') .addEventListener('click',()=>buyUp('reload'));
    $('buyWallHp')   .addEventListener('click',()=>buyUp('wallhp'));
    $('buyRepair')   .addEventListener('click',()=>buyUp('repair'));
    $('buyArchers')  .addEventListener('click',()=>buyUp('archers'));
    $('buyFireAmmo') .addEventListener('click',()=>buyAmmoBundle('fire', 75,10));
    $('buyIceAmmo')  .addEventListener('click',()=>buyAmmoBundle('ice',  75,10));
    $('buyBombAmmo') .addEventListener('click',()=>buyAmmoBundle('bomb',140, 5));
  }

  function syncShopDisplay() {
    const btn=(id,key,lbl)=>{
      const u=UP[key],el=$(id);
      if (u.lv>=u.max){el.textContent='MAXED OUT';el.classList.add('disabled');}
      else{el.textContent=lbl+': '+upCost(key)+'g';el.classList.toggle('disabled',gold<upCost(key));}
    };
    btn('buyDamage',   'damage',   'Upgrade');
    btn('buyMultishot','multishot','Upgrade');
    btn('buyFirerate', 'reload',   'Upgrade');
    btn('buyWallHp',   'wallhp',   'Buy');
    btn('buyRepair',   'repair',   'Upgrade');
    btn('buyArchers',  'archers',  'Hire');
    $('buyFireAmmo').textContent='Buy ×10: 75g';
    $('buyIceAmmo').textContent ='Buy ×10: 75g';
    $('buyBombAmmo').textContent='Buy ×5: 140g';
    $('ownedFire').textContent=ammo.fire;
    $('ownedIce').textContent =ammo.ice;
    $('ownedBomb').textContent=ammo.bomb;
    const mt=['Single','Triple Fan','×5 Spread','×7 Spread'];
    document.querySelector('[data-upgrade="damage"]    .v-level').textContent=UP.damage.lv+' / '+UP.damage.max;
    document.querySelector('[data-upgrade="multishot"] .v-level').textContent=mt[UP.multishot.lv];
    document.querySelector('[data-upgrade="firerate"]  .v-level').textContent=UP.reload.lv+' / '+UP.reload.max;
    document.querySelector('[data-upgrade="wallHp"]    .v-level').textContent=maxWallHp+' HP';
    document.querySelector('[data-upgrade="repair"]    .v-level').textContent=UP.repair.lv?'+'+UP.repair.lv*15+' HP/s':'None';
    document.querySelector('[data-upgrade="archers"]   .v-level').textContent=UP.archers.lv+' / 5';
  }

  function syncHUD() {
    hudGold.textContent=gold;
    hudHp.textContent=Math.floor(wallHp)+' / '+maxWallHp;
    hudWave.textContent=waveNum;
  }

  function syncSlots() {
    ['fire','ice','bomb'].forEach(t=>{
      slotEls[t].classList.toggle('locked',ammo[t]<=0);
      ammoEls[t].textContent=ammo[t];
      if (ammo[t]<=0 && activeType===t) pickType('normal');
    });
    Object.values(slotEls).forEach(el=>el.classList.remove('active'));
    slotEls[activeType].classList.add('active');
  }

  // ─────────────────────────────────────────────────────────
  // DRAW: BACKGROUND
  // ─────────────────────────────────────────────────────────
  function drawBG() {
    const sky=ctx.createLinearGradient(0,0,0,H*0.8);
    sky.addColorStop(0,'#04050c'); sky.addColorStop(1,'#0d0e1c');
    ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);

    const t=Date.now()*0.001;
    STARS.forEach(s=>{
      ctx.fillStyle=`rgba(255,255,240,${0.3+Math.sin(t+s.phase)*0.25+0.15})`;
      ctx.fillRect(s.x,s.y,s.r*2,s.r*2);
    });

    // Moon glow
    const mg=ctx.createRadialGradient(845,68,20,845,68,75);
    mg.addColorStop(0,'rgba(255,255,220,0.12)'); mg.addColorStop(1,'rgba(255,255,180,0)');
    ctx.fillStyle=mg; ctx.beginPath(); ctx.arc(845,68,75,0,Math.PI*2); ctx.fill();
    const mb=ctx.createRadialGradient(838,58,5,845,68,42);
    mb.addColorStop(0,'rgba(255,255,225,0.82)'); mb.addColorStop(1,'rgba(205,200,170,0.12)');
    ctx.fillStyle=mb; ctx.beginPath(); ctx.arc(845,68,42,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(140,135,110,0.22)';
    [[835,55,7],[858,80,5],[822,76,4],[850,52,3]].forEach(([cx,cy,r])=>{
      ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
    });

    // Far hill
    ctx.fillStyle='#0b0d18'; ctx.beginPath();
    ctx.moveTo(0,H); ctx.lineTo(0,340);
    ctx.bezierCurveTo(100,290,220,310,350,345);
    ctx.bezierCurveTo(480,300,600,285,750,340);
    ctx.bezierCurveTo(860,310,920,360,W,370);
    ctx.lineTo(W,H); ctx.closePath(); ctx.fill();

    // Near hill
    ctx.fillStyle='#090b14'; ctx.beginPath();
    ctx.moveTo(0,H); ctx.lineTo(0,395);
    ctx.bezierCurveTo(150,365,300,375,450,410);
    ctx.bezierCurveTo(600,375,730,400,880,418);
    ctx.lineTo(W,H); ctx.closePath(); ctx.fill();

    // Trees
    TREES.forEach(tr=>{
      ctx.fillStyle='#08090f';
      ctx.fillRect(tr.x-3,GROUND_Y-tr.h,6,tr.h);
      [[18,0],[14,-14],[10,-26]].forEach(([hw,yo])=>{
        ctx.beginPath();
        ctx.moveTo(tr.x,GROUND_Y-tr.h+yo-18);
        ctx.lineTo(tr.x-hw,GROUND_Y-tr.h+yo);
        ctx.lineTo(tr.x+hw,GROUND_Y-tr.h+yo);
        ctx.closePath(); ctx.fill();
      });
    });

    ctx.fillStyle='#0b0c12'; ctx.fillRect(0,GROUND_Y,W,H-GROUND_Y);
    ctx.strokeStyle='#111420'; ctx.lineWidth=1;
    for (let gx=140;gx<W;gx+=42){
      ctx.beginPath(); ctx.moveTo(gx,GROUND_Y); ctx.lineTo(gx+18,GROUND_Y+32); ctx.stroke();
    }
    ctx.strokeStyle='#1a1e2e'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(0,GROUND_Y); ctx.lineTo(W,GROUND_Y); ctx.stroke();
  }

  // ─────────────────────────────────────────────────────────
  // DRAW: CASTLE
  // ─────────────────────────────────────────────────────────
  function drawCastle() {
    const shX=wallShake>0?(Math.random()*4-2)*(wallShake/9):0;
    const shY=wallShake>0?(Math.random()*2-1)*(wallShake/9):0;
    ctx.save(); ctx.translate(shX,shY);

    ctx.fillStyle='rgba(0,0,0,0.35)';
    ctx.fillRect(3,WALL_TOP+3,WALL_W,GROUND_Y-WALL_TOP);
    ctx.fillStyle='#1b1f2e';
    ctx.fillRect(0,WALL_TOP,WALL_W,GROUND_Y-WALL_TOP);

    // Stone rows
    ctx.strokeStyle='#232840'; ctx.lineWidth=1;
    for (let row=0;row<Math.ceil((GROUND_Y-WALL_TOP)/38)+1;row++){
      const ry=WALL_TOP+row*38, offX=(row%2)*30;
      ctx.beginPath(); ctx.moveTo(0,ry); ctx.lineTo(WALL_W,ry); ctx.stroke();
      for (let col=-1;col<4;col++){
        ctx.beginPath(); ctx.moveTo(col*60+offX,ry); ctx.lineTo(col*60+offX,ry+38); ctx.stroke();
      }
    }

    // Left tower
    ctx.fillStyle='#20253a'; ctx.fillRect(0,WALL_TOP-18,24,GROUND_Y-WALL_TOP+18);
    ctx.fillStyle='#1c2133'; ctx.fillRect(3,WALL_TOP-14,18,GROUND_Y-WALL_TOP+14);

    // Merlons
    for (let i=0;i<5;i++){
      const mx=i*(22+12)-4;
      ctx.fillStyle='#1f2540'; ctx.fillRect(mx,WALL_TOP-28,22,28);
      ctx.fillStyle='#28304a'; ctx.fillRect(mx,WALL_TOP-28,22,3);
      ctx.fillRect(mx,WALL_TOP-28,3,28);
    }
    ctx.fillStyle='#252c42'; ctx.fillRect(-4,WALL_TOP-2,WALL_W+8,4);

    // Arrow slits
    [[26,32],[68,32],[26,82],[68,82],[26,130],[68,130]].forEach(([sx,sy])=>{
      ctx.fillStyle='#080a10'; ctx.fillRect(sx,WALL_TOP+sy,10,20);
      ctx.fillStyle='rgba(200,245,66,0.055)'; ctx.fillRect(sx+1,WALL_TOP+sy+1,8,18);
    });

    // Gate
    ctx.fillStyle='#07090f'; ctx.fillRect(38,GROUND_Y-75,36,75);
    ctx.beginPath(); ctx.arc(56,GROUND_Y-75,18,Math.PI,0); ctx.fill();
    ctx.strokeStyle='#121520'; ctx.lineWidth=2;
    for (let gi=0;gi<4;gi++){
      ctx.beginPath(); ctx.moveTo(41+gi*9,GROUND_Y-72); ctx.lineTo(41+gi*9,GROUND_Y-2); ctx.stroke();
    }
    for (let gr=0;gr<3;gr++){
      ctx.beginPath(); ctx.moveTo(41,GROUND_Y-58+gr*20); ctx.lineTo(68,GROUND_Y-58+gr*20); ctx.stroke();
    }

    // Damage cracks
    const hf=wallHp/maxWallHp;
    if (hf<0.6){
      ctx.strokeStyle=`rgba(220,60,60,${(0.6-hf)*0.8})`; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(72,WALL_TOP+45); ctx.lineTo(85,WALL_TOP+78); ctx.lineTo(76,WALL_TOP+108); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(28,WALL_TOP+58); ctx.lineTo(18,WALL_TOP+95); ctx.stroke();
    }
    if (hf<0.3){
      ctx.strokeStyle='rgba(255,50,50,0.7)'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(52,WALL_TOP+18); ctx.lineTo(42,WALL_TOP+52); ctx.lineTo(58,WALL_TOP+82); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(90,WALL_TOP+40); ctx.lineTo(102,WALL_TOP+70); ctx.stroke();
    }

    // Wall HP bar
    ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(0,GROUND_Y+5,WALL_W,6);
    const hc=hf>0.55?'#3bcc3b':hf>0.28?'#ff9900':'#ff3366';
    ctx.fillStyle=hc; ctx.fillRect(0,GROUND_Y+5,WALL_W*Math.max(0,hf),6);

    drawHeroArcher(BOW.x,BOW.y);
    sentries.forEach(s=>drawSentryArcher(s.x,s.y));
    ctx.restore();
  }

  function drawHeroArcher(x,y) {
    ctx.fillStyle='#8aaa20'; ctx.fillRect(x-7,y-2,5,12); ctx.fillRect(x+7,y-2,5,12);
    ctx.fillStyle='#b8e238'; ctx.fillRect(x-5,y-6,11,15);
    ctx.fillStyle='#c8f542'; ctx.beginPath(); ctx.arc(x+1,y-12,7,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#8aaa20'; ctx.fillRect(x-6,y-18,14,8); ctx.fillRect(x-4,y-20,10,4);
    ctx.fillStyle='#050708'; ctx.fillRect(x-5,y-15,12,4);
    ctx.strokeStyle='#a8ca28'; ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.arc(x+20,y-6,13,-Math.PI/2.2,Math.PI/2.2); ctx.stroke();
    ctx.strokeStyle='#e2d890'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(x+7,y-6); ctx.lineTo(x+20,y-6); ctx.stroke();
    const pullD=aiming?Math.min(13,Math.hypot(BOW.x-mouse.x,BOW.y-mouse.y)*0.28):0;
    const strAng=aiming?Math.atan2(BOW.y-mouse.y,BOW.x-mouse.x):0;
    const pX=x+20+(aiming?Math.cos(strAng+Math.PI)*pullD:0);
    const pY=y-6 +(aiming?Math.sin(strAng+Math.PI)*pullD:0);
    ctx.strokeStyle=aiming?'rgba(255,255,210,0.9)':'rgba(255,255,210,0.45)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(x+20,y-19); ctx.lineTo(pX,pY); ctx.lineTo(x+20,y+7); ctx.stroke();
    ctx.strokeStyle='#c8f542'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(x+6,y-4); ctx.lineTo(x+20,y-8); ctx.stroke();
  }

  function drawSentryArcher(x,y) {
    ctx.fillStyle='#0abbd4'; ctx.fillRect(x-4,y-5,9,13);
    ctx.beginPath(); ctx.arc(x+1,y-10,5,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#08a0be'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(x+14,y-3,8,-Math.PI/2,Math.PI/2); ctx.stroke();
    ctx.strokeStyle='rgba(255,255,200,0.35)'; ctx.lineWidth=0.9;
    ctx.beginPath(); ctx.moveTo(x+14,y-11); ctx.lineTo(x+18,y-3); ctx.lineTo(x+14,y+5); ctx.stroke();
  }

  // ─────────────────────────────────────────────────────────
  // DRAW: ENEMIES
  // ─────────────────────────────────────────────────────────
  function drawEnemy(e) {
    const s=e.sz;
    ctx.save(); ctx.translate(e.x,e.y);
    if (e.flash>0){ctx.shadowColor='#ffffff';ctx.shadowBlur=14;}
    const col=e.frozen>0?'#55c8ee':e.burning>0?'#ee6622':e.col;
    const lw=e.wFrame<2?1:-1;

    if (e.type==='goblin') {
      ctx.fillStyle='#1c380c'; ctx.fillRect(-s*.45+lw*2,s*.3,s*.38,s*.9); ctx.fillRect(s*.07-lw*2,s*.3,s*.38,s*.9);
      ctx.fillStyle=col; ctx.fillRect(-s*.65,-s*.55,s*1.3,s*.9);
      ctx.beginPath(); ctx.arc(0,-s*.85,s*.58,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#ffe020'; ctx.fillRect(-s*.22,-s*1.02,s*.14,s*.14); ctx.fillRect(s*.08,-s*1.02,s*.14,s*.14);
      ctx.fillStyle='#ff2222'; ctx.fillRect(-s*.32,-s*.72,s*.64,s*.18);
      ctx.strokeStyle='#bbb'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(s*.65,-s*.4); ctx.lineTo(s*.95,-s*.8); ctx.stroke();

    } else if (e.type==='runner') {
      ctx.fillStyle='#5a3a1a'; ctx.fillRect(-s*.9,-s*.1,s*1.8,s*.7);
      ctx.fillRect(-s*.7,s*.4+lw*3,s*.4,s*.55); ctx.fillRect(s*.3,s*.4-lw*3,s*.4,s*.55);
      ctx.fillStyle='#6e4a22'; ctx.beginPath(); ctx.arc(-s*1.0,-s*.08,s*.52,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#fff'; ctx.fillRect(-s*1.2,-s*.2,s*.22,s*.12);
      ctx.fillStyle=col; ctx.fillRect(-s*.3,-s*1.1,s*.6,s*1.0);
      ctx.beginPath(); ctx.arc(0,-s*1.35,s*.45,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#ff4444'; ctx.fillRect(-s*.2,-s*1.5,s*.4,s*.12);

    } else if (e.type==='orc'||e.type==='orc_boss') {
      const bs=e.boss?1.05:1; ctx.scale(bs,bs);
      ctx.fillStyle='#3a2a55'; ctx.fillRect(-s*.48+lw*2,s*.22,s*.42,s*1.1); ctx.fillRect(s*.06-lw*2,s*.22,s*.42,s*1.1);
      ctx.fillStyle=col; ctx.fillRect(-s*.75,-s*.65,s*1.5,s*.95);
      ctx.beginPath(); ctx.arc(0,-s*.95,s*.68,0,Math.PI*2); ctx.fill();
      if (e.boss){
        ctx.fillStyle='#5a3a7a';
        ctx.fillRect(-s*.76,-s*1.55,s*1.52,s*.7);
        ctx.fillRect(-s*.62,-s*2.0,s*.25,s*.55); ctx.fillRect(s*.37,-s*2.0,s*.25,s*.55);
      }
      ctx.fillStyle='#ffdd22'; ctx.fillRect(-s*.25,-s*1.15,s*.2,s*.2); ctx.fillRect(s*.05,-s*1.15,s*.2,s*.2);
      ctx.fillStyle='#7a7a7a'; ctx.fillRect(s*.88,-s*.9,s*.14,s*1.25); ctx.fillRect(s*.72,-s*1.05,s*.38,s*.42);
      ctx.fillStyle='#6b4020'; ctx.fillRect(s*.92,-s*.85,s*.06,s*1.2);

    } else if (e.type==='troll'||e.type==='troll_boss') {
      ctx.fillStyle='#1e2c40'; ctx.fillRect(-s*.55+lw*2,s*.55,s*.48,s*1.3); ctx.fillRect(s*.07-lw*2,s*.55,s*.48,s*1.3);
      ctx.fillStyle=col; ctx.fillRect(-s*1.05,-s*.9,s*2.1,s*1.55);
      ctx.beginPath(); ctx.arc(0,-s*1.25,s*.9,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='#263348'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(-s*.5,-s*.4); ctx.lineTo(-s*.7,s*.2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s*.3,-s*.6); ctx.lineTo(s*.5,-s*.1); ctx.stroke();
      ctx.fillStyle='#ff2200'; ctx.fillRect(-s*.22,-s*1.42,s*.2,s*.2); ctx.fillRect(s*.02,-s*1.42,s*.2,s*.2);
      ctx.fillStyle='#5c3818'; ctx.fillRect(s*1.1,-s*.9,s*.2,s*1.5);
      if (e.boss){
        ctx.fillStyle='#aaa'; ctx.fillRect(s*.9,-s*1.05,s*.62,s*.52);
        for (let si=0;si<3;si++) { ctx.beginPath(); ctx.arc(s*.97+si*s*.24,-s*1.08,s*.1,0,Math.PI*2); ctx.fill(); }
      } else {
        ctx.fillRect(s*.9,-s*1.0,s*.6,s*.5);
      }

    } else if (e.type==='harpy') {
      const flap=Math.sin(Date.now()*0.008)*s*.5;
      ctx.fillStyle=col; ctx.beginPath(); ctx.arc(0,0,s*.72,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle=e.col; ctx.lineWidth=3.5;
      ctx.beginPath(); ctx.moveTo(0,-s*.2); ctx.quadraticCurveTo(-s*1.4,-s*.6+flap,-s*2.2,s*.4+flap); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,-s*.2); ctx.quadraticCurveTo(s*1.4,-s*.6+flap,s*2.2,s*.4+flap); ctx.stroke();
      ctx.fillStyle='#ffee66'; ctx.fillRect(-s*.22,-s*.28,s*.16,s*.16); ctx.fillRect(s*.06,-s*.28,s*.16,s*.16);
      ctx.fillStyle='#ff4444'; ctx.beginPath(); ctx.arc(0,s*.22,s*.28,0,Math.PI); ctx.fill();

    } else if (e.type==='ogre') {
      ctx.fillStyle='#8c2808'; ctx.fillRect(-s*.6+lw*3,s*.62,s*.55,s*1.4); ctx.fillRect(s*.05-lw*3,s*.62,s*.55,s*1.4);
      ctx.fillStyle=col; ctx.fillRect(-s*1.2,-s*1.15,s*2.4,s*1.85);
      ctx.beginPath(); ctx.arc(0,-s*1.55,s*1.1,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#ffe0a8'; ctx.fillRect(-s*.52,-s*1.15,s*.18,s*.42); ctx.fillRect(s*.34,-s*1.15,s*.18,s*.42);
      ctx.shadowColor='#ff3300'; ctx.shadowBlur=8; ctx.fillStyle='#ff1500';
      ctx.fillRect(-s*.42,-s*2.0,s*.22,s*.22); ctx.fillRect(s*.2,-s*2.0,s*.22,s*.22);
      ctx.shadowBlur=0;
      ctx.fillStyle='#661800'; ctx.fillRect(s*1.2,-s*.95,s*.28,s*2.0);
      ctx.fillStyle='#888'; ctx.fillRect(s*.92,-s*1.3,s*.84,s*.65);

    } else if (e.type==='demon_lord') {
      const pulse=0.96+Math.sin(Date.now()*0.004)*0.05; ctx.scale(pulse,pulse);
      ctx.fillStyle='#6a0010'; ctx.fillRect(-s*.65+lw*4,s*.55,s*.6,s*1.5); ctx.fillRect(s*.05-lw*4,s*.55,s*.6,s*1.5);
      ctx.fillStyle=col; ctx.fillRect(-s*1.4,-s*1.3,s*2.8,s*2.0);
      ctx.beginPath(); ctx.arc(0,-s*1.75,s*1.3,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#380008';
      ctx.beginPath(); ctx.moveTo(-s*.85,-s*2.8); ctx.lineTo(-s*.45,-s*1.92); ctx.lineTo(-s*1.25,-s*1.92); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(s*.85,-s*2.8); ctx.lineTo(s*.45,-s*1.92); ctx.lineTo(s*1.25,-s*1.92); ctx.closePath(); ctx.fill();
      ctx.shadowColor='#ff0000'; ctx.shadowBlur=20; ctx.fillStyle='#ff1500';
      ctx.fillRect(-s*.48,-s*2.06,s*.26,s*.26); ctx.fillRect(s*.22,-s*2.06,s*.26,s*.26);
      ctx.shadowBlur=0;
      ctx.strokeStyle='#550010'; ctx.lineWidth=4;
      ctx.beginPath(); ctx.moveTo(-s*.9,-s*.5); ctx.quadraticCurveTo(-s*2.8,-s*2.2,-s*3.4,s*.5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s*.9,-s*.5); ctx.quadraticCurveTo(s*2.8,-s*2.2,s*3.4,s*.5); ctx.stroke();
    }

    // HP bar
    const hpFrac=Math.max(0,e.hp/e.maxHp);
    const bw=e.boss?s*4.2:s*2.8, bh=e.boss?6:3;
    const barY=-s*(e.type==='demon_lord'?3.5:e.boss?2.7:e.fly?1.8:2.1)-5;
    ctx.fillStyle='rgba(0,0,0,0.65)'; ctx.fillRect(-bw/2,barY,bw,bh);
    ctx.fillStyle=hpFrac>0.55?'#3bcc3b':hpFrac>0.27?'#ff9900':'#ff3366';
    ctx.fillRect(-bw/2,barY,bw*hpFrac,bh);
    if (e.boss){
      ctx.shadowColor=e.col; ctx.shadowBlur=6;
      ctx.fillStyle='#ff3366'; ctx.font='bold 8px "Space Mono",monospace'; ctx.textAlign='center';
      ctx.fillText(e.lbl,0,barY-5); ctx.shadowBlur=0;
    }
    if (e.frozen>0){
      ctx.fillStyle=`rgba(0,210,255,${Math.min(0.4,e.frozen/200*0.4)})`;
      ctx.fillRect(-s*(e.boss?1.5:0.85),-s*1.8,s*(e.boss?3:1.7),s*2.8);
    }
    ctx.restore();
  }

  // ─────────────────────────────────────────────────────────
  // DRAW: ARROWS
  // ─────────────────────────────────────────────────────────
  function drawArrow(arr) {
    const ang=Math.atan2(arr.vy,arr.vx);
    arr.trail.forEach((pt,i)=>{
      const alpha=(i/arr.trail.length)*0.55;
      const tc=arr.type==='fire'?`rgba(255,110,20,${alpha})`:arr.type==='ice'?`rgba(0,200,255,${alpha})`:arr.type==='bomb'?`rgba(255,200,0,${alpha*.8})`:`rgba(200,190,140,${alpha*.6})`;
      ctx.fillStyle=tc;
      const r=(i/arr.trail.length)*2.5+0.5;
      ctx.fillRect(pt.x-r/2,pt.y-r/2,r,r);
    });
    ctx.save(); ctx.translate(arr.x,arr.y); ctx.rotate(ang);
    const sc=arr.type==='fire'?'#c85010':arr.type==='ice'?'#55bbd0':arr.type==='bomb'?'#888':'#c8b870';
    ctx.strokeStyle=sc; ctx.lineWidth=2.2;
    ctx.beginPath(); ctx.moveTo(-18,0); ctx.lineTo(-1,0); ctx.stroke();
    const fc=arr.type==='fire'?'#ff5500':arr.type==='ice'?'#00d0ee':'#f8f0d8';
    ctx.strokeStyle=fc; ctx.lineWidth=1.3;
    ctx.beginPath();
    ctx.moveTo(-18,0); ctx.lineTo(-23,-5); ctx.moveTo(-18,0); ctx.lineTo(-23,5);
    ctx.moveTo(-14,0); ctx.lineTo(-18,-4); ctx.moveTo(-14,0); ctx.lineTo(-18,4);
    ctx.stroke();
    if (arr.type==='normal'){
      ctx.fillStyle='#d8d8d8';
      ctx.beginPath(); ctx.moveTo(2,0); ctx.lineTo(-4,-2.5); ctx.lineTo(-4,2.5); ctx.closePath(); ctx.fill();
    } else if (arr.type==='fire'){
      ctx.shadowColor='#ff5500'; ctx.shadowBlur=10; ctx.fillStyle='#ff3300';
      ctx.beginPath(); ctx.moveTo(5,0); ctx.lineTo(-3,-3); ctx.lineTo(-3,3); ctx.closePath(); ctx.fill(); ctx.shadowBlur=0;
    } else if (arr.type==='ice'){
      ctx.shadowColor='#00e5ff'; ctx.shadowBlur=10; ctx.fillStyle='#00d8ff';
      ctx.beginPath(); ctx.moveTo(6,0); ctx.lineTo(-2,-3); ctx.lineTo(-2,3); ctx.closePath(); ctx.fill(); ctx.shadowBlur=0;
    } else if (arr.type==='bomb'){
      ctx.shadowColor='#ff8800'; ctx.shadowBlur=12; ctx.fillStyle='#1a1a1a';
      ctx.beginPath(); ctx.arc(2.5,0,5.5,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='#ff7700'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(6.5,-4); ctx.lineTo(10,-9); ctx.stroke(); ctx.shadowBlur=0;
    }
    ctx.restore();
  }

  // ─────────────────────────────────────────────────────────
  // DRAW: AIM GUIDE
  // ─────────────────────────────────────────────────────────
  function drawAimGuide() {
    if (!aiming) return;
    const dx=BOW.x-mouse.x, dy=BOW.y-mouse.y;
    const dist=Math.hypot(dx,dy); if (dist<10) return;
    const pwr=Math.min(MAX_POWER,dist*POWER_SCALE);
    const nx=dx/dist, ny=dy/dist;
    let gx=BOW.x,gy=BOW.y,gvx=nx*pwr,gvy=ny*pwr;
    const base=activeType==='fire'?'rgba(255,120,0,':activeType==='ice'?'rgba(0,200,255,':activeType==='bomb'?'rgba(255,200,0,':'rgba(200,245,66,';
    ctx.setLineDash([4,5]);
    for (let i=0;i<55;i++){
      ctx.strokeStyle=base+(1-i/55)*0.7+')'; ctx.lineWidth=1.6;
      const nx2=gx+gvx,ny2=gy+gvy;
      ctx.beginPath(); ctx.moveTo(gx,gy); ctx.lineTo(nx2,ny2); ctx.stroke();
      gx=nx2;gy=ny2;gvy+=GRAVITY; if(gy>GROUND_Y) break;
    }
    ctx.setLineDash([]);
    const pFrac=pwr/MAX_POWER;
    ctx.strokeStyle=`rgba(200,245,66,${0.3+pFrac*0.55})`; ctx.lineWidth=1.8;
    ctx.beginPath(); ctx.arc(BOW.x,BOW.y,12+pFrac*22,0,Math.PI*2); ctx.stroke();
    ctx.strokeStyle='rgba(255,255,210,0.55)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(BOW.x,BOW.y); ctx.lineTo(mouse.x,mouse.y); ctx.stroke();
  }

  // ─────────────────────────────────────────────────────────
  // DRAW: PARTICLES & FLOATS
  // ─────────────────────────────────────────────────────────
  function drawParticles() {
    particles.forEach(p=>{
      ctx.globalAlpha=(p.lf/p.maxLf)*0.9; ctx.fillStyle=p.col;
      ctx.fillRect(p.x-p.sz/2,p.y-p.sz/2,p.sz,p.sz);
    });
    ctx.globalAlpha=1;
  }

  function drawFloats() {
    ctx.textAlign='center';
    floats.forEach(t=>{
      ctx.globalAlpha=t.lf/t.maxLf; ctx.fillStyle=t.col;
      ctx.font=`bold ${Math.round(12*(t.scale||1))}px "Space Mono",monospace`;
      ctx.fillText(t.text,t.x,t.y);
    });
    ctx.globalAlpha=1; ctx.textAlign='left';
  }

  // ─────────────────────────────────────────────────────────
  // DRAW: HUD OVERLAY
  // ─────────────────────────────────────────────────────────
  function drawHudOverlay() {
    if (state!=='playing') return;
    const remaining=enemies.length+spawnQueue.length;
    ctx.fillStyle='rgba(200,245,66,0.8)'; ctx.font='11px "Space Mono",monospace'; ctx.textAlign='right';
    ctx.fillText('WAVE '+waveNum,W-16,22);
    ctx.fillStyle='rgba(170,175,185,0.55)'; ctx.fillText(remaining+' remaining',W-16,36);
    ctx.textAlign='left';
    const rlFrac=Math.min(1,(Date.now()-lastShot)/reloadMs());
    if (rlFrac<1){
      ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillRect(BOW.x-22,BOW.y-46,44,5);
      ctx.fillStyle='#c8f542'; ctx.fillRect(BOW.x-22,BOW.y-46,44*rlFrac,5);
    }
    if (activeType!=='normal'){
      const tl={fire:'FIRE',ice:'ICE',bomb:'BOMB'};
      ctx.fillStyle=activeType==='fire'?'#ff6b35':activeType==='ice'?'#00e5ff':'#ffd700';
      ctx.font='bold 10px "Space Mono",monospace';
      ctx.fillText('['+tl[activeType]+' ×'+ammo[activeType]+']',BOW.x-20,BOW.y-52);
    }
  }

  // ─────────────────────────────────────────────────────────
  // MAIN LOOP
  // ─────────────────────────────────────────────────────────
  let lastTs=0;
  function loop(ts) {
    const dt=Math.min(ts-lastTs,50); lastTs=ts;
    ctx.clearRect(0,0,W,H);
    drawBG(); drawCastle();
    enemies.forEach(drawEnemy);
    arrows.forEach(drawArrow);
    drawParticles(); drawFloats();
    drawAimGuide(); drawHudOverlay();
    update(dt);
    requestAnimationFrame(loop);
  }

  window.addEventListener('load', init);
}());

