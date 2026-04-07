import { motion } from 'framer-motion';

export default function GameHUD({ score, lives, combo, level, reactionTime }) {
  return (
    <div className="fixed top-0 left-0 right-0 p-4 z-30 pointer-events-none">
      <div className="flex justify-between items-start max-w-6xl mx-auto">
        {/* Score */}
        <div className="text-left">
          <div className="text-sm text-muted-foreground uppercase tracking-wider">Score</div>
          <motion.div
            key={score}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold text-primary"
          >
            {score.toLocaleString()}
          </motion.div>
        </div>

        {/* Center Stats */}
        <div className="text-center">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-xs text-muted-foreground">Level</div>
              <div className="text-2xl font-bold">{level}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Combo</div>
              <motion.div
                key={combo}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-accent"
              >
                {combo}x
              </motion.div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Reaction</div>
              <div className="text-2xl font-bold">{reactionTime}ms</div>
            </div>
          </div>
        </div>

        {/* Lives */}
        <div className="text-right">
          <div className="text-sm text-muted-foreground uppercase tracking-wider">Lives</div>
          <div className="flex gap-1 justify-end">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: i < lives ? 1 : 0.8, opacity: i < lives ? 1 : 0.3 }}
                className="w-6 h-6"
              >
                <svg viewBox="0 0 24 24" fill={i < lives ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="text-red-500">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}