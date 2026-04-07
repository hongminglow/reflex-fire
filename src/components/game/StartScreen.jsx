import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { startBackground, stopBackground } from '../../lib/sounds';

export default function StartScreen({ onStart, highScore }) {
  // Start music when menu loads
  useEffect(() => {
    console.log('Menu loaded - starting background music...');
    try {
      startBackground();
      console.log('Background music started successfully');
    } catch (error) {
      console.error('Failed to start background music:', error);
    }
    
    // Stop music when leaving menu
    return () => {
      console.log('Leaving menu - stopping music');
      stopBackground();
    };
  }, []);

  const handleStart = () => {
    stopBackground(); // Stop music when entering game
    onStart();
  };

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
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            REFLEX
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Test your reaction speed
          </p>
        </motion.div>

        {highScore > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="text-sm text-muted-foreground uppercase tracking-wider">High Score</div>
            <div className="text-3xl font-bold text-primary">{highScore.toLocaleString()}</div>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="px-12 py-4 bg-primary text-primary-foreground rounded-lg text-xl font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-shadow"
        >
          START GAME
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-sm text-muted-foreground"
        >
          <p>Click targets before they disappear</p>
          <p className="mt-1">Build combos for bonus points</p>
        </motion.div>
      </div>
    </div>
  );
}