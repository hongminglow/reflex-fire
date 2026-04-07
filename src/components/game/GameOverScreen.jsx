import { motion } from 'framer-motion';

export default function GameOverScreen({ score, highScore, isNewHighScore, stats, onRestart, onMenu }) {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--muted)/0.3)_0%,_transparent_70%)]" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-2 text-destructive">
            GAME OVER
          </h1>
          {isNewHighScore && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="text-2xl text-accent font-bold mb-4"
            >
              NEW HIGH SCORE!
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="my-8"
        >
          <div className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Final Score</div>
          <div className="text-5xl font-bold text-primary">{score.toLocaleString()}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-6 mb-8 max-w-md mx-auto"
        >
          <div className="bg-card p-4 rounded-lg">
            <div className="text-xs text-muted-foreground uppercase">Hits</div>
            <div className="text-2xl font-bold">{stats.hits}</div>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <div className="text-xs text-muted-foreground uppercase">Max Combo</div>
            <div className="text-2xl font-bold">{stats.maxCombo}x</div>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <div className="text-xs text-muted-foreground uppercase">Avg Reaction</div>
            <div className="text-2xl font-bold">{stats.avgReaction}ms</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold shadow-lg shadow-primary/30"
          >
            PLAY AGAIN
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenu}
            className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold"
          >
            MENU
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}