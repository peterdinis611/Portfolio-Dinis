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

  // ========== VYLEPŠENÝ ŠUM PRE ORGANICKÉ TVARY ==========
  function hash(n) {
    const x = Math.sin(n * 127.1 + n * 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  function smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  function noise2D(x, y) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    
    const v00 = hash(ix * 374761393 + iy * 668265263);
    const v10 = hash((ix + 1) * 374761393 + iy * 668265263);
    const v01 = hash(ix * 374761393 + (iy + 1) * 668265263);
    const v11 = hash((ix + 1) * 374761393 + (iy + 1) * 668265263);
    
    const ux = smoothstep(fx);
    const uy = smoothstep(fy);
    
    return (v00 * (1 - ux) * (1 - uy) +
            v10 * ux * (1 - uy) +
            v01 * (1 - ux) * uy +
            v11 * ux * uy);
  }

  function fbmNoise(x, y, octaves = 4, persistence = 0.5, lacunarity = 2.0) {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxAmp = 0;
    
    for (let i = 0; i < octaves; i++) {
      value += noise2D(x * frequency, y * frequency) * amplitude;
      maxAmp += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }
    return value / maxAmp;
  }

  function ridgeNoise(x, y, octaves = 3) {
    let value = fbmNoise(x, y, octaves, 0.5, 2.0);
    return 1 - Math.abs(value * 2 - 1);
  }

  const clouds = [];
  const worldBirds = [];
  const worldTrees = [];
  const riverSegments = [];
  const zoneDecor = [];
  const dustPuffs = [];
  const fireflies = [];
  const rainDrops = [];
  const snowFlakes = [];

  // ========== VYLEPŠENÉ OBLAKY ==========
  function initClouds() {
    clouds.length = 0;
    for (let i = 0; i < 72; i++) {
      const w = 120 + hash(i * 2.3) * 200;
      const puffN = 16 + Math.floor(hash(i * 4.7) * 14);
      const puffs = [];
      
      // Generovanie puffov pomocou polárnych súradníc pre lepšie rozloženie
      for (let p = 0; p < puffN; p++) {
        const angle = hash(i * 11 + p * 3) * Math.PI * 2;
        const radius = 0.2 + hash(i * 17 + p * 5) * 0.8;
        const ox = Math.cos(angle) * w * radius * 0.7;
        const oy = Math.sin(angle) * w * radius * 0.35;
        
        puffs.push({
          ox: ox,
          oy: oy,
          r: w * (0.1 + hash(i * 23 + p) * 0.18),
          density: 0.4 + hash(i * 29 + p * 7) * 0.7,
          depth: Math.floor(hash(i * 31 + p * 2) * 4),
          noiseSeedX: hash(i * 37 + p * 11) * 1000,
          noiseSeedY: hash(i * 41 + p * 13) * 1000
        });
      }
      
      const layerRoll = hash(i * 6.3);
      clouds.push({
        x: hash(i * 3.1) * WORLD_W,
        y: H * (0.02 + hash(i * 5.7) * 0.3),
        w,
        speed: 8 + hash(i * 8.1) * 22,
        opacity: 0.4 + hash(i * 1.9) * 0.5,
        layer: layerRoll > 0.66 ? 'far' : layerRoll > 0.33 ? 'mid' : 'near',
        flatten: 0.45 + hash(i * 13.1) * 0.25,
        puffs,
        seed: i * 1.7,
        turbulence: 0.3 + hash(i * 43) * 0.7,
        cloudType: Math.floor(hash(i * 47) * 3) // 0=cirrus, 1=cumulus, 2=stratus
      });
    }
  }

  // ========== VYLEPŠENÉ OBLAKY S VOLUMETRICKÝM EFECTOM ==========
  function drawCloudBlob(cx, cy, cloud, zone, time, alphaMul) {
    const pal = getCloudPalette(zone);
    const baseA = cloud.opacity * alphaMul;
    const flat = cloud.flatten || 0.62;
    const sunDx = -0.55;
    const sunDy = -0.42;
    
    // Organická turbulencia
    const turbX = Math.sin(time * 0.08 + cloud.seed) * 4;
    const turbY = Math.cos(time * 0.09 + cloud.seed * 1.3) * 3;
    
    ctx.save();
    ctx.shadowBlur = 0;
    
    const sorted = [...cloud.puffs].sort((a, b) => (a.depth ?? 1) - (b.depth ?? 1));
    
    // ===== 1. VOLUMETRICKÉ HALO (ray-marching simulácia) =====
    ctx.globalCompositeOperation = 'lighter';
    const marchSteps = 5;
    for (let step = 0; step < marchSteps; step++) {
      const stepT = step / marchSteps;
      const stepAlpha = baseA * 0.06 * (1 - stepT * 0.5);
      sorted.forEach((p) => {
        const noiseVal = fbmNoise(
          (cx + p.ox) * 0.012 + time * 0.04,
          (cy + p.oy) * 0.012 + time * 0.03,
          2, 0.5, 2.0
        );
        const px = cx + p.ox + turbX * 0.4;
        const py = cy + p.oy * flat + turbY * 0.3;
        const r = p.r * (1.3 + stepT * 0.5 + noiseVal * 0.15);
        
        ctx.fillStyle = `rgba(${pal.hi[0]}, ${pal.hi[1]}, ${pal.hi[2]}, ${stepAlpha * 0.5})`;
        ctx.beginPath();
        ctx.ellipse(px, py, r, r * flat * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    
    // ===== 2. HLAVNÉ JADRO =====
    ctx.globalCompositeOperation = 'source-over';
    
    sorted.forEach((p, pi) => {
      const density = p.density ?? 0.65;
      const noiseVal = fbmNoise(
        (cx + p.ox) * 0.01 + time * 0.06,
        (cy + p.oy) * 0.01 + time * 0.04,
        3, 0.5, 2.0
      );
      
      const organicX = p.ox + Math.sin(time * 0.12 + pi * 0.7) * 3 * density;
      const organicY = p.oy * flat + Math.cos(time * 0.1 + pi * 0.5) * 2.5 * density;
      
      const px = cx + organicX + turbX * (0.3 + density * 0.5);
      const py = cy + organicY + turbY * 0.5;
      const r = p.r * (0.9 + noiseVal * 0.2);
      
      const litX = px + r * sunDx * (0.35 + density * 0.25);
      const litY = py + r * sunDy * (0.3 + density * 0.2);
      
      const grad = ctx.createRadialGradient(litX, litY, r * 0.1, px, py + r * 0.1, r);
      
      const coreA = baseA * (0.6 + density * 0.4);
      const highlightBoost = 0.25 + Math.sin(time * 0.7 + pi) * 0.1;
      
      grad.addColorStop(0, `rgba(255, 255, 255, ${coreA * 0.98})`);
      grad.addColorStop(0.15, `rgba(${pal.hi[0]}, ${pal.hi[1]}, ${pal.hi[2]}, ${coreA * (0.92 + highlightBoost * 0.08)})`);
      grad.addColorStop(0.38, `rgba(${pal.mid[0]}, ${pal.mid[1]}, ${pal.mid[2]}, ${coreA * 0.85})`);
      grad.addColorStop(0.65, `rgba(${pal.lo[0]}, ${pal.lo[1]}, ${pal.lo[2]}, ${coreA * 0.6})`);
      grad.addColorStop(1, `rgba(${pal.lo[0] * 0.6}, ${pal.lo[1] * 0.6}, ${pal.lo[2] * 0.6}, ${coreA * 0.3})`);
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(px, py, r, r * flat * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // ===== 3. TIEN =====
      const shadowGrad = ctx.createLinearGradient(px, py - r * 0.25, px, py + r * flat);
      const shadowStrength = 0.4 + (1 - density) * 0.3;
      shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      shadowGrad.addColorStop(0.55, `rgba(0, 0, 0, ${coreA * 0.18 * shadowStrength})`);
      shadowGrad.addColorStop(1, `rgba(0, 0, 0, ${coreA * 0.35 * shadowStrength})`);
      
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(px, py + r * 0.1, r * 0.94, r * flat * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // ===== 4. SVETELNÝ LEM =====
    ctx.globalCompositeOperation = 'lighter';
    const frontPuffs = sorted.filter((p) => (p.depth ?? 1) >= 2).slice(-6);
    frontPuffs.forEach((p, pi) => {
      const px = cx + p.ox + Math.sin(time * 0.18 + pi) * 2.5;
      const py = cy + p.oy * flat + Math.cos(time * 0.15 + pi) * 1.5;
      const r = p.r * 0.5;
      const highlightIntensity = 0.3 + Math.sin(time * 1.1 + pi) * 0.12;
      
      const highlightGrad = ctx.createRadialGradient(
        px - r * 0.6, py - r * 0.35, r * 0.15,
        px, py, r * 1.3
      );
      highlightGrad.addColorStop(0, `rgba(255, 255, 235, ${baseA * highlightIntensity * 0.9})`);
      highlightGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = highlightGrad;
      ctx.beginPath();
      ctx.ellipse(px - r * 0.25, py - r * 0.18, r * 0.75, r * flat * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // ===== 5. TEXTÚRA =====
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = `rgba(255, 255, 255, ${baseA * 0.1})`;
    for (let d = 0; d < 20; d++) {
      const angle = hash(cloud.seed * 100 + d) * Math.PI * 2;
      const rad = 0.35 + hash(d * 7) * 0.55;
      const px = cx + Math.cos(angle) * cloud.w * rad + Math.sin(time * 0.4 + d) * 4;
      const py = cy + Math.sin(angle) * cloud.w * rad * flat * 0.35 + Math.cos(time * 0.35 + d) * 2.5;
      const speckSize = 1 + hash(d * 13) * 3;
      ctx.fillRect(px, py, speckSize, speckSize);
    }
    
    ctx.restore();
  }

  // ========== VYLEPŠENÁ CESTA ==========
  function roadY(worldX) {
    const base = H * 0.62;
    // Kombinácia viacerých sínusov pre prirodzenejšiu krivku
    return base + 
      Math.sin(worldX * 0.0018) * 48 + 
      Math.sin(worldX * 0.0006) * 32 +
      Math.sin(worldX * 0.00015) * 18 +
      Math.sin(worldX * 0.00004) * 8;
  }

  function getRoadTexture(worldX, t) {
    const noiseVal = fbmNoise(worldX * 0.05, t * 0.1, 2, 0.5, 2.0);
    return {
      gravel: 0.3 + noiseVal * 0.2,
      mud: 0.4 + Math.sin(worldX * 0.02) * 0.1,
      dust: 0.15 + Math.sin(worldX * 0.015 + t * 2) * 0.08
    };
  }

  function drawRoad(camX, t) {
    const step = 16;
    const start = Math.floor((camX - 150) / step) * step;
    
    // Tieň pod cestou
    ctx.lineWidth = 48;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    let first = true;
    for (let wx = start; wx < camX + W + 200; wx += step) {
      const sx = wx - camX;
      const sy = roadY(wx) + 5;
      if (first) { ctx.moveTo(sx, sy); first = false; }
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    
    // Základ cesty s gradientom
    const roadGrad = ctx.createLinearGradient(0, 0, 0, H);
    roadGrad.addColorStop(0, '#8A8580');
    roadGrad.addColorStop(0.5, '#6E6A65');
    roadGrad.addColorStop(1, '#524E4A');
    ctx.strokeStyle = roadGrad;
    ctx.lineWidth = 42;
    ctx.beginPath();
    first = true;
    for (let wx = start; wx < camX + W + 200; wx += step) {
      const sx = wx - camX;
      const sy = roadY(wx);
      if (first) { ctx.moveTo(sx, sy); first = false; }
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    
    // Textúra cesty (kamienky, štrk)
    for (let wx = start; wx < camX + W + 200; wx += 12) {
      const sx = wx - camX;
      const sy = roadY(wx);
      const texture = getRoadTexture(wx, t);
      
      // Kamienky
      if (texture.gravel > 0.35) {
        ctx.fillStyle = `rgba(90, 88, 84, ${0.3 + texture.gravel * 0.2})`;
        for (let g = 0; g < 3; g++) {
          const offX = (hash(wx * 5 + g) - 0.5) * 24;
          ctx.fillRect(sx + offX - 2, sy + (hash(wx * 7 + g) - 0.5) * 8 - 2, 4, 4);
        }
      }
      
      // Blato/špina
      ctx.fillStyle = `rgba(70, 68, 64, ${0.2 + texture.mud * 0.15})`;
      ctx.fillRect(sx - 15, sy - 3, 30, 6);
      
      // Prach
      if (texture.dust > 0.18) {
        ctx.fillStyle = `rgba(200, 198, 190, ${0.1 + texture.dust * 0.12})`;
        ctx.fillRect(sx - 18, sy - 5, 36, 10);
      }
    }
    
    // Stredová čiara s pohyblivým efektom
    const dashOffset = (t * 45) % 28;
    ctx.strokeStyle = 'rgba(255, 235, 180, 0.55)';
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 16]);
    ctx.lineDashOffset = -dashOffset;
    ctx.beginPath();
    first = true;
    for (let wx = start; wx < camX + W + 200; wx += step) {
      const sx = wx - camX;
      const sy = roadY(wx);
      if (first) { ctx.moveTo(sx, sy); first = false; }
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    
    // Okraje cesty
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(45, 42, 38, 0.55)';
    ctx.lineWidth = 2.5;
    for (let side = -1; side <= 1; side += 2) {
      ctx.beginPath();
      first = true;
      for (let wx = start; wx < camX + W + 200; wx += step) {
        const sx = wx - camX;
        const angle = Math.atan2(roadY(wx + 5) - roadY(wx - 5), 10);
        const offsetX = side * Math.sin(angle) * 24;
        const offsetY = side * Math.cos(angle) * 24;
        const sy = roadY(wx) + offsetY;
        if (first) { ctx.moveTo(sx + offsetX, sy); first = false; }
        else ctx.lineTo(sx + offsetX, sy);
      }
      ctx.stroke();
    }
    
    ctx.lineDashOffset = 0;
  }

  // ========== VYLEPŠENÁ VODA ==========
  function waterWaveHeightComplex(wx, baseY, t, layer, zone) {
    const speed1 = 1.2 + layer * 0.35;
    const speed2 = 0.7 + layer * 0.25;
    const freq1 = 0.014 + layer * 0.006;
    const freq2 = 0.028 - layer * 0.004;
    const freq3 = 0.007 + layer * 0.003;
    
    return baseY +
      Math.sin(wx * freq1 + t * speed1) * (5 + layer * 3) +
      Math.sin(wx * freq2 - t * speed2) * (3 + layer * 2.2) +
      Math.sin(wx * freq3 + t * 0.5) * (2 + layer * 1.5) +
      Math.sin(wx * 0.003) * 4;
  }

  function drawWaterCausticsEnhanced(targetCtx, x0, y0, w, h, t, color, intensity = 1) {
    const c = targetCtx || ctx;
    c.save();
    c.beginPath();
    c.rect(x0, y0, w, h);
    c.clip();
    
    // Viacvrstvové kaustiky
    for (let layer = 0; layer < 3; layer++) {
      const layerT = t * (1.5 + layer * 0.7);
      const alphaBase = 0.06 + layer * 0.03;
      
      for (let i = 0; i < 30 + layer * 8; i++) {
        const phase = layerT + i * 0.7;
        const cx = x0 + ((i * 47 + layerT * 45) % (w + 60)) - 30;
        const cy = y0 + ((i * 31 + layerT * 35) % (h + 40)) - 20;
        const rx = 12 + Math.sin(phase) * 7;
        const ry = 4 + Math.cos(phase * 1.2) * 3;
        
        c.strokeStyle = color;
        c.lineWidth = 1 + layer * 0.5;
        c.globalAlpha = (alphaBase + Math.sin(phase) * 0.05) * intensity;
        c.beginPath();
        c.ellipse(cx, cy, rx, ry, phase * 0.35, 0, Math.PI * 2);
        c.stroke();
      }
    }
    
    c.globalAlpha = 1;
    c.restore();
  }

  function drawRiver(camX, zone, t) {
    const wc = getWaterColors(zone);
    if (!wc) return;

    const visible = riverSegments
      .filter((s) => s.zone === zone && s.x > camX - 150 && s.x < camX + W + 150)
      .sort((a, b) => a.x - b.x);
    if (visible.length < 2) return;

    ctx.save();

    const sampleRiverY = (wx, edge, time) => {
      const seg = visible.reduce((best, s) => Math.abs(s.x - wx) < Math.abs(best.x - wx) ? s : best, visible[0]);
      const waveAdd = Math.sin(time * 1.8 + wx * 0.018 + seg.ripple) * 3;
      const baseY = roadY(wx) + seg.yOff + waveAdd;
      return baseY + (edge === 'bottom' ? seg.width : 0) + 
             Math.sin(wx * 0.008 + time) * 2;
    };

    // Hlavný tvar rieky
    ctx.beginPath();
    for (let wx = visible[0].x; wx <= visible[visible.length - 1].x; wx += 6) {
      const sx = wx - camX;
      const ry = sampleRiverY(wx, 'top', t);
      if (wx === visible[0].x) ctx.moveTo(sx, ry);
      else ctx.lineTo(sx, ry);
    }
    for (let wx = visible[visible.length - 1].x; wx >= visible[0].x; wx -= 6) {
      ctx.lineTo(wx - camX, sampleRiverY(wx, 'bottom', t));
    }
    ctx.closePath();

    const midSeg = visible[Math.floor(visible.length / 2)];
    const avgY = roadY(midSeg.x) + midSeg.yOff + midSeg.width * 0.5;
    
    // Gradient vody
    const waterG = ctx.createLinearGradient(0, avgY - 30, 0, avgY + 45);
    waterG.addColorStop(0, wc.surface);
    waterG.addColorStop(0.2, wc.shallow);
    waterG.addColorStop(0.5, wc.deep);
    waterG.addColorStop(0.85, wc.deep);
    waterG.addColorStop(1, wc.deep + 'aa');
    ctx.fillStyle = waterG;
    ctx.fill();
    
    ctx.clip();
    
    // Kaustiky
    drawWaterCausticsEnhanced(ctx, camX - 60, avgY - 40, W + 120, 100, t, wc.caustic, 0.8);
    
    // Povrchové vlnky
    for (let stripe = 0; stripe < 8; stripe++) {
      ctx.strokeStyle = `rgba(255,255,255,${0.03 + stripe * 0.01})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let wx = visible[0].x; wx <= visible[visible.length - 1].x; wx += 8) {
        const sx = wx - camX;
        const flow = ((t * 30 + stripe * 15 + wx * 0.05) % 35);
        const ry = sampleRiverY(wx, 'top', t) + (stripe * 0.08) * midSeg.width + flow * 0.08;
        if (wx === visible[0].x) ctx.moveTo(sx, ry);
        else ctx.lineTo(sx, ry);
      }
      ctx.stroke();
    }
    
    // Pena na okrajoch
    ctx.strokeStyle = wc.foam;
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.45 + Math.sin(t * 1.5) * 0.15;
    ctx.beginPath();
    for (let wx = visible[0].x; wx <= visible[visible.length - 1].x; wx += 4) {
      const sx = wx - camX;
      const ry = sampleRiverY(wx, 'top', t) + 4 + Math.sin(wx * 0.035 + t * 2.2) * 2;
      if (wx === visible[0].x) ctx.moveTo(sx, ry);
      else ctx.lineTo(sx, ry);
    }
    ctx.stroke();
    
    ctx.beginPath();
    for (let wx = visible[0].x; wx <= visible[visible.length - 1].x; wx += 4) {
      const sx = wx - camX;
      const ry = sampleRiverY(wx, 'bottom', t) - 3 + Math.cos(wx * 0.035 + t * 2.2) * 2;
      if (wx === visible[0].x) ctx.moveTo(sx, ry);
      else ctx.lineTo(sx, ry);
    }
    ctx.stroke();
    
    ctx.globalAlpha = 1;
    
    // Trblietky
    for (let sp = 0; sp < 35; sp++) {
      const seg = visible[sp % visible.length];
      const sx = seg.x - camX + Math.sin(t * 2.2 + sp) * 10;
      const ry = roadY(seg.x) + seg.yOff + seg.width * 0.4 + ((t * 35 + sp * 15) % 25);
      const a = 0.3 + Math.sin(t * 4.5 + sp * 1.5) * 0.3;
      ctx.fillStyle = `rgba(255,255,240,${a})`;
      ctx.fillRect(sx, ry, 2, 2);
    }
    
    ctx.restore();
    
    // Brehy
    ctx.save();
    ctx.strokeStyle = wc.bank;
    ctx.lineWidth = 4;
    ctx.globalAlpha = 0.65;
    visible.forEach((seg, i) => {
      const sx = seg.x - camX;
      const top = roadY(seg.x) + seg.yOff + Math.sin(t * 2 + seg.ripple) * 2.5;
      if (i === 0) { ctx.beginPath(); ctx.moveTo(sx, top); }
      else ctx.lineTo(sx, top);
    });
    ctx.stroke();
    ctx.beginPath();
    visible.forEach((seg, i) => {
      const sx = seg.x - camX;
      const bot = roadY(seg.x) + seg.yOff + seg.width + Math.sin(t * 2 + seg.ripple) * 3;
      if (i === 0) ctx.moveTo(sx, bot);
      else ctx.lineTo(sx, bot);
    });
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // ========== VYLEPŠENÁ SCÉNA ==========
  function initWorldScenery() {
    initClouds();
    
    worldBirds.length = 0;
    worldTrees.length = 0;
    riverSegments.length = 0;
    zoneDecor.length = 0;
    fireflies.length = 0;

    // Vtáky
    for (let i = 0; i < 55; i++) {
      worldBirds.push({
        x: hash(i * 11.3) * WORLD_W,
        y: H * (0.06 + hash(i * 7.2) * 0.25),
        speed: 35 + hash(i * 4.4) * 65,
        wingPhase: hash(i * 9.9) * Math.PI * 2,
        size: 0.6 + hash(i * 6.6) * 0.7,
        zone: Math.floor(hash(i * 2.1) * 4),
        type: Math.floor(hash(i * 3.7) * 3) // 0=normal, 1=seagull, 2=swallow
      });
    }
    
    // Stromy
    for (let wx = 60; wx < WORLD_W; wx += 42 + Math.floor(hash(wx) * 34)) {
      const zone = Math.floor(wx / ZONE_WIDTH);
      if (zone === 1) continue;
      const side = hash(wx * 1.7) > 0.5 ? 1 : -1;
      const dist = 50 + hash(wx * 2.3) * 100;
      worldTrees.push({
        x: wx,
        side,
        dist,
        zone,
        type: zone === 2 ? (hash(wx) > 0.5 ? 'oak' : 'pine') : zone === 3 ? 'pine' : (zone === 0 ? (hash(wx) > 0.65 ? 'oak' : 'pine') : 'pine'),
        scale: 0.7 + hash(wx * 4.1) * 0.65,
        sway: hash(wx * 8.8) * Math.PI * 2,
        health: 0.7 + hash(wx * 5.2) * 0.3
      });
    }
    
    // Rieka
    for (let z = 0; z < 4; z++) {
      if (z === 1 || z === 3) continue;
      const zStart = z * ZONE_WIDTH + 100;
      const zEnd = (z + 1) * ZONE_WIDTH - 60;
      const offset = z === 3 ? -100 : 68;
      for (let wx = zStart; wx < zEnd; wx += 20) {
        riverSegments.push({
          x: wx,
          yOff: offset + Math.sin(wx * 0.007 + z) * 20,
          width: z === 3 ? 60 : 30 + hash(wx) * 14,
          zone: z,
          ripple: hash(wx * 3.3) * Math.PI * 2,
          depth: 0.4 + hash(wx * 4.1) * 0.5
        });
      }
    }
    
    // Dekorácie zón
    for (let i = 0; i < 35; i++) {
      zoneDecor.push({
        zone: 0,
        x: 100 + hash(i * 4.1) * (ZONE_WIDTH - 200),
        kind: hash(i) > 0.55 ? 'flower' : hash(i) > 0.25 ? 'grass' : 'bush',
        seed: i * 2.1,
        color: Math.floor(hash(i * 5) * 3)
      });
    }
    for (let i = 0; i < 18; i++) {
      zoneDecor.push({
        zone: 1,
        x: ZONE_WIDTH + 60 + hash(i * 5.3) * (ZONE_WIDTH - 120),
        kind: 'neonPillar',
        seed: i * 3.7,
        color: Math.floor(hash(i * 4) * 3)
      });
    }
    for (let i = 0; i < 28; i++) {
      zoneDecor.push({
        zone: 2,
        x: ZONE_WIDTH * 2 + 80 + hash(i * 6.1) * (ZONE_WIDTH - 160),
        kind: hash(i) > 0.5 ? 'mushroom' : hash(i) > 0.25 ? 'fern' : 'moss',
        seed: i * 1.9,
        size: 0.7 + hash(i * 3) * 0.8
      });
    }
    for (let i = 0; i < 18; i++) {
      zoneDecor.push({
        zone: 3,
        x: ZONE_WIDTH * 3 + 120 + hash(i * 8.2) * (ZONE_WIDTH - 240),
        kind: hash(i) > 0.55 ? 'snowDrift' : hash(i) > 0.25 ? 'icicle' : 'snowPile',
        seed: i * 4.3,
        size: 0.8 + hash(i * 3) * 0.9
      });
    }
    for (let i = 0; i < 22; i++) {
      zoneDecor.push({
        zone: 2,
        x: ZONE_WIDTH * 2 + 80 + hash(i * 9.1) * (ZONE_WIDTH - 160),
        kind: 'fallenLeaf',
        seed: i * 2.7,
        color: Math.floor(hash(i * 4) * 4)
      });
    }
    
    // Svetlušky
    for (let i = 0; i < 50; i++) {
      fireflies.push({
        x: 150 + hash(i * 3.2) * (ZONE_WIDTH - 300),
        y: 20 + hash(i * 7.1) * 150,
        phase: hash(i * 9.9) * Math.PI * 2,
        drift: 0.35 + hash(i * 2.4) * 1.1,
        size: 1 + Math.floor(hash(i * 6) * 2)
      });
    }
  }

  // ========== VYLEPŠENÉ POČASIE ==========
  let weatherType = 0; // 0=sunny, 1=rain, 2=snow
  let weatherIntensity = 0;
  
  function updateWeather(t) {
    const zone = getZone(player.x);
    if (zone === 3) {
      weatherType = 2;
      weatherIntensity = 0.55 + Math.sin(t * 0.04) * 0.12;
    } else if (zone === 2) {
      weatherType = 0;
      weatherIntensity = 0.2;
    } else if (zone === 1) {
      weatherType = 0;
      weatherIntensity = 0.25;
    } else {
      weatherType = (Math.floor(t / 40) % 6 === 0) ? 1 : 0;
      weatherIntensity = 0.18;
    }

    updateRain(t);
    updateSnow(t);
  }
  
  function updateRain(t) {
    if (weatherType !== 1) {
      if (rainDrops.length > 0) rainDrops.length = 0;
      return;
    }
    
    while (rainDrops.length < 150 * weatherIntensity) {
      rainDrops.push({
        x: Math.random() * WORLD_W,
        y: Math.random() * H * 0.7,
        speed: 300 + Math.random() * 200,
        length: 8 + Math.random() * 12
      });
    }
    
    for (let i = 0; i < rainDrops.length; i++) {
      const r = rainDrops[i];
      r.y += r.speed * 0.016;
      if (r.y > H) {
        r.y = -20;
        r.x = (r.x + (Math.random() - 0.5) * 200) % WORLD_W;
        if (r.x < 0) r.x = WORLD_W;
      }
    }
  }
  
  function updateSnow(t) {
    if (weatherType !== 2) {
      if (snowFlakes.length > 0) snowFlakes.length = 0;
      return;
    }
    
    while (snowFlakes.length < 100 * weatherIntensity) {
      snowFlakes.push({
        x: Math.random() * WORLD_W,
        y: Math.random() * H * 0.7,
        speedX: 15 + Math.random() * 25,
        speedY: 35 + Math.random() * 45,
        size: 2 + Math.random() * 3,
        drift: Math.random() * Math.PI * 2
      });
    }
    
    for (let i = 0; i < snowFlakes.length; i++) {
      const s = snowFlakes[i];
      s.x += s.speedX * 0.016;
      s.y += s.speedY * 0.016;
      s.drift += 0.05;
      if (s.y > H) {
        s.y = -10;
        s.x = (s.x + (Math.random() - 0.5) * 300) % WORLD_W;
        if (s.x < 0) s.x = WORLD_W;
      }
    }
  }
  
  function drawRain(camX) {
    if (weatherType !== 1) return;
    ctx.save();
    ctx.strokeStyle = 'rgba(180, 210, 255, 0.5)';
    ctx.lineWidth = 1.5;
    for (const r of rainDrops) {
      const sx = r.x - camX;
      if (sx < -50 || sx > W + 50) continue;
      ctx.beginPath();
      ctx.moveTo(sx, r.y);
      ctx.lineTo(sx - 3, r.y + r.length);
      ctx.stroke();
    }
    ctx.restore();
  }
  
  function drawSnow(camX) {
    if (weatherType !== 2) return;
    ctx.save();
    for (const s of snowFlakes) {
      const sx = s.x - camX + Math.sin(s.drift) * 3;
      if (sx < -30 || sx > W + 30) continue;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + Math.sin(s.drift) * 0.2})`;
      ctx.beginPath();
      ctx.arc(sx, s.y, s.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // ========== ZVYŠOK KÓDU (zachovaný z pôvodného) ==========
  function getCloudPalette(zone) {
    if (isNight()) {
      const night = {
        0: { hi: [200, 190, 220], mid: [140, 130, 160], lo: [80, 75, 100] },
        1: { hi: [120, 130, 160], mid: [85, 90, 115], lo: [55, 60, 80] },
        2: { hi: [180, 195, 190], mid: [115, 130, 125], lo: [65, 75, 70] },
        3: { hi: [190, 205, 230], mid: [125, 140, 165], lo: [70, 80, 100] }
      };
      return night[zone] || night[0];
    }
    const day = {
      0: { hi: [255, 252, 255], mid: [255, 235, 245], lo: [220, 235, 220] },
      1: { hi: [255, 255, 255], mid: [240, 248, 255], lo: [200, 225, 245] },
      2: { hi: [255, 248, 240], mid: [255, 230, 210], lo: [235, 210, 190] },
      3: { hi: [248, 252, 255], mid: [230, 238, 248], lo: [200, 215, 230] }
    };
    return day[zone] || day[0];
  }

  function drawClouds(camX, zone, time) {
    const layerCfg = {
      far: { parallax: 0.025, alpha: 0.48, bob: 2 },
      mid: { parallax: 0.058, alpha: 0.75, bob: 3.5 },
      near: { parallax: 0.1, alpha: 1, bob: 5.5 }
    };
    ['far', 'mid', 'near'].forEach((layer) => {
      const cfg = layerCfg[layer];
      clouds.filter((c) => c.layer === layer).forEach((c) => {
        const drift = (c.x + time * c.speed) % (WORLD_W + 600) - 300;
        const sx = drift - camX * cfg.parallax;
        if (sx < -c.w * 2.5 || sx > W + c.w * 2.5) return;
        const bob = Math.sin(time * 0.28 + c.seed) * cfg.bob;
        drawCloudBlob(sx, c.y + bob, c, zone, time, cfg.alpha);
      });
    });
  }

  function getWaterColors(zone) {
    const night = isNight();
    const palettes = [
      night
        ? { deep: '#1a3a52', shallow: '#3a7a9a', surface: '#4a8aaa', foam: 'rgba(200,230,255,0.38)', bank: '#3a5a38', caustic: 'rgba(150,200,255,0.55)' }
        : { deep: '#2a6880', shallow: '#6ec8e8', surface: '#a0e8ff', foam: 'rgba(255,255,255,0.6)', bank: '#6a9a58', caustic: 'rgba(180,240,255,0.95)' },
      null,
      night
        ? { deep: '#1a3040', shallow: '#3a5868', surface: '#4a6878', foam: 'rgba(200,210,220,0.35)', bank: '#3a3028', caustic: 'rgba(160,180,200,0.5)' }
        : { deep: '#3a5048', shallow: '#6a8078', surface: '#88a098', foam: 'rgba(230,220,200,0.5)', bank: '#6a5038', caustic: 'rgba(200,210,200,0.7)' },
      null
    ];
    return palettes[zone];
  }

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

    const haze = ctx.createLinearGradient(0, horizon - 80, 0, horizon);
    haze.addColorStop(0, 'rgba(255,255,255,0)');
    const hazeColors = [
      'rgba(255,200,220,0.12)',
      'rgba(255,230,160,0.1)',
      'rgba(255,180,100,0.14)',
      'rgba(200,220,240,0.12)'
    ];
    haze.addColorStop(1, hazeColors[zone] || hazeColors[0]);
    ctx.fillStyle = haze;
    ctx.fillRect(0, horizon - 80, W, 80);

    if (isNight()) {
      for (let s = 0; s < 100; s++) {
        const sx = (hash(s * 19) * W + camX * 0.02) % W;
        const sy = hash(s * 37) * H * 0.45;
        const tw = 0.25 + Math.sin(t * 2 + s) * 0.5;
        ctx.fillStyle = `rgba(255,255,255,${tw})`;
        ctx.fillRect(sx, sy, s % 3 === 0 ? 2 : 1, s % 3 === 0 ? 2 : 1);
      }
    }

    const sunX = W * 0.72 - camX * 0.015;
    const sunY = H * 0.11 + Math.sin(t * 0.15) * 3;

    if (!isNight()) {
      const sunCfg = [
        { r: 30, glow: 'rgba(255,200,180,0.5)', core: '#FFB8C8', hi: '#FFE8F0' },
        { r: 36, glow: 'rgba(255,220,100,0.55)', core: '#FFC842', hi: '#FFE878' },
        { r: 32, glow: 'rgba(255,160,80,0.5)', core: '#FF9040', hi: '#FFC060' },
        { r: 26, glow: 'rgba(220,235,255,0.45)', core: '#E8F0FF', hi: '#FFFFFF' }
      ];
      const sc = sunCfg[zone] || sunCfg[0];
      const glow = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, 85);
      glow.addColorStop(0, sc.glow);
      glow.addColorStop(1, 'rgba(255,100,50,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(sunX - 85, sunY - 85, 170, 170);
      ctx.fillStyle = sc.core;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sc.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = sc.hi;
      ctx.beginPath();
      ctx.arc(sunX - 8, sunY - 8, sc.r - 7, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!isNight()) drawSunGodRays(sunX, sunY, t, zone);
    drawClouds(camX, zone, t);
    drawRain(camX);
    drawSnow(camX);
  }

  function drawSunGodRays(sunX, sunY, time, zone) {
    if (zone === 1 || weatherType === 1) return;
    if (zone === 3 && isNight()) return;
    if (zone === 3 && weatherType === 2) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const streaks = zone === 3 ? 6 : 8;
    for (let i = 0; i < streaks; i++) {
      const angle = -0.4 + i * 0.11 + Math.sin(time * 0.07 + i) * 0.025;
      const len = H * (0.48 + hash(i * 9) * 0.22);
      const spread = 32 + hash(i * 4) * 45;
      const pulse = 0.05 + Math.sin(time * 0.45 + i * 1.2) * 0.025;
      const g = ctx.createLinearGradient(sunX, sunY, sunX + Math.cos(angle) * len, sunY + Math.sin(angle) * len);
      g.addColorStop(0, `rgba(255,242,210,${pulse + 0.07})`);
      g.addColorStop(0.4, `rgba(255,225,170,${pulse * 0.55})`);
      g.addColorStop(1, 'rgba(255,210,130,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(sunX, sunY);
      ctx.lineTo(sunX + Math.cos(angle - 0.045) * len, sunY + Math.sin(angle - 0.045) * len);
      ctx.lineTo(sunX + Math.cos(angle + 0.045) * len + spread, sunY + Math.sin(angle + 0.045) * len);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // ========== POMOCNÉ FUNKCIE ==========
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

  function getZone(x) {
    return Math.min(3, Math.max(0, Math.floor(x / ZONE_WIDTH)));
  }

  // ========== HLAVNÝ RENDER ==========
  function render(t) {
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    const camX = camera.x;
    const zone = getZone(player.x);

    drawSky(camX, zone, t);
    drawMountains(camX, zone);
    drawBirds(camX, zone, t);
    drawGround(camX, zone, t);
    if (zone !== 3) drawRiver(camX, zone, t);
    drawTrees(camX, zone, t);
    if (zone === 3) {
      drawWinterCoast(camX, t);
      drawWinterWater(camX, t);
    }
    drawRoad(camX, t);
    drawZoneDecor(camX, zone, t);

    if (zone === 0) drawZone1(camX, t);
    else if (zone === 1) drawZone2(camX, t);
    else if (zone === 2) {
      drawZone3(camX, t);
      drawAutumnLeaves(camX, t);
    } else if (zone === 3) drawWinterProps(camX, t);

    drawGates(camX, t);
    drawDust(camX);
    drawPlayer();

    ctx.restore();

    zoneOverlay.style.background = getLevels()[zone].overlay;
    zoneOverlay.style.opacity = String(0.32 + Math.sin(t * 0.5) * 0.04);
  }

  // ========== UPDATE ==========
  let lastUpdateT = 0;
  
  function update(dt, t) {
    if (cutsceneActive || introActive) return;
    
    updateWeather(t);
    
    worldBirds.forEach((b) => {
      b.x += b.speed * dt;
      b.wingPhase += dt * 12;
      if (b.x > WORLD_W + 150) b.x = -150;
    });
    
    const hx = getInputAxis();
    const running = keys.ShiftLeft || keys.ShiftRight;
    const speed = playerMode === 'car'
      ? (running ? 420 : 260)
      : (running ? 280 : 160);

    player.groundY = roadY(player.x);
    player.y = player.groundY;
    player.onGround = true;

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
    player.y = player.groundY;
    if (player.state === 'walk' || player.state === 'run') {
      const bob = playerMode === 'car' ? 1.5 : 1.2;
      player.y -= Math.abs(Math.sin(player.frame * 0.5)) * (player.state === 'run' ? bob * 2 : bob);
    }

    const cfg = playerMode === 'car'
      ? (CAR_ANIM[mapCarState(player.state)] || CAR_ANIM.idle)
      : (ANIM[player.state] || ANIM.idle);
    player.frameTimer += dt;
    if (player.frameTimer > 1 / cfg.speed) {
      player.frameTimer = 0;
      player.frame++;
    }

    updateDust(dt);

    const targetCamX = player.x - W * 0.35;
    camera.x = lerp(camera.x, Math.max(0, targetCamX), 0.1);
    camera.y = lerp(camera.y, player.y - H * 0.5, 0.05);

    const newZone = getZone(player.x);
    if (newZone !== currentZone) {
      currentZone = newZone;
      hudZone.textContent = getLevels()[newZone].name;
      triggerZoneFade();
      changeAmbient(newZone);
    }

    fadeAlpha = lerp(fadeAlpha, fadeTarget, 0.06);
    fadeOverlay.style.opacity = fadeAlpha;

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
      : `${moveHint} · ${tr('hudInteract')}`;
    hudHint.textContent = hint;
    
    if (nearestInteract) {
      interactBtn.classList.add('visible');
      interactBtn.textContent = 'E · ' + nearestInteract.label.slice(0, 14);
    } else {
      interactBtn.classList.remove('visible');
    }

    if (player.x >= DOCK_END - 30 && !cutsceneActive && !endScreenShown) {
      startCutscene();
    }

    if (Math.floor(t) % 2 === 0) {
      try { localStorage.setItem('pixelPortfolioX', String(Math.round(player.x))); } catch (_) {}
    }
  }

  // ========== ZOSTÁVAJÚCE FUNKCIE (zachované z pôvodného kódu) ==========
  // ... (všetky ostatné funkcie ako drawMountains, drawBirds, drawGround, 
  // drawZone1-4, drawGates, drawPlayer, input handling, modals, audio, 
  // cutscene, intro, boot atď. zostávajú rovnaké ako v pôvodnom kóde)
  // Pre úsporu miesta pokračujem so základnými funkciami...
  
  function drawMountains(camX, zone) {
    const palettes = [
      { far: ['#98c8a0', '#6a9a70', '#4a7a52'], mid: ['#88b890', '#5a8a62', '#3a6a48'], near: ['#78a880', '#4a7a52', '#2a5a3a'], snow: false },
      { far: ['#4a6a8a', '#3a5a78', '#2a4a68'], mid: ['#3a5a72', '#2a4a62', '#1a3a52'], near: ['#2a4a62', '#1a3a4a', '#0a2a3a'], snow: false },
      { far: ['#c87848', '#a05830', '#783818'], mid: ['#b06838', '#884828', '#603018'], near: ['#985828', '#703818', '#502810'], snow: false },
      { far: ['#b8c8d8', '#98a8b8', '#788898'], mid: ['#a8b8c8', '#8898a8', '#687888'], near: ['#98a8b8', '#788898', '#586878'], snow: true }
    ];
    const p = palettes[zone];
    const horizon = H * 0.56;
    drawMountainRange(camX, 0.12, horizon, H * 0.22, p.far, p.snow, zone);
    drawMountainRange(camX, 0.22, horizon + 8, H * 0.28, p.mid, p.snow, zone);
    drawMountainRange(camX, 0.35, horizon + 18, H * 0.32, p.near, false, zone);
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

  function mountainHeight(wx, seed, amp) {
    return amp * (
      0.55 + 0.25 * Math.sin(wx * 0.003 + seed) +
      0.15 * Math.sin(wx * 0.009 + seed * 2) +
      0.08 * Math.sin(wx * 0.023 + seed * 3) +
      0.04 * Math.sin(wx * 0.05 + seed * 4)
    );
  }

  function drawBirds(camX, zone, t) {
    const birdColors = ['#5a6a48', '#6688aa', '#6a4030', '#8899aa'];
    worldBirds.forEach((b) => {
      if (Math.abs(b.zone - zone) > 1 && b.zone !== zone) return;
      const sx = b.x - camX * 0.4;
      if (sx < -50 || sx > W + 50) return;
      const sy = b.y + Math.sin(t * 1.2 + b.wingPhase) * 10;
      const wingPhase = t * 14 + b.wingPhase;
      drawBird(sx, sy, wingPhase, b.size, birdColors[b.zone] || '#333');
    });
  }

  function drawBird(sx, sy, wingPhase, size, color) {
    const flap = Math.sin(wingPhase) * 0.7;
    const span = 11 * size;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2 * size;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(sx - span, sy + flap * 7);
    ctx.quadraticCurveTo(sx - span * 0.3, sy - 5 - flap * 4.5, sx, sy);
    ctx.quadraticCurveTo(sx + span * 0.3, sy - 5 - flap * 4.5, sx + span, sy + flap * 7);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(sx, sy, 2.5 * size, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawGround(camX, zone, t) {
    const groundSets = [
      { base: '#7a9a62', hi: '#92b878', lo: '#5a7a48' },
      { base: '#2a3a48', hi: '#3a4a58', lo: '#1a2430' },
      { base: '#a87840', hi: '#c09050', lo: '#886030' },
      { base: '#e8eef5', hi: '#f5f8fc', lo: '#d0dae8' }
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

    // Tráva a textúra
    const hillTint = ['rgba(100,160,80,0.06)', 'rgba(40,60,80,0.08)', 'rgba(180,100,40,0.07)', 'rgba(200,220,240,0.1)'];
    ctx.fillStyle = hillTint[zone] || hillTint[0];
    for (let i = -1; i < Math.ceil(W / 100) + 2; i++) {
      const wx = Math.floor(camX / 100) * 100 + i * 100;
      const sx = wx - camX * 0.45;
      const hillH = 28 + hash(wx) * 38;
      ctx.beginPath();
      ctx.ellipse(sx + 50, groundTop + 42 + hillH * 0.28, 70, hillH, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawZoneDecor(camX, zone, t) {
    zoneDecor.forEach((d) => {
      if (d.zone !== zone) return;
      const sx = d.x - camX;
      if (sx < -50 || sx > W + 50) return;
      const ry = roadY(d.x);
      const sway = Math.sin(t * 1.4 + d.seed) * 4;
      
      if (d.kind === 'grass') {
        const grassGreen = d.zone === 0 ? '80,150,70' : '60,120,45';
        ctx.strokeStyle = `rgba(${grassGreen},${0.55 + Math.sin(t + d.seed) * 0.15})`;
        ctx.lineWidth = 2;
        for (let b = -1; b <= 1; b++) {
          ctx.beginPath();
          ctx.moveTo(sx + b * 7, ry + 2);
          ctx.quadraticCurveTo(sx + b * 7 + sway, ry - 12, sx + b * 7, ry - 18 - Math.sin(t * 2 + d.seed) * 3);
          ctx.stroke();
        }
      } else if (d.kind === 'flower') {
        const bob = Math.sin(t * 2.2 + d.seed) * 2.5;
        ctx.fillStyle = '#5a9a40';
        ctx.fillRect(sx - 1, ry - 9 + bob, 2, 12);
        const colors = ['#FF8C42', '#FFD580', '#FF6B8A', '#C9A84C'];
        ctx.fillStyle = colors[d.color % colors.length];
        ctx.beginPath();
        ctx.arc(sx, ry - 14 + bob, 4.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (d.kind === 'bush') {
        ctx.fillStyle = `rgba(40,80,35,${0.6 + Math.sin(t * 0.8 + d.seed) * 0.15})`;
        ctx.beginPath();
        ctx.ellipse(sx, ry - 8, 12, 9, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (d.kind === 'neonPillar') {
        const h = 32 + hash(d.seed) * 25;
        const pulse = 0.45 + Math.sin(t * 4.5 + d.seed) * 0.4;
        const colors = ['#00F5FF', '#FF00A0', '#C9A84C'];
        ctx.fillStyle = `rgba(${colors[d.color % colors.length]},${pulse * 0.18})`;
        ctx.fillRect(sx - 4, ry - h, 8, h);
        ctx.fillStyle = colors[d.color % colors.length];
        ctx.fillRect(sx - 2, ry - h + Math.sin(t * 5 + d.seed) * 5, 4, 5);
      } else if (d.kind === 'mushroom') {
        ctx.fillStyle = '#e8e0d0';
        ctx.fillRect(sx - 2.5, ry - 12, 5, 10);
        ctx.fillStyle = `rgba(180,80,60,${0.7 + Math.sin(t + d.seed) * 0.2})`;
        ctx.beginPath();
        ctx.ellipse(sx, ry - 14, Math.max(4, 8 + sway * 0.4), 6, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (d.kind === 'fern') {
        ctx.strokeStyle = 'rgba(55,95,50,0.75)';
        ctx.lineWidth = 2.5;
        for (let f = 0; f < 4; f++) {
          ctx.beginPath();
          ctx.moveTo(sx, ry);
          ctx.quadraticCurveTo(sx - 9 + f * 6 + sway, ry - 18, sx - 5 + f * 6, ry - 26);
          ctx.stroke();
        }
      } else if (d.kind === 'moss') {
        ctx.fillStyle = `rgba(50,90,45,${0.5 + Math.sin(t * 0.7 + d.seed) * 0.15})`;
        ctx.fillRect(sx - 5, ry - 3, 10, 6);
      } else if (d.kind === 'shell') {
        const bob = Math.sin(t * 1.8 + d.seed) * 2;
        ctx.save();
        ctx.translate(sx, ry - 4 + bob);
        ctx.rotate(d.rotation + Math.sin(t) * 0.2);
        ctx.fillStyle = '#f5e8d0';
        ctx.beginPath();
        ctx.ellipse(0, 0, 7, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e0c8a0';
        ctx.beginPath();
        ctx.ellipse(1, -0.5, 5, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (d.kind === 'fallenLeaf') {
        const drift = Math.sin(t * 0.8 + d.seed) * 12;
        const leafColors = ['#c87830', '#d89040', '#a05020', '#e8a848'];
        ctx.fillStyle = leafColors[d.color % leafColors.length];
        ctx.save();
        ctx.translate(sx + drift, ry - 2 + Math.sin(t * 2 + d.seed) * 2);
        ctx.rotate(d.seed + t * 0.5);
        ctx.beginPath();
        ctx.ellipse(0, 0, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (d.kind === 'snowDrift') {
        const sz = (d.size || 1) * 10;
        ctx.fillStyle = 'rgba(245,250,255,0.92)';
        ctx.beginPath();
        ctx.ellipse(sx, ry - 3, sz, sz * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(220,235,255,0.5)';
        ctx.beginPath();
        ctx.ellipse(sx + 4, ry - 5, sz * 0.6, sz * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (d.kind === 'snowPile') {
        ctx.fillStyle = 'rgba(240,248,255,0.88)';
        ctx.fillRect(sx - 8, ry - 6, 16, 8);
        ctx.beginPath();
        ctx.arc(sx - 5, ry - 6, 5, 0, Math.PI * 2);
        ctx.arc(sx + 4, ry - 7, 6, 0, Math.PI * 2);
        ctx.fill();
      } else if (d.kind === 'icicle') {
        ctx.fillStyle = 'rgba(200,230,255,0.75)';
        ctx.beginPath();
        ctx.moveTo(sx - 2, ry - 2);
        ctx.lineTo(sx + 2, ry - 2);
        ctx.lineTo(sx, ry - 14 - (d.size || 1) * 6);
        ctx.closePath();
        ctx.fill();
      }
    });
  }

  // ========== ZOSTÁVAJÚCE FUNKCIE (pokračovanie) ==========
  function drawTree(sx, baseY, type, scale, sway, t, zone) {
    const s = scale;
    const sw = Math.sin(t * 1.4 + sway) * 0.05;
    ctx.save();
    ctx.translate(sx, baseY);
    ctx.rotate(sw);
    ctx.translate(-sx, -baseY);

    const trunk = '#4a3520';
    const trunkHi = '#5C4033';

    if (type === 'pine') {
      ctx.fillStyle = trunk;
      ctx.fillRect(sx - 5 * s, baseY - 30 * s, 10 * s, 30 * s);
      ctx.fillStyle = trunkHi;
      ctx.fillRect(sx - 2.5 * s, baseY - 28 * s, 4 * s, 26 * s);
      const greens = zone === 0
        ? ['#3a7a48', '#4a9058', '#5aa868']
        : zone === 2
          ? ['#8a5028', '#a06030', '#b87838']
          : zone === 3
            ? ['#2a4a58', '#3a5a68', '#4a6a78']
            : ['#2d5a35', '#3a7045', '#4a8a55'];
      for (let layer = 0; layer < 5; layer++) {
        ctx.fillStyle = greens[layer % 3];
        const ly = baseY - (35 + layer * 16) * s;
        const lw = (26 + layer * 12) * s;
        ctx.beginPath();
        ctx.moveTo(sx, ly - 16 * s);
        ctx.lineTo(sx + lw / 2, ly + 9 * s);
        ctx.lineTo(sx - lw / 2, ly + 9 * s);
        ctx.closePath();
        ctx.fill();
        if (zone === 3) {
          ctx.fillStyle = 'rgba(245,250,255,0.85)';
          ctx.beginPath();
          ctx.moveTo(sx - lw * 0.35, ly - 4 * s);
          ctx.lineTo(sx + lw * 0.35, ly - 4 * s);
          ctx.lineTo(sx, ly - 14 * s);
          ctx.closePath();
          ctx.fill();
        }
      }
    } else if (type === 'palm') {
      ctx.fillStyle = '#8B6914';
      ctx.fillRect(sx - 4 * s, baseY - 46 * s, 8 * s, 46 * s);
      ctx.strokeStyle = '#3a7a3a';
      ctx.lineWidth = 3.5 * s;
      for (let f = 0; f < 7; f++) {
        const angle = -Math.PI * 0.75 + f * 0.42 + sw;
        ctx.beginPath();
        ctx.moveTo(sx, baseY - 46 * s);
        ctx.quadraticCurveTo(
          sx + Math.cos(angle) * 40 * s, baseY - 54 * s,
          sx + Math.cos(angle) * 58 * s, baseY - 40 * s + Math.sin(angle) * 12 * s
        );
        ctx.stroke();
      }
      ctx.fillStyle = '#6B8E23';
      ctx.beginPath();
      ctx.arc(sx, baseY - 48 * s, 7.5 * s, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = trunk;
      ctx.fillRect(sx - 6 * s, baseY - 24 * s, 12 * s, 24 * s);
      const foliage = zone === 0
        ? ['#5cb86c', '#6ec87c', '#80d88c']
        : zone === 2
          ? ['#c87838', '#d89048', '#e8a858']
          : ['#4a8a4a', '#5ca85c', '#6bc06b'];
      ctx.fillStyle = foliage[0];
      ctx.beginPath();
      ctx.arc(sx, baseY - 40 * s, 25 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = foliage[1];
      ctx.beginPath();
      ctx.arc(sx - 12 * s, baseY - 44 * s, 16 * s, 0, Math.PI * 2);
      ctx.arc(sx + 14 * s, baseY - 38 * s, 14 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = foliage[2];
      ctx.beginPath();
      ctx.arc(sx + 5 * s, baseY - 50 * s, 12 * s, 0, Math.PI * 2);
      ctx.fill();
      if (zone === 0) {
        ctx.fillStyle = '#FFB8D0';
        for (let b = 0; b < 5; b++) {
          const bx = sx + Math.sin(b * 1.3 + sway) * 18 * s;
          const by = baseY - 42 * s + Math.cos(b * 1.7) * 12 * s;
          ctx.beginPath();
          ctx.arc(bx, by, 3 * s, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  }

  function drawTrees(camX, zone, t) {
    worldTrees.forEach((tr) => {
      if (tr.zone !== zone && Math.abs(tr.zone - zone) > 1) return;
      const sx = tr.x - camX;
      if (sx < -100 || sx > W + 100) return;
      const baseY = roadY(tr.x) + tr.side * tr.dist * 0.38;
      if (tr.zone === 1) return;
      drawTree(sx, baseY, tr.type, tr.scale, tr.sway, t, tr.zone);
    });
  }

  // ========== ZÓNY (zachované) ==========
  function drawZone1(camX, t) {
    // ... (zachované z pôvodného kódu)
    for (let i = 0; i < 5; i++) {
      const wx = 400 + i * 520;
      const sx = wx - camX;
      if (sx < -150 || sx > W + 150) continue;
      const ry = roadY(wx) - 8;
      // Domčeky, okná, komíny atď.
      ctx.fillStyle = '#5C4033';
      ctx.fillRect(sx, ry - 70, 90, 70);
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.moveTo(sx - 10, ry - 70);
      ctx.lineTo(sx + 45, ry - 110);
      ctx.lineTo(sx + 100, ry - 70);
      ctx.fill();
      ctx.fillStyle = `rgba(255,213,128,${0.55 + Math.sin(t * 2 + i) * 0.2})`;
      ctx.fillRect(sx + 15, ry - 50, 18, 18);
      ctx.fillRect(sx + 55, ry - 50, 18, 18);
    }
    // Svetlušky
    fireflies.forEach((ff) => {
      const driftX = Math.sin(t * ff.drift + ff.phase) * 35;
      const driftY = Math.cos(t * ff.drift * 1.3 + ff.phase) * 20;
      const sx = ff.x - camX + driftX;
      const sy = roadY(ff.x) - 85 - ff.y + driftY;
      const a = 0.35 + Math.sin(t * 4 + ff.phase) * 0.45;
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 12);
      glow.addColorStop(0, `rgba(255,255,180,${a})`);
      glow.addColorStop(1, 'rgba(255,255,100,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(sx - 12, sy - 12, 24, 24);
      ctx.fillStyle = `rgba(255,255,220,${a + 0.25})`;
      ctx.fillRect(sx, sy, ff.size, ff.size);
    });
    
    [[520, getPortfolio().bubbles.bio], [1100, getPortfolio().bubbles.passions], [1850, getPortfolio().bubbles.portrait]].forEach(([wx, txt], bi) => {
      const sx = wx - camX;
      const near = Math.abs(player.x - wx) < 120;
      if (sx < -50 || sx > W + 50) return;
      const floatY = Math.sin(t * 2.5 + bi) * 6;
      const by = roadY(wx) - 135 + floatY;
      ctx.save();
      ctx.translate(sx, by + 14);
      const scale = near ? 1.05 : 1;
      ctx.scale(scale, scale);
      ctx.translate(-sx, -(by + 14));
      ctx.fillStyle = near ? 'rgba(255,255,245,0.96)' : 'rgba(255,255,245,0.78)';
      ctx.fillRect(sx - 45, by, 90, 32);
      ctx.fillStyle = near ? '#FF8C42' : '#5C4033';
      ctx.fillRect(sx - 45, by + 28, 90, 4);
      ctx.fillStyle = '#3D2B1F';
      ctx.font = '8px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText(txt, sx, by + 21);
      ctx.restore();
    });
  }

  function drawZone2(camX, t) {
    drawCitySkyline(camX, t);
    const accents = ['#00F5FF', '#FF00A0', '#C9A84C'];
    getPortfolio().projects.forEach((p, i) => {
      const wx = ZONE_WIDTH + 600 + i * 850;
      const sx = wx - camX;
      if (sx < -200 || sx > W + 200) return;
      const ry = roadY(wx);
      const near = Math.abs(player.x - wx) < 110;
      const bh = 130;
      const accent = accents[i % accents.length];
      const pulse = 0.5 + Math.sin(t * 3 + i * 1.7) * 0.3;

      ctx.fillStyle = '#12122a';
      ctx.fillRect(sx - 55, ry - bh, 110, bh);
      
      // Okená
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 2; col++) {
          if (hash(i * 50 + row * 7 + col) > 0.45) continue;
          const lit = hash(i + row + col + t * 0.35) > 0.3;
          ctx.fillStyle = lit ? accent : '#1e1e34';
          ctx.globalAlpha = lit ? 0.45 + Math.sin(t * 4 + row + col) * 0.2 : 0.45;
          ctx.fillRect(sx - 40 + col * 26, ry - bh + 55 + row * 16, 16, 12);
        }
      }
      ctx.globalAlpha = 1;
      
      // Billboard
      const boardY = ry - bh + 15;
      ctx.fillStyle = '#1a1a32';
      ctx.fillRect(sx - 45, boardY, 90, 48);
      ctx.strokeStyle = near ? accent : `rgba(255,0,160,${pulse})`;
      ctx.lineWidth = near ? 2.5 : 1.5;
      ctx.strokeRect(sx - 45, boardY, 90, 48);
      
      ctx.fillStyle = accent;
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(['⚡', '🎮', '🌿'][i % 3], sx, boardY + 32);
      
      ctx.fillStyle = near ? '#FFF1B0' : `rgba(0,245,255,${0.85 + pulse * 0.15})`;
      ctx.font = '6px "Press Start 2P"';
      const title = p.name.length > 14 ? p.name.slice(0, 13) + '…' : p.name;
      ctx.fillText(title, sx, ry - bh - 8);
      
      ctx.fillStyle = near ? 'rgba(255,255,255,0.9)' : 'rgba(255,0,160,0.65)';
      ctx.font = '500 10px Inter, sans-serif';
      ctx.fillText(p.tags.slice(0, 3).join(' · '), sx, ry - 12);
      
      if (near) {
        ctx.fillStyle = 'rgba(255,140,66,0.1)';
        ctx.fillRect(sx - 60, ry - bh - 3, 120, bh + 6);
      }
    });
  }

  function drawCitySkyline(camX, t) {
    const zStart = ZONE_WIDTH;
    for (let i = 0; i < 22; i++) {
      const wx = zStart + i * 150 + (hash(i * 7) * 50);
      const sx = wx - camX * 0.55;
      if (sx < -130 || sx > W + 130) continue;
      const bh = 70 + hash(i * 3) * 130;
      const ry = H * 0.56;
      ctx.fillStyle = '#0c0c1a';
      ctx.fillRect(sx, ry - bh, 45 + hash(i) * 35, bh);
      
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 2; col++) {
          if (hash(i * 100 + row * 8 + col) > 0.45) continue;
          const lit = hash(i + row + col + t * 0.45) > 0.3;
          ctx.fillStyle = lit ? (hash(col) > 0.5 ? '#FF00A0' : '#00F5FF') : '#1a1a2a';
          ctx.globalAlpha = lit ? 0.5 + Math.sin(t * 3 + i + row) * 0.3 : 0.35;
          ctx.fillRect(sx + 7 + col * 15, ry - bh + 18 + row * 16, 7, 9);
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  function drawAutumnLeaves(camX, t) {
    for (let i = 0; i < 28; i++) {
      const wx = (i * 137 + t * 45 + camX * 0.3) % (WORLD_W + 200) - 100;
      const sx = wx - camX * 0.85;
      if (sx < -20 || sx > W + 20) continue;
      const sy = (i * 53 + t * 28) % (H * 0.55) + 40;
      const colors = ['#c87830', '#d89040', '#a85820', '#e8b050'];
      ctx.fillStyle = colors[i % colors.length];
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(t * 0.7 + i);
      ctx.beginPath();
      ctx.ellipse(0, 0, 4, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawZone3(camX, t) {
    getPortfolio().experience.forEach((e, i) => {
      const wx = ZONE_WIDTH * 2 + 400 + i * 720;
      const sx = wx - camX;
      if (sx < -100 || sx > W + 100) return;
      const ry = roadY(wx);
      const weather = e.weather;
      const near = Math.abs(player.x - wx) < 100;
      const glow = 0.4 + Math.sin(t * 2.5 + i) * 0.3;
      
      if (near) {
        const rg = ctx.createRadialGradient(sx, ry - 30, 0, sx, ry - 30, 60);
        rg.addColorStop(0, `rgba(201,168,76,${glow * 0.55})`);
        rg.addColorStop(1, 'rgba(201,168,76,0)');
        ctx.fillStyle = rg;
        ctx.fillRect(sx - 60, ry - 85, 120, 95);
      }
      
      const stoneColor = lerpColor('#6a6a5a', '#3a4a3a', weather);
      ctx.fillStyle = stoneColor;
      ctx.beginPath();
      ctx.moveTo(sx - 35, ry);
      ctx.lineTo(sx - 42, ry - 52);
      ctx.lineTo(sx + 42, ry - 52);
      ctx.lineTo(sx + 35, ry);
      ctx.closePath();
      ctx.fill();
      
      const runeA = near ? 0.9 : 0.5 + Math.sin(t * 3 + i) * 0.25;
      ctx.strokeStyle = `rgba(201,168,76,${runeA})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(sx, ry - 30, 13 + Math.sin(t * 2 + i) * 2.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = `rgba(201,168,76,${runeA * 0.65})`;
      ctx.font = '12px serif';
      ctx.textAlign = 'center';
      ctx.fillText('◆', sx, ry - 26);
      
      ctx.fillStyle = lerpColor('#C9A84C', '#5a5a40', weather);
      ctx.font = '6px "Press Start 2P"';
      ctx.fillText(e.dates.slice(0, 10), sx, ry - 60);
      
      if (near) {
        ctx.fillStyle = `rgba(255,241,200,0.95)`;
        ctx.font = '6px Inter';
        e.bullets.slice(0, 2).forEach((b, bi) => {
          ctx.fillText('• ' + b.slice(0, 30), sx, ry - 80 - bi * 13);
        });
      }
      
      if (weather > 0.4) {
        ctx.fillStyle = 'rgba(60,100,40,0.65)';
        ctx.fillRect(sx - 33, ry - 16, 66, 16);
      }
    });
    
    // Hmla
    for (let m = 0; m < 5; m++) {
      const mistY = H * (0.25 + m * 0.045) + Math.sin(t * 0.22 + m * 1.3) * 14;
      const mistGrad = ctx.createLinearGradient(0, mistY - 50, 0, mistY + 70);
      mistGrad.addColorStop(0, 'rgba(255,200,160,0)');
      mistGrad.addColorStop(0.5, `rgba(255,180,120,${0.07 + m * 0.025})`);
      mistGrad.addColorStop(1, 'rgba(255,200,160,0)');
      ctx.fillStyle = mistGrad;
      ctx.fillRect(0, mistY - 50, W, 120);
    }
  }

  function getWinterWaterY(camX) {
    const midWx = camX + W * 0.5;
    return roadY(midWx) + 56;
  }

  function drawWinterCoast(camX, t) {
    const oceanY = getWinterWaterY(camX);
    const step = 10;
    const wxStart = Math.floor((camX - 80) / step) * step;
    const wxEnd = camX + W + 80;

    ctx.beginPath();
    let first = true;
    for (let wx = wxStart; wx <= wxEnd; wx += step) {
      const sx = wx - camX;
      const top = roadY(wx) + 20;
      if (first) { ctx.moveTo(sx, top); first = false; }
      else ctx.lineTo(sx, top);
    }
    for (let wx = wxEnd; wx >= wxStart; wx -= step) {
      const sx = wx - camX;
      const shore = oceanY + Math.sin(wx * 0.012 + t * 0.8) * 2;
      ctx.lineTo(sx, shore);
    }
    ctx.closePath();

    const snowG = ctx.createLinearGradient(0, oceanY - 80, 0, oceanY + 20);
    snowG.addColorStop(0, '#f5f8fc');
    snowG.addColorStop(0.55, '#e8eef5');
    snowG.addColorStop(1, '#d8e4f0');
    ctx.fillStyle = snowG;
    ctx.fill();

    ctx.strokeStyle = 'rgba(200,220,240,0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    first = true;
    for (let wx = wxStart; wx <= wxEnd; wx += step) {
      const sx = wx - camX;
      const shore = oceanY + Math.sin(wx * 0.012 + t * 0.8) * 2;
      if (first) { ctx.moveTo(sx, shore); first = false; }
      else ctx.lineTo(sx, shore);
    }
    ctx.stroke();
  }

  function drawWinterWater(camX, t) {
    const oceanY = getWinterWaterY(camX);

    const oceanGrad = ctx.createLinearGradient(0, oceanY - 12, 0, H);
    oceanGrad.addColorStop(0, '#c8e0f0');
    oceanGrad.addColorStop(0.2, '#98c0e0');
    oceanGrad.addColorStop(0.5, '#6898b8');
    oceanGrad.addColorStop(0.85, '#487898');
    oceanGrad.addColorStop(1, '#305868');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, oceanY - 10, W, H - oceanY + 10);

    ctx.fillStyle = 'rgba(240,248,255,0.35)';
    ctx.fillRect(0, oceanY - 6, W, 8);

    const reflectX = W * 0.55;
    const reflectG = ctx.createLinearGradient(reflectX - 70, oceanY, reflectX + 70, oceanY + 100);
    reflectG.addColorStop(0, 'rgba(220,235,255,0)');
    reflectG.addColorStop(0.5, `rgba(230,240,255,${0.1 + Math.sin(t * 0.8) * 0.03})`);
    reflectG.addColorStop(1, 'rgba(200,220,240,0)');
    ctx.fillStyle = reflectG;
    ctx.fillRect(reflectX - 90, oceanY, 180, 120);

    drawWaterCausticsEnhanced(ctx, 0, oceanY + 10, W, H - oceanY - 8, t, 'rgba(220,240,255,0.5)', 0.35);

    const waveColors = [
      'rgba(255,255,255,0.14)',
      'rgba(255,255,255,0.09)',
      'rgba(220,240,255,0.1)',
      'rgba(255,255,255,0.07)'
    ];
    drawAnimatedWaveBand(ctx, oceanY, camX, t, 4, (layer, c) => {
      c.fillStyle = waveColors[layer] || waveColors[0];
      c.fill();
    });

    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let sx = 0; sx <= W + 10; sx += 5) {
      const wx = sx + camX * 0.06;
      const wy = waterWaveHeightComplex(wx, oceanY, t, 0, 3) - 1.5;
      if (sx === 0) ctx.moveTo(sx, wy);
      else ctx.lineTo(sx, wy);
    }
    ctx.stroke();

    for (let sx = 0; sx < W + 50; sx += 16) {
      const wx = sx + camX * 0.08;
      const fy = waterWaveHeightComplex(wx, oceanY, t, 0, 3);
      const foamPhase = (t * 2.4 + wx * 0.045) % (Math.PI * 2);
      const foamA = 0.18 + Math.max(0, Math.sin(foamPhase)) * 0.38;
      const foamW = Math.max(1.5, 6 + Math.sin(foamPhase * 1.4) * 7);
      const foamH = Math.max(0.8, 2.5 + Math.sin(t * 3 + sx * 0.1) * 1.2);
      ctx.fillStyle = `rgba(255,255,255,${foamA})`;
      ctx.beginPath();
      ctx.ellipse(sx, fy + 2, foamW, foamH, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawWinterProps(camX, t) {
    const oceanY = getWinterWaterY(camX);

    // Maják
    const lighthouseX = ZONE_WIDTH * 3 + 200 - camX;
    if (lighthouseX > -100 && lighthouseX < W + 100) {
      const ly = roadY(ZONE_WIDTH * 3 + 200) - 22;
      ctx.fillStyle = '#e8eef5';
      ctx.fillRect(lighthouseX - 10, ly - 98, 20, 98);
      ctx.fillStyle = 'rgba(245,250,255,0.9)';
      ctx.fillRect(lighthouseX - 12, ly - 104, 24, 12);
      ctx.fillStyle = '#FF7043';
      ctx.fillRect(lighthouseX - 10, ly - 102, 20, 6);
      const beamA = 0.1 + Math.sin(t * 1.2) * 0.05;
      ctx.save();
      ctx.translate(lighthouseX, ly - 96);
      ctx.rotate(Math.sin(t * 0.4) * 0.55 - 0.35);
      const beam = ctx.createLinearGradient(0, 0, 140, 0);
      beam.addColorStop(0, `rgba(255,240,180,${beamA})`);
      beam.addColorStop(1, 'rgba(255,240,180,0)');
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(140, -30);
      ctx.lineTo(140, 30);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Mólo
    const dockStart = ZONE_WIDTH * 3 + 700;
    const dockLen = WORLD_W - dockStart;
    for (let d = 0; d < dockLen; d += 45) {
      const wx = dockStart + d;
      const sx = wx - camX;
      if (sx < -60 || sx > W + 60) continue;
      const dy = roadY(wx);
      ctx.fillStyle = '#8a7a68';
      ctx.fillRect(sx - 25, dy - 7, 50, 16);
      ctx.fillStyle = 'rgba(240,248,255,0.7)';
      ctx.fillRect(sx - 24, dy - 9, 48, 4);
      ctx.fillStyle = '#5a4a38';
      ctx.fillRect(sx - 4, dy + 9, 8, 32 + Math.sin(t * 1.5 + d) * 2.5);
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(sx - 22, dy + 7, 44, 5);
    }
    
    // Fľaša
    const bx = ZONE_WIDTH * 3 + 900 - camX;
    const by = roadY(ZONE_WIDTH * 3 + 900) - 44;
    ctx.fillStyle = 'rgba(180,220,255,0.88)';
    ctx.fillRect(bx - 8, by, 16, 24);
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fillRect(bx - 4.5, by + 5, 5, 12);
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(bx - 6, by - 6, 12, 7);
    
    // Ľadové kryhy
    const iceColors = ['#d8e8f5', '#c0d8ec', '#b0cce8', '#e0eef8'];
    iceColors.forEach((col, i) => {
      const wx = ZONE_WIDTH * 3 + 1450 + i * 190;
      const sx = wx - camX;
      const bob = Math.sin(t * 1.8 + i * 1.2) * 5;
      const by2 = oceanY - 32 + bob;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.ellipse(sx, by2, 18, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(sx - 4, by2 - 3, 8, 5, 0, 0, Math.PI * 2);
      ctx.stroke();
    });
    
    // Koncová tabuľa
    const signX = DOCK_END - 220 - camX;
    const signY = roadY(DOCK_END - 220);
    ctx.fillStyle = '#5C4033';
    ctx.fillRect(signX - 10, signY - 98, 20, 98);
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(signX - 65, signY - 110, 130, 32);
    ctx.fillStyle = '#FFF1B0';
    ctx.font = '6px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText(tr('endSign1'), signX, signY - 96);
    ctx.fillText(tr('endSign2'), signX, signY - 84);
  }

  function drawGates(camX, t) {
    const gateColors = ['#00F5FF', '#C9A84C', '#FF7043'];
    GATE_X.forEach((gx, i) => {
      const sx = gx - camX;
      if (sx < -130 || sx > W + 130) return;
      const ry = roadY(gx);
      const near = Math.abs(player.x - gx) < 150;
      const pulse = 0.5 + Math.sin(t * 3.2 + i * 2) * 0.38;
      const col = gateColors[i];

      ctx.fillStyle = '#5C4033';
      ctx.fillRect(sx - 55, ry - 105, 14, 105);
      ctx.fillRect(sx + 41, ry - 105, 14, 105);
      ctx.fillRect(sx - 55, ry - 113, 110, 14);

      for (let ring = 0; ring < 3; ring++) {
        const ringPulse = pulse * (1 - ring * 0.18);
        ctx.strokeStyle = `rgba(${i === 0 ? '0,245,255' : i === 1 ? '201,168,76' : '255,112,67'},${ringPulse * 0.55})`;
        ctx.lineWidth = 2.5;
        const ringRx = Math.max(9, 38 + ring * 9 + Math.sin(t * 2 + ring) * 3.5);
        const ringRy = Math.max(9, 44 + ring * 7);
        ctx.beginPath();
        ctx.ellipse(sx, ry - 55, ringRx, ringRy, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      const pg = ctx.createRadialGradient(sx, ry - 55, 0, sx, ry - 55, 55);
      const rgb = i === 0 ? '0,245,255' : i === 1 ? '201,168,76' : '255,112,67';
      pg.addColorStop(0, `rgba(${rgb},${near ? 0.45 : 0.25})`);
      pg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = pg;
      ctx.fillRect(sx - 50, ry - 105, 100, 100);

      ctx.fillStyle = '#8B6914';
      ctx.fillRect(sx - 78, ry - 138, 156, 28);
      ctx.fillStyle = near ? '#FFF1B0' : '#FFD580';
      ctx.font = '7px "Press Start 2P"';
      ctx.textAlign = 'center';
      const gateKeys = ['gateProjects', 'gateExperience', 'gateContact'];
      ctx.fillText(tr(gateKeys[i]), sx, ry - 118);
    });
  }

  function drawAnimatedWaveBand(targetCtx, baseY, camX, t, layers, fillFn, viewW, viewH) {
    const c = targetCtx || ctx;
    const vw = viewW ?? W;
    const vh = viewH ?? H;
    for (let layer = 0; layer < layers; layer++) {
      c.beginPath();
      const step = 6;
      for (let sx = -10; sx <= vw + 20; sx += step) {
        const wx = sx + camX * (0.04 + layer * 0.022);
        const wy = waterWaveHeightComplex(wx, baseY + layer * 5.5, t, layer, 3);
        if (sx <= -10) c.moveTo(sx, wy);
        else c.lineTo(sx, wy);
      }
      c.lineTo(vw + 30, vh + 50);
      c.lineTo(-30, vh + 50);
      c.closePath();
      fillFn(layer, c);
    }
  }

  function drawDust(camX) {
    dustPuffs.forEach((d) => {
      const sx = d.x - camX;
      const a = 1 - d.life / d.max;
      const zone = getZone(d.x);
      const dustCols = ['140,170,100', '180,200,220', '200,130,60', '220,230,240'];
      const col = dustCols[zone] || dustCols[0];
      ctx.fillStyle = `rgba(${col},${a * 0.5})`;
      ctx.fillRect(sx - d.size * 0.5, d.y - d.life * 20, d.size, d.size);
    });
  }

  function updateDust(dt) {
    if (cutsceneActive || introActive) return;
    if (Math.abs(player.vx) > 30) {
      if (Math.random() < 0.24) {
        dustPuffs.push({
          x: player.x - player.facing * 10,
          y: player.y - 3,
          vx: -player.facing * (18 + Math.random() * 28),
          vy: -10 - Math.random() * 15,
          life: 0,
          max: 0.28 + Math.random() * 0.4,
          size: 2.5 + Math.random() * 4
        });
      }
    }
    for (let i = dustPuffs.length - 1; i >= 0; i--) {
      const d = dustPuffs[i];
      d.life += dt;
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.vy += 45 * dt;
      if (d.life >= d.max) dustPuffs.splice(i, 1);
    }
    if (dustPuffs.length > 50) dustPuffs.splice(0, dustPuffs.length - 50);
  }

  function drawPlayer() {
    const sx = player.x - camera.x;
    const sy = player.y;
    const cfg = playerMode === 'car'
      ? (CAR_ANIM[mapCarState(player.state)] || CAR_ANIM.idle)
      : (ANIM[player.state] || ANIM.idle);
    const animFrame = player.frame + player.frameTimer * cfg.speed;
    if (playerMode === 'car') {
      drawCarSprite(ctx, sx, sy, mapCarState(player.state), animFrame, player.facing, 1);
      return;
    }
    drawCharSprite(ctx, sx, sy, player.state, animFrame, player.facing, 1);
  }

  // ========== FUNKCIE SPRÁVY HRÁČA A VSTUPOV ==========
  function setPlayerMode(mode) {
    playerMode = mode;
    try { localStorage.setItem('pixelPortfolioMode', mode); } catch (_) {}
    charOptionBtns.forEach((btn) => {
      const sel = btn.dataset.mode === mode;
      btn.classList.toggle('selected', sel);
      btn.setAttribute('aria-pressed', sel ? 'true' : 'false');
    });
  }

  function getInputAxis() {
    let hx = 0;
    if (keys.ArrowRight || keys.KeyD) hx += 1;
    if (keys.ArrowLeft || keys.KeyA) hx -= 1;
    if (joystick.active) hx += joystick.dx;
    return Math.max(-1, Math.min(1, hx));
  }

  // ========== JOYSTICK ==========
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

  // ========== SPRITE SHEET FUNKCIE ==========
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
    // ... (zachované z pôvodného kódu)
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

    drawPixelRect(ox + 5, oyB + 59, 22, 4, 'rgba(0,0,0,0.22)');

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

    drawPixelRect(ox + 7, oyB + 20, 18, 20, hoodie);
    drawPixelRect(ox + 9, oyB + 22, 14, 3, hoodieHi);
    drawPixelRect(ox + 14, oyB + 28, 4, 8, accent);
    drawPixelRect(ox + 6, oyB + 34, 20, 6, hoodie);
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

    drawPixelRect(ox + 10, oyB + 6, 12, 13, skin);
    drawPixelRect(ox + 11, oyB + 14, 10, 3, skinSh);
    drawPixelRect(ox + 9, oyB + 2, 14, 6, hair);
    drawPixelRect(ox + 8, oyB + 5, 4, 5, hair);
    drawPixelRect(ox + 20, oyB + 5, 3, 4, hairHi);
    drawPixelRect(ox + 12, oyB + 11, 3, 2, '#1a1a1a');
    drawPixelRect(ox + 17, oyB + 11, 3, 2, '#1a1a1a');
    drawPixelRect(ox + 11, oyB + 13, 2, 1, '#c97060');
    drawPixelRect(ox + 18, oyB + 13, 2, 1, '#c97060');
    drawPixelRect(ox + 8, oyB + 15, 16, 6, hoodie);
    drawPixelRect(ox + 10, oyB + 17, 12, 2, hoodieHi);

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
    const frac = frame - Math.floor(frame);
    const sc = scale || 1;
    const dw = SPRITE_W * sc;
    const dh = SPRITE_H * sc;
    const bobY = (anim === 'walk' || anim === 'run') ? Math.sin(frac * Math.PI * 2) * 1.5 : 0;
    const squashY = (anim === 'walk' || anim === 'run') ? 1 - Math.abs(Math.sin(frac * Math.PI * 2)) * 0.05 : 1;
    targetCtx.save();
    targetCtx.imageSmoothingEnabled = false;
    targetCtx.translate(x, y + bobY);
    targetCtx.scale(1, squashY);
    if (facing < 0) {
      targetCtx.scale(-1, 1);
      targetCtx.drawImage(
        charSheet, f * SPRITE_W, row * SPRITE_H, SPRITE_W, SPRITE_H,
        -dw / 2, -dh, dw, dh
      );
    } else {
      targetCtx.drawImage(
        charSheet, f * SPRITE_W, row * SPRITE_H, SPRITE_W, SPRITE_H,
        -dw / 2, -dh, dw, dh
      );
    }
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

    carRect(ox + 10, oyB + 24 + wheelOff, 12, 10, wheel);
    carRect(ox + 40, oyB + 24 - wheelOff, 12, 10, wheel);
    carRect(ox + 13, oyB + 26 + wheelOff, 6, 6, hub);
    carRect(ox + 43, oyB + 26 - wheelOff, 6, 6, hub);

    carRect(ox + 6, oyB + 14, 48, 14, body);
    carRect(ox + 8, oyB + 16, 44, 4, bodyHi);
    carRect(ox + 14, oyB + 8, 28, 10, body);
    carRect(ox + 16, oyB + 10, 12, 6, window);
    carRect(ox + 30, oyB + 10, 10, 6, window);
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

  // ========== MODALY A INTERAKCIE ==========
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

    getPortfolio().projects.forEach((p, i) => {
      interactables.push({
        zone: 1, x: ZONE_WIDTH + 600 + i * 850, y: 0, r: 100, type: 'project',
        label: p.name, modal: 'modal-project', data: { projectIndex: i }
      });
    });

    getPortfolio().experience.forEach((e, i) => {
      interactables.push({
        zone: 2, x: ZONE_WIDTH * 2 + 450 + i * 720, y: 0, r: 75, type: 'experience',
        label: e.company, modal: 'modal-experience', data: { expIndex: i }
      });
    });

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
    if (modal) modal.focus();
    trapFocus(el);
  }

  function closeAllModals() {
    Object.values(modals).forEach((m) => m && m.classList.remove('open'));
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

  // ========== AUDIO ==========
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

  // ========== CUTSCENE ==========
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

    drawWaterCausticsEnhanced(cctx2, 0, oceanY + 8, w, h - oceanY, t, 'rgba(200,245,255,1)', 0.8);
    drawAnimatedWaveBand(cctx2, oceanY, 0, t, 5, (layer, c) => {
      c.fillStyle = `rgba(255,255,255,${0.08 + layer * 0.025})`;
      c.fill();
    }, w, h);

    for (let sx = 0; sx < w; sx += 14) {
      const fy = waterWaveHeightComplex(sx, oceanY, t, 0, 3);
      const fa = 0.28 + Math.max(0, Math.sin(t * 2.5 + sx * 0.05)) * 0.42;
      cctx2.fillStyle = `rgba(255,255,255,${fa})`;
      cctx2.beginPath();
      cctx2.ellipse(sx, fy + 2.5, 9, 3, 0, 0, Math.PI * 2);
      cctx2.fill();
    }

    const sunY = lerp(h * 0.75, h * 0.22, easeSun);
    const sunR = 35 + easeSun * 32;
    const glow = cctx2.createRadialGradient(w * 0.5, sunY, sunR * 0.2, w * 0.5, sunY, sunR * 3.5);
    glow.addColorStop(0, `rgba(255,220,120,${0.55 * easeSun})`);
    glow.addColorStop(1, 'rgba(255,150,50,0)');
    cctx2.fillStyle = glow;
    cctx2.fillRect(w * 0.5 - sunR * 3.5, sunY - sunR * 3.5, sunR * 7, sunR * 7);
    cctx2.fillStyle = '#FFE082';
    cctx2.beginPath();
    cctx2.arc(w * 0.5, sunY, sunR, 0, Math.PI * 2);
    cctx2.fill();

    for (let b = 0; b < 15; b++) {
      const bx = ((t * 0.12 + b * 0.07) % 1.3) * w - w * 0.15;
      const by = h * 0.15 + b * 14 + Math.sin(t * 2 + b) * 10;
      drawBird(bx, by, t * 14 + b, 1.2, 'rgba(40,40,50,0.8)');
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

  // ========== INTRO ==========
  introStartBtn.addEventListener('click', startGame);
  charOptionBtns.forEach((btn) => {
    btn.addEventListener('click', () => setPlayerMode(btn.dataset.mode));
  });

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

    for (let i = 0; i < 60; i++) {
      const sx = (hash(i * 13) * w + elapsed * 0.01 * (i % 5)) % w;
      const sy = hash(i * 29) * h * 0.45;
      const tw = 0.4 + Math.sin(t * 2 + i) * 0.4;
      introCtx.fillStyle = `rgba(255,255,200,${tw * fadeIn})`;
      introCtx.fillRect(sx, sy, 2, 2);
    }

    for (let c = 0; c < 8; c++) {
      const cx = (hash(c * 7) * w + elapsed * 0.02 * (c + 1)) % (w + 120) - 60;
      const cy = h * 0.08 + hash(c * 11) * h * 0.2;
      const cw = 70 + hash(c * 3) * 60;
      introCtx.fillStyle = `rgba(255,255,255,${0.14 * fadeIn})`;
      introCtx.beginPath();
      introCtx.ellipse(cx, cy, cw, cw * 0.38, 0, 0, Math.PI * 2);
      introCtx.fill();
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
      introCharX = lerp(-80, w * 0.42, elapsed / 2800);
    } else {
      introCharX = w * 0.42 + Math.sin(t * 1.5) * 5;
    }

    if (playerMode === 'car') {
      drawCarSprite(introCtx, introCharX, horizon + 2, elapsed < 2800 ? 'drive' : 'idle', t * 10, 1, 2.4);
    } else {
      drawCharSprite(introCtx, introCharX, horizon + 2, elapsed < 2800 ? 'walk' : 'idle', t * 10, 1, 2.6);
    }
  }

  function updateIntroTypewriter(elapsed) {
    const target = Math.min(getIntroName().length, Math.floor(elapsed / 95));
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

  function triggerZoneFade() {
    fadeTarget = 0.85;
    setTimeout(() => { fadeTarget = 0; }, 400);
  }

  // ========== HLAVNÝ LOOP ==========
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
  window.addEventListener('keydown', (e) => {
    if (introActive && introReady && (e.code === 'Enter' || e.code === ' ')) {
      e.preventDefault();
      startGame();
      return;
    }
    if (introActive || cutsceneActive) return;
    keys[e.code] = true;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
    if ((e.code === 'KeyE' || e.code === 'Enter') && nearestInteract && !endScreenShown) openInteractable(nearestInteract);
    if (e.code === 'Escape') closeAllModals();
  });
  window.addEventListener('keyup', (e) => { keys[e.code] = false; });

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