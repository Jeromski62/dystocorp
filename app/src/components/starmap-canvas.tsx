"use client";

import { useEffect, useRef } from "react";

// Cyberpunk CRT starmap background, ported from the design handoff
// (design_handoff_crt_starmap) — a WebGL starfield behind a CRT/terminal
// treatment (haze, scanlines, glitch tear, vignette, tube curvature, film
// grain) with mouse-parallax depth and six labelled "star systems" tagging
// corp names. Monochrome, pure black/white, no color accent. The WebGL
// shaders, 2D-canvas label renderer, and CSS overlay stack are lifted
// near-verbatim per the handoff's porting note; only the DCLogic component
// boot loop is traded for a single React effect (same pattern as RainCanvas).

type CrtIntensity = "subtle" | "medium" | "strong";

const CRT_PRESETS: Record<CrtIntensity, { scan: number; vig: number; flick: number; sweep: boolean }> = {
  subtle: { scan: 0.16, vig: 0.82, flick: 0.01, sweep: false },
  medium: { scan: 0.3, vig: 1.0, flick: 0.028, sweep: true },
  strong: { scan: 0.44, vig: 1.18, flick: 0.055, sweep: true },
};

type System = {
  x: number;
  y: number;
  par: number;
  name: string;
  ra: string;
  dec: string;
  cls: string;
  st: string;
  ionize?: boolean;
};

// Flavor text (RA/DEC/class/status are decorative, not tied to real data) —
// the two real corps get real names, the rest fill out the setting's lore.
const SYSTEMS: System[] = [
  { x: -0.62, y: 0.46, par: 0.045, name: "Yūgure Corp", ra: "04:22:17", dec: "−18°44′", cls: "III", st: "CLAIMED" },
  { x: 0.44, y: 0.58, par: 0.06, name: "BioNexx Connect", ra: "11:04:52", dec: "+62°11′", cls: "I", st: "ACTIVE" },
  { x: 0.7, y: -0.18, par: 0.03, name: "AetherLink Systems", ra: "19:47:03", dec: "−04°29′", cls: "IV", st: "DISPUTED", ionize: true },
  { x: -0.3, y: -0.52, par: 0.052, name: "Vektor-Logistics", ra: "02:15:44", dec: "−77°02′", cls: "II", st: "CLAIMED" },
  { x: 0.16, y: 0.3, par: 0.038, name: "Soma Group Entertainment", ra: "23:58:10", dec: "+09°55′", cls: "III", st: "SURVEY" },
  { x: -0.8, y: -0.08, par: 0.028, name: "CredoTrust", ra: "07:33:21", dec: "−31°17′", cls: "V", st: "DERELICT" },
];

const VERTEX_SHADER = `
  attribute vec2 a_pos; attribute float a_size; attribute float a_bright;
  attribute float a_par; attribute float a_phase;
  uniform vec2 u_mouse; uniform float u_time; uniform float u_tw; uniform float u_dpr;
  varying float v_b;
  void main(){
    vec2 p = a_pos + u_mouse * a_par;
    gl_Position = vec4(p, 0.0, 1.0);
    float tw = mix(1.0, 0.55 + 0.45*sin(u_time*(0.4+a_par*8.0)+a_phase), u_tw);
    v_b = a_bright * tw;
    gl_PointSize = a_size * u_dpr * 2.3;
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float; varying float v_b;
  void main(){
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float core = smoothstep(0.24, 0.0, d);
    float halo = smoothstep(0.5, 0.0, d);
    float a = (core + halo * halo * 0.55) * v_b;
    gl_FragColor = vec4(vec3(1.0), a);
  }
`;

export function StarmapCanvas({
  className = "",
  parallaxStrength = 1,
  starCount = 1100,
  twinkle = true,
  crtIntensity = "medium",
  scanlines = true,
}: {
  className?: string;
  parallaxStrength?: number;
  starCount?: number;
  twinkle?: boolean;
  crtIntensity?: CrtIntensity;
  scanlines?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const labelCanvasRef = useRef<HTMLCanvasElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const tearRef = useRef<HTMLDivElement>(null);
  const flickRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const glCanvas = glCanvasRef.current;
    const labelCanvas = labelCanvasRef.current;
    if (!root || !glCanvas || !labelCanvas) return;

    const preset = CRT_PRESETS[crtIntensity];
    root.style.setProperty("--scan", scanlines ? String(preset.scan) : "0");
    root.style.setProperty("--vig", String(preset.vig));
    if (sweepRef.current) sweepRef.current.style.display = preset.sweep ? "block" : "none";

    const gl = glCanvas.getContext("webgl", { alpha: false, antialias: true });
    if (!gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX_SHADER));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    const loc = {
      pos: gl.getAttribLocation(program, "a_pos"),
      size: gl.getAttribLocation(program, "a_size"),
      bright: gl.getAttribLocation(program, "a_bright"),
      par: gl.getAttribLocation(program, "a_par"),
      phase: gl.getAttribLocation(program, "a_phase"),
      mouse: gl.getUniformLocation(program, "u_mouse"),
      time: gl.getUniformLocation(program, "u_time"),
      tw: gl.getUniformLocation(program, "u_tw"),
      dpr: gl.getUniformLocation(program, "u_dpr"),
    };
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const n = Math.max(200, Math.min(4000, starCount));
    // Seeded LCG so the field is deterministic across reloads instead of
    // reshuffling every mount.
    let seed = 20260725;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    const stars = new Float32Array(n * 6);
    for (let i = 0; i < n; i++) {
      const depth = rand(); // 0 far .. 1 near
      const bigRoll = rand();
      let size = 1 + depth * 1.6;
      if (bigRoll > 0.97) size = 3.2 + rand() * 3.0;
      const par = 0.006 + depth * 0.05;
      const bright = Math.min(1, 0.28 + depth * 0.55 + (bigRoll > 0.97 ? 0.4 : 0));
      const o = i * 6;
      stars[o] = rand() * 2 - 1;
      stars[o + 1] = rand() * 2 - 1;
      stars[o + 2] = size;
      stars[o + 3] = bright;
      stars[o + 4] = par;
      stars[o + 5] = rand() * 6.28;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, stars, gl.STATIC_DRAW);

    // Canvas text needs a resolved font-family string (var() doesn't work in
    // ctx.font) -- read the app's actual body font off the root instead of
    // loading a separate mono face just for this component.
    const bodyFont = getComputedStyle(document.documentElement).getPropertyValue("--font-body").trim() || "Rajdhani, sans-serif";

    let dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = window.innerWidth;
    let H = window.innerHeight;
    const labelCtx = labelCanvas.getContext("2d")!;

    function resize() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      glCanvas!.width = W * dpr;
      glCanvas!.height = H * dpr;
      labelCanvas!.width = W * dpr;
      labelCanvas!.height = H * dpr;
      gl!.viewport(0, 0, glCanvas!.width, glCanvas!.height);
      labelCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    function onMouseMove(e: MouseEvent) {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = -((e.clientY / window.innerHeight) * 2 - 1);
    }
    window.addEventListener("resize", resize);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reducedMotion) window.addEventListener("mousemove", onMouseMove);

    function drawLabels(mx: number, my: number, time: number) {
      labelCtx.clearRect(0, 0, W, H);
      labelCtx.lineWidth = 1;
      for (const s of SYSTEMS) {
        const cx = s.x + mx * s.par;
        const cy = s.y + my * s.par;
        const sx = (cx * 0.5 + 0.5) * W;
        const sy = (0.5 - cy * 0.5) * H;
        const pulse = 0.55 + 0.45 * Math.sin(time * 1.6 + s.x * 9);

        labelCtx.strokeStyle = `rgba(240,240,240,${0.5 + 0.3 * pulse})`;
        const r = 9;
        labelCtx.beginPath();
        labelCtx.moveTo(sx - r, sy - r + 4);
        labelCtx.lineTo(sx - r, sy - r);
        labelCtx.lineTo(sx - r + 4, sy - r);
        labelCtx.moveTo(sx + r - 4, sy - r);
        labelCtx.lineTo(sx + r, sy - r);
        labelCtx.lineTo(sx + r, sy - r + 4);
        labelCtx.moveTo(sx - r, sy + r - 4);
        labelCtx.lineTo(sx - r, sy + r);
        labelCtx.lineTo(sx - r + 4, sy + r);
        labelCtx.moveTo(sx + r - 4, sy + r);
        labelCtx.lineTo(sx + r, sy + r);
        labelCtx.lineTo(sx + r, sy + r - 4);
        labelCtx.stroke();

        labelCtx.fillStyle = s.ionize ? "rgba(240,240,240,0.95)" : `rgba(240,240,240,${0.6 + 0.4 * pulse})`;
        labelCtx.fillRect(sx - 1, sy - 1, 2, 2);

        const lx = sx + 18;
        const ly = sy - 18;
        labelCtx.strokeStyle = "rgba(190,190,190,0.4)";
        labelCtx.beginPath();
        labelCtx.moveTo(sx + r, sy - r);
        labelCtx.lineTo(lx, ly);
        labelCtx.lineTo(lx + 132, ly);
        labelCtx.stroke();

        labelCtx.textBaseline = "bottom";
        labelCtx.font = `500 12px ${bodyFont}`;
        labelCtx.fillStyle = "rgba(245,245,245,0.92)";
        labelCtx.fillText(s.name, lx + 3, ly - 3);
        labelCtx.textBaseline = "top";
        labelCtx.font = `400 10px ${bodyFont}`;
        labelCtx.fillStyle = "rgba(150,150,150,0.8)";
        labelCtx.fillText(`RA ${s.ra}  DEC ${s.dec}`, lx + 3, ly + 3);
        labelCtx.fillStyle = s.st === "DISPUTED" || s.st === "DERELICT" ? "rgba(210,210,210,0.9)" : "rgba(130,130,130,0.75)";
        labelCtx.fillText(`CLASS ${s.cls} · ${s.st}`, lx + 3, ly + 16);
      }
    }

    function drawStars(mx: number, my: number, time: number) {
      gl!.clearColor(0, 0, 0, 1);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.useProgram(program);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, buffer);
      const stride = 6 * 4;
      const enable = (location: number, size: number, offset: number) => {
        gl!.enableVertexAttribArray(location);
        gl!.vertexAttribPointer(location, size, gl!.FLOAT, false, stride, offset);
      };
      enable(loc.pos, 2, 0);
      enable(loc.size, 1, 8);
      enable(loc.bright, 1, 12);
      enable(loc.par, 1, 16);
      enable(loc.phase, 1, 20);
      gl!.uniform2f(loc.mouse, mx, my);
      gl!.uniform1f(loc.time, time);
      gl!.uniform1f(loc.tw, twinkle ? 1 : 0);
      gl!.uniform1f(loc.dpr, dpr);
      gl!.drawArrays(gl!.POINTS, 0, n);
    }

    let time = 0;
    let glitch = 0;
    let raf = 0;

    function frameLoop() {
      time += 0.016;
      mouse.x += (target.x - mouse.x) * 0.045;
      mouse.y += (target.y - mouse.y) * 0.045;
      const mx = mouse.x * parallaxStrength;
      const my = mouse.y * parallaxStrength;

      drawStars(mx, my, time);
      drawLabels(mx, my, time);

      if (flickRef.current) {
        flickRef.current.style.opacity = String(preset.flick * (0.25 + Math.random() * 0.75));
      }

      if (scanlines && scanRef.current) {
        if (glitch > 0) {
          glitch--;
          const jx = (Math.random() * 2 - 1) * 8;
          const sk = (Math.random() * 2 - 1) * 0.7;
          scanRef.current.style.transform = `translateX(${jx.toFixed(1)}px) skewX(${sk.toFixed(2)}deg)`;
          if (tearRef.current) {
            if (Math.random() < 0.6) {
              tearRef.current.style.opacity = (0.4 + Math.random() * 0.6).toFixed(2);
              tearRef.current.style.height = `${(2 + Math.random() * 14).toFixed(0)}px`;
              tearRef.current.style.transform = `translateY(${(Math.random() * 100).toFixed(0)}vh) translateX(${((Math.random() * 2 - 1) * 12).toFixed(0)}px)`;
            } else {
              tearRef.current.style.opacity = "0";
            }
          }
        } else {
          scanRef.current.style.transform = "translateX(0)";
          if (tearRef.current) tearRef.current.style.opacity = "0";
          if (Math.random() < 0.014) glitch = 3 + Math.floor(Math.random() * 9);
        }
      }

      raf = requestAnimationFrame(frameLoop);
    }

    if (reducedMotion) {
      // Single static frame instead of the animation loop -- no parallax,
      // twinkle, sweep/glitch/flicker/grain motion.
      drawStars(0, 0, 0);
      drawLabels(0, 0, 0);
    } else {
      raf = requestAnimationFrame(frameLoop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [parallaxStrength, starCount, twinkle, crtIntensity, scanlines]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden bg-black font-mono text-[#f2f2f2] select-none motion-reduce:[&_[data-role=grain]]:animate-none motion-reduce:[&_[data-role=haze]]:animate-none motion-reduce:[&_[data-role=sweep]]:animate-none ${className}`}
      style={{ ["--scan" as string]: 0.18, ["--vig" as string]: 1 }}
    >
      <canvas ref={glCanvasRef} className="absolute inset-0 z-0 block size-full" />

      <div
        data-role="haze"
        className="absolute inset-[-8%] z-[1] opacity-50 mix-blend-screen blur-[48px] [animation:hazeDrift_34s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(38% 30% at 32% 40%, rgba(190,200,210,0.20), transparent 70%), radial-gradient(46% 34% at 72% 62%, rgba(150,160,170,0.16), transparent 72%), radial-gradient(60% 44% at 50% 88%, rgba(120,130,140,0.14), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: "radial-gradient(70% 60% at 50% 46%, rgba(140,150,160,0.06), transparent 72%)" }}
      />
      <canvas ref={labelCanvasRef} className="pointer-events-none absolute inset-0 z-[2] block size-full" />

      <div
        ref={sweepRef}
        data-role="sweep"
        className="absolute inset-0 z-[3] h-[22%] mix-blend-screen [animation:sweepDown_7s_linear_infinite]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.05) 55%, rgba(255,255,255,0) 100%)",
        }}
      />
      <div
        ref={scanRef}
        className="absolute inset-0 z-[4] opacity-[var(--scan)] will-change-transform"
        style={{
          background:
            "repeating-linear-gradient(to bottom, rgba(235,235,235,0.55) 0px, rgba(235,235,235,0.55) 1px, rgba(255,255,255,0) 1px, rgba(255,255,255,0) 6px)",
        }}
      />
      <div
        ref={tearRef}
        className="absolute inset-x-0 top-0 z-[4] h-[6px] opacity-0 mix-blend-screen"
        style={{
          background:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, rgba(120,120,120,0.2) 2px, rgba(255,255,255,0.4) 3px)",
        }}
      />
      <div
        className="absolute inset-0 z-[5] opacity-[var(--vig)]"
        style={{
          background: "radial-gradient(ellipse 78% 78% at 50% 48%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.55) 78%, rgba(0,0,0,0.94) 100%)",
        }}
      />
      <div
        className="absolute inset-0 z-[6] rounded-2xl"
        style={{
          boxShadow: "inset 0 0 140px 30px rgba(0,0,0,0.85), inset 0 0 40px rgba(0,0,0,0.6)",
          background: "radial-gradient(ellipse at 50% -18%, rgba(255,255,255,0.05), transparent 46%)",
        }}
      />
      <div ref={flickRef} className="absolute inset-0 z-[7] bg-white opacity-0 mix-blend-overlay" />
      <div
        data-role="grain"
        className="absolute inset-[-15%] z-[8] opacity-[0.16] mix-blend-overlay [animation:grainShift_0.7s_steps(1)_infinite]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
