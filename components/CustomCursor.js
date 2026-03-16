import { useEffect, useRef } from 'react';

export default function CustomCursor({ sound }) {
  const cursorRef  = useRef(null);
  const trailerRef = useRef(null);

  useEffect(() => {
    const cursor  = cursorRef.current;
    const trailer = trailerRef.current;
    if (!cursor || !trailer) return;

    let mouseX = 0, mouseY = 0;
    let trailerX = 0, trailerY = 0;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    };

    const animate = () => {
      trailerX += (mouseX - trailerX) * 0.15;
      trailerY += (mouseY - trailerY) * 0.15;
      trailer.style.left = trailerX + 'px';
      trailer.style.top  = trailerY + 'px';
      requestAnimationFrame(animate);
    };

    const onEnter = () => cursor.style.transform = 'translate(-50%,-50%) scale(1.5)';
    const onLeave = () => cursor.style.transform = 'translate(-50%,-50%) scale(1)';

    document.addEventListener('mousemove', onMove);
    document.querySelectorAll('button, a, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    animate();
    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <>
      <style>{`
        * { cursor: none !important; }
      `}</style>

      {/* Ghost cursor */}
      <div ref={cursorRef} style={{
        position: 'fixed',
        left: 0, top: 0,
        width: 28, height: 28,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 99999,
        fontSize: '1.4rem',
        lineHeight: 1,
        transition: 'transform 0.15s ease',
        userSelect: 'none',
        filter: 'drop-shadow(0 0 6px rgba(255,106,0,0.8))',
      }}>
        👻
      </div>

      {/* Trailing glow */}
      <div ref={trailerRef} style={{
        position: 'fixed',
        left: 0, top: 0,
        width: 20, height: 20,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 99998,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,106,0,0.3) 0%, transparent 70%)',
        userSelect: 'none',
      }}/>
    </>
  );
}