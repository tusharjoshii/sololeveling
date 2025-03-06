import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Clock,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { toast } from 'react-toastify';

function Workouts() {
  const { userProfile, updateUserProfile } = useAuth();
  const { playSoundEffect } = useAudio();
  const [workouts, setWorkouts] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    difficulty: 'all'
  });
  
  // Generate workouts based on user rank
  useEffect(() => {
    if (userProfile) {
      const generatedWorkouts = generateWorkoutsForRank(userProfile.rank);
      setWorkouts(generatedWorkouts);
    }
  }, [userProfile]);
  
  // Timer logic
  useEffect(() => {
    let interval;
    
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning]);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const generateWorkoutsForRank = (rank) => {
    const multiplier = {
      'E': 1,
      'D': 1.5,
      'C': 2,
      'B': 2.5,
      'A': 3,
      'S': 4
    }[rank] || 1;
    
    return [
      {
        id: 'workout1',
        title: 'Beginner Full Body',
        description: 'A full body workout for beginners',
        difficulty: 'beginner',
        type: 'strength',
        duration: '15-20 min',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        exercises: [
          { name: 'Push-ups', reps: Math.floor(8 * multiplier), sets: 3 },
          { name: 'Squats', reps: Math.floor(12 * multiplier), sets: 3 },
          { name: 'Plank', duration: '30 seconds', sets: 3 },
          { name: 'Jumping Jacks', reps: Math.floor(20 * multiplier), sets: 3 }
        ]
      },
      {
        id: 'workout2',
        title: 'Cardio Blast',
        description: 'High intensity cardio workout',
        difficulty: 'intermediate',
        type: 'cardio',
        duration: '20-25 min',
        image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        exercises: [
          { name: 'High Knees', duration: '45 seconds', sets: 3 },
          { name: 'Burpees', reps: Math.floor(10 * multiplier), sets: 3 },
          { name: 'Mountain Climbers', duration: '45 seconds', sets: 3 },
          { name: 'Jump Rope', duration: '1 minute', sets: 3 }
        ]
      },
      {
        id: 'workout3',
        title: 'Core Crusher',
        description: 'Focus on strengthening your core',
        difficulty: 'intermediate',
        type: 'strength',
        duration: '15-20 min',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        exercises: [
          { name: 'Sit-ups', reps: Math.floor(15 * multiplier), sets: 3 },
          { name: 'Russian Twists', reps: Math.floor(20 * multiplier), sets: 3 },
          { name: 'Leg Raises', reps: Math.floor(12 * multiplier), sets: 3 },
          { name: 'Plank', duration: '45 seconds', sets: 3 }
        ]
      },
      {
        id: 'workout4',
        title: 'Upper Body Focus',
        description: 'Build strength in your upper body',
        difficulty: 'advanced',
        type: 'strength',
        duration: '25-30 min',
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        exercises: [
          { name: 'Push-ups', reps: Math.floor(15 * multiplier), sets: 4 },
          { name: 'Dips', reps: Math.floor(12 * multiplier), sets: 3 },
          { name: 'Pull-ups', reps: Math.floor(8 * multiplier), sets: 3 },
          { name: 'Shoulder Taps', reps: Math.floor(16 * multiplier), sets: 3 }
        ]
      },
      {
        id: 'workout5',
        title: 'Lower Body Power',
        description: 'Build strength in your legs',
        difficulty: 'intermediate',
        type: 'strength',
        duration: '20-25 min',
        image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        exercises: [
          { name: 'Squats', reps: Math.floor(20 * multiplier), sets: 4 },
          { name: 'Lunges', reps: Math.floor(12 * multiplier), sets: 3 },
          { name: 'Calf Raises', reps: Math.floor(15 * multiplier), sets: 3 },
          { name: 'Glute Bridges', reps: Math.floor(15 * multiplier), sets: 3 }
        ]
      },
      {
        id: 'workout6',
        title: 'HIIT Challenge',
        description: 'High intensity interval training',
        difficulty: 'advanced',
        type: 'cardio',
        duration: '25-30 min',
        image: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        exercises: [
          { name: 'Burpees', reps: Math.floor(12 * multiplier), sets: 4 },
          { name: 'Jump Squats', reps: Math.floor(15 * multiplier), sets: 4 },
          { name: 'Mountain Climbers', duration: '45 seconds', sets: 4 },
          { name: 'Jumping Lunges', reps: Math.floor(12 * multiplier), sets: 4 }
        ]
      }
    ];
  };
  
  const startWorkout = (workout) => {
    setActiveWorkout(workout);
    setTimer(0);
    setIsTimerRunning(true);
    playSoundEffect('buttonClick');
    toast.info(`Starting ${workout.title} workout!`);
  };
  
  const pauseTimer = () => {
    setIsTimerRunning(false);
    playSoundEffect('buttonClick');
  };
  
  const resumeTimer = () => {
    setIsTimerRunning(true);
    playSoundEffect('buttonClick');
  };
  
  const resetWorkout = () => {
    setTimer(0);
    setIsTimerRunning(false);
    playSoundEffect('buttonClick');
    toast.info('Workout reset!');
  };
  
  const completeWorkout = async () => {
    playSoundEffect('taskComplete');
    
    try {
      // Update user profile with completed workout
      const updatedProfile = {
        workoutsCompleted: (userProfile.workoutsCompleted || 0) + 1,
        experience: (userProfile.experience || 0) + 50,
        coins: (userProfile.coins || 0) + 25
      };
      
      // Check if level up is needed
      if (Math.floor((updatedProfile.experience) / 100) > Math.floor((userProfile.experience || 0) / 100)) {
        updatedProfile.level = (userProfile.level || 1) + 1;
        playSoundEffect('levelUp');
        toast.success(`Level up! You are now level ${updatedProfile.level}!`);
      }
      
      await updateUserProfile(updatedProfile);
      
      setActiveWorkout(null);
      setTimer(0);
      setIsTimerRunning(false);
      
      toast.success('Workout completed! +25 coins, +50 XP');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to complete workout');
    }
  };
  
  const filteredWorkouts = workouts.filter(workout => {
    if (filters.type !== 'all' && workout.type !== filters.type) return false;
    if (filters.difficulty !== 'all' && workout.difficulty !== filters.difficulty) return false;
    return true;
  });
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-500';
      case 'intermediate': return 'text-yellow-500';
      case 'advanced': return 'text-red-500';
      default: return 'text-sl-light-gray';
    }
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
        <h1 className="text-3xl font-bold mb-2">Workouts</h1>
        <p className="text-sl-light-gray opacity-80">
          Choose a workout to start your training
        </p>
      </motion.div>
      
      {/* Active workout */}
      {activeWorkout && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sl-card mb-8"
        >
          <div className="flex flex-col md:flex-row items-center mb-6">
            <div className="w-full md:w-1/3 mb-4 md:mb-0 md:mr-6">
              <div className="relative rounded-lg overflow-hidden h-48">
                <img 
                  src={activeWorkout.image} 
                  alt={activeWorkout.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sl-dark-purple to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold">{activeWorkout.title}</h3>
                  <p className="text-sm opacity-80">{activeWorkout.duration}</p>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-2/3">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-2xl font-bold mb-1">Current Workout</h2>
                  <p className="opacity-80">{activeWorkout.description}</p>
                </div>
                
                <div className="flex items-center">
                  <div className="text-center mr-6">
                    <p className="text-3xl font-bold font-display">{formatTime(timer)}</p>
                    <p className="text-xs opacity-80">Elapsed Time</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    {isTimerRunning ? (
                      <button 
                        className="p-3 rounded-full bg-sl-soft-purple bg-opacity-20 hover:bg-opacity-30 transition-colors"
                        onClick={pauseTimer}
                      >
                        <Pause size={20} />
                      </button>
                    ) : (
                      <button 
                        className="p-3 rounded-full bg-sl-soft-purple bg-opacity-20 hover:bg-opacity-30 transition-colors"
                        onClick={resumeTimer}
                      >
                        <Play size={20} />
                      </button>
                    )}
                    
                    <button 
                      className="p-3 rounded-full bg-sl-soft-purple bg-opacity-20 hover:bg-opacity-30 transition-colors"
                      onClick={resetWorkout}
                    >
                      <RotateCcw size={20} />
                    </button>
                    
                    <button 
                      className="p-3 rounded-full bg-green-500 bg-opacity-20 hover:bg-opacity-30 transition-colors text-green-500"
                      onClick={completeWorkout}
                    >
                      <CheckCircle size={20} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-sl-dark-purple rounded-lg p-4">
                <h3 className="font-medium mb-3">Exercises</h3>
                <div className="space-y-3">
                  {activeWorkout.exercises.map((exercise, index) => (
                    <div key={index} className="flex justify-between items-center p-2 rounded-md hover:bg-sl-soft-purple hover:bg-opacity-10 transition-colors">
                      <div>
                        <p className="font-medium">{exercise.name}</p>
                        <p className="text-sm opacity-80">
                          {exercise.reps 
                            ? `${exercise.sets} sets x ${exercise.reps} reps` 
                            : `${exercise.sets} sets x ${exercise.duration}`}
                        </p>
                      </div>
                      <div className="w-6 h-6 rounded-full border-2 border-sl-soft-purple flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <button 
            className="sl-button w-full"
            onClick={() => setActiveWorkout(null)}
          >
            Choose Different Workout
          </button>
        </motion.div>
      )}
      
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <button 
          className="flex items-center mb-4 text-sl-soft-purple hover:text-sl-blue transition-colors"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <Filter size={18} className="mr-2" />
          Filter Workouts
          {filterOpen ? <ChevronUp size={18} className="ml-2" /> : <ChevronDown size={18} className="ml-2" />}
        </button>
        
        {filterOpen && (
          <div className="sl-card mb-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Workout Type</label>
                <select 
                  className="sl-input w-full"
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                >
                  <option value="all">All Types</option>
                  <option value="strength">Strength</option>
                  <option value="cardio">Cardio</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty</label>
                <select 
                  className="sl-input w-full"
                  value={filters.difficulty}
                  onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                >
                  <option value="all">All Difficulties</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Workout list */}
      {!activeWorkout && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredWorkouts.map(workout => (
            <motion.div
              key={workout.id}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="sl-card overflow-hidden cursor-pointer"
              onClick={() => startWorkout(workout)}
            >
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                <img 
                  src={workout.image} 
                  alt={workout.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sl-dark-purple to-transparent"></div>
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(workout.difficulty)}`}>
                    {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}
                  </span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-1">{workout.title}</h3>
              <p className="text-sm opacity-80 mb-3">{workout.description}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Dumbbell size={16} className="mr-1" />
                  <span className="text-sm">{workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span className="text-sm">{workout.duration}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-sl-soft-purple border-opacity-20">
                <button className="sl-button w-full flex items-center justify-center">
                  <Play size={18} className="mr-2" />
                  Start Workout
                </button>
              </div>
            </motion.div>
          ))}
          
          {filteredWorkouts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Dumbbell size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">No workouts found</h3>
              <p className="opacity-80">Try changing your filters to see more workouts</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default Workouts;