import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const TARGET_COLORS = [
  'text-red-500',
  'text-orange-500',
  'text-yellow-500',
  'text-green-500',
  'text-purple-500',
];

export default function Target({ target, onHit, onMiss }) {
  const [timeLeft, setTimeLeft] = useState(target.duration);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = target.duration - elapsed;
      setTimeLeft(Math.max(0, remaining));

      if (remaining <= 0) {
        onMiss(target.id);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [target.id, target.duration, onMiss]);

  const handleClick = () => {
    if (timeLeft > 0) {
      onHit(target.id, timeLeft);
    }
  };

  const size = 60 + target.size * 30;
  const progress = timeLeft / target.duration;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotate: -180 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      exit={{ scale: 0, opacity: 0, rotate: 180 }}
      transition={{ duration: 0.2, type: 'spring' }}
      className="fixed cursor-pointer z-20"
      style={{
        left: `${target.x}%`,
        top: `${target.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={handleClick}
    >
      {/* Progress ring */}
      <svg
        width={size + 20}
        height={size + 20}
        className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
      >
        <circle
          cx={(size + 20) / 2}
          cy={(size + 20) / 2}
          r={(size + 10) / 2}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-muted opacity-30"
        />
        <circle
          cx={(size + 20) / 2}
          cy={(size + 20) / 2}
          r={(size + 10) / 2}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={`${progress * Math.PI * (size + 10)} ${Math.PI * (size + 10)}`}
          className="text-primary"
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
        />
      </svg>

      {/* Skeleton Icon */}
      <div className={`${TARGET_COLORS[target.type]} drop-shadow-lg`} style={{ width: size, height: size }}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          {/* Skull */}
          <path d="M12 2C8.5 2 5.5 4.5 5.5 8c0 2.5 1 4.5 2 5.5v2c0 .5.5 1 1 1h1v2.5c0 .5.5 1 1 1h1c.5 0 1-.5 1-1V16.5h1c.5 0 1-.5 1-1v-2c1-1 2-3 2-5.5 0-3.5-3-6-6.5-6z"/>
          {/* Eye sockets */}
          <circle cx="9" cy="9" r="1.5" fill="#000"/>
          <circle cx="15" cy="9" r="1.5" fill="#000"/>
          {/* Nose */}
          <path d="M12 11l-1 1.5h2z" fill="#000"/>
          {/* Teeth */}
          <rect x="9" y="13" width="1" height="1.5" fill="#000"/>
          <rect x="11" y="13" width="1" height="1.5" fill="#000"/>
          <rect x="13" y="13" width="1" height="1.5" fill="#000"/>
          <rect x="15" y="13" width="1" height="1.5" fill="#000"/>
          {/* Spine/Ribs */}
          <path d="M11 17h2v1h-2z M10 18.5h4v.5h-4z M10.5 20h3v.5h-3z" fill="currentColor" opacity="0.7"/>
        </svg>
      </div>
    </motion.div>
  );
}