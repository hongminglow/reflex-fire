import { motion } from 'framer-motion';

export default function HitEffect({ x, y, points, isHit }) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 0.5 }}
      animate={{ opacity: 0, y: -50, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed pointer-events-none z-30"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
    >
      <div className={`text-2xl font-bold ${isHit ? 'text-green-400' : 'text-red-400'}`}>
        {isHit ? `+${points}` : 'MISS'}
      </div>
    </motion.div>
  );
}