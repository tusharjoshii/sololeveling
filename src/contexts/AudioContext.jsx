import { createContext, useContext, useState, useEffect } from 'react';
import { Howl } from 'howler';

const AudioContext = createContext();

export function useAudio() {
  return useContext(AudioContext);
}

export function AudioProvider({ children }) {
  const [isMuted, setIsMuted] = useState(false);
  const [bgMusic, setBgMusic] = useState(null);
  const [volume, setVolume] = useState(0.5);
  
  // Sound effects
  const soundEffects = {
    levelUp: new Howl({
      src: ['https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-complete-or-approved-mission-205.mp3'],
      volume: 0.7,
    }),
    coinEarned: new Howl({
      src: ['https://assets.mixkit.co/sfx/preview/mixkit-coin-win-notification-1992.mp3'],
      volume: 0.7,
    }),
    taskComplete: new Howl({
      src: ['https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3'],
      volume: 0.7,
    }),
    buttonClick: new Howl({
      src: ['https://assets.mixkit.co/sfx/preview/mixkit-modern-technology-select-notification-221.mp3'],
      volume: 0.5,
    }),
    error: new Howl({
      src: ['https://assets.mixkit.co/sfx/preview/mixkit-negative-tone-interface-tap-2568.mp3'],
      volume: 0.5,
    }),
  };

  // Initialize background music
  useEffect(() => {
    const music = new Howl({
      src: ['https://assets.mixkit.co/music/preview/mixkit-game-level-music-689.mp3'],
      loop: true,
      volume: volume,
      autoplay: false,
    });
    
    setBgMusic(music);
    
    return () => {
      if (music) {
        music.stop();
      }
    };
  }, []);

  // Update volume when it changes
  useEffect(() => {
    if (bgMusic) {
      bgMusic.volume(isMuted ? 0 : volume);
    }
    
    // Update all sound effects volume
    Object.values(soundEffects).forEach(sound => {
      sound.volume(isMuted ? 0 : sound._volume);
    });
  }, [volume, isMuted, bgMusic]);

  function toggleMute() {
    setIsMuted(!isMuted);
    if (bgMusic) {
      if (!isMuted) {
        bgMusic.volume(0);
      } else {
        bgMusic.volume(volume);
      }
    }
  }

  function playMusic() {
    if (bgMusic && !bgMusic.playing()) {
      bgMusic.play();
    }
  }

  function stopMusic() {
    if (bgMusic) {
      bgMusic.stop();
    }
  }

  function playSoundEffect(effect) {
    if (soundEffects[effect] && !isMuted) {
      soundEffects[effect].play();
    }
  }

  function changeVolume(newVolume) {
    setVolume(newVolume);
  }

  const value = {
    isMuted,
    toggleMute,
    playMusic,
    stopMusic,
    playSoundEffect,
    volume,
    changeVolume
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}