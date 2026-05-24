(function () {
  'use strict';

  const { t: tr, getPortfolio, getLevels, getIntroName, isNight, setLang, setTheme, getLang, getTheme } = window.GameConfig;

  const ZONE_WIDTH = 3400;
  const WORLD_W = ZONE_WIDTH * 4 + 800;
  const GATE_X = [ZONE_WIDTH, ZONE_WIDTH * 2, ZONE_WIDTH * 3];
  const DOCK_END = WORLD_W - 120;

  // ─── DOM refs ─────────────────────────────────────────────────────────
  const canvas = document.getElementById('world');
  const ctx = canvas.getContext('2d');
  const zoneOverlay = document.getElementById('zone-overlay');
  const fadeOverlay = document.getElementById('fade-overlay');
  const hudZone = document.getElementById('zone-name');
  const hudHint = document.getElementById('hint-text');
  const interactBtn = document.getElementById('interact-btn');
  const jumpBtn = document.getElementById('jump-btn');
  const charSelectEl = document.getElementById('char-select');
  const charOptionBtns = document.querySelectorAll('.char-option');
  const introScreen = document.getElementById('intro-screen');
  const introCanvas = document.getElementById('intro-canvas');
  const introCtx = introCanvas.getContext('2d');
  const introNameEl = document.getElementById('intro-name');
  const introSubEl = document.getElementById('intro-sub');
  const introStartBtn = document.getElementById('intro-start');
  const loadBar = document.getElementById('load-bar');
  const loadText = document.getElementById('load-text');

  // ─── Game state ───────────────────────────────────────────────────────
  const keys = {};
  let W = 0, H = 0, dpr = 1;
  let camera = { x: 0, y: 0 };
  let playerMode = 'walker';
  const JUMP_V = { walker: 420, car: 340 };
  const GRAVITY = 1100;
  let player = {
    x: 180, y: 0, vx: 0, vy: 0,
    w: 32, h: 64, facing: 1,
    state: 'idle', frame: 0, frameTimer: 0,
    onGround: true, groundY: 0
  };
  let currentZone = 0;
  let fadeAlpha = 0;
  let fadeTarget = 0;
  let nearestInteract = null;
  let introActive = true;
  let introReady = false;
  let introCharX = -80;
  let introAnimId = 0;
  let cutsceneActive = false;
  let endScreenShown = false;
  let cutscenePhase = 0;
  let ambientGain = null;
  let audioCtx = null;
  let pianoPlaying = false;
  const loadedSprites = { char: false, zones: [false, false, false, false] };

  // ─── Procedural scenery ───────────────────────────────────────────────
  function hash(n) {
    const x = Math.sin(n * 127.1 + n * 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  const clouds = [];
  const worldBirds = [];
  const worldTrees = [];
  const riverSegments = [];
  function initWorldScenery() {
    clouds.length = 0;
    worldBirds.length = 0;
    worldTrees.length = 0;
    riverSegments.length = 0;

    for (let i = 0; i < 52; i++) {
      const w = 100 + hash(i * 2.3) * 160;
      const puffs = [];
      const puffN = 8 + Math.floor(hash(i * 4.7) * 7);
      for (let p = 0; p < puffN; p++) {
        puffs.push({
          ox: (hash(i * 11 + p * 3) - 0.5) * w * 0.95,
          oy: (hash(i * 17 + p * 5) - 0.5) * w * 0.3,
          r: w * (0.1 + hash(i * 23 + p) * 0.17),
          density: 0.3 + hash(i * 29 + p * 7) * 0.7,
          depth: Math.floor(hash(i * 31 + p * 2) * 3)
        });
      }
      const layerRoll = hash(i * 6.3);
      clouds.push({
        x: hash(i * 3.1) * WORLD_W,
        y: H * (0.02 + hash(i * 5.7) * 0.24),
        w,
        speed: 0.005 + hash(i * 8.1) * 0.02,
        opacity: 0.32 + hash(i * 1.9) * 0.52,
        layer: layerRoll > 0.66 ? 'far' : layerRoll > 0.33 ? 'mid' : 'near',
        flatten: 0.52 + hash(i * 13.1) * 0.18,
        puffs,
        seed: i * 1.7
      });
    }

    for (let i = 0; i < 40; i++) {
      worldBirds.push({
        x: hash(i * 11.3) * WORLD_W,
        y: H * (0.08 + hash(i * 7.2) * 0.22),
        speed: 45 + hash(i * 4.4) * 70,
        wingPhase: hash(i * 9.9) * Math.PI * 2,
        size: 0.7 + hash(i * 6.6) * 0.6,
        zone: Math.floor(hash(i * 2.1) * 4)
      });
    }

    for (let wx = 80; wx < WORLD_W; wx += 38 + Math.floor(hash(wx) * 28)) {
      const zone = Math.floor(wx / ZONE_WIDTH);
      if (zone === 1) continue;
      const side = hash(wx * 1.7) > 0.5 ? 1 : -1;
      const dist = 55 + hash(wx * 2.3) * 90;
      worldTrees.push({
        x: wx,
        side,
        dist,
        zone,
        type: zone === 2 ? (hash(wx) > 0.6 ? 'pine' : 'oak') : zone === 3 ? 'palm' : 'pine',
        scale: 0.75 + hash(wx * 4.1) * 0.55,
        sway: hash(wx * 8.8) * Math.PI * 2
      });
    }

    for (let z = 0; z < 4; z++) {
      if (z === 1) continue;
      const zStart = z * ZONE_WIDTH + 120;
      const zEnd = (z + 1) * ZONE_WIDTH - 80;
      const offset = z === 3 ? -95 : 72;
      for (let wx = zStart; wx < zEnd; wx += 24) {
        riverSegments.push({
          x: wx,
          yOff: offset + Math.sin(wx * 0.008 + z) * 18,
          width: z === 3 ? 55 : 28 + hash(wx) * 12,
          zone: z,
          ripple: hash(wx * 3.3) * Math.PI * 2
        });
      }
    }

  }

  let globalTime = 0;

  // ─── Road path ────────────────────────────────────────────────────────
  function roadY(worldX) {
    const base = H * 0.62;
    return base + Math.sin(worldX * 0.002) * 45 + Math.sin(worldX * 0.0007) * 25;
  }

  function roadAngle(worldX) {
    const dx = 1;
    const y1 = roadY(worldX);
    const y2 = roadY(worldX + dx);
    return Math.atan2(y2 - y1, dx);
  }

  // ─── Sprite sheet (32x64, procedural pixel art) ───────────────────────
  const SPRITE_W = 32, SPRITE_H = 64;
  const ANIM = {
    idle: { frames: 6, speed: 9 },
    walk: { frames: 8, speed: 11 },
    run: { frames: 8, speed: 14 },
    jump: { frames: 4, speed: 10 },
    wave: { frames: 6, speed: 9 }
  };

  const CAR_W = 64, CAR_H = 44;
  const CAR_ANIM = {
    idle: { frames: 4, speed: 8 },
    drive: { frames: 6, speed: 13 },
    fast: { frames: 6, speed: 17 },
    jump: { frames: 2, speed: 8 },
    wave: { frames: 4, speed: 9 }
  };

  const charSheet = document.createElement('canvas');
  charSheet.width = SPRITE_W * 8;
  charSheet.height = SPRITE_H * 5;
  const cctx = charSheet.getContext('2d');

  const carSheet = document.createElement('canvas');
  carSheet.width = CAR_W * 6;
  carSheet.height = CAR_H * 5;
  const carCtx = carSheet.getContext('2d');

  function drawPixelRect(x, y, w, h, color) {
    cctx.fillStyle = color;
    cctx.fillRect(x, y, w, h);
  }

  function drawCharacterFrame(ox, oy, frame, anim) {
    const skin = '#F0C89A';
    const skinSh = '#D4A574';
    const hair = '#2C1810';
    const hairHi = '#4A3020';
    const hoodie = '#2C3E6B';
    const hoodieHi = '#3D5288';
    const accent = '#FF8C42';
    const pants = '#3A4558';
    const pantsHi = '#4A5A70';
    const shoe = '#E8E8F0';
    const shoeSol = '#B0B0C0';
    const phase = frame / (ANIM[anim]?.frames || 6);
    const bob = anim === 'idle' ? Math.sin(phase * Math.PI * 2) * 1.2 : 0;
    const walkCycle = Math.sin(phase * Math.PI * 2);
    const runMul = anim === 'run' ? 1.7 : 1;
    const legOff = (anim === 'walk' || anim === 'run') ? walkCycle * 5 * runMul : 0;
    const armSwing = (anim === 'walk' || anim === 'run') ? -walkCycle * 6 * runMul : 0;
    const jumpPose = anim === 'jump' ? -2 - Math.abs(Math.sin(phase * Math.PI)) * 2 : 0;
    const oyB = oy + bob + jumpPose;
    const jumpTuck = anim === 'jump' ? Math.sin(phase * Math.PI) * 1.5 : 0;

    // Shadow
    drawPixelRect(ox + 5, oyB + 59, 22, 4, 'rgba(0,0,0,0.22)');

    // Legs (walk / idle / run — jump kreslí nohy nižšie)
    if (anim !== 'jump') {
      drawPixelRect(ox + 9, oyB + 38 + legOff, 7, 14, pants);
      drawPixelRect(ox + 17, oyB + 38 - legOff, 7, 14, pants);
      drawPixelRect(ox + 10, oyB + 40 + legOff, 3, 8, pantsHi);
      drawPixelRect(ox + 18, oyB + 40 - legOff, 3, 8, pantsHi);
      drawPixelRect(ox + 7, oyB + 52 + legOff, 9, 5, shoe);
      drawPixelRect(ox + 16, oyB + 52 - legOff, 9, 5, shoe);
      drawPixelRect(ox + 8, oyB + 54 + legOff, 7, 2, shoeSol);
      drawPixelRect(ox + 17, oyB + 54 - legOff, 7, 2, shoeSol);
    } else {
      drawPixelRect(ox + 10, oyB + 38 + jumpTuck, 6, 11, pants);
      drawPixelRect(ox + 17, oyB + 38 - jumpTuck, 6, 11, pants);
      drawPixelRect(ox + 11, oyB + 40 + jumpTuck, 3, 6, pantsHi);
      drawPixelRect(ox + 18, oyB + 40 - jumpTuck, 3, 6, pantsHi);
    }

    // Hoodie body
    drawPixelRect(ox + 7, oyB + 20, 18, 20, hoodie);
    drawPixelRect(ox + 9, oyB + 22, 14, 3, hoodieHi);
    drawPixelRect(ox + 14, oyB + 28, 4, 8, accent);
    drawPixelRect(ox + 6, oyB + 34, 20, 6, hoodie);

    // Backpack strap
    drawPixelRect(ox + 22, oyB + 22, 3, 14, '#1a2030');
    drawPixelRect(ox + 7, oyB + 22, 2, 12, '#1a2030');

    if (anim === 'jump') {
      drawPixelRect(ox + 2, oyB + 18, 5, 12, hoodie);
      drawPixelRect(ox + 25, oyB + 18, 5, 12, hoodie);
    } else if (anim === 'wave') {
      const waveLift = -12 - Math.sin(phase * Math.PI) * 8;
      drawPixelRect(ox + 3, oyB + 22, 5, 12, hoodie);
      drawPixelRect(ox + 3, oyB + 32, 4, 4, skin);
      drawPixelRect(ox + 21, oyB + waveLift, 7, 7, skin);
      drawPixelRect(ox + 19, oyB + waveLift - 10, 6, 12, skin);
      drawPixelRect(ox + 20, oyB + waveLift - 12, 5, 4, skinSh);
    } else {
      drawPixelRect(ox + 3, oyB + 22 + armSwing, 5, 14, hoodie);
      drawPixelRect(ox + 3, oyB + 34 + armSwing, 4, 4, skin);
      drawPixelRect(ox + 24, oyB + 22 - armSwing, 5, 14, hoodie);
      drawPixelRect(ox + 25, oyB + 34 - armSwing, 4, 4, skin);
    }

    // Head
    drawPixelRect(ox + 10, oyB + 6, 12, 13, skin);
    drawPixelRect(ox + 11, oyB + 14, 10, 3, skinSh);
    drawPixelRect(ox + 9, oyB + 2, 14, 6, hair);
    drawPixelRect(ox + 8, oyB + 5, 4, 5, hair);
    drawPixelRect(ox + 20, oyB + 5, 3, 4, hairHi);
    drawPixelRect(ox + 12, oyB + 11, 3, 2, '#1a1a1a');
    drawPixelRect(ox + 17, oyB + 11, 3, 2, '#1a1a1a');
    drawPixelRect(ox + 11, oyB + 13, 2, 1, '#c97060');
    drawPixelRect(ox + 18, oyB + 13, 2, 1, '#c97060');
    // Hood
    drawPixelRect(ox + 8, oyB + 15, 16, 6, hoodie);
    drawPixelRect(ox + 10, oyB + 17, 12, 2, hoodieHi);

    // Jump shoes — až na konci, aby ich neprekrývalo telo ani nohavice
    if (anim === 'jump') {
      drawPixelRect(ox + 7, oyB + 48 + jumpTuck, 9, 5, shoe);
      drawPixelRect(ox + 16, oyB + 48 - jumpTuck, 9, 5, shoe);
      drawPixelRect(ox + 8, oyB + 50 + jumpTuck, 7, 3, shoeSol);
      drawPixelRect(ox + 17, oyB + 50 - jumpTuck, 7, 3, shoeSol);
    }
  }

  function drawCharSprite(targetCtx, x, y, anim, frame, facing, scale) {
    const row = { idle: 0, walk: 1, run: 2, jump: 3, wave: 4 }[anim] || 0;
    const cfg = ANIM[anim] || ANIM.idle;
    const f = Math.floor(frame) % cfg.frames;
    const sc = scale || 1;
    const dw = SPRITE_W * sc;
    const dh = SPRITE_H * sc;
    targetCtx.save();
    targetCtx.imageSmoothingEnabled = false;
    if (facing < 0) {
      targetCtx.translate(x + dw / 2, y);
      targetCtx.scale(-1, 1);
      targetCtx.translate(-(x + dw / 2), -y);
    }
    targetCtx.drawImage(
      charSheet, f * SPRITE_W, row * SPRITE_H, SPRITE_W, SPRITE_H,
      x - dw / 2, y - dh, dw, dh
    );
    targetCtx.restore();
  }

  function carRect(x, y, w, h, color) {
    carCtx.fillStyle = color;
    carCtx.fillRect(x, y, w, h);
  }

  function drawCarFrame(ox, oy, frame, anim) {
    const phase = frame / (CAR_ANIM[anim]?.frames || 4);
    const bounce = anim === 'idle' ? Math.sin(phase * Math.PI * 2) * 1 : 0;
    const drive = (anim === 'drive' || anim === 'fast') ? Math.sin(phase * Math.PI * 2) * 2 : 0;
    const jumpTilt = anim === 'jump' ? -3 : 0;
    const oyB = oy + bounce + jumpTilt;
    const body = '#C0392B';
    const bodyHi = '#E74C3C';
    const window = '#87CEEB';
    const wheel = '#2a2a2a';
    const hub = '#888';
    const trim = '#FFD580';

    carRect(ox + 4, oyB + 28, 52, 3, 'rgba(0,0,0,0.2)');
    const wheelOff = drive;

    // Wheels
    carRect(ox + 10, oyB + 24 + wheelOff, 12, 10, wheel);
    carRect(ox + 40, oyB + 24 - wheelOff, 12, 10, wheel);
    carRect(ox + 13, oyB + 26 + wheelOff, 6, 6, hub);
    carRect(ox + 43, oyB + 26 - wheelOff, 6, 6, hub);

    // Body
    carRect(ox + 6, oyB + 14, 48, 14, body);
    carRect(ox + 8, oyB + 16, 44, 4, bodyHi);
    carRect(ox + 14, oyB + 8, 28, 10, body);
    carRect(ox + 16, oyB + 10, 12, 6, window);
    carRect(ox + 30, oyB + 10, 10, 6, window);
    // Driver head in window
    carRect(ox + 18, oyB + 11, 6, 5, '#F0C89A');
    carRect(ox + 17, oyB + 10, 8, 3, '#2C1810');

  if (anim === 'fast') {
      carRect(ox + 2, oyB + 18, 4, 2, 'rgba(255,255,255,0.5)');
      carRect(ox + 58, oyB + 18, 4, 2, 'rgba(255,255,255,0.3)');
    }
    carRect(ox + 6, oyB + 26, 6, 2, trim);
    carRect(ox + 50, oyB + 18, 4, 6, '#FF8C42');
  }

  function drawCarSprite(targetCtx, x, y, anim, frame, facing, scale) {
    const row = { idle: 0, drive: 1, fast: 2, jump: 3, wave: 4 }[anim] || 0;
    const cfg = CAR_ANIM[anim] || CAR_ANIM.idle;
    const f = Math.floor(frame) % cfg.frames;
    const sc = scale || 1;
    const dw = CAR_W * sc;
    const dh = CAR_H * sc;
    targetCtx.save();
    targetCtx.imageSmoothingEnabled = false;
    if (facing < 0) {
      targetCtx.translate(x + dw / 2, y);
      targetCtx.scale(-1, 1);
      targetCtx.translate(-(x + dw / 2), -y);
    }
    targetCtx.drawImage(
      carSheet, f * CAR_W, row * CAR_H, CAR_W, CAR_H,
      x - dw / 2, y - dh, dw, dh
    );
    targetCtx.restore();
  }

  function buildSpriteSheet() {
    ['idle', 'walk', 'run', 'jump', 'wave'].forEach((anim, row) => {
      const count = ANIM[anim].frames;
      for (let f = 0; f < count; f++) {
        drawCharacterFrame(f * SPRITE_W, row * SPRITE_H, f, anim);
      }
    });
    loadedSprites.char = true;
  }

  function buildCarSpriteSheet() {
    ['idle', 'drive', 'fast', 'jump', 'wave'].forEach((anim, row) => {
      const count = CAR_ANIM[anim].frames;
      for (let f = 0; f < count; f++) {
        drawCarFrame(f * CAR_W, row * CAR_H, f, anim);
      }
    });
  }

  function mapCarState(state) {
    if (state === 'walk') return 'drive';
    if (state === 'run') return 'fast';
    return state === 'jump' ? 'jump' : state;
  }

  function tryJump() {
    if (!player.onGround || cutsceneActive || introActive || endScreenShown) return;
    player.vy = -JUMP_V[playerMode];
    player.onGround = false;
    player.state = 'jump';
  }

  function setPlayerMode(mode) {
    playerMode = mode;
    try { localStorage.setItem('pixelPortfolioMode', mode); } catch (_) {}
    charOptionBtns.forEach((btn) => {
      const sel = btn.dataset.mode === mode;
      btn.classList.toggle('selected', sel);
      btn.setAttribute('aria-pressed', sel ? 'true' : 'false');
    });
  }

  // ─── Interactables ────────────────────────────────────────────────────
  const interactables = [];

  function initInteractables() {
    const p = getPortfolio();
    interactables.push({
      zone: 0, x: 520, y: 0, r: 70, type: 'about-scroll',
      label: tr('labelBio'), modal: 'modal-about', data: { section: 'bio' }
    });
    interactables.push({
      zone: 0, x: 1100, y: 0, r: 65, type: 'about-scroll',
      label: tr('labelPassions'), modal: 'modal-about', data: { section: 'interests' }
    });
    interactables.push({
      zone: 0, x: 1850, y: 0, r: 80, type: 'about-painting',
      label: tr('labelPortrait'), modal: 'modal-about', data: { section: 'full' }
    });

    // Level 2 — buildings
    getPortfolio().projects.forEach((p, i) => {
      interactables.push({
        zone: 1, x: ZONE_WIDTH + 600 + i * 850, y: 0, r: 100, type: 'project',
        label: p.name, modal: 'modal-project', data: { projectIndex: i }
      });
    });

    // Level 3 — rune stones
    getPortfolio().experience.forEach((e, i) => {
      interactables.push({
        zone: 2, x: ZONE_WIDTH * 2 + 450 + i * 720, y: 0, r: 75, type: 'experience',
        label: e.company, modal: 'modal-experience', data: { expIndex: i }
      });
    });

    // Level 4 — bottle form & buoys
    interactables.push({
      zone: 3, x: ZONE_WIDTH * 3 + 900, y: 0, r: 90, type: 'contact-form',
      label: tr('labelBottle'), modal: 'modal-contact'
    });
    const buoyNames = ['GitHub', 'LinkedIn', 'Twitter', 'Email'];
    const buoyKeys = ['github', 'linkedin', 'twitter', 'email'];
    buoyNames.forEach((name, i) => {
      interactables.push({
        zone: 3, x: ZONE_WIDTH * 3 + 1400 + i * 180, y: 0, r: 50, type: 'buoy',
        label: name, url: getPortfolio().social[buoyKeys[i]]
      });
    });
  }

  // ─── Parallax & zone helpers ──────────────────────────────────────────
  function getZone(x) {
    return Math.min(3, Math.max(0, Math.floor(x / ZONE_WIDTH)));
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function lerpColor(c1, c2, t) {
    const p = (h) => parseInt(h.slice(1), 16);
    const r1 = (p(c1) >> 16) & 255, g1 = (p(c1) >> 8) & 255, b1 = p(c1) & 255;
    const r2 = (p(c2) >> 16) & 255, g2 = (p(c2) >> 8) & 255, b2 = p(c2) & 255;
    const r = Math.round(lerp(r1, r2, t));
    const g = Math.round(lerp(g1, g2, t));
    const b = Math.round(lerp(b1, b2, t));
    return `rgb(${r},${g},${b})`;
  }

  // ─── Drawing: sky, mountains, nature ────────────────────────────────
  function drawSky(camX, zone, t) {
    const z = getLevels()[zone];
    const next = getLevels()[Math.min(3, zone + 1)];
    const localT = (player.x % ZONE_WIDTH) / ZONE_WIDTH;
    const horizon = H * 0.58;

    const grad = ctx.createLinearGradient(0, 0, 0, horizon);
    grad.addColorStop(0, lerpColor(z.colors[0], next.colors[0], localT * 0.35));
    grad.addColorStop(0.55, lerpColor(z.colors[1], next.colors[1], localT * 0.25));
    grad.addColorStop(1, lerpColor(z.colors[2] || z.colors[1], next.colors[2] || next.colors[1], localT * 0.2));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, horizon);

    // Atmospheric haze band
    const haze = ctx.createLinearGradient(0, horizon - 80, 0, horizon);
    haze.addColorStop(0, 'rgba(255,255,255,0)');
    haze.addColorStop(1, zone === 1 ? 'rgba(0,245,255,0.08)' : zone === 2 ? 'rgba(180,200,160,0.15)' : 'rgba(255,220,180,0.12)');
    ctx.fillStyle = haze;
    ctx.fillRect(0, horizon - 80, W, 80);

    if (isNight()) {
      for (let s = 0; s < 80; s++) {
        const sx = (hash(s * 19) * W + camX * 0.02) % W;
        const sy = hash(s * 37) * H * 0.45;
        const tw = 0.3 + Math.sin(t * 2 + s) * 0.5;
        ctx.fillStyle = `rgba(255,255,255,${tw})`;
        ctx.fillRect(sx, sy, s % 3 === 0 ? 2 : 1, s % 3 === 0 ? 2 : 1);
      }
    }

    const sunX = W * 0.72 - camX * 0.015;
    const sunY = H * 0.11 + Math.sin(t * 0.15) * 3;
    const night = isNight();

    if (zone === 0) {
      if (night) {
        const moonX = W * 0.78 - camX * 0.01;
        const moonY = H * 0.1;
        ctx.fillStyle = 'rgba(220,230,255,0.15)';
        ctx.beginPath();
        ctx.arc(moonX, moonY, 38, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e8ecf5';
        ctx.beginPath();
        ctx.arc(moonX, moonY, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = z.colors[0];
        ctx.beginPath();
        ctx.arc(moonX + 10, moonY - 4, 20, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const glow = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, 70);
        glow.addColorStop(0, 'rgba(255,180,80,0.5)');
        glow.addColorStop(1, 'rgba(255,100,50,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(sunX - 70, sunY - 70, 140, 140);
        ctx.fillStyle = '#FF8C42';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 32, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFD580';
        ctx.beginPath();
        ctx.arc(sunX - 8, sunY - 8, 24, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (zone === 1) {
      const starA = night ? 0.9 : 0.5;
      ctx.fillStyle = `rgba(255,255,255,${starA})`;
      for (let s = 0; s < (night ? 55 : 35); s++) {
        const sx = (hash(s * 17) * W + t * 8) % W;
        const sy = hash(s * 23) * H * 0.35;
        ctx.fillRect(sx, sy, 2, 2);
      }
    } else if (zone === 3) {
      const glow = ctx.createRadialGradient(W * 0.55, sunY, 5, W * 0.55, sunY, 50);
      glow.addColorStop(0, 'rgba(255,240,180,0.4)');
      glow.addColorStop(1, 'rgba(255,200,100,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(W * 0.55 - 50, sunY - 50, 100, 100);
      ctx.fillStyle = '#FFE082';
      ctx.beginPath();
      ctx.arc(W * 0.55, sunY, 26, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!night) drawSunGodRays(sunX, sunY, t, zone);
    drawClouds(camX, zone, t);
  }

  /** Jemné slnečné lúče (inšpirované god-rays pass z volumetric clouds) */
  function drawSunGodRays(sunX, sunY, time, zone) {
    if (zone === 1) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const streaks = zone === 3 ? 5 : 7;
    for (let i = 0; i < streaks; i++) {
      const angle = -0.35 + i * 0.12 + Math.sin(time * 0.08 + i) * 0.02;
      const len = H * (0.45 + hash(i * 9) * 0.2);
      const spread = 28 + hash(i * 4) * 40;
      const pulse = 0.04 + Math.sin(time * 0.5 + i * 1.3) * 0.02;
      const g = ctx.createLinearGradient(sunX, sunY, sunX + Math.cos(angle) * len, sunY + Math.sin(angle) * len);
      g.addColorStop(0, `rgba(255,240,200,${pulse + 0.06})`);
      g.addColorStop(0.35, `rgba(255,220,160,${pulse * 0.5})`);
      g.addColorStop(1, 'rgba(255,200,120,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(sunX, sunY);
      ctx.lineTo(sunX + Math.cos(angle - 0.04) * len, sunY + Math.sin(angle - 0.04) * len);
      ctx.lineTo(sunX + Math.cos(angle + 0.04) * len + spread, sunY + Math.sin(angle + 0.04) * len);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function getCloudPalette(zone) {
    if (isNight()) {
      const night = {
        0: { hi: [180, 170, 200], mid: [120, 110, 140], lo: [60, 55, 80] },
        1: { hi: [100, 110, 140], mid: [70, 75, 100], lo: [40, 45, 65] },
        2: { hi: [160, 175, 170], mid: [100, 115, 110], lo: [50, 60, 55] },
        3: { hi: [170, 185, 210], mid: [110, 125, 150], lo: [55, 65, 85] }
      };
      return night[zone] || night[0];
    }
    const day = {
      0: { hi: [255, 252, 245], mid: [255, 240, 220], lo: [220, 200, 185] },
      1: { hi: [200, 210, 230], mid: [140, 150, 175], lo: [90, 100, 125] },
      2: { hi: [248, 252, 250], mid: [230, 242, 235], lo: [195, 215, 200] },
      3: { hi: [255, 255, 255], mid: [240, 248, 255], lo: [200, 225, 245] }
    };
    return day[zone] || day[0];
  }

  function drawClouds(camX, zone, time) {
    const layerCfg = {
      far: { parallax: 0.03, alpha: 0.45, bob: 2.5 },
      mid: { parallax: 0.065, alpha: 0.72, bob: 4 },
      near: { parallax: 0.11, alpha: 1, bob: 6 }
    };
    ['far', 'mid', 'near'].forEach((layer) => {
      const cfg = layerCfg[layer];
      clouds.filter((c) => c.layer === layer).forEach((c) => {
        const drift = (c.x + time * c.speed * 9000) % (WORLD_W + 500) - 250;
        const sx = drift - camX * cfg.parallax;
        if (sx < -c.w * 2.8 || sx > W + c.w * 2.8) return;
        const bob = Math.sin(time * 0.32 + c.seed) * cfg.bob;
        drawCloudBlob(sx, c.y + bob, c, zone, time, cfg.alpha);
      });
    });
  }

  /** 2D aproximácia volumetric ray-march: viac vrstiev hustoty + svetlo zo slnka */
  function drawCloudBlob(cx, cy, cloud, zone, time, alphaMul) {
    const pal = getCloudPalette(zone);
    const baseA = cloud.opacity * alphaMul;
    const flat = cloud.flatten || 0.62;
    const sunDx = -0.55;
    const sunDy = -0.42;

    ctx.save();

    // Spodný tieň (extinction — tmavšia spodná strana ako vo volume shaderi)
    ctx.fillStyle = `rgba(${pal.lo[0]},${pal.lo[1]},${pal.lo[2]},${baseA * 0.28})`;
    cloud.puffs.forEach((p) => {
      ctx.beginPath();
      ctx.ellipse(cx + p.ox + 5, cy + p.oy * flat + 8, p.r * 1.1, p.r * flat * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Vonkajšie „halo“ vrstvy — akumulácia nízkej hustoty (viac krokov marchu)
    ctx.globalCompositeOperation = 'lighter';
    cloud.puffs.forEach((p, pi) => {
      const density = p.density ?? 0.65;
      const px = cx + p.ox + Math.sin(time * 0.18 + cloud.seed + pi) * 2;
      const py = cy + p.oy * flat + Math.cos(time * 0.14 + cloud.seed + pi * 0.7) * 1.2;
      const r = p.r * (1.25 + (1 - density) * 0.15);
      const grad = ctx.createRadialGradient(
        px + r * sunDx * 0.2, py + r * sunDy * 0.2, 0,
        px, py, r * 1.4
      );
      const a = baseA * density * 0.18;
      grad.addColorStop(0, `rgba(${pal.hi[0]},${pal.hi[1]},${pal.hi[2]},${a * 0.5})`);
      grad.addColorStop(0.45, `rgba(${pal.mid[0]},${pal.mid[1]},${pal.mid[2]},${a})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(px, py, r * 1.15, r * flat * 0.72, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalCompositeOperation = 'source-over';

    // Jadro oblaku — zoradené podľa hĺbky (back → front)
    const sorted = [...cloud.puffs].sort((a, b) => (a.depth ?? 1) - (b.depth ?? 1));
    sorted.forEach((p, pi) => {
      const density = p.density ?? 0.65;
      const px = cx + p.ox + Math.sin(time * 0.22 + cloud.seed + pi) * 1.8;
      const py = cy + p.oy * flat + Math.cos(time * 0.16 + cloud.seed) * 1;
      const r = p.r;
      const litX = px - r * sunDx * 0.35;
      const litY = py - r * sunDy * 0.35;
      const grad = ctx.createRadialGradient(litX, litY, 0, px, py + r * 0.15, r);
      const coreA = baseA * (0.55 + density * 0.45);
      grad.addColorStop(0, `rgba(255,255,255,${coreA * 0.95})`);
      grad.addColorStop(0.25, `rgba(${pal.hi[0]},${pal.hi[1]},${pal.hi[2]},${coreA})`);
      grad.addColorStop(0.6, `rgba(${pal.mid[0]},${pal.mid[1]},${pal.mid[2]},${coreA * 0.88})`);
      grad.addColorStop(1, `rgba(${pal.lo[0]},${pal.lo[1]},${pal.lo[2]},${coreA * 0.35})`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(px, py, r, r * flat * 0.65, 0, 0, Math.PI * 2);
      ctx.fill();

      // Spodná absorpčná vrstva (tmavší okraj dole)
      const shGrad = ctx.createLinearGradient(px, py - r * 0.2, px, py + r * flat);
      shGrad.addColorStop(0, 'rgba(0,0,0,0)');
      shGrad.addColorStop(1, `rgba(${pal.lo[0]},${pal.lo[1]},${pal.lo[2]},${coreA * 0.35})`);
      ctx.fillStyle = shGrad;
      ctx.beginPath();
      ctx.ellipse(px, py + r * 0.08, r * 0.92, r * flat * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Svetelný lem zo strany slnka (scattering highlight)
    const front = sorted.filter((p) => (p.depth ?? 1) >= 1).slice(-4);
    ctx.fillStyle = `rgba(255,255,255,${baseA * 0.38})`;
    front.forEach((p) => {
      ctx.beginPath();
      ctx.ellipse(
        cx + p.ox - p.r * 0.28, cy + p.oy * flat - p.r * 0.32,
        p.r * 0.38, p.r * flat * 0.22, 0, 0, Math.PI * 2
      );
      ctx.fill();
    });

    ctx.restore();
  }

  function waterWaveHeight(wx, baseY, t, layer) {
    return baseY +
      Math.sin(wx * (0.016 + layer * 0.004) + t * (1.3 + layer * 0.4)) * (4 + layer * 2.5) +
      Math.sin(wx * (0.038 - layer * 0.003) - t * (0.85 + layer * 0.15)) * (2 + layer * 1.2);
  }

  function drawWaterCaustics(targetCtx, x0, y0, w, h, t, color) {
    const c = targetCtx || ctx;
    c.save();
    c.beginPath();
    c.rect(x0, y0, w, h);
    c.clip();
    for (let i = 0; i < 18; i++) {
      const phase = t * 1.8 + i * 0.9;
      const cx = x0 + ((i * 47 + t * 55) % (w + 40)) - 20;
      const cy = y0 + ((i * 31 + t * 35) % (h + 20)) - 10;
      const rx = 10 + Math.sin(phase) * 5;
      const ry = 3 + Math.cos(phase * 1.3) * 2;
      c.strokeStyle = color;
      c.lineWidth = 1.2;
      c.globalAlpha = 0.08 + Math.sin(phase) * 0.04;
      c.beginPath();
      c.ellipse(cx, cy, rx, ry, phase * 0.4, 0, Math.PI * 2);
      c.stroke();
    }
    c.globalAlpha = 1;
    c.restore();
  }

  function drawAnimatedWaveBand(targetCtx, baseY, camX, t, layers, fillFn, viewW, viewH) {
    const c = targetCtx || ctx;
    const vw = viewW ?? W;
    const vh = viewH ?? H;
    for (let layer = 0; layer < layers; layer++) {
      c.beginPath();
      const step = 6;
      for (let sx = -10; sx <= vw + 20; sx += step) {
        const wx = sx + camX * (0.04 + layer * 0.025);
        const wy = waterWaveHeight(wx, baseY + layer * 6, t, layer);
        if (sx <= -10) c.moveTo(sx, wy);
        else c.lineTo(sx, wy);
      }
      c.lineTo(vw + 30, vh + 50);
      c.lineTo(-30, vh + 50);
      c.closePath();
      fillFn(layer, c);
    }
  }

  function mountainHeight(wx, seed, amp) {
    return amp * (
      0.55 + 0.25 * Math.sin(wx * 0.003 + seed) +
      0.15 * Math.sin(wx * 0.009 + seed * 2) +
      0.08 * Math.sin(wx * 0.023 + seed * 3)
    );
  }

  function drawMountainRange(camX, parallax, baseY, amp, colors, snow, zone) {
    const step = 12;
    const startWx = Math.floor((camX * parallax - 100) / step) * step;
    const endWx = camX * parallax + W + 200;

    ctx.beginPath();
    let first = true;
    for (let wx = startWx; wx <= endWx; wx += step) {
      const sx = wx - camX * parallax;
      const h = mountainHeight(wx, zone * 10 + parallax * 5, amp);
      const y = baseY - h;
      if (first) { ctx.moveTo(sx, baseY + 30); first = false; }
      ctx.lineTo(sx, y);
    }
    ctx.lineTo(W + 50, baseY + 40);
    ctx.lineTo(-50, baseY + 40);
    ctx.closePath();

    const g = ctx.createLinearGradient(0, baseY - amp, 0, baseY);
    g.addColorStop(0, colors[0]);
    g.addColorStop(0.6, colors[1]);
    g.addColorStop(1, colors[2]);
    ctx.fillStyle = g;
    ctx.fill();

    if (snow) {
      ctx.beginPath();
      first = true;
      for (let wx = startWx; wx <= endWx; wx += step) {
        const sx = wx - camX * parallax;
        const h = mountainHeight(wx, zone * 10 + parallax * 5, amp);
        const peakY = baseY - h;
        const snowLine = baseY - h * 0.55;
        if (h < amp * 0.35) continue;
        if (first) { ctx.moveTo(sx, snowLine); first = false; }
        else ctx.lineTo(sx, peakY + h * 0.12);
      }
      ctx.lineTo(W + 50, baseY);
      ctx.lineTo(-50, baseY);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fill();
    }
  }

  function drawMountains(camX, zone) {
    const palettes = [
      { far: ['#c98a5a', '#8B5A2B', '#5C3D1E'], mid: ['#a07040', '#6B4423', '#4a3020'], near: ['#7a5535', '#5C4033', '#3D2B1F'], snow: false },
      { far: ['#2a2a4a', '#1a1a35', '#0D0D1A'], mid: ['#3a3a5a', '#252540', '#12121f'], near: ['#4a4a6a', '#2a2a45', '#1a1a2e'], snow: false },
      { far: ['#4a6a4a', '#2d4a2d', '#1a2e1a'], mid: ['#3d5c3d', '#2a4030', '#1a2a1a'], near: ['#2d4a35', '#1e3525', '#142018'], snow: false },
      { far: ['#a8d8f0', '#6BB8E8', '#4DA6FF'], mid: ['#87CEEB', '#5ba3d9', '#3d8fc4'], near: ['#6ab0d4', '#4a90b8', '#2e7098'], snow: false }
    ];
    const p = palettes[zone];
    const horizon = H * 0.56;
    drawMountainRange(camX, 0.12, horizon, H * 0.22, p.far, p.snow, zone);
    drawMountainRange(camX, 0.22, horizon + 8, H * 0.28, p.mid, p.snow, zone);
    drawMountainRange(camX, 0.35, horizon + 18, H * 0.32, p.near, false, zone);
  }

  function drawBird(sx, sy, wingPhase, size, color, targetCtx) {
    const c = targetCtx || ctx;
    const flap = Math.sin(wingPhase) * 0.6;
    const span = 10 * size;
    c.strokeStyle = color;
    c.lineWidth = 2 * size;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(sx - span, sy + flap * 6);
    c.quadraticCurveTo(sx - span * 0.3, sy - 4 - flap * 4, sx, sy);
    c.quadraticCurveTo(sx + span * 0.3, sy - 4 - flap * 4, sx + span, sy + flap * 6);
    c.stroke();
    c.fillStyle = color;
    c.beginPath();
    c.arc(sx, sy, 2 * size, 0, Math.PI * 2);
    c.fill();
  }

  function drawBirds(camX, zone, t) {
    const birdColors = ['#4a4035', '#8899cc', '#3a4a30', '#f8f8f8'];
    worldBirds.forEach((b) => {
      if (Math.abs(b.zone - zone) > 1 && b.zone !== zone) return;
      const sx = b.x - camX * 0.4;
      if (sx < -40 || sx > W + 40) return;
      const sy = b.y + Math.sin(t * 1.2 + b.wingPhase) * 8;
      const wingPhase = t * 12 + b.wingPhase;
      drawBird(sx, sy, wingPhase, b.size, birdColors[b.zone] || '#333');
    });
  }

  function getWaterColors(zone) {
    const night = isNight();
    const palettes = [
      night
        ? { deep: '#1a3a52', shallow: '#3a7a9a', surface: '#4a8aaa', foam: 'rgba(200,230,255,0.35)', bank: '#2a3a28', caustic: 'rgba(150,200,255,0.5)' }
        : { deep: '#2a6a88', shallow: '#7ed4f5', surface: '#a8e8ff', foam: 'rgba(255,255,255,0.55)', bank: '#5a7a48', caustic: 'rgba(180,240,255,0.9)' },
      null,
      night
        ? { deep: '#0f2218', shallow: '#2a5a40', surface: '#3a6a50', foam: 'rgba(180,220,200,0.3)', bank: '#1a2818', caustic: 'rgba(160,220,180,0.45)' }
        : { deep: '#1a3d2a', shallow: '#5aaa72', surface: '#7ec898', foam: 'rgba(220,255,230,0.45)', bank: '#3d4a30', caustic: 'rgba(200,255,220,0.85)' },
      night
        ? { deep: '#0f3550', shallow: '#2a6a90', surface: '#3a8ab0', foam: 'rgba(200,230,255,0.4)', bank: '#3a3528', caustic: 'rgba(160,210,255,0.55)' }
        : { deep: '#15608a', shallow: '#5ec8f5', surface: '#8ee0ff', foam: 'rgba(255,255,255,0.6)', bank: '#c4a86a', caustic: 'rgba(200,240,255,0.95)' }
    ];
    return palettes[zone];
  }

  function drawRiver(camX, zone, t) {
    const wc = getWaterColors(zone);
    if (!wc) return;

    const visible = riverSegments
      .filter((s) => s.zone === zone && s.x > camX - 100 && s.x < camX + W + 100)
      .sort((a, b) => a.x - b.x);
    if (visible.length < 2) return;

    ctx.save();

    const sampleRiverY = (wx, edge) => {
      const seg = visible.reduce((best, s) => Math.abs(s.x - wx) < Math.abs(best.x - wx) ? s : best, visible[0]);
      const w = Math.sin(t * 1.6 + wx * 0.015 + seg.ripple) * 2;
      return roadY(wx) + seg.yOff + (edge === 'bottom' ? seg.width : 0) + w;
    };

    ctx.beginPath();
    for (let wx = visible[0].x; wx <= visible[visible.length - 1].x; wx += 8) {
      const sx = wx - camX;
      const ry = sampleRiverY(wx, 'top');
      if (wx === visible[0].x) ctx.moveTo(sx, ry);
      else ctx.lineTo(sx, ry);
    }
    for (let wx = visible[visible.length - 1].x; wx >= visible[0].x; wx -= 8) {
      ctx.lineTo(wx - camX, sampleRiverY(wx, 'bottom'));
    }
    ctx.closePath();

    const midSeg = visible[Math.floor(visible.length / 2)];
    const avgY = roadY(midSeg.x) + midSeg.yOff + midSeg.width * 0.5;
    const waterG = ctx.createLinearGradient(0, avgY - 25, 0, avgY + 35);
    waterG.addColorStop(0, wc.surface);
    waterG.addColorStop(0.25, wc.shallow);
    waterG.addColorStop(0.7, wc.deep);
    waterG.addColorStop(1, wc.deep);
    ctx.fillStyle = waterG;
    ctx.fill();

    // Clip for inner effects
    ctx.clip();

    drawWaterCaustics(ctx, camX - 50, avgY - 30, W + 100, 80, t, wc.caustic);

    function segWidthMid(wx) {
      const seg = visible.reduce((b, s) => Math.abs(s.x - wx) < Math.abs(b.x - wx) ? s : b, visible[0]);
      return seg.width;
    }

    for (let stripe = 0; stripe < 6; stripe++) {
      ctx.strokeStyle = `rgba(255,255,255,${0.04 + stripe * 0.012})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let wx = visible[0].x; wx <= visible[visible.length - 1].x; wx += 10) {
        const sx = wx - camX;
        const flow = ((t * 35 + stripe * 18 + wx * 0.06) % 40);
        const ry = sampleRiverY(wx, 'top') + segWidthMid(wx) * (0.3 + stripe * 0.08) + flow * 0.06;
        if (wx === visible[0].x) ctx.moveTo(sx, ry);
        else ctx.lineTo(sx, ry);
      }
      ctx.stroke();
    }

    ctx.strokeStyle = wc.foam;
    ctx.lineWidth = 2.5;
    ctx.globalAlpha = 0.35 + Math.sin(t * 1.8) * 0.15;
    ctx.beginPath();
    for (let wx = visible[0].x; wx <= visible[visible.length - 1].x; wx += 5) {
      const sx = wx - camX;
      const ry = sampleRiverY(wx, 'top') + 3 + Math.sin(wx * 0.04 + t * 2.5) * 1.5;
      if (wx === visible[0].x) ctx.moveTo(sx, ry);
      else ctx.lineTo(sx, ry);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Sparkles
    for (let sp = 0; sp < 20; sp++) {
      const seg = visible[sp % visible.length];
      const sx = seg.x - camX + Math.sin(t * 2 + sp) * 8;
      const ry = roadY(seg.x) + seg.yOff + seg.width * 0.35 + ((t * 30 + sp * 17) % 20);
      const a = 0.25 + Math.sin(t * 4 + sp * 1.7) * 0.25;
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fillRect(sx, ry, 2, 2);
    }

    ctx.restore();

    // Shore banks (outside clip)
    ctx.save();
    ctx.strokeStyle = wc.bank;
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.5;
    visible.forEach((seg, i) => {
      const sx = seg.x - camX;
      const top = roadY(seg.x) + seg.yOff + Math.sin(t * 2.2 + seg.ripple) * 2;
      const bot = top + seg.width;
      if (i === 0) { ctx.beginPath(); ctx.moveTo(sx, top); }
      else ctx.lineTo(sx, top);
    });
    ctx.stroke();
    ctx.beginPath();
    visible.forEach((seg, i) => {
      const sx = seg.x - camX;
      const bot = roadY(seg.x) + seg.yOff + seg.width + Math.sin(t * 2.2 + seg.ripple) * 2.5;
      if (i === 0) ctx.moveTo(sx, bot);
      else ctx.lineTo(sx, bot);
    });
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function drawTree(sx, baseY, type, scale, sway, t) {
    const s = scale;
    const sw = Math.sin(t * 1.4 + sway) * 0.04;
    ctx.save();
    ctx.translate(sx, baseY);
    ctx.rotate(sw);
    ctx.translate(-sx, -baseY);

    const trunk = '#4a3520';
    const trunkHi = '#5C4033';

    if (type === 'pine') {
      ctx.fillStyle = trunk;
      ctx.fillRect(sx - 4 * s, baseY - 28 * s, 8 * s, 28 * s);
      ctx.fillStyle = trunkHi;
      ctx.fillRect(sx - 2 * s, baseY - 26 * s, 3 * s, 24 * s);
      const greens = ['#2d5a35', '#3a7045', '#4a8a55'];
      for (let layer = 0; layer < 4; layer++) {
        ctx.fillStyle = greens[layer % 3];
        const ly = baseY - (32 + layer * 16) * s;
        const lw = (24 + layer * 10) * s;
        ctx.beginPath();
        ctx.moveTo(sx, ly - 14 * s);
        ctx.lineTo(sx + lw / 2, ly + 8 * s);
        ctx.lineTo(sx - lw / 2, ly + 8 * s);
        ctx.closePath();
        ctx.fill();
      }
    } else if (type === 'palm') {
      ctx.fillStyle = '#8B6914';
      ctx.fillRect(sx - 3 * s, baseY - 42 * s, 6 * s, 42 * s);
      ctx.strokeStyle = '#3a7a3a';
      ctx.lineWidth = 3 * s;
      for (let f = 0; f < 6; f++) {
        const angle = -Math.PI * 0.75 + f * 0.45 + sw;
        ctx.beginPath();
        ctx.moveTo(sx, baseY - 42 * s);
        ctx.quadraticCurveTo(
          sx + Math.cos(angle) * 35 * s, baseY - 50 * s,
          sx + Math.cos(angle) * 50 * s, baseY - 38 * s + Math.sin(angle) * 10 * s
        );
        ctx.stroke();
      }
      ctx.fillStyle = '#6B8E23';
      ctx.beginPath();
      ctx.arc(sx, baseY - 44 * s, 6 * s, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Oak / round
      ctx.fillStyle = trunk;
      ctx.fillRect(sx - 5 * s, baseY - 22 * s, 10 * s, 22 * s);
      ctx.fillStyle = '#4a8a4a';
      ctx.beginPath();
      ctx.arc(sx, baseY - 38 * s, 22 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#5ca85c';
      ctx.beginPath();
      ctx.arc(sx - 10 * s, baseY - 42 * s, 14 * s, 0, Math.PI * 2);
      ctx.arc(sx + 12 * s, baseY - 36 * s, 12 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#6bc06b';
      ctx.beginPath();
      ctx.arc(sx + 4 * s, baseY - 48 * s, 10 * s, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawTrees(camX, zone, t) {
    worldTrees.forEach((tr) => {
      if (tr.zone !== zone && Math.abs(tr.zone - zone) > 1) return;
      const sx = tr.x - camX;
      if (sx < -80 || sx > W + 80) return;
      const baseY = roadY(tr.x) + tr.side * tr.dist * 0.35;
      if (tr.zone === 1) return;
      drawTree(sx, baseY, tr.type, tr.scale, tr.sway, t);
    });
  }

  // ─── Zone-specific scenery ────────────────────────────────────────────
  const fireflies = Array.from({ length: 30 }, () => ({
    x: Math.random() * ZONE_WIDTH,
    phase: Math.random() * Math.PI * 2,
    y: Math.random() * 200
  }));

  function zoneVisible(camX, zoneId) {
    const zStart = zoneId * ZONE_WIDTH;
    return camX + W > zStart - 200 && camX < zStart + ZONE_WIDTH + 200;
  }

  function drawZone1(camX, t) {
    // Cottages
    for (let i = 0; i < 5; i++) {
      const wx = 400 + i * 520;
      const sx = wx - camX;
      if (sx < -150 || sx > W + 150) continue;
      const ry = roadY(wx) - 8;
      ctx.fillStyle = '#5C4033';
      ctx.fillRect(sx, ry - 70, 90, 70);
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.moveTo(sx - 10, ry - 70);
      ctx.lineTo(sx + 45, ry - 110);
      ctx.lineTo(sx + 100, ry - 70);
      ctx.fill();
      // Window glow
      ctx.fillStyle = `rgba(255,213,128,${0.5 + Math.sin(t * 2 + i) * 0.2})`;
      ctx.fillRect(sx + 15, ry - 50, 18, 18);
      ctx.fillRect(sx + 55, ry - 50, 18, 18);
      // Lantern
      ctx.fillStyle = '#FF8C42';
      ctx.fillRect(sx + 80, ry - 95, 8, 12);
      // Framed portrait on cottage 3
      if (i === 2) {
        ctx.fillStyle = '#5C4033';
        ctx.fillRect(sx + 52, ry - 48, 28, 32);
        ctx.fillStyle = '#FFD580';
        ctx.fillRect(sx + 55, ry - 45, 22, 22);
        ctx.fillStyle = '#FF8C42';
        ctx.beginPath();
        ctx.arc(sx + 66, ry - 36, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // Fireflies
    fireflies.forEach((ff) => {
      const sx = ff.x - camX + Math.sin(t * 0.8 + ff.phase) * 28;
      const sy = roadY(ff.x) - 90 - ff.y + Math.cos(t * 1.2 + ff.phase) * 20;
      const a = 0.35 + Math.sin(t * 4 + ff.phase) * 0.45;
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 8);
      glow.addColorStop(0, `rgba(255,255,180,${a})`);
      glow.addColorStop(1, 'rgba(255,255,100,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(sx - 8, sy - 8, 16, 16);
      ctx.fillStyle = `rgba(255,255,220,${a + 0.2})`;
      ctx.fillRect(sx, sy, 3, 3);
    });
    // Speech bubbles (proximity glow)
    [[520, getPortfolio().bubbles.bio], [1100, getPortfolio().bubbles.passions], [1850, getPortfolio().bubbles.portrait]].forEach(([wx, txt]) => {
      const sx = wx - camX;
      const near = Math.abs(player.x - wx) < 120;
      if (sx < -50 || sx > W + 50) return;
      const by = roadY(wx) - 130;
      ctx.fillStyle = near ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)';
      ctx.fillRect(sx - 40, by, 80, 28);
      ctx.fillStyle = '#3D2B1F';
      ctx.font = '8px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText(txt, sx, by + 18);
    });
  }

  function drawCitySkyline(camX, t) {
    const zStart = ZONE_WIDTH;
    for (let i = 0; i < 18; i++) {
      const wx = zStart + i * 165 + (hash(i * 7) * 40);
      const sx = wx - camX * 0.55;
      if (sx < -120 || sx > W + 120) continue;
      const bh = 80 + hash(i * 3) * 120;
      const ry = H * 0.56;
      ctx.fillStyle = '#0c0c18';
      ctx.fillRect(sx, ry - bh, 50 + hash(i) * 30, bh);
      // Lit windows
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 3; col++) {
          if (hash(i * 100 + row * 10 + col) > 0.4) continue;
          const lit = hash(i + row + col + t * 0.5) > 0.3;
          ctx.fillStyle = lit ? (hash(col) > 0.5 ? '#FF00A0' : '#00F5FF') : '#1a1a2a';
          ctx.globalAlpha = lit ? 0.5 + Math.sin(t * 3 + i + row) * 0.3 : 0.3;
          ctx.fillRect(sx + 8 + col * 14, ry - bh + 15 + row * 18, 8, 10);
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  function drawZone2(camX, t) {
    drawCitySkyline(camX, t);
    getPortfolio().projects.forEach((p, i) => {
      const wx = ZONE_WIDTH + 500 + i * 850;
      const sx = wx - camX;
      if (sx < -200 || sx > W + 200) return;
      const ry = roadY(wx);
      const bh = 180;
      // Building
      ctx.fillStyle = '#12121f';
      ctx.fillRect(sx - 60, ry - bh, 120, bh);
      ctx.strokeStyle = '#00F5FF';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx - 60, ry - bh, 120, bh);
      // Neon sign
      ctx.fillStyle = `rgba(0,245,255,${0.6 + Math.sin(t * 4 + i) * 0.3})`;
      ctx.font = '7px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText(p.name.slice(0, 12), sx, ry - bh - 12);
      // Billboard
      ctx.fillStyle = '#0a0a14';
      ctx.fillRect(sx - 45, ry - bh + 20, 90, 50);
      ctx.strokeStyle = '#FF00A0';
      ctx.strokeRect(sx - 45, ry - bh + 20, 90, 50);
      // Tags
      p.tags.slice(0, 3).forEach((tag, ti) => {
        ctx.fillStyle = '#FF00A0';
        ctx.fillRect(sx - 40 + ti * 32, ry - 35, 28, 10);
      });
    });
  }

  function drawZone3(camX, t) {
    getPortfolio().experience.forEach((e, i) => {
      const wx = ZONE_WIDTH * 2 + 400 + i * 720;
      const sx = wx - camX;
      if (sx < -100 || sx > W + 100) return;
      const ry = roadY(wx);
      const weather = e.weather;
      const stoneColor = lerpColor('#6a6a5a', '#3a4a3a', weather);
      ctx.fillStyle = stoneColor;
      ctx.fillRect(sx - 35, ry - 55, 70, 55);
      ctx.fillStyle = lerpColor('#C9A84C', '#5a5a40', weather);
      ctx.font = '6px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText(e.dates.slice(0, 10), sx, ry - 58);
      const near = Math.abs(player.x - wx) < 100;
      if (near) {
        ctx.fillStyle = `rgba(201,168,76,${0.8})`;
        ctx.font = '6px Inter';
        e.bullets.slice(0, 2).forEach((b, bi) => {
          ctx.fillText('• ' + b.slice(0, 28), sx, ry - 75 - bi * 12);
        });
      }
      // Moss
      if (weather > 0.4) {
        ctx.fillStyle = 'rgba(60,100,40,0.6)';
        ctx.fillRect(sx - 30, ry - 15, 60, 15);
      }
    });
    // Mist layers
    for (let m = 0; m < 3; m++) {
      const mistY = H * (0.32 + m * 0.06) + Math.sin(t * 0.3 + m) * 8;
      const mistGrad = ctx.createLinearGradient(0, mistY - 30, 0, mistY + 50);
      mistGrad.addColorStop(0, 'rgba(200,220,200,0)');
      mistGrad.addColorStop(0.5, `rgba(210,230,210,${0.06 + m * 0.02})`);
      mistGrad.addColorStop(1, 'rgba(200,220,200,0)');
      ctx.fillStyle = mistGrad;
      ctx.fillRect(0, mistY - 30, W, 80);
    }
  }

  function drawZone4(camX, t) {
    const oceanY = H * 0.68;

    // Deep ocean base
    const oceanGrad = ctx.createLinearGradient(0, oceanY - 20, 0, H);
    oceanGrad.addColorStop(0, '#8ee8ff');
    oceanGrad.addColorStop(0.15, '#5ec8f5');
    oceanGrad.addColorStop(0.4, '#4DA6FF');
    oceanGrad.addColorStop(0.75, '#2a7ab5');
    oceanGrad.addColorStop(1, '#1a4d72');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, oceanY - 15, W, H - oceanY + 15);

    // Sun reflection on water
    const reflectX = W * 0.55;
    const reflectG = ctx.createLinearGradient(reflectX - 60, oceanY, reflectX + 60, oceanY + 80);
    reflectG.addColorStop(0, 'rgba(255,240,180,0)');
    reflectG.addColorStop(0.5, `rgba(255,230,150,${0.12 + Math.sin(t * 0.8) * 0.04})`);
    reflectG.addColorStop(1, 'rgba(255,220,120,0)');
    ctx.fillStyle = reflectG;
    ctx.fillRect(reflectX - 80, oceanY, 160, 100);

    drawWaterCaustics(ctx, 0, oceanY + 10, W, H - oceanY - 10, t, 'rgba(200,245,255,1)');

    // Multi-layer waves
    const waveColors = [
      'rgba(255,255,255,0.14)',
      'rgba(255,255,255,0.1)',
      'rgba(200,235,255,0.12)',
      'rgba(255,255,255,0.08)',
      'rgba(180,220,255,0.06)'
    ];
    drawAnimatedWaveBand(ctx, oceanY, camX, t, 5, (layer, c) => {
      c.fillStyle = waveColors[layer] || waveColors[0];
      c.fill();
    });

    // Crest highlights on top wave
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let sx = 0; sx <= W + 10; sx += 5) {
      const wx = sx + camX * 0.06;
      const wy = waterWaveHeight(wx, oceanY, t, 0) - 1;
      if (sx === 0) ctx.moveTo(sx, wy);
      else ctx.lineTo(sx, wy);
    }
    ctx.stroke();

    // Shore foam — animated rolling bubbles
    for (let sx = 0; sx < W + 40; sx += 12) {
      const wx = sx + camX * 0.08;
      const fy = waterWaveHeight(wx, oceanY, t, 0);
      const foamPhase = (t * 2.5 + wx * 0.04) % (Math.PI * 2);
      const foamA = 0.2 + Math.max(0, Math.sin(foamPhase)) * 0.45;
      const foamW = 6 + Math.sin(foamPhase * 1.5) * 8;
      ctx.fillStyle = `rgba(255,255,255,${foamA})`;
      ctx.beginPath();
      ctx.ellipse(sx, fy + 2, foamW, 2.5 + Math.sin(t * 3 + sx * 0.1), 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Spray particles
    for (let sp = 0; sp < 25; sp++) {
      const sx = (sp * 73 + t * 35) % (W + 40);
      const wx = sx + camX * 0.05;
      const base = waterWaveHeight(wx, oceanY, t, 0);
      const sy = base - 4 - (sp % 5) - Math.sin(t * 4 + sp) * 3;
      ctx.fillStyle = `rgba(255,255,255,${0.15 + Math.sin(t * 5 + sp) * 0.15})`;
      ctx.fillRect(sx, sy, 2, 2);
    }

    // Dock
    const dockStart = ZONE_WIDTH * 3 + 700;
    const dockLen = WORLD_W - dockStart;
    for (let d = 0; d < dockLen; d += 40) {
      const wx = dockStart + d;
      const sx = wx - camX;
      if (sx < -50 || sx > W + 50) continue;
      const dy = roadY(wx);
      ctx.fillStyle = '#9a7530';
      ctx.fillRect(sx - 22, dy - 6, 44, 14);
      ctx.fillStyle = '#6B4F10';
      ctx.fillRect(sx - 3, dy + 8, 6, 28 + Math.sin(t * 1.5 + d) * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(sx - 20, dy + 6, 40, 4);
    }

    // Bottle
    const bx = ZONE_WIDTH * 3 + 900 - camX;
    const by = roadY(ZONE_WIDTH * 3 + 900) - 42;
    ctx.fillStyle = 'rgba(180,220,255,0.85)';
    ctx.fillRect(bx - 7, by, 14, 22);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(bx - 4, by + 4, 4, 10);
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(bx - 5, by - 5, 10, 6);

    // Buoys
    ['#333', '#0077B5', '#1DA1F2', '#FF7043'].forEach((col, i) => {
      const wx = ZONE_WIDTH * 3 + 1400 + i * 180;
      const sx = wx - camX;
      const bob = Math.sin(t * 2.5 + i * 1.2) * 8;
      const by2 = oceanY - 35 + bob;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(sx, by2, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx, by2 + 15);
      ctx.lineTo(sx + Math.sin(t + i) * 3, by2 + 35);
      ctx.stroke();
    });

    // End sign
    const signX = DOCK_END - 200 - camX;
    const signY = roadY(DOCK_END - 200);
    ctx.fillStyle = '#5C4033';
    ctx.fillRect(signX - 8, signY - 95, 16, 95);
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(signX - 55, signY - 105, 110, 28);
    ctx.fillStyle = '#FFF1B0';
    ctx.font = '6px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText(tr('endSign1'), signX, signY - 92);
    ctx.fillText(tr('endSign2'), signX, signY - 80);
  }

  function drawGates(camX) {
    GATE_X.forEach((gx, i) => {
      const sx = gx - camX;
      if (sx < -120 || sx > W + 120) return;
      const ry = roadY(gx);
      // Arch
      ctx.fillStyle = '#5C4033';
      ctx.fillRect(sx - 50, ry - 100, 12, 100);
      ctx.fillRect(sx + 38, ry - 100, 12, 100);
      ctx.fillRect(sx - 50, ry - 108, 100, 12);
      // Portal glow
      const pulse = 0.5 + Math.sin(performance.now() * 0.003) * 0.3;
      ctx.fillStyle = `rgba(0,245,255,${pulse * 0.4})`;
      ctx.fillRect(sx - 38, ry - 98, 76, 90);
      // Sign
      ctx.fillStyle = '#8B6914';
      ctx.fillRect(sx - 70, ry - 130, 140, 24);
      ctx.fillStyle = '#FFD580';
      ctx.font = '7px "Press Start 2P"';
      ctx.textAlign = 'center';
      const gateKeys = ['gateProjects', 'gateExperience', 'gateContact'];
      ctx.fillText(tr(gateKeys[i]), sx, ry - 112);
    });
  }

  function drawRoad(camX) {
    const step = 20;
    const start = Math.floor((camX - 100) / step) * step;

    // Road shadow / edge
    ctx.lineWidth = 42;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    let first = true;
    for (let wx = start; wx < camX + W + 200; wx += step) {
      const sx = wx - camX;
      const sy = roadY(wx) + 3;
      if (first) { ctx.moveTo(sx, sy); first = false; }
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Dirt road
    const roadGrad = ctx.createLinearGradient(0, 0, 0, H);
    roadGrad.addColorStop(0, '#8B6914');
    roadGrad.addColorStop(1, '#6B4423');
    ctx.strokeStyle = roadGrad;
    ctx.lineWidth = 36;
    ctx.beginPath();
    first = true;
    for (let wx = start; wx < camX + W + 200; wx += step) {
      const sx = wx - camX;
      const sy = roadY(wx);
      if (first) { ctx.moveTo(sx, sy); first = false; }
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Gravel texture
    for (let wx = start; wx < camX + W + 200; wx += 14) {
      const sx = wx - camX;
      const sy = roadY(wx) + (hash(wx * 7) - 0.5) * 8;
      ctx.fillStyle = hash(wx * 3) > 0.5 ? 'rgba(90,60,30,0.35)' : 'rgba(120,90,50,0.25)';
      ctx.fillRect(sx - 1, sy - 1, 3, 3);
    }

    // Center dashed line
    ctx.strokeStyle = 'rgba(255,230,170,0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 14]);
    ctx.beginPath();
    first = true;
    for (let wx = start; wx < camX + W + 200; wx += step) {
      const sx = wx - camX;
      const sy = roadY(wx);
      if (first) { ctx.moveTo(sx, sy); first = false; }
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawGround(camX, zone, t) {
    const groundSets = [
      { base: '#8B7355', hi: '#A08060', lo: '#6B5344' },
      { base: '#1a1a28', hi: '#252538', lo: '#12121c' },
      { base: '#3a5a38', hi: '#4a6a48', lo: '#2a4030' },
      { base: '#e8d5a0', hi: '#f5e8b8', lo: '#d4c088' }
    ];
    const g = groundSets[zone];
    const midX = camX + W * 0.5;
    const groundTop = roadY(midX) + 18;

    const grad = ctx.createLinearGradient(0, groundTop - 40, 0, H);
    grad.addColorStop(0, g.hi);
    grad.addColorStop(0.4, g.base);
    grad.addColorStop(1, g.lo);
    ctx.fillStyle = grad;
    ctx.fillRect(0, groundTop - 10, W, H);

    // Rolling hills on ground
    ctx.fillStyle = zone === 1 ? 'rgba(40,40,60,0.5)' : `rgba(0,0,0,0.06)`;
    for (let i = -1; i < Math.ceil(W / 120) + 2; i++) {
      const wx = Math.floor(camX / 120) * 120 + i * 120;
      const sx = wx - camX * 0.5;
      const hillH = 25 + hash(wx) * 35;
      ctx.beginPath();
      ctx.ellipse(sx + 60, groundTop + 40 + hillH * 0.3, 80, hillH, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawPlayer() {
    const sx = player.x - camera.x;
    const sy = player.y;
    if (playerMode === 'car') {
      drawCarSprite(ctx, sx, sy, mapCarState(player.state), player.frame, player.facing, 1);
      return;
    }
    drawCharSprite(ctx, sx, sy, player.state, player.frame, player.facing, 1);
  }

  // ─── Render ───────────────────────────────────────────────────────────
  function render(t) {
    globalTime = t;
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    const camX = camera.x;
    const zone = getZone(player.x);

    drawSky(camX, zone, t);
    drawMountains(camX, zone);
    drawBirds(camX, zone, t);
    drawGround(camX, zone, t);

    // River len v aktuálnej zóne
    drawRiver(camX, zone, t);

    drawTrees(camX, zone, t);
    drawRoad(camX);

    if (zone === 0) drawZone1(camX, t);
    else if (zone === 1) drawZone2(camX, t);
    else if (zone === 2) drawZone3(camX, t);
    else if (zone === 3) drawZone4(camX, t);

    drawGates(camX);
    drawPlayer();

    ctx.restore();

    zoneOverlay.style.background = getLevels()[zone].overlay;
    zoneOverlay.style.opacity = '0.35';
  }

  // ─── Input ────────────────────────────────────────────────────────────
  const joystick = { active: false, dx: 0, dy: 0 };
  const joyZone = document.getElementById('joystick-zone');
  const joyKnob = document.getElementById('joystick-knob');

  function setupJoystick() {
    let startX, startY;
    const maxDist = 36;
    function handleStart(e) {
      e.preventDefault();
      joystick.active = true;
      const t = e.touches ? e.touches[0] : e;
      startX = t.clientX; startY = t.clientY;
    }
    function handleMove(e) {
      if (!joystick.active) return;
      e.preventDefault();
      const t = e.touches ? e.touches[0] : e;
      let dx = t.clientX - startX;
      let dy = t.clientY - startY;
      const dist = Math.hypot(dx, dy);
      if (dist > maxDist) { dx = (dx / dist) * maxDist; dy = (dy / dist) * maxDist; }
      joyKnob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
      joystick.dx = dx / maxDist;
      joystick.dy = dy / maxDist;
    }
    function handleEnd() {
      joystick.active = false;
      joystick.dx = joystick.dy = 0;
      joyKnob.style.transform = 'translate(-50%, -50%)';
    }
    joyZone.addEventListener('touchstart', handleStart, { passive: false });
    joyZone.addEventListener('touchmove', handleMove, { passive: false });
    joyZone.addEventListener('touchend', handleEnd);
    joyZone.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
  }

  window.addEventListener('keydown', (e) => {
    if (introActive && introReady && (e.code === 'Enter' || e.code === ' ')) {
      e.preventDefault();
      startGame();
      return;
    }
    if (introActive || cutsceneActive) return;
    if (!e.repeat && (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') && !endScreenShown) {
      if (e.code === 'Space') e.preventDefault();
      tryJump();
    }
    keys[e.code] = true;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
    if ((e.code === 'KeyE' || e.code === 'Enter') && nearestInteract && !endScreenShown) openInteractable(nearestInteract);
    if (e.code === 'Escape') closeAllModals();
  });
  window.addEventListener('keyup', (e) => { keys[e.code] = false; });

  function getInputAxis() {
    let hx = 0;
    if (keys.ArrowRight || keys.KeyD) hx += 1;
    if (keys.ArrowLeft || keys.KeyA) hx -= 1;
    if (joystick.active) hx += joystick.dx;
    return Math.max(-1, Math.min(1, hx));
  }

  // ─── Physics & update ─────────────────────────────────────────────────
  function update(dt, t) {
    if (cutsceneActive || introActive) return;

    worldBirds.forEach((b) => {
      b.x += b.speed * dt;
      if (b.x > WORLD_W + 120) b.x = -120;
    });

    const hx = getInputAxis();
    const running = keys.ShiftLeft || keys.ShiftRight;
    const speed = playerMode === 'car'
      ? (running ? 420 : 260)
      : (running ? 280 : 160);

    player.groundY = roadY(player.x);

    if (!player.onGround) {
      player.vy += GRAVITY * dt;
      player.y += player.vy * dt;
      if (player.y >= player.groundY) {
        player.y = player.groundY;
        player.vy = 0;
        player.onGround = true;
      } else {
        player.state = 'jump';
      }
    }

    if (hx !== 0) {
      player.vx = hx * speed;
      player.facing = hx > 0 ? 1 : -1;
      if (player.onGround) player.state = running ? 'run' : 'walk';
    } else {
      player.vx *= playerMode === 'car' ? 0.75 : 0.7;
      if (Math.abs(player.vx) < 5) {
        player.vx = 0;
        if (player.onGround) player.state = 'idle';
      }
    }

    const minX = 40;
    player.x += player.vx * dt;
    if (player.x < minX) { player.x = minX; player.vx = 0; }
    if (player.x > WORLD_W) player.x = WORLD_W;

    player.groundY = roadY(player.x);
    if (player.onGround) {
      player.y = player.groundY;
      if (player.state === 'walk' || player.state === 'run') {
        const bob = playerMode === 'car' ? 1.5 : 1.2;
        player.y -= Math.abs(Math.sin(player.frame * 0.5)) * (player.state === 'run' ? bob * 2 : bob);
      }
    }

    const cfg = playerMode === 'car'
      ? (CAR_ANIM[mapCarState(player.state)] || CAR_ANIM.idle)
      : (ANIM[player.state] || ANIM.idle);
    player.frameTimer += dt;
    if (player.frameTimer > 1 / cfg.speed) {
      player.frameTimer = 0;
      player.frame++;
    }

    // Camera lerp
    const targetCamX = player.x - W * 0.35;
    camera.x = lerp(camera.x, Math.max(0, targetCamX), 0.08);
    camera.y = lerp(camera.y, player.y - H * 0.5, 0.05);

    // Zone change
    const newZone = getZone(player.x);
    if (newZone !== currentZone) {
      currentZone = newZone;
      hudZone.textContent = getLevels()[newZone].name;
      triggerZoneFade();
      changeAmbient(newZone);
    }

    // Fade
    fadeAlpha = lerp(fadeAlpha, fadeTarget, 0.06);
    fadeOverlay.style.opacity = fadeAlpha;

    // Interactables
    nearestInteract = null;
    let nearDist = Infinity;
    const feetY = player.onGround ? player.groundY : player.y;
    interactables.forEach((item) => {
      const iy = roadY(item.x);
      const d = Math.hypot(player.x - item.x, feetY - iy);
      if (d < item.r && d < nearDist) {
        nearDist = d;
        nearestInteract = item;
      }
    });
    const moveHint = playerMode === 'car' ? tr('hudMoveCar') : tr('hudMoveWalker');
    const hint = nearestInteract
      ? `${tr('hudNear')}: ${nearestInteract.label} — E`
      : `${moveHint} · ${tr('hudJump')} · ${tr('hudInteract')}`;
    hudHint.textContent = hint;
    if (nearestInteract) {
      interactBtn.classList.add('visible');
      interactBtn.textContent = 'E · ' + nearestInteract.label.slice(0, 14);
      interactBtn.setAttribute('aria-label', 'Interact with ' + nearestInteract.label);
    } else {
      interactBtn.classList.remove('visible');
    }

    // End of dock cutscene
    if (player.x >= DOCK_END - 30 && !cutsceneActive && !endScreenShown) {
      startCutscene();
    }

    // Save position
    if (Math.floor(t) % 2 === 0) {
      try { localStorage.setItem('pixelPortfolioX', String(Math.round(player.x))); } catch (_) {}
    }
  }

  function triggerZoneFade() {
    fadeTarget = 0.85;
    setTimeout(() => { fadeTarget = 0; }, 400);
  }

  // ─── Modals ───────────────────────────────────────────────────────────
  const modals = {
    about: document.getElementById('modal-about'),
    project: document.getElementById('modal-project'),
    experience: document.getElementById('modal-experience'),
    contact: document.getElementById('modal-contact')
  };

  function openModal(el) {
    closeAllModals();
    el.classList.add('open');
    const modal = el.querySelector('.modal');
    modal.focus();
    trapFocus(el);
  }

  function closeAllModals() {
    Object.values(modals).forEach((m) => m.classList.remove('open'));
  }

  function trapFocus(backdrop) {
    const focusable = backdrop.querySelectorAll('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    backdrop.addEventListener('keydown', function handler(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  document.querySelectorAll('.modal-close').forEach((btn) => {
    btn.addEventListener('click', closeAllModals);
  });
  document.querySelectorAll('.modal-backdrop').forEach((bd) => {
    bd.addEventListener('click', (e) => { if (e.target === bd) closeAllModals(); });
  });

  function openInteractable(item) {
    if (item.type === 'buoy' && item.url) {
      window.open(item.url, '_blank', 'noopener');
      return;
    }
    if (item.modal === 'modal-about') {
      document.getElementById('about-bio').textContent = getPortfolio().bio;
      document.getElementById('about-photo').src = getPortfolio().photo;
      document.getElementById('about-photo').alt = getPortfolio().name + ' portrait';
      document.getElementById('about-title').textContent = getPortfolio().name + ' — ' + getPortfolio().title;
      const icons = document.getElementById('about-interests');
      icons.innerHTML = getPortfolio().interests.map((i) => `<span aria-hidden="true">${i}</span>`).join('');
      openModal(modals.about);
    } else if (item.modal === 'modal-project') {
      const p = getPortfolio().projects[item.data.projectIndex];
      document.getElementById('project-title').textContent = p.name;
      document.getElementById('project-desc').textContent = p.desc;
      document.getElementById('project-thumb').src = p.thumb;
      document.getElementById('project-thumb').alt = p.name + ' preview';
      document.getElementById('project-live').href = p.live;
      document.getElementById('project-github').href = p.github;
      document.getElementById('project-tags').innerHTML = p.tags.map((t) => `<span class="tag">${t}</span>`).join('');
      openModal(modals.project);
    } else if (item.modal === 'modal-experience') {
      const e = getPortfolio().experience[item.data.expIndex];
      document.getElementById('exp-title').textContent = e.role + ' @ ' + e.company;
      document.getElementById('exp-dates').textContent = e.dates;
      document.getElementById('exp-bullets').innerHTML = e.bullets.map((b) => `<li>${b}</li>`).join('');
      openModal(modals.experience);
    } else if (item.modal === 'modal-contact') {
      openModal(modals.contact);
    }
  }

  document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cf-name').value;
    const email = document.getElementById('cf-email').value;
    const msg = document.getElementById('cf-message').value;
    const subject = encodeURIComponent('Portfolio contact from ' + name);
    const body = encodeURIComponent(msg + '\n\nFrom: ' + name + ' <' + email + '>');
    window.location.href = `mailto:${getPortfolio().email}?subject=${subject}&body=${body}`;
    closeAllModals();
  });

  interactBtn.addEventListener('click', () => {
    if (nearestInteract) openInteractable(nearestInteract);
  });

  document.getElementById('end-cta').addEventListener('click', () => {
    document.getElementById('end-screen').classList.remove('visible');
    cutsceneEl.classList.remove('active');
    cutsceneActive = false;
    endScreenShown = false;
    player.x = ZONE_WIDTH * 3 + 900;
    camera.x = Math.max(0, player.x - W * 0.35);
    openModal(modals.contact);
  });

  document.getElementById('end-replay').addEventListener('click', () => {
    resetWorld();
  });

  introStartBtn.addEventListener('click', startGame);

  charOptionBtns.forEach((btn) => {
    btn.addEventListener('click', () => setPlayerMode(btn.dataset.mode));
  });

  jumpBtn.addEventListener('click', (e) => {
    e.preventDefault();
    tryJump();
  });

  // ─── Audio (Web Audio API ambient) ────────────────────────────────────
  function initAudio() {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      ambientGain = audioCtx.createGain();
      ambientGain.gain.value = 0.04;
      ambientGain.connect(audioCtx.destination);
    } catch (_) {}
  }

  let ambientOsc = null;
  function changeAmbient(zone) {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (ambientOsc) { try { ambientOsc.stop(); } catch (_) {} }
    const freqs = [220, 110, 165, 196];
    ambientOsc = audioCtx.createOscillator();
    ambientOsc.type = zone === 1 ? 'square' : 'sine';
    ambientOsc.frequency.value = freqs[zone];
    const g = audioCtx.createGain();
    g.gain.value = 0.03;
    ambientOsc.connect(g);
    g.connect(ambientGain);
    ambientOsc.start();
  }

  function playPianoChord() {
    if (!audioCtx || pianoPlaying) return;
    pianoPlaying = true;
    [261.63, 329.63, 392, 523.25].forEach((f, i) => {
      const o = audioCtx.createOscillator();
      o.type = 'triangle';
      o.frequency.value = f;
      const g = audioCtx.createGain();
      g.gain.setValueAtTime(0, audioCtx.currentTime);
      g.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 0.5 + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 5);
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start(audioCtx.currentTime + i * 0.15);
      o.stop(audioCtx.currentTime + 5.5);
    });
  }

  // ─── Cutscene ─────────────────────────────────────────────────────────
  const cutsceneEl = document.getElementById('cutscene');
  const cutsceneCanvas = document.getElementById('cutscene-canvas');
  const cctx2 = cutsceneCanvas.getContext('2d');
  let cutsceneStart = 0;

  function startCutscene() {
    if (cutsceneActive) return;
    cutsceneActive = true;
    endScreenShown = false;
    player.state = 'wave';
    player.vx = 0;
    cutsceneEl.classList.add('active');
    cutsceneEl.style.opacity = '1';
    cutsceneEl.setAttribute('aria-hidden', 'false');
    cutsceneStart = performance.now();
    initAudio();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    setTimeout(playPianoChord, 800);
  }

  const endParticles = Array.from({ length: 40 }, (_, i) => ({
    x: Math.random(), y: Math.random(), s: 1 + Math.random() * 2, sp: 0.2 + Math.random() * 0.5, ph: Math.random() * Math.PI * 2
  }));

  function drawCutscene(elapsed) {
    const w = cutsceneCanvas.width / dpr;
    const h = cutsceneCanvas.height / dpr;
    const t = elapsed / 1000;
    cctx2.setTransform(dpr, 0, 0, dpr, 0, 0);
    cctx2.clearRect(0, 0, w, h);

    const sunProgress = Math.min(1, elapsed / 5500);
    const easeSun = sunProgress * sunProgress * (3 - 2 * sunProgress);

    const grad = cctx2.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, `rgb(${Math.floor(30 + 200 * easeSun)}, ${Math.floor(20 + 100 * easeSun)}, ${Math.floor(60 + 80 * easeSun)})`);
    grad.addColorStop(0.45, `rgb(${Math.floor(255 * easeSun)}, ${Math.floor(120 + 60 * easeSun)}, ${Math.floor(80 + 40 * easeSun)})`);
    grad.addColorStop(0.75, '#FF9E6D');
    grad.addColorStop(1, '#4DA6FF');
    cctx2.fillStyle = grad;
    cctx2.fillRect(0, 0, w, h);

    const oceanY = h * 0.68;
    const oceanG = cctx2.createLinearGradient(0, oceanY - 15, 0, h);
    oceanG.addColorStop(0, '#8ee8ff');
    oceanG.addColorStop(0.3, '#5ec8f5');
    oceanG.addColorStop(0.6, '#4DA6FF');
    oceanG.addColorStop(1, '#1a4d72');
    cctx2.fillStyle = oceanG;
    cctx2.fillRect(0, oceanY - 10, w, h - oceanY + 10);

    drawWaterCaustics(cctx2, 0, oceanY + 8, w, h - oceanY, t, 'rgba(200,245,255,1)');
    drawAnimatedWaveBand(cctx2, oceanY, 0, t, 5, (layer, c) => {
      c.fillStyle = `rgba(255,255,255,${0.07 + layer * 0.025})`;
      c.fill();
    }, w, h);

    for (let sx = 0; sx < w; sx += 14) {
      const fy = waterWaveHeight(sx, oceanY, t, 0);
      const fa = 0.25 + Math.max(0, Math.sin(t * 2.5 + sx * 0.05)) * 0.4;
      cctx2.fillStyle = `rgba(255,255,255,${fa})`;
      cctx2.beginPath();
      cctx2.ellipse(sx, fy + 2, 8, 2.5, 0, 0, Math.PI * 2);
      cctx2.fill();
    }

    const sunY = lerp(h * 0.75, h * 0.22, easeSun);
    const sunR = 35 + easeSun * 30;
    const glow = cctx2.createRadialGradient(w * 0.5, sunY, sunR * 0.2, w * 0.5, sunY, sunR * 3);
    glow.addColorStop(0, `rgba(255,220,120,${0.5 * easeSun})`);
    glow.addColorStop(1, 'rgba(255,150,50,0)');
    cctx2.fillStyle = glow;
    cctx2.fillRect(w * 0.5 - sunR * 3, sunY - sunR * 3, sunR * 6, sunR * 6);
    cctx2.fillStyle = '#FFE082';
    cctx2.beginPath();
    cctx2.arc(w * 0.5, sunY, sunR, 0, Math.PI * 2);
    cctx2.fill();

    for (let b = 0; b < 15; b++) {
      const bx = ((t * 0.12 + b * 0.07) % 1.3) * w - w * 0.15;
      const by = h * 0.15 + b * 14 + Math.sin(t * 2 + b) * 10;
      drawBird(bx, by, t * 14 + b, 1.2, 'rgba(40,40,50,0.8)', cctx2);
    }

    endParticles.forEach((p) => {
      const px = (p.x + t * p.sp * 0.02) % 1 * w;
      const py = p.y * h * 0.5 - Math.sin(t + p.ph) * 20;
      cctx2.fillStyle = `rgba(255,240,180,${0.3 + Math.sin(t * 2 + p.ph) * 0.2})`;
      cctx2.fillRect(px, py, p.s, p.s);
    });

    const dockY = h * 0.68;
    cctx2.fillStyle = '#8B6914';
    cctx2.fillRect(w * 0.38, dockY - 8, w * 0.24, 14);

    const charAnim = elapsed > 4200 ? 'wave' : 'idle';
    const charFrame = elapsed / 80;
    if (playerMode === 'car') {
      drawCarSprite(cctx2, w * 0.48, dockY + 4, mapCarState(charAnim), charFrame, 1, 2.6);
    } else {
      drawCharSprite(cctx2, w * 0.48, dockY + 4, charAnim, charFrame, 1, 2.8);
    }

    if (easeSun > 0.6) {
      cctx2.font = '10px "Press Start 2P"';
      cctx2.fillStyle = `rgba(255,241,176,${(easeSun - 0.6) * 2.5})`;
      cctx2.textAlign = 'center';
      cctx2.fillText('PETER DINIS', w * 0.5, h * 0.14);
    }
  }

  function updateCutscene(t) {
    const elapsed = t - cutsceneStart;
    drawCutscene(elapsed);

    if (elapsed >= 6500 && !endScreenShown) {
      endScreenShown = true;
      cutsceneEl.style.transition = 'opacity 1.5s';
      cutsceneEl.style.opacity = '0.35';
      document.getElementById('end-screen').classList.add('visible');
      player.state = 'wave';
    }
  }

  function resetWorld() {
    cutsceneActive = false;
    endScreenShown = false;
    cutscenePhase = 0;
    pianoPlaying = false;
    cutsceneEl.classList.remove('active');
    cutsceneEl.style.opacity = '';
    cutsceneEl.setAttribute('aria-hidden', 'true');
    document.getElementById('end-screen').classList.remove('visible');
    player.x = 180;
    player.vx = 0;
    player.vy = 0;
    player.y = roadY(180);
    player.groundY = player.y;
    player.onGround = true;
    player.state = 'idle';
    player.frame = 0;
    camera.x = 0;
    currentZone = 0;
    hudZone.textContent = getLevels()[0].name;
    fadeAlpha = fadeTarget = 0;
    fadeOverlay.style.opacity = 0;
    try { localStorage.setItem('pixelPortfolioX', '180'); } catch (_) {}
  }

  // ─── Resize ───────────────────────────────────────────────────────────
  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    cutsceneCanvas.width = W * dpr;
    cutsceneCanvas.height = H * dpr;
    introCanvas.width = W * dpr;
    introCanvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    initWorldScenery();
  }

  window.addEventListener('resize', resize);

  // ─── Intro animation ───────────────────────────────────────────────────
  let introStart = 0;
  let introTyped = 0;

  function drawIntroScene(elapsed, t) {
    const w = W;
    const h = H;
    introCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    introCtx.clearRect(0, 0, w, h);

    const fadeIn = Math.min(1, elapsed / 800);

    const sky = introCtx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#0f0a1a');
    sky.addColorStop(0.35, '#3a2048');
    sky.addColorStop(0.65, `rgba(255,140,66,${fadeIn})`);
    sky.addColorStop(1, '#FFD580');
    introCtx.fillStyle = sky;
    introCtx.fillRect(0, 0, w, h);

    for (let i = 0; i < 50; i++) {
      const sx = (hash(i * 13) * w + elapsed * 0.01 * (i % 5)) % w;
      const sy = hash(i * 29) * h * 0.45;
      const tw = 0.4 + Math.sin(t * 2 + i) * 0.4;
      introCtx.fillStyle = `rgba(255,255,200,${tw * fadeIn})`;
      introCtx.fillRect(sx, sy, 2, 2);
    }

    const horizon = h * 0.7;
    introCtx.fillStyle = '#5C4033';
    introCtx.beginPath();
    introCtx.moveTo(0, horizon);
    for (let sx = 0; sx <= w + 40; sx += 30) {
      const wy = horizon - 30 - hash(sx * 0.1) * 50;
      introCtx.lineTo(sx, wy);
    }
    introCtx.lineTo(w + 40, h);
    introCtx.lineTo(0, h);
    introCtx.closePath();
    introCtx.fill();

    introCtx.fillStyle = '#6B5344';
    introCtx.fillRect(0, horizon, w, h - horizon);

    if (elapsed < 2800) {
      introCharX = lerp(-70, w * 0.42, elapsed / 2800);
    } else {
      introCharX = w * 0.42 + Math.sin(t * 1.5) * 4;
    }

    if (playerMode === 'car') {
      drawCarSprite(introCtx, introCharX, horizon + 2, elapsed < 2800 ? 'drive' : 'idle', t * 10, 1, 2.4);
    } else {
      drawCharSprite(introCtx, introCharX, horizon + 2, elapsed < 2800 ? 'walk' : 'idle', t * 10, 1, 2.6);
    }
  }

  function updateIntroTypewriter(elapsed) {
    const target = Math.min(getIntroName().length, Math.floor(elapsed / 100));
    if (target !== introTyped) {
      introTyped = target;
      const showCursor = target < getIntroName().length;
      introNameEl.innerHTML = getIntroName().slice(0, target) +
        (showCursor ? '<span class="cursor">_</span>' : '');
    }
  }

  function introLoop(now) {
    if (!introActive) return;
    const elapsed = now - introStart;
    const t = now / 1000;
    drawIntroScene(elapsed, t);
    updateIntroTypewriter(elapsed);
    if (elapsed > 1800) introSubEl.classList.add('visible');
    if (introReady && elapsed > 2800) charSelectEl.classList.add('visible');
    if (introReady && elapsed > 3200) introStartBtn.classList.add('visible');
    introAnimId = requestAnimationFrame(introLoop);
  }

  async function loadGameAssets() {
    const loadingTexts = window.GameData.i18n[window.GameConfig.getLang()].loading;
    const steps = [
      { pct: 12, text: loadingTexts[0] },
      { pct: 30, text: loadingTexts[1] },
      { pct: 50, text: loadingTexts[2] },
      { pct: 70, text: loadingTexts[3] },
      { pct: 88, text: loadingTexts[4] },
      { pct: 100, text: loadingTexts[5] }
    ];
    buildSpriteSheet();
    buildCarSpriteSheet();
    initInteractables();
    initWorldScenery();
    for (const step of steps) {
      loadBar.style.width = step.pct + '%';
      loadText.textContent = step.text;
      await new Promise((r) => setTimeout(r, 220));
    }
    introReady = true;
  }

  function startGame() {
    if (!introReady) return;
    introActive = false;
    cancelAnimationFrame(introAnimId);
    introScreen.classList.add('hidden');
    introScreen.setAttribute('aria-hidden', 'true');
    initAudio();
    changeAmbient(0);
    lastT = performance.now();
    requestAnimationFrame(gameLoop);
  }

  function runIntro() {
    introStart = performance.now();
    introCharX = -80;
    introTyped = 0;
    introNameEl.innerHTML = '<span class="cursor">_</span>';
    introAnimId = requestAnimationFrame(introLoop);
  }

  // ─── Main loop ────────────────────────────────────────────────────────
  let lastT = 0;
  let gameLoopRunning = false;

  function gameLoop(t) {
    if (!gameLoopRunning) return;
    const dt = Math.min(0.05, (t - lastT) / 1000);
    lastT = t;

    if (cutsceneActive) {
      updateCutscene(t);
    } else if (!introActive) {
      update(dt, t / 1000);
      render(t / 1000);
    }

    requestAnimationFrame(gameLoop);
  }

  // ─── Boot ─────────────────────────────────────────────────────────────
  async function boot() {
    resize();
    setupJoystick();
    try {
      const savedMode = localStorage.getItem('pixelPortfolioMode');
      if (savedMode === 'walker' || savedMode === 'car') setPlayerMode(savedMode);
    } catch (_) {}
    gameLoopRunning = true;
    requestAnimationFrame(gameLoop);
    try {
      const saved = parseFloat(localStorage.getItem('pixelPortfolioX'));
      if (!isNaN(saved) && saved > 40 && saved < DOCK_END - 50) player.x = saved;
    } catch (_) {}
    player.groundY = roadY(player.x);
    player.y = player.groundY;
    player.onGround = true;
    camera.x = Math.max(0, player.x - W * 0.35);
    await loadGameAssets();
    runIntro();
  }

  document.addEventListener('click', () => {
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }, { once: true });

  window.gameRefreshInteractables = function () {
    interactables.length = 0;
    initInteractables();
  };

  window.gameHudUpdate = function () {
    if (!introActive && !cutsceneActive) {
      hudZone.textContent = getLevels()[currentZone].name;
    }
  };

  boot();
})();
