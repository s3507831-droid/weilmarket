import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const trailRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', onMove);

    const animate = () => {
      trailRef.current.x += (pos.x - trailRef.current.x) * 0.12;
      trailRef.current.y += (pos.y - trailRef.current.y) * 0.12;
      setTrail({ x: trailRef.current.x, y: trailRef.current.y });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [pos.x, pos.y]);

  return (
    <>
      <style>{`
        html, body, * { cursor: none !important; }
      `}</style>

      {/* Main ghost cursor */}
      <div style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 2147483647,
        fontSize: '1.8rem',
        lineHeight: 1,
        userSelect: 'none',
        filter: 'drop-shadow(0 0 8px rgba(255,106,0,0.9))',
        transition: 'transform 0.1s ease',
      }}>
        👻
      </div>

      {/* Orange glow trail */}
      <div style={{
        position: 'fixed',
        left: trail.x,
        top: trail.y,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 2147483646,
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,106,0,0.5) 0%, transparent 70%)',
        userSelect: 'none',
      }}/>
    </>
  );
}