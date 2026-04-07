import { useState, useCallback, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import StartScreen from '../components/game/StartScreen';
import GameOverScreen from '../components/game/GameOverScreen';
import GameHUD from '../components/game/GameHUD';
import Target from '../components/game/Target';
import HitEffect from '../components/game/HitEffect';
import FlashOverlay from '../components/game/FlashOverlay';
import MuzzleFlash from '../components/game/MuzzleFlash';
import CustomCrosshair from '../components/game/CrossHair';
import { playGunshot, playHit, playMiss, startBackground, stopBackground } from '../lib/sounds';

const GAME_STATES = { MENU: 'menu', PLAYING: 'playing', OVER: 'over' };

function getSpawnInterval(level) {
  return Math.max(600, 2000 - level * 150);
}

function getTargetDuration(level) {
  return Math.max(800, 2500 - level * 180);
}

export default function Game() {
  const [gameState, setGameState] = useState(GAME_STATES.MENU);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [level, setLevel] = useState(1);
  const [targets, setTargets] = useState([]);
  const [effects, setEffects] = useState([]);
  const [flash, setFlash] = useState(null);
  const [muzzle, setMuzzle] = useState(false);
  const [reactionTime, setReactionTime] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('reflexShooterHighScore') || '0');
  });

  const statsRef = useRef({ hits: 0, misses: 0, maxCombo: 0, totalReaction: 0, reactionCount: 0 });
  const spawnTimerRef = useRef(null);
  const targetIdRef = useRef(0);
  const effectIdRef = useRef(0);
  // All game state kept in refs so callbacks always read current values
  const livesRef = useRef(3);
  const scoreRef = useRef(0);
  const levelRef = useRef(1);
  const comboRef = useRef(0);
  const targetsRef = useRef([]);
  const gameActiveRef = useRef(false);

  // Keep targetsRef in sync
  useEffect(() => {
    targetsRef.current = targets;
  }, [targets]);

  const clearTimers = useCallback(() => {
    if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
  }, []);

  const spawnTarget = useCallback(() => {
    if (!gameActiveRef.current) return;
    const id = ++targetIdRef.current;
    const newTarget = {
      id,
      x: 10 + Math.random() * 80,
      y: 15 + Math.random() * 70,
      type: Math.floor(Math.random() * 5),
      size: Math.random() * 3,
      duration: getTargetDuration(levelRef.current),
      spawnTime: Date.now(),
    };
    setTargets(prev => {
      const next = [...prev, newTarget];
      targetsRef.current = next;
      return next;
    });

    const nextInterval = getSpawnInterval(levelRef.current) + Math.random() * 800;
    spawnTimerRef.current = setTimeout(spawnTarget, nextInterval);
  }, []);

  const endGame = useCallback((finalScore) => {
    gameActiveRef.current = false;
    clearTimers();
    stopBackground();
    setTargets([]);
    targetsRef.current = [];
    setGameState(GAME_STATES.OVER);
    setHighScore(prev => {
      if (finalScore > prev) {
        localStorage.setItem('reflexShooterHighScore', String(finalScore));
        return finalScore;
      }
      return prev;
    });
  }, [clearTimers]);

  const startGame = useCallback(() => {
    gameActiveRef.current = true;
    setGameState(GAME_STATES.PLAYING);
    setScore(0);
    setLives(3);
    setCombo(0);
    setLevel(1);
    setTargets([]);
    setEffects([]);
    setReactionTime(0);
    scoreRef.current = 0;
    livesRef.current = 3;
    levelRef.current = 1;
    comboRef.current = 0;
    targetsRef.current = [];
    statsRef.current = { hits: 0, misses: 0, maxCombo: 0, totalReaction: 0, reactionCount: 0 };
    targetIdRef.current = 0;
    effectIdRef.current = 0;

    // Background music already playing from menu, no need to start again

    const delay = 1000 + Math.random() * 1500;
    spawnTimerRef.current = setTimeout(spawnTarget, delay);
  }, [spawnTarget]);

  const handleHit = useCallback((targetId, timeLeft) => {
    const target = targetsRef.current.find(t => t.id === targetId);
    if (!target) return;

    setTargets(prev => {
      const next = prev.filter(t => t.id !== targetId);
      targetsRef.current = next;
      return next;
    });

    const reaction = Date.now() - target.spawnTime;
    setReactionTime(reaction);

    statsRef.current.hits++;
    statsRef.current.totalReaction += reaction;
    statsRef.current.reactionCount++;

    const speedBonus = Math.max(10, Math.floor((timeLeft / target.duration) * 100));
    const newCombo = comboRef.current + 1;
    comboRef.current = newCombo;
    const comboMultiplier = 1 + newCombo * 0.25;
    const points = Math.floor(speedBonus * comboMultiplier);

    setCombo(newCombo);
    if (newCombo > statsRef.current.maxCombo) statsRef.current.maxCombo = newCombo;

    const newScore = scoreRef.current + points;
    scoreRef.current = newScore;
    setScore(newScore);

    const newLevel = Math.floor(newScore / 500) + 1;
    if (newLevel !== levelRef.current) {
      levelRef.current = newLevel;
      setLevel(newLevel);
    }

    const effectId = ++effectIdRef.current;
    setEffects(prev => [...prev, { id: effectId, x: target.x, y: target.y, points, isHit: true }]);
    setTimeout(() => setEffects(prev => prev.filter(e => e.id !== effectId)), 800);

    setFlash('hit');
    setMuzzle(true);
    setTimeout(() => setFlash(null), 200);
    setTimeout(() => setMuzzle(false), 150);

    playGunshot();
    setTimeout(() => playHit(), 60);
  }, []);

  const handleMiss = useCallback((targetId) => {
    if (!gameActiveRef.current) return;

    const target = targetsRef.current.find(t => t.id === targetId);
    if (!target) return; // already removed

    setTargets(prev => {
      const next = prev.filter(t => t.id !== targetId);
      targetsRef.current = next;
      return next;
    });

    comboRef.current = 0;
    setCombo(0);
    statsRef.current.misses++;

    const effectId = ++effectIdRef.current;
    setEffects(prev => [...prev, { id: effectId, x: target.x, y: target.y, points: 0, isHit: false }]);
    setTimeout(() => setEffects(prev => prev.filter(e => e.id !== effectId)), 800);

    setFlash('miss');
    setTimeout(() => setFlash(null), 300);

    playMiss();

    const newLives = livesRef.current - 1;
    livesRef.current = newLives;
    setLives(newLives);

    if (newLives <= 0) {
      endGame(scoreRef.current);
    }
  }, [endGame]);

  useEffect(() => {
    return () => {
      clearTimers();
      stopBackground();
    };
  }, [clearTimers]);

  const stats = {
    hits: statsRef.current.hits,
    maxCombo: statsRef.current.maxCombo,
    avgReaction: statsRef.current.reactionCount > 0
      ? Math.round(statsRef.current.totalReaction / statsRef.current.reactionCount)
      : 0,
  };

  if (gameState === GAME_STATES.MENU) {
    return <StartScreen onStart={startGame} highScore={highScore} />;
  }

  if (gameState === GAME_STATES.OVER) {
    return (
      <GameOverScreen
        score={score}
        highScore={highScore}
        isNewHighScore={score >= highScore && score > 0}
        stats={stats}
        onRestart={startGame}
        onMenu={() => setGameState(GAME_STATES.MENU)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-background overflow-hidden select-none" style={{ cursor: 'none' }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--muted)/0.3)_0%,_transparent_70%)]" />
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <GameHUD score={score} lives={lives} combo={combo} level={level} reactionTime={reactionTime} />

      <AnimatePresence>
        {targets.map(target => (
          <Target key={target.id} target={target} onHit={handleHit} onMiss={handleMiss} />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {effects.map(effect => (
          <HitEffect key={effect.id} {...effect} />
        ))}
      </AnimatePresence>

      <FlashOverlay type={flash} />
      <MuzzleFlash show={muzzle} />
      <CustomCrosshair />
    </div>
  );
}