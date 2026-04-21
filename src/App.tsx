/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Music, Activity, Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 md:p-8 selection:bg-neon-cyan selection:text-black">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-magenta/10 blur-[120px] rounded-full" />
        <div className="scanline" />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 w-full max-w-6xl flex justify-between items-center mb-6 lg:mb-12"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neon-cyan/20 rounded-lg">
            <Activity className="w-6 h-6 text-neon-cyan" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter uppercase font-sans text-white">
              Neon<span className="text-neon-cyan">Pulse</span>
            </h1>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Hardware Terminal 0.1.4</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-[11px] font-mono text-white/40 uppercase tracking-widest">
          <span className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
            Core Status: Optimal
          </span>
          <span className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-magenta animate-pulse" />
            Audio Sync: Active
          </span>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
        {/* Game Area */}
        <motion.section 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <SnakeGame />
        </motion.section>

        {/* Sidebar / Controls */}
        <motion.aside 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-6"
        >
          <MusicPlayer />

          {/* Quick Stats / Info Widget */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 font-mono text-sm hidden md:block">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
              <Terminal className="w-4 h-4 text-neon-cyan" />
              <span className="text-white/60 text-xs uppercase tracking-widest">System Logs</span>
            </div>
            <div className="space-y-3 opacity-60">
              <div className="flex justify-between">
                <span>Latency</span>
                <span className="text-neon-cyan">2ms</span>
              </div>
              <div className="flex justify-between">
                <span>Uptime</span>
                <span className="text-neon-magenta">142:04:12</span>
              </div>
              <div className="flex justify-between">
                <span>Packet Loss</span>
                <span className="text-neon-lime">0.0%</span>
              </div>
            </div>
            <div className="mt-6 p-3 bg-neon-cyan/5 rounded border border-neon-cyan/20 text-[11px] text-neon-cyan italic">
              "The rhythm flows through the grid. Keep the pulse alive."
            </div>
          </div>

          <div className="flex justify-center gap-4 text-white/20">
            <Music className="w-5 h-5 hover:text-neon-magenta transition-colors cursor-help" />
            <div className="w-px h-5 bg-white/10" />
            <Activity className="w-5 h-5 hover:text-neon-cyan transition-colors cursor-help" />
          </div>
        </motion.aside>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-8 lg:mt-16 text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">
        Design Protocol © 2026 // Synthetic Artifacts
      </footer>
    </div>
  );
}
