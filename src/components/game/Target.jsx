import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const TARGET_COLORS = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
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

  const size = 40 + target.size * 20;
  const progress = timeLeft / target.duration;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.15 }}
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

      {/* Target body */}
      <div
        className={`rounded-full ${TARGET_COLORS[target.type]} shadow-lg shadow-primary/20`}
        style={{ width: size, height: size }}
      >
        <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center">
          <div className="w-1/3 h-1/3 rounded-full bg-white/40" />
        </div>
      </div>
    </motion.div>
  );
}