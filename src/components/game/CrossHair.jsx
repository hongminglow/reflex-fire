import { useEffect, useState } from 'react';

export default function CustomCrosshair() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{ left: position.x, top: position.y, transform: 'translate(-50%, -50%)' }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32" className="text-primary">
        <circle cx="16" cy="16" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="16" y1="0" x2="16" y2="10" stroke="currentColor" strokeWidth="2" />
        <line x1="16" y1="22" x2="16" y2="32" stroke="currentColor" strokeWidth="2" />
        <line x1="0" y1="16" x2="10" y2="16" stroke="currentColor" strokeWidth="2" />
        <line x1="22" y1="16" x2="32" y2="16" stroke="currentColor" strokeWidth="2" />
        <circle cx="16" cy="16" r="2" fill="currentColor" />
      </svg>
    </div>
  );
}