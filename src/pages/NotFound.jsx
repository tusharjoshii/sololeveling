import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sl-dark-purple">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sl-card max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2
          }}
          className="mb-6 inline-block"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#A480F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="m15 9-6 6"></path>
            <path d="m9 9 6 6"></path>
          </svg>
        </motion.div>
        
        <h1 className="sl-gradient-text text-4xl mb-4">404</h1>
        <p className="text-xl mb-6">Page not found</p>
        <p className="mb-8 opacity-80">The page you are looking for doesn't exist or has been moved.</p>
        
        <Link to="/" className="sl-button inline-flex items-center">
          <Home size={18} className="mr-2" />
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFound;