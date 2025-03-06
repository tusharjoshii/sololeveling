import React from 'react';
import { motion } from 'framer-motion';

function RankBadge({ rank }) {
  const getRankClass = () => {
    switch (rank) {
      case 'E': return 'sl-badge-rank-e';
      case 'D': return 'sl-badge-rank-d';
      case 'C': return 'sl-badge-rank-c';
      case 'B': return 'sl-badge-rank-b';
      case 'A': return 'sl-badge-rank-a';
      case 'S': return 'sl-badge-rank-s';
      default: return 'sl-badge-rank-e';
    }
  };
  
  const getRankAnimation = () => {
    if (rank === 'S') {
      return {
        animate: {
          boxShadow: ['0 0 5px rgba(255, 0, 0, 0.5)', '0 0 20px rgba(255, 215, 0, 0.8)', '0 0 5px rgba(255, 0, 0, 0.5)'],
        },
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      };
    }
    
    if (rank === 'A') {
      return {
        animate: {
          scale: [1, 1.05, 1],
        },
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      };
    }
    
    return {};
  };
  
  return (
    <motion.div 
      className={`${getRankClass()} px-3 py-1`}
      whileHover={{ scale: 1.1 }}
      {...getRankAnimation()}
    >
      Rank {rank}
    </motion.div>
  );
}

export default RankBadge;