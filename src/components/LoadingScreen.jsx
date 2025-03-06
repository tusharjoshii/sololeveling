import React from 'react';
import { motion } from 'framer-motion';

function LoadingScreen() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-sl-dark-purple">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mb-8"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#A480F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v8"></path>
          <path d="m4.93 10.93 1.41 1.41"></path>
          <path d="M2 18h2"></path>
          <path d="M20 18h2"></path>
          <path d="m19.07 10.93-1.41 1.41"></path>
          <path d="M22 22H2"></path>
          <path d="m16 8-4 4-4-4"></path>
          <path d="M16 16a4 4 0 0 0-8 0"></path>
        </svg>
      </motion.div>
      
      <h1 className="sl-gradient-text text-3xl mb-4">SOLO LEVELING</h1>
      
      <div className="w-64 h-2 bg-sl-dark-violet rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-sl-soft-purple to-sl-blue"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-4 text-sl-light-gray"
      >
        Preparing your hunter awakening...
      </motion.p>
    </div>
  );
}

export default LoadingScreen;