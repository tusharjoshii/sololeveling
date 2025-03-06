import React, { useState } from 'react';
import { useAudio } from '../contexts/AudioContext';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion } from 'framer-motion';

function MusicPlayer() {
  const { isMuted, toggleMute, volume, changeVolume } = useAudio();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div 
        className="flex items-center bg-sl-dark-violet rounded-full shadow-lg border border-sl-soft-purple border-opacity-30 p-2"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <motion.div 
          className="mr-2 text-sl-soft-purple"
          animate={{ rotate: isMuted ? 0 : 360 }}
          transition={{ duration: 4, repeat: isMuted ? 0 : Infinity, ease: "linear" }}
        >
          <Music size={20} />
        </motion.div>
        
        {/* Volume slider */}
        {showVolumeSlider && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 100, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="mr-2"
          >
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-sl-dark-purple rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #A480F2 0%, #A480F2 ${volume * 100}%, #1D1340 ${volume * 100}%, #1D1340 100%)`
              }}
            />
          </motion.div>
        )}
        
        {/* Volume button */}
        <button 
          className="p-2 rounded-full hover:bg-sl-soft-purple hover:bg-opacity-20 transition-colors"
          onClick={() => setShowVolumeSlider(!showVolumeSlider)}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        
        {/* Mute toggle */}
        <button 
          className="p-2 rounded-full hover:bg-sl-soft-purple hover:bg-opacity-20 transition-colors"
          onClick={toggleMute}
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
      </motion.div>
    </div>
  );
}

export default MusicPlayer;