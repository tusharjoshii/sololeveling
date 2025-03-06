import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Clock, 
  ArrowRight,
  Plus,
  ChevronDown,
  ChevronUp,
  Award,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';

function Challenges() {
  const { userProfile } = useAuth();
  const { playSoundEffect } = useAudio();
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'push-ups',
    target: 50,
    duration: 7,
    betAmount: 10
  });
  
  useEffect(() => {
    // Mock data for challenges
    const mockActiveChallenges = [
      {
        id: 'challenge1',
        title: '100 Push-up Challenge',
        description: 'Complete 100 push-ups in a single day',
        creator: {
          username: 'FitnessMaster',
          rank: 'A'
        },
        participants: 8,
        type: 'push-ups',
        target: 100,
        timeLeft: '2 days',
        betAmount: 50
      },
      {
        id: 'challenge2',
        title: 'Weekly Running Challenge',
        description: 'Run at least 10km this week',
        creator: {
          username: 'RunnerPro',
          rank: 'B'
        },
        participants: 12,
        type: 'running',
        target: 10,
        unit: 'km',
        timeLeft: '5 days',
        betAmount: 30
      }
    ];
    
    const mockCompletedChallenges = [
      {
        id: 'completed1',
        title: 'Squat Master',
        description: 'Complete 200 squats in a week',
        result: 'won',
        reward: 75,
        date: '3 days ago'
      },
      {
        id: 'completed2',
        title: 'Plank Challenge',
        description: 'Hold a plank for 3 minutes',
        result: 'lost',
        penalty: 20,
        date: '1 week ago'
      }
    ];
    
    setActiveChallenges(mockActiveChallenges);
    setCompletedChallenges(mockCompletedChallenges);
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'target' || name === 'duration' || name === 'betAmount' 
        ? parseInt(value) 
        : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if user has enough coins
    if (userProfile.coins < formData.betAmount) {
      toast.error(`Not enough coins! You need ${formData.betAmount} coins to create this challenge.`);
      playSoundEffect('error');
      return;
    }
    
    // Create new challenge
    const newChallenge = {
      id: `challenge${Date.now()}`,
      title: formData.title,
      description: formData.description,
      creator: {
        username: userProfile.username,
        rank: userProfile.rank
      },
      participants: 1,
      type: formData.type,
      target: formData.target,
      unit: getUnitForType(formData.type),
      timeLeft: `${formData.duration} days`,
      betAmount: formData.betAmount
    };
    
    setActiveChallenges(prev => [newChallenge, ...prev]);
    setShowCreateForm(false);
    setFormData({
      title: '',
      description: '',
      type: 'push-ups',
      target: 50,
      duration: 7,
      betAmount: 10
    });
    
    playSoundEffect('taskComplete');
    toast.success('Challenge created successfully!');
  };
  
  const joinChallenge = (challengeId) => {
    // Find the challenge
    const challenge = activeChallenges.find(c => c.id === challengeId);
    
    // Check if user has enough coins
    if (userProfile.coins < challenge.betAmount) {
      toast.error(`Not enough coins! You need ${challenge.betAmount} coins to join this challenge.`);
      playSoundEffect('error');
      return;
    }
    
    // Update participants count
    setActiveChallenges(prev => 
      prev.map(c => 
        c.id === challengeId 
          ? { ...c, participants: c.participants + 1 } 
          : c
      )
    );
    
    playSoundEffect('buttonClick');
    toast.success(`Joined the "${challenge.title}" challenge!`);
  };
  
  const getUnitForType = (type) => {
    switch (type) {
      case 'running':
      case 'cycling':
        return 'km';
      case 'push-ups':
      case 'pull-ups':
      case 'sit-ups':
      case 'squats':
        return 'reps';
      case 'plank':
        return 'seconds';
      default:
        return '';
    }
  };
  
  const canCreateChallenge = () => {
    // Only users ranked D and above can create challenges
    const rankOrder = { 'E': 0, 'D': 1, 'C': 2, 'B': 3, 'A': 4, 'S': 5 };
    return rankOrder[userProfile?.rank] >= 1;
  };
  
  return (
    <div className="sl-container">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Challenges</h1>
        <p className="text-sl-light-gray opacity-80">
          Compete with other hunters and earn rewards
        </p>
      </motion.div>
      
      {/* Create challenge button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        {canCreateChallenge() ? (
          <button 
            className="sl-button flex items-center"
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              playSoundEffect('buttonClick');
            }}
          >
            {showCreateForm ? (
              <>
                <ChevronUp size={18} className="mr-2" />
                Hide Challenge Form
              </>
            ) : (
              <>
                <Plus size={18} className="mr-2" />
                Create New Challenge
              </>
            )}
          </button>
        ) : (
          <div className="sl-card p-4 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30">
            <div className="flex items-start">
              <AlertCircle size={20} className="text-yellow-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Rank Requirement</h3>
                <p className="text-sm opacity-80">
                  You need to be at least Rank D to create challenges. Keep training to level up!
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Create challenge form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="sl-card">
            <h2 className="text-xl font-bold mb-4">Create New Challenge</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Challenge Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="sl-input w-full"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium mb-1">
                    Exercise Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    className="sl-input w-full"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="push-ups">Push-ups</option>
                    <option value="pull-ups">Pull-ups</option>
                    <option value="sit-ups">Sit-ups</option>
                    <option value="squats">Squats</option>
                    <option value="running">Running</option>
                    <option value="cycling">Cycling</option>
                    <option value="plank">Plank</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  className="sl-input w-full"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label htmlFor="target" className="block text-sm font-medium mb-1">
                    Target ({getUnitForType(formData.type)})
                  </label>
                  <input
                    type="number"
                    id="target"
                    name="target"
                    min="1"
                    className="sl-input w-full"
                    value={formData.target}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium mb-1">
                    Duration (days)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    min="1"
                    max="30"
                    className="sl-input w-full"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="betAmount" className="block text-sm font-medium mb-1">
                    Bet Amount (coins)
                  </label>
                  <input
                    type="number"
                    id="betAmount"
                    name="betAmount"
                    min="5"
                    className="sl-input w-full"
                    value={formData.betAmount}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 rounded-md border border-sl-soft-purple text-sl-soft-purple hover:bg-sl-soft-purple hover:bg-opacity-10 transition-colors"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sl-button flex items-center"
                >
                  <Trophy size={18} className="mr-2" />
                  Create Challenge
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
      
      {/* Active challenges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-xl font-bold mb-4">Active Challenges</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeChallenges.map(challenge => (
            <div key={challenge.id} className="sl-card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold">{challenge.title}</h3>
                  <p className="text-sm opacity-80 mb-2">{challenge.description}</p>
                  <div className="flex items-center text-sm">
                    <span className="opacity-70 mr-1">Created by:</span>
                    <span className="font-medium">{challenge.creator.username}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs sl-badge-rank-${challenge.creator.rank.toLowerCase()}`}>
                      {challenge.creator.rank}
                    </span>
                  </div>
                </div>
                <div className="bg-sl-soft-purple bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  {challenge.type.replace('-', ' ')}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-2 rounded-lg bg-sl-dark-purple">
                  <p className="text-xs opacity-70 mb-1">Target</p>
                  <p className="font-bold">
                    {challenge.target} {challenge.unit || ''}
                  </p>
                </div>
                <div className="text-center p-2 rounded-lg bg-sl-dark-purple">
                  <p className="text-xs opacity-70 mb-1">Participants</p>
                  <div className="flex items-center justify-center">
                    <Users size={14} className="mr-1" />
                    <p className="font-bold">{challenge.participants}</p>
                  </div>
                </div>
                <div className="text-center p-2 rounded-lg bg-sl-dark-purple">
                  <p className="text-xs opacity-70 mb-1">Time Left</p>
                  <div className="flex items-center justify-center">
                    <Clock size={14} className="mr-1" />
                    <p className="font-bold">{challenge.timeLeft}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-sl-soft-purple border-opacity-20">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500 mr-1">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v12"></path>
                    <path d="M8 10h8"></path>
                  </svg>
                  <span className="font-bold">{challenge.betAmount}</span>
                  <span className="ml-1 opacity-70">coins</span>
                </div>
                
                <button 
                  className="sl-button flex items-center"
                  onClick={() => joinChallenge(challenge.id)}
                >
                  Join Challenge
                  <ArrowRight size={18} className="ml-2" />
                </button>
              </div>
            </div>
          ))}
          
          {activeChallenges.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Trophy size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">No active challenges</h3>
              <p className="opacity-80">Create a new challenge or check back later!</p>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Completed challenges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-bold mb-4">Completed Challenges</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {completedChallenges.map(challenge => (
            <div 
              key={challenge.id} 
              className={`sl-card border ${
                challenge.result === 'won' 
                  ? 'border-green-500 border-opacity-50' 
                  : 'border-red-500 border-opacity-50'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold">{challenge.title}</h3>
                  <p className="text-sm opacity-80">{challenge.description}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  challenge.result === 'won' 
                    ? 'bg-green-500 bg-opacity-20 text-green-400' 
                    : 'bg-red-500 bg-opacity-20 text-red-400'
                }`}>
                  {challenge.result === 'won' ? 'Won' : 'Lost'}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-sl-soft-purple border-opacity-20">
                <div className="flex items-center">
                  {challenge.result === 'won' ? (
                    <>
                      <Award size={18} className="text-green-500 mr-1" />
                      <span className="font-bold text-green-400">+{challenge.reward}</span>
                      <span className="ml-1 opacity-70">coins</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mr-1">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 6v12"></path>
                        <path d="M8 10h8"></path>
                      </svg>
                      <span className="font-bold text-red-400">-{challenge.penalty}</span>
                      <span className="ml-1 opacity-70">coins</span>
                    </>
                  )}
                </div>
                
                <span className="text-sm opacity-70">{challenge.date}</span>
              </div>
            </div>
          ))}
          
          {completedChallenges.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Award size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">No completed challenges</h3>
              <p className="opacity-80">Join some challenges to see your results here!</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Challenges;