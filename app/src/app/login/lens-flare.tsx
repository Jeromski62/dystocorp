// Decorative lens-flare group behind the login form, positioned at the
// golden-section point per the design handoff. Pure background flourish —
// pointer-events:none, breathes via the `dcflare` keyframe in globals.css.
export function LensFlare() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-0"
      style={{
        left: "76%",
        top: "24%",
        transform: "translate(-50%, -50%)",
        filter: "blur(3px)",
        animation: "dcflare 6s var(--ease) infinite",
      }}
    >
      <div
        className="absolute rounded-full"
        style={{
          left: 0,
          top: 0,
          transform: "translate(-50%, -50%)",
          width: 340,
          height: 340,
          background: "radial-gradient(circle, rgba(216,233,255,0.16) 0%, rgba(170,196,224,0.06) 34%, transparent 68%)",
          filter: "blur(8px)",
        }}
      />
      <div
        className="absolute"
        style={{
          left: 0,
          top: 0,
          transform: "translate(-50%, -50%)",
          width: 150,
          height: 1.5,
          background: "linear-gradient(to right, transparent, rgba(216,233,255,0.5), transparent)",
          filter: "blur(1.5px)",
        }}
      />
      <div
        className="absolute"
        style={{
          left: 0,
          top: 0,
          transform: "translate(-50%, -50%)",
          width: 1.5,
          height: 150,
          background: "linear-gradient(to bottom, transparent, rgba(216,233,255,0.5), transparent)",
          filter: "blur(1.5px)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          left: 0,
          top: 0,
          transform: "translate(-50%, -50%)",
          width: 14,
          height: 14,
          background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(216,233,255,0.4) 55%, transparent 100%)",
          filter: "blur(1px)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          left: -108,
          top: 66,
          transform: "translate(-50%, -50%)",
          width: 22,
          height: 22,
          background: "radial-gradient(circle, rgba(170,196,224,0.22), transparent 70%)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          left: 150,
          top: -92,
          transform: "translate(-50%, -50%)",
          width: 12,
          height: 12,
          background: "radial-gradient(circle, rgba(216,233,255,0.3), transparent 70%)",
        }}
      />
    </div>
  );
}
