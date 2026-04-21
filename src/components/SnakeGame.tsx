import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Point, GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { Trophy, RefreshCw, Zap } from 'lucide-react';

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback(() => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    return { x, y };
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setIsGameOver(false);
    setScore(0);
    setGameStarted(true);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y,
      };

      // Collision Detection
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check for Food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (Subtle)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw Food
    ctx.fillStyle = '#39FF14';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#39FF14';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00FFFF' : 'rgba(0, 255, 255, 0.6)';
      ctx.shadowBlur = isHead ? 20 : 5;
      ctx.shadowColor = '#00FFFF';
      
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;
      const padding = 2;
      
      ctx.fillRect(x + padding, y + padding, cellSize - padding * 2, cellSize - padding * 2);
    });
    ctx.shadowBlur = 0;
  }, [snake, food]);

  useEffect(() => {
    const loop = (time: number) => {
      const speedOffset = Math.min(score / 5, 50); // Get faster as score grows
      if (time - lastUpdateRef.current > (GAME_SPEED - speedOffset)) {
        moveSnake();
        lastUpdateRef.current = time;
      }
      draw();
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    if (gameStarted && !isGameOver) {
      gameLoopRef.current = requestAnimationFrame(loop);
    } else {
      draw();
    }

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameStarted, isGameOver, moveSnake, draw, score]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] font-mono">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-neon-cyan" />
          <span className="text-white/60">SCORE:</span>
          <span className="text-xl text-neon-cyan font-bold">{score}</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-neon-magenta" />
          <span className="text-white/60">BEST:</span>
          <span className="text-xl text-neon-magenta font-bold">{highScore}</span>
        </div>
      </div>

      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="neon-border-cyan bg-black/40 rounded-xl cursor-crosshair transition-all duration-500 group-hover:scale-[1.02]"
        />
        
        <AnimatePresence>
          {!gameStarted && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-xl"
            >
              <div className="text-center p-8">
                <motion.h2 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-4xl font-bold text-neon-cyan mb-6 tracking-tighter"
                >
                  NEON PULSE
                </motion.h2>
                <button 
                  onClick={resetGame}
                  className="px-8 py-3 bg-neon-cyan text-black font-bold rounded-lg hover:bg-white transition-all transform hover:scale-110 active:scale-95 uppercase tracking-widest text-sm"
                >
                  Execute Program
                </button>
                <p className="mt-4 text-white/40 text-xs font-mono uppercase">Use Arrows to Navigate</p>
              </div>
            </motion.div>
          )}

          {isGameOver && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md rounded-xl"
            >
              <div className="text-center p-8">
                <h2 className="text-5xl font-bold text-neon-magenta mb-2 italic">SYSTEM CRASH</h2>
                <div className="mb-8 font-mono text-neon-cyan">
                  <p className="text-sm opacity-60">SCORE CAPTURED</p>
                  <p className="text-3xl font-bold">{score}</p>
                </div>
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-2 mx-auto px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-neon-magenta hover:text-white transition-all transform hover:scale-110 active:scale-95 uppercase tracking-widest text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reboot System
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
