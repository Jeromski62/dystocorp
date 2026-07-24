"use client";

import { useEffect, useRef } from "react";

// Rain-on-glass canvas effect, ported from the design handoff's `Raindrops`
// class (itself adapted from the codrops "rain on glass" demo) — copied
// near-verbatim per the handoff's porting note, only trading the original
// multi-canvas DCLogic boot loop for a single canvas + one React effect.
type Drop = {
  x: number;
  y: number;
  r: number;
  spreadX: number;
  spreadY: number;
  momentum: number;
  momentumX: number;
  lastSpawn: number;
  nextSpawn: number;
  parent: Drop | null;
  isNew: boolean;
  killed: boolean;
  shrink: number;
};

const DROP_DEFAULTS: Drop = {
  x: 0,
  y: 0,
  r: 0,
  spreadX: 0,
  spreadY: 0,
  momentum: 0,
  momentumX: 0,
  lastSpawn: 0,
  nextSpawn: 0,
  parent: null,
  isNew: true,
  killed: false,
  shrink: 0,
};

const DROP_SIZE = 64;

const DEFAULT_OPTIONS = {
  minR: 8,
  maxR: 30,
  maxDrops: 500,
  rainChance: 0.28,
  rainLimit: 3,
  dropletsRate: 40,
  dropletsSize: [1.5, 3.2] as [number, number],
  dropletsCleaningRadiusMultiplier: 0.4,
  // continuously fades the static "fogged glass" droplet layer so it settles
  // into a steady state instead of accumulating forever (looked like a chalky
  // film building up over long-running sessions before this was added)
  dropletsDecay: 0.0035,
  raining: true,
  globalTimeScale: 1,
  trailRate: 1,
  autoShrink: true,
  spawnArea: [-0.1, 0.95] as [number, number],
  trailScaleRange: [0.2, 0.45] as [number, number],
  collisionRadius: 0.45,
  collisionRadiusIncrease: 0.0002,
  dropFallMultiplier: 1,
  collisionBoostMultiplier: 0.05,
  collisionBoost: 1,
};

function random(from: number | null = null, to: number | null = null, interp: ((n: number) => number) | null = null) {
  if (from == null) {
    from = 0;
    to = 1;
  } else if (from != null && to == null) {
    to = from;
    from = 0;
  }
  const delta = to! - from;
  const fn = interp ?? ((n: number) => n);
  return from + fn(Math.random()) * delta;
}

const chance = (c: number) => random() <= c;
const times = (n: number, f: (i: number) => void) => {
  for (let i = 0; i < n; i++) f(i);
};
const createCanvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};

class Raindrops {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  scale: number;
  dropAlpha: HTMLImageElement;
  dropColor: HTMLImageElement;
  dropletsPixelDensity = 1;
  dropletsCounter = 0;
  lastRender: number | null = null;
  options: typeof DEFAULT_OPTIONS;
  ctx: CanvasRenderingContext2D;
  droplets: HTMLCanvasElement;
  dropletsCtx: CanvasRenderingContext2D;
  drops: Drop[] = [];
  dropLook: HTMLCanvasElement | null = null;
  clearDropletsGfx: HTMLCanvasElement | null = null;
  tint: string;

  constructor(
    canvas: HTMLCanvasElement,
    scale: number,
    dropAlpha: HTMLImageElement,
    dropColor: HTMLImageElement,
    tint: string,
    options: Partial<typeof DEFAULT_OPTIONS> = {},
  ) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.scale = scale;
    this.dropAlpha = dropAlpha;
    this.dropColor = dropColor;
    this.tint = tint;
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    this.ctx = canvas.getContext("2d")!;
    this.droplets = createCanvas(this.width * this.dropletsPixelDensity, this.height * this.dropletsPixelDensity);
    this.dropletsCtx = this.droplets.getContext("2d")!;
    this.renderDropsGfx();
  }

  deltaR() {
    return this.options.maxR - this.options.minR;
  }
  area() {
    return (this.width * this.height) / this.scale;
  }
  areaMultiplier() {
    return Math.sqrt(this.area() / (1024 * 768));
  }

  drawDroplet(x: number, y: number, r: number) {
    this.drawDrop(this.dropletsCtx, {
      ...DROP_DEFAULTS,
      x: x * this.dropletsPixelDensity,
      y: y * this.dropletsPixelDensity,
      r: r * this.dropletsPixelDensity,
    });
  }

  renderDropsGfx() {
    const s = DROP_SIZE;
    const look = createCanvas(s, s);
    const c = look.getContext("2d")!;
    c.drawImage(this.dropAlpha, 0, 0, s, s);
    c.globalCompositeOperation = "source-in";
    c.fillStyle = `rgba(${this.tint},0.13)`;
    c.fillRect(0, 0, s, s);
    c.globalCompositeOperation = "source-atop";
    const rim = c.createRadialGradient(s * 0.5, s * 0.72, 2, s * 0.5, s * 0.72, s * 0.52);
    rim.addColorStop(0, "rgba(216,233,255,0.55)");
    rim.addColorStop(1, "rgba(216,233,255,0)");
    c.fillStyle = rim;
    c.fillRect(0, 0, s, s);
    const hi = c.createRadialGradient(s * 0.36, s * 0.3, 0, s * 0.36, s * 0.3, s * 0.26);
    hi.addColorStop(0, "rgba(255,255,255,0.9)");
    hi.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = hi;
    c.fillRect(0, 0, s, s);
    const sh = c.createLinearGradient(0, 0, 0, s);
    sh.addColorStop(0, "rgba(8,12,18,0.32)");
    sh.addColorStop(0.55, "rgba(8,12,18,0)");
    c.fillStyle = sh;
    c.fillRect(0, 0, s, s);
    this.dropLook = look;

    this.clearDropletsGfx = createCanvas(128, 128);
    const clearCtx = this.clearDropletsGfx.getContext("2d")!;
    clearCtx.fillStyle = "#000";
    clearCtx.beginPath();
    clearCtx.arc(64, 64, 64, 0, Math.PI * 2);
    clearCtx.fill();
  }

  drawDrop(ctx: CanvasRenderingContext2D, drop: Drop) {
    if (!this.dropLook) return;
    const { x, y, r, spreadX, spreadY } = drop;
    const scaleX = 1;
    const scaleY = 1.5;
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(
      this.dropLook,
      (x - r * scaleX * (spreadX + 1)) * this.scale,
      (y - r * scaleY * (spreadY + 1)) * this.scale,
      r * 2 * scaleX * (spreadX + 1) * this.scale,
      r * 2 * scaleY * (spreadY + 1) * this.scale,
    );
  }

  clearDroplets(x: number, y: number, r = 30) {
    const ctx = this.dropletsCtx;
    ctx.globalCompositeOperation = "destination-out";
    ctx.drawImage(
      this.clearDropletsGfx!,
      (x - r) * this.dropletsPixelDensity * this.scale,
      (y - r) * this.dropletsPixelDensity * this.scale,
      r * 2 * this.dropletsPixelDensity * this.scale,
      r * 2 * this.dropletsPixelDensity * this.scale * 1.5,
    );
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  createDrop(options: Partial<Drop>): Drop | null {
    if (this.drops.length >= this.options.maxDrops * this.areaMultiplier()) return null;
    return { ...DROP_DEFAULTS, ...options };
  }

  updateRain(timeScale: number) {
    const rainDrops: Drop[] = [];
    if (this.options.raining) {
      const limit = this.options.rainLimit * timeScale * this.areaMultiplier();
      let count = 0;
      while (chance(this.options.rainChance * timeScale * this.areaMultiplier()) && count < limit) {
        count++;
        const r = random(this.options.minR, this.options.maxR, (n) => Math.pow(n, 3));
        const rainDrop = this.createDrop({
          x: random(this.width / this.scale),
          y: random((this.height / this.scale) * this.options.spawnArea[0], (this.height / this.scale) * this.options.spawnArea[1]),
          r,
          momentum: 1 + (r - this.options.minR) * 0.1 + random(2),
          spreadX: 1.5,
          spreadY: 1.5,
        });
        if (rainDrop != null) rainDrops.push(rainDrop);
      }
    }
    return rainDrops;
  }

  updateDroplets(timeScale: number) {
    // fade the accumulated droplet texture a little every frame, so it
    // settles at a steady state instead of building up indefinitely
    this.dropletsCtx.globalCompositeOperation = "destination-out";
    this.dropletsCtx.fillStyle = `rgba(0,0,0,${this.options.dropletsDecay * timeScale})`;
    this.dropletsCtx.fillRect(0, 0, this.width * this.dropletsPixelDensity, this.height * this.dropletsPixelDensity);

    if (this.options.raining) {
      this.dropletsCounter += this.options.dropletsRate * timeScale * this.areaMultiplier();
      times(this.dropletsCounter, () => {
        this.dropletsCounter--;
        this.drawDroplet(
          random(this.width / this.scale),
          random(this.height / this.scale),
          random(this.options.dropletsSize[0], this.options.dropletsSize[1], (n) => n * n),
        );
      });
    }
    this.ctx.drawImage(this.droplets, 0, 0, this.width, this.height);
  }

  updateDrops(timeScale: number) {
    let newDrops: Drop[] = [];
    this.updateDroplets(timeScale);
    newDrops = newDrops.concat(this.updateRain(timeScale));

    this.drops.sort((a, b) => {
      const va = a.y * (this.width / this.scale) + a.x;
      const vb = b.y * (this.width / this.scale) + b.x;
      return va > vb ? 1 : va === vb ? 0 : -1;
    });

    this.drops.forEach((drop, i) => {
      if (drop.killed) return;

      if (chance((drop.r - this.options.minR * this.options.dropFallMultiplier) * (0.1 / this.deltaR()) * timeScale)) {
        drop.momentum += random((drop.r / this.options.maxR) * 4);
      }
      if (this.options.autoShrink && drop.r <= this.options.minR && chance(0.05 * timeScale)) {
        drop.shrink += 0.01;
      }
      drop.r -= drop.shrink * timeScale;
      if (drop.r <= 0) drop.killed = true;

      if (this.options.raining) {
        drop.lastSpawn += drop.momentum * timeScale * this.options.trailRate;
        if (drop.lastSpawn > drop.nextSpawn) {
          const trailDrop = this.createDrop({
            x: drop.x + random(-drop.r, drop.r) * 0.1,
            y: drop.y - drop.r * 0.01,
            r: drop.r * random(this.options.trailScaleRange[0], this.options.trailScaleRange[1]),
            spreadY: drop.momentum * 0.1,
            parent: drop,
          });
          if (trailDrop != null) {
            newDrops.push(trailDrop);
            drop.r *= Math.pow(0.97, timeScale);
            drop.lastSpawn = 0;
            drop.nextSpawn =
              random(this.options.minR, this.options.maxR) - drop.momentum * 2 * this.options.trailRate + (this.options.maxR - drop.r);
          }
        }
      }

      drop.spreadX *= Math.pow(0.4, timeScale);
      drop.spreadY *= Math.pow(0.7, timeScale);

      const moved = drop.momentum > 0;
      if (moved && !drop.killed) {
        drop.y += drop.momentum * this.options.globalTimeScale;
        drop.x += drop.momentumX * this.options.globalTimeScale;
        if (drop.y > this.height / this.scale + drop.r) drop.killed = true;
      }

      const checkCollision = (moved || drop.isNew) && !drop.killed;
      drop.isNew = false;
      if (checkCollision) {
        this.drops.slice(i + 1, i + 70).forEach((drop2) => {
          if (drop !== drop2 && drop.r > drop2.r && drop.parent !== drop2 && drop2.parent !== drop && !drop2.killed) {
            const dx = drop2.x - drop.x;
            const dy = drop2.y - drop.y;
            const dd = Math.sqrt(dx * dx + dy * dy);
            if (dd < (drop.r + drop2.r) * (this.options.collisionRadius + drop.momentum * this.options.collisionRadiusIncrease * timeScale)) {
              const pi = Math.PI;
              const a1 = pi * (drop.r * drop.r);
              const a2 = pi * (drop2.r * drop2.r);
              let targetR = Math.sqrt((a1 + a2 * 0.8) / pi);
              if (targetR > this.options.maxR) targetR = this.options.maxR;
              drop.r = targetR;
              drop.momentumX += dx * 0.1;
              drop.spreadX = 0;
              drop.spreadY = 0;
              drop2.killed = true;
              drop.momentum = Math.max(drop2.momentum, Math.min(40, drop.momentum + targetR * this.options.collisionBoostMultiplier + this.options.collisionBoost));
            }
          }
        });
      }

      drop.momentum -= Math.max(1, this.options.minR * 0.5 - drop.momentum) * 0.1 * timeScale;
      if (drop.momentum < 0) drop.momentum = 0;
      drop.momentumX *= Math.pow(0.7, timeScale);

      if (!drop.killed) {
        newDrops.push(drop);
        if (moved && this.options.dropletsRate > 0) this.clearDroplets(drop.x, drop.y, drop.r * this.options.dropletsCleaningRadiusMultiplier);
        this.drawDrop(this.ctx, drop);
      }
    });

    this.drops = newDrops;
  }

  update() {
    this.clearCanvas();
    const now = Date.now();
    if (this.lastRender == null) this.lastRender = now;
    const deltaT = now - this.lastRender;
    let timeScale = deltaT / ((1 / 60) * 1000);
    if (timeScale > 1.1) timeScale = 1.1;
    timeScale *= this.options.globalTimeScale;
    this.lastRender = now;
    this.updateDrops(timeScale);
  }
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });

/**
 * Decorative rain-on-glass canvas. Always `pointer-events:none` and purely
 * visual — never intercepts clicks. Gate its mounting on a feature flag if
 * one is added later (design's "Login-Regen-Effekt" toggle).
 */
export function RainCanvas({ tint = "170,196,224", className = "" }: { tint?: string; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let dead = false;
    const rafs: number[] = [];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const boot = () => {
      if (dead) return;
      if (!canvas.clientWidth || !canvas.clientHeight) {
        rafs.push(requestAnimationFrame(boot));
        return;
      }
      Promise.all([loadImage("/rain/drop-alpha.png"), loadImage("/rain/drop-color.png")]).then(([dropAlpha, dropColor]) => {
        if (dead) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = canvas.clientWidth * dpr;
        canvas.height = canvas.clientHeight * dpr;
        const rd = new Raindrops(canvas, dpr, dropAlpha, dropColor, tint, { globalTimeScale: 1 });
        const step = () => {
          if (dead) return;
          rd.update();
          rafs.push(requestAnimationFrame(step));
        };
        rafs.push(requestAnimationFrame(step));
      });
    };
    rafs.push(requestAnimationFrame(boot));

    return () => {
      dead = true;
      rafs.forEach((id) => cancelAnimationFrame(id));
    };
  }, [tint]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
