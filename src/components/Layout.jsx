import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MusicPlayer from './MusicPlayer';
import { useAudio } from '../contexts/AudioContext';
import { motion } from 'framer-motion';

function Layout() {
  const { playMusic } = useAudio();
  
  useEffect(() => {
    // Start background music when layout mounts
    playMusic();
  }, [playMusic]);
  
  return (
    <div className="flex h-screen bg-sl-dark-purple text-sl-light-gray overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-4 relative">
          {/* Background particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-sl-soft-purple opacity-30"
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: Math.random() * window.innerHeight 
                }}
                animate={{ 
                  x: Math.random() * window.innerWidth, 
                  y: Math.random() * window.innerHeight 
                }}
                transition={{ 
                  duration: 10 + Math.random() * 20,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            ))}
          </div>
          
          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <Outlet />
          </motion.div>
        </main>
        
        <MusicPlayer />
      </div>
    </div>
  );
}

export default Layout;