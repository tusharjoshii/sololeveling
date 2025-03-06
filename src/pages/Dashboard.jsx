import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Dumbbell, 
  Trophy, 
  Users, 
  BarChart3,
  Flame,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import RankBadge from '../components/RankBadge';

function Dashboard() {
  const { userProfile, currentUser } = useAuth();
  const { playSoundEffect } = useAudio();
  const [dailyTasks, setDailyTasks] = useState([]);
  const [topRankers, setTopRankers] = useState([]);
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;
      
      try {
        // Fetch daily tasks
        const tasksRef = collection(db, 'tasks');
        const tasksQuery = query(
          tasksRef,
          where('userId', '==', currentUser.uid),
          where('date', '==', new Date().toISOString().split('T')[0]),
          orderBy('createdAt', 'desc')
        );
        
        const tasksSnapshot = await getDocs(tasksQuery);
        const tasksData = tasksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setDailyTasks(tasksData.length > 0 ? tasksData : generateDailyTasks());
        
        // Fetch top rankers
        const usersRef = collection(db, 'users');
        const rankersQuery = query(
          usersRef,
          orderBy('coins', 'desc'),
          limit(5)
        );
        
        const rankersSnapshot = await getDocs(rankersQuery);
        const rankersData = rankersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setTopRankers(rankersData);
        
        // Fetch recent achievements (placeholder for now)
        setRecentAchievements([
          { id: 1, title: 'First Workout', description: 'Completed your first workout', date: '2 days ago' },
          { id: 2, title: 'Streak Master', description: 'Maintained a 3-day streak', date: '1 day ago' },
          { id: 3, title: 'Push-up Pro', description: 'Completed 100 push-ups in a day', date: 'Today' },
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [currentUser]);
  
  // Generate placeholder daily tasks based on user rank
  const generateDailyTasks = () => {
    const rank = userProfile?.rank || 'E';
    const multiplier = {
      'E': 1,
      'D': 1.5,
      'C': 2,
      'B': 2.5,
      'A': 3,
      'S': 4
    }[rank];
    
    return [
      {
        id: 'task1',
        title: 'Push-ups',
        description: 'Complete push-ups to build upper body strength',
        target: Math.floor(10 * multiplier),
        current: 0,
        completed: false,
        type: 'strength'
      },
      {
        id: 'task2',
        title: 'Running',
        description: 'Run to improve your cardio',
        target: Math.floor(1 * multiplier),
        unit: 'km',
        current: 0,
        completed: false,
        type: 'cardio'
      },
      {
        id: 'task3',
        title: 'Sit-ups',
        description: 'Strengthen your core with sit-ups',
        target: Math.floor(15 * multiplier),
        current: 0,
        completed: false,
        type: 'strength'
      }
    ];
  };
  
  const getProgressPercentage = (current, target) => {
    return Math.min(100, Math.floor((current / target) * 100));
  };
  
  const handleTaskProgress = (taskId, increment) => {
    playSoundEffect('buttonClick');
    
    setDailyTasks(prev => 
      prev.map(task => {
        if (task.id === taskId) {
          const newCurrent = Math.min(task.target, task.current + increment);
          const completed = newCurrent >= task.target;
          
          if (completed && !task.completed) {
            playSoundEffect('taskComplete');
          }
          
          return {
            ...task,
            current: newCurrent,
            completed
          };
        }
        return task;
      })
    );
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sl-soft-purple"></div>
      </div>
    );
  }
  
  return (
    <div className="sl-container">
      {/* Welcome section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, <span className="sl-gradient-text">{userProfile?.username || 'Hunter'}</span>
        </h1>
        <p className="text-sl-light-gray opacity-80">
          Ready to continue your journey to become stronger?
        </p>
      </motion.div>
      
      {/* Stats overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {/* Rank */}
        <div className="sl-card flex items-center">
          <div className="mr-4 p-3 rounded-full bg-sl-soft-purple bg-opacity-20">
            <TrendingUp size={24} className="text-sl-soft-purple" />
          </div>
          <div>
            <h3 className="text-sm font-medium opacity-80">Current Rank</h3>
            <div className="flex items-center mt-1">
              <RankBadge rank={userProfile?.rank || 'E'} />
            </div>
          </div>
        </div>
        
        {/* Coins */}
        <div className="sl-card flex items-center">
          <div className="mr-4 p-3 rounded-full bg-yellow-500 bg-opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v12"></path>
              <path d="M8 10h8"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium opacity-80">Coins</h3>
            <p className="text-xl font-bold">{userProfile?.coins || 0}</p>
          </div>
        </div>
        
        {/* Streak */}
        <div className="sl-card flex items-center">
          <div className="mr-4 p-3 rounded-full bg-red-500 bg-opacity-20">
            <Flame size={24} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium opacity-80">Current Streak</h3>
            <p className="text-xl font-bold">{userProfile?.streak || 0} days</p>
          </div>
        </div>
        
        {/* Workouts */}
        <div className="sl-card flex items-center">
          <div className="mr-4 p-3 rounded-full bg-green-500 bg-opacity-20">
            <Dumbbell size={24} className="text-green-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium opacity-80">Workouts Completed</h3>
            <p className="text-xl font-bold">{userProfile?.workoutsCompleted || 0}</p>
          </div>
        </div>
      </motion.div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="sl-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Today's Tasks</h2>
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span className="text-sm opacity-80">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {dailyTasks.map(task => (
                <div key={task.id} className="border border-sl-soft-purple border-opacity-20 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm opacity-80">{task.description}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${task.completed ? 'bg-green-500 bg-opacity-20 text-green-400' : 'bg-sl-soft-purple bg-opacity-20 text-sl-soft-purple'}`}>
                      {task.completed ? 'Completed' : 'In Progress'}
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="sl-progress-bar">
                      <div 
                        className="sl-progress-fill"
                        style={{ width: `${getProgressPercentage(task.current, task.target)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-sm">
                      <span>
                        {task.current}/{task.target} {task.unit || ''}
                      </span>
                      <span>{getProgressPercentage(task.current, task.target)}%</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      className="sl-button py-1 px-3 text-sm"
                      onClick={() => handleTaskProgress(task.id, 1)}
                    >
                      +1
                    </button>
                    <button 
                      className="sl-button py-1 px-3 text-sm"
                      onClick={() => handleTaskProgress(task.id, 5)}
                    >
                      +5
                    </button>
                    <button 
                      className="sl-button py-1 px-3 text-sm"
                      onClick={() => handleTaskProgress(task.id, 10)}
                    >
                      +10
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <Link to="/workouts" className="sl-button w-full flex items-center justify-center">
                <Dumbbell size={18} className="mr-2" />
                View All Workouts
              </Link>
            </div>
          </div>
        </motion.div>
        
        {/* Sidebar content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Top Rankers */}
          <div className="sl-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Top Hunters</h2>
              <Link to="/leaderboard" className="text-sm text-sl-soft-purple hover:text-sl-blue transition-colors">
                View All
              </Link>
            </div>
            
            <div className="space-y-3">
              {topRankers.length > 0 ? (
                topRankers.map((ranker, index) => (
                  <div key={ranker.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-sl-soft-purple hover:bg-opacity-10 transition-colors">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-sl-dark-purple flex items-center justify-center mr-3 border border-sl-soft-purple">
                        <span className="font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{ranker.username}</p>
                        <div className="flex items-center">
                          <RankBadge rank={ranker.rank} />
                          <span className="ml-2 text-xs opacity-80">{ranker.coins} coins</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center opacity-80">No rankers found</p>
              )}
            </div>
            
            <div className="mt-4">
              <Link to="/leaderboard" className="sl-button w-full flex items-center justify-center">
                <BarChart3 size={18} className="mr-2" />
                View Leaderboard
              </Link>
            </div>
          </div>
          
          {/* Recent Achievements */}
          <div className="sl-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent Achievements</h2>
              <Link to="/profile" className="text-sm text-sl-soft-purple hover:text-sl-blue transition-colors">
                View All
              </Link>
            </div>
            
            <div className="space-y-3">
              {recentAchievements.map(achievement => (
                <div key={achievement.id} className="p-2 rounded-lg hover:bg-sl-soft-purple hover:bg-opacity-10 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-sm opacity-80">{achievement.description}</p>
                    </div>
                    <span className="text-xs opacity-70">{achievement.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Quick access buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
      >
        <Link to="/challenges" className="sl-card p-6 hover:border-sl-soft-purple transition-all duration-300 flex flex-col items-center justify-center text-center">
          <Trophy size={32} className="mb-2 text-yellow-500" />
          <h3 className="font-bold mb-1">Challenges</h3>
          <p className="text-sm opacity-80">Compete with other hunters</p>
        </Link>
        
        <Link to="/social" className="sl-card p-6 hover:border-sl-soft-purple transition-all duration-300 flex flex-col items-center justify-center text-center">
          <Users size={32} className="mb-2 text-sl-soft-purple" />
          <h3 className="font-bold mb-1">Social</h3>
          <p className="text-sm opacity-80">Connect with other hunters</p>
        </Link>
        
        <Link to="/leaderboard" className="sl-card p-6 hover:border-sl-soft-purple transition-all duration-300 flex flex-col items-center justify-center text-center">
          <BarChart3 size={32} className="mb-2 text-sl-blue" />
          <h3 className="font-bold mb-1">Leaderboard</h3>
          <p className="text-sm opacity-80">See top ranked hunters</p>
        </Link>
      </motion.div>
    </div>
  );
}

export default Dashboard;