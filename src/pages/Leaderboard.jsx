import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Trophy, 
  Medal, 
  Search,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import RankBadge from '../components/RankBadge';

function Leaderboard() {
  const { userProfile } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    rank: 'all',
    timeframe: 'all-time'
  });
  
  useEffect(() => {
    // Mock data for leaderboard
    const mockUsers = [
      {
        id: 'user1',
        username: 'FitnessMaster',
        rank: 'A',
        coins: 2500,
        workoutsCompleted: 120,
        streak: 45,
        verified: true
      },
      {
        id: 'user2',
        username: 'RunnerPro',
        rank: 'B',
        coins: 1800,
        workoutsCompleted: 95,
        streak: 30,
        verified: true
      },
      {
        id: 'user3',
        username: 'GymRat',
        rank: 'C',
        coins: 1200,
        workoutsCompleted: 75,
        streak: 15,
        verified: false
      },
      {
        id: 'user4',
        username: 'StrengthGuru',
        rank: 'S',
        coins: 5000,
        workoutsCompleted: 250,
        streak: 90,
        verified: true
      },
      {
        id: 'user5',
        username: 'FitnessNewbie',
        rank: 'E',
        coins: 300,
        workoutsCompleted: 20,
        streak: 5,
        verified: false
      },
      {
        id: 'user6',
        username: 'CardioKing',
        rank: 'A',
        coins: 2200,
        workoutsCompleted: 110,
        streak: 40,
        verified: true
      },
      {
        id: 'user7',
        username: 'FlexMaster',
        rank: 'D',
        coins: 800,
        workoutsCompleted: 50,
        streak: 10,
        verified: false
      },
      {
        id: 'user8',
        username: 'IronPumper',
        rank: 'B',
        coins: 1600,
        workoutsCompleted: 85,
        streak: 25,
        verified: false
      },
      {
        id: 'user9',
        username: 'EnduranceChamp',
        rank: 'C',
        coins: 1100,
        workoutsCompleted: 70,
        streak: 12,
        verified: false
      },
      {
        id: 'user10',
        username: 'PowerLifter',
        rank: 'A',
        coins: 2100,
        workoutsCompleted: 105,
        streak: 38,
        verified: true
      }
    ];
    
    // Add current user if not already in the list
    if (userProfile && !mockUsers.some(user => user.id === userProfile.uid)) {
      mockUsers.push({
        id: userProfile.uid,
        username: userProfile.username,
        rank: userProfile.rank,
        coins: userProfile.coins || 0,
        workoutsCompleted: userProfile.workoutsCompleted || 0,
        streak: userProfile.streak || 0,
        verified: userProfile.verified || false
      });
    }
    
    // Sort by coins (descending)
    mockUsers.sort((a, b) => b.coins - a.coins);
    
    setUsers(mockUsers);
    setLoading(false);
  }, [userProfile]);
  
  const filteredUsers = users.filter(user => {
    // Search filter
    if (searchTerm && !user.username.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Rank filter
    if (filters.rank !== 'all' && user.rank !== filters.rank) {
      return false;
    }
    
    return true;
  });
  
  const getUserRank = (userId) => {
    const index = filteredUsers.findIndex(user => user.id === userId);
    return index + 1;
  };
  
  const isCurrentUser = (userId) => {
    return userProfile && userProfile.uid === userId;
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-sl-light-gray opacity-80">
          See how you rank against other hunters
        </p>
      </motion.div>
      
      {/* Search and filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-sl-light-gray opacity-50" />
            </div>
            <input
              type="text"
              className="sl-input w-full pl-10"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            className="flex items-center text-sl-soft-purple hover:text-sl-blue transition-colors"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter size={18} className="mr-2" />
            Filter Leaderboard
            {filterOpen ? <ChevronUp size={18} className="ml-2" /> : <ChevronDown size={18} className="ml-2" />}
          </button>
        </div>
        
        {filterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <div className="sl-card p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rank</label>
                  <select 
                    className="sl-input w-full"
                    value={filters.rank}
                    onChange={(e) => setFilters({...filters, rank: e.target.value})}
                  >
                    <option value="all">All Ranks</option>
                    <option value="E">Rank E</option>
                    <option value="D">Rank D</option>
                    <option value="C">Rank C</option>
                    <option value="B">Rank B</option>
                    <option value="A">Rank A</option>
                    <option value="S">Rank S</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Time Frame</label>
                  <select 
                    className="sl-input w-full"
                    value={filters.timeframe}
                    onChange={(e) => setFilters({...filters, timeframe: e.target.value})}
                  >
                    <option value="all-time">All Time</option>
                    <option value="this-week">This Week</option>
                    <option value="this-month">This Month</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {/* Top 3 users */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        {filteredUsers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 2nd place */}
            {filteredUsers.length > 1 && (
              <div className="order-2 md:order-1">
                <div className="sl-card p-6 text-center relative">
                  <div className="absolute top-3 left-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="font-bold text-sl-dark-purple">2</span>
                    </div>
                  </div>
                  
                  <div className="w-20 h-20 rounded-full bg-sl-soft-purple bg-opacity-20 flex items-center justify-center mx-auto mb-4 border-2 border-gray-300">
                    <span className="text-2xl font-bold">{filteredUsers[1].username.charAt(0)}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-1">
                    {filteredUsers[1].username}
                    {filteredUsers[1].verified && (
                      <span className="ml-1 text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </span>
                    )}
                  </h3>
                  
                  <div className="flex justify-center mb-3">
                    <RankBadge rank={filteredUsers[1].rank} />
                  </div>
                  
                  <div className="flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500 mr-1">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 6v12"></path>
                      <path d="M8 10h8"></path>
                    </svg>
                    <span className="font-bold">{filteredUsers[1].coins}</span>
                  </div>
                  
                  {isCurrentUser(filteredUsers[1].id) && (
                    <div className="mt-2 text-xs text-sl-soft-purple">
                      This is you!
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* 1st place */}
            <div className="order-1 md:order-2">
              <div className="sl-card p-6 text-center relative transform md:scale-110 border-2 border-yellow-500 border-opacity-50">
                <div className="absolute top-3 left-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                    <Trophy size={16} className="text-sl-dark-purple" />
                  </div>
                </div>
                
                <div className="w-24 h-24 rounded-full bg-sl-soft-purple bg-opacity-20 flex items-center justify-center mx-auto mb-4 border-4 border-yellow-500">
                  <span className="text-3xl font-bold">{filteredUsers[0].username.charAt(0)}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-1">
                  {filteredUsers[0].username}
                  {filteredUsers[0].verified && (
                    <span className="ml-1 text-blue-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </span>
                  )}
                </h3>
                
                <div className="flex justify-center mb-3">
                  <RankBadge rank={filteredUsers[0].rank} />
                </div>
                
                <div className="flex justify-center items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500 mr-1">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v12"></path>
                    <path d="M8 10h8"></path>
                  </svg>
                  <span className="text-lg font-bold">{filteredUsers[0].coins}</span>
                </div>
                
                {isCurrentUser(filteredUsers[0].id) && (
                  <div className="mt-2 text-xs text-sl-soft-purple">
                    This is you!
                  </div>
                )}
              </div>
            </div>
            
            {/* 3rd place */}
            {filteredUsers.length > 2 && (
              <div className="order-3">
                <div className="sl-card p-6 text-center relative">
                  <div className="absolute top-3 left-3">
                    <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center">
                      <span className="font-bold text-sl-dark-purple">3</span>
                    </div>
                  </div>
                  
                  <div className="w-20 h-20 rounded-full bg-sl-soft-purple bg-opacity-20 flex items-center justify-center mx-auto mb-4 border-2 border-amber-700">
                    <span className="text-2xl font-bold">{filteredUsers[2].username.charAt(0)}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-1">
                    {filteredUsers[2].username}
                    {filteredUsers[2].verified && (
                      <span className="ml-1 text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </span>
                    )}
                  </h3>
                  
                  <div className="flex justify-center mb-3">
                    <RankBadge rank={filteredUsers[2].rank} />
                  </div>
                  
                  <div className="flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500 mr-1">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 6v12"></path>
                      <path d="M8 10h8"></path>
                    </svg>
                    <span className="font-bold">{filteredUsers[2].coins}</span>
                  </div>
                  
                  {isCurrentUser(filteredUsers[2].id) && (
                    <div className="mt-2 text-xs text-sl-soft-purple">
                      This is you!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
      
      {/* Leaderboard table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="sl-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-sl-soft-purple border-opacity-30">
                  <th className="px-4 py-3 text-left">Rank</th>
                  <th className="px-4 py-3 text-left">Hunter</th>
                  <th className="px-4 py-3 text-center">Rank</th>
                  <th className="px-4 py-3 text-center">Coins</th>
                  <th className="px-4 py-3 text-center">Workouts</th>
                  <th className="px-4 py-3 text-center">Streak</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.slice(3).map((user, index) => (
                  <tr 
                    key={user.id} 
                    className={`border-b border-sl-soft-purple border-opacity-10 hover:bg-sl-soft-purple hover:bg-opacity-10 transition-colors ${
                      isCurrentUser(user.id) ? 'bg-sl-soft-purple bg-opacity-5' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <span className="font-bold">{index + 4}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-sl-soft-purple bg-opacity-20 flex items-center justify-center mr-3">
                          <span className="font-bold">{user.username.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {user.username}
                            {user.verified && (
                              <span className="ml-1 text-blue-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                              </span>
                            )}
                          </p>
                          {isCurrentUser(user.id) && (
                            <span className="text-xs text-sl-soft-purple">You</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <RankBadge rank={user.rank} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500 mr-1">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 6v12"></path>
                          <path d="M8 10h8"></path>
                        </svg>
                        <span className="font-bold">{user.coins}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-medium">{user.workoutsCompleted}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mr-1">
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        <span className="font-medium">{user.streak} days</span>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center">
                      <BarChart3 size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="opacity-80">No users found matching your filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Leaderboard;