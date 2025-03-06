import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Edit, Save, User, Award, Calendar, Flame, Dumbbell } from 'lucide-react';
import RankBadge from '../components/RankBadge';
import { toast } from 'react-toastify';

function Profile() {
  const { userProfile, updateUserProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (userProfile) {
      setFormData({
        username: userProfile.username || '',
        bio: userProfile.bio || ''
      });
    }
  }, [userProfile]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateUserProfile({
        username: formData.username,
        bio: formData.bio
      });
      
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sl-soft-purple"></div>
      </div>
    );
  }
  
  // Calculate level progress
  const levelProgress = (userProfile.experience % 100) || 0;
  
  // Mock achievements
  const achievements = [
    { id: 1, title: 'First Workout', description: 'Completed your first workout', date: '2 days ago', icon: <Dumbbell size={20} /> },
    { id: 2, title: 'Streak Master', description: 'Maintained a 3-day streak', date: '1 day ago', icon: <Flame size={20} /> },
    { id: 3, title: 'Push-up Pro', description: 'Completed 100 push-ups in a day', date: 'Today', icon: <Award size={20} /> },
  ];
  
  return (
    <div className="sl-container">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1"
        >
          <div className="sl-card">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-sl-soft-purple bg-opacity-20 flex items-center justify-center mb-4 border-2 border-sl-soft-purple">
                <User size={40} className="text-sl-soft-purple" />
              </div>
              
              {editing ? (
                <form onSubmit={handleSubmit} className="w-full">
                  <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="sl-input w-full"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="bio" className="block text-sm font-medium mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows="3"
                      className="sl-input w-full"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="mr-2 px-4 py-2 rounded-md border border-sl-soft-purple text-sl-soft-purple hover:bg-sl-soft-purple hover:bg-opacity-10 transition-colors"
                      onClick={() => setEditing(false)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="sl-button flex items-center"
                      disabled={loading}
                    >
                      {loading ? (
                        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <Save size={18} className="mr-2" />
                      )}
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-1">{userProfile.username}</h2>
                  <div className="flex items-center mb-4">
                    <RankBadge rank={userProfile.rank} />
                    {userProfile.verified && (
                      <span className="ml-2 text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </span>
                    )}
                  </div>
                  
                  <p className="text-center mb-6 opacity-80">
                    {userProfile.bio || 'No bio yet. Click edit to add one!'}
                  </p>
                  
                  <button
                    className="sl-button flex items-center mb-6"
                    onClick={() => setEditing(true)}
                  >
                    <Edit size={18} className="mr-2" />
                    Edit Profile
                  </button>
                </>
              )}
              
              <div className="w-full border-t border-sl-soft-purple border-opacity-30 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm opacity-80">Level</p>
                    <p className="text-xl font-bold">{userProfile.level || 1}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm opacity-80">Coins</p>
                    <p className="text-xl font-bold">{userProfile.coins || 0}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Experience</span>
                    <span>{levelProgress}/100 XP</span>
                  </div>
                  <div className="sl-progress-bar">
                    <div 
                      className="sl-progress-fill"
                      style={{ width: `${levelProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Stats and achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          {/* Stats */}
          <div className="sl-card mb-6">
            <h2 className="text-xl font-bold mb-4">Stats</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center p-4 rounded-lg bg-sl-dark-purple">
                <div className="mr-4 p-3 rounded-full bg-red-500 bg-opacity-20">
                  <Flame size={24} className="text-red-500" />
                </div>
                <div>
                  <p className="text-sm opacity-80">Current Streak</p>
                  <p className="text-xl font-bold">{userProfile.streak || 0} days</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 rounded-lg bg-sl-dark-purple">
                <div className="mr-4 p-3 rounded-full bg-green-500 bg-opacity-20">
                  <Dumbbell size={24} className="text-green-500" />
                </div>
                <div>
                  <p className="text-sm opacity-80">Workouts</p>
                  <p className="text-xl font-bold">{userProfile.workoutsCompleted || 0}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 rounded-lg bg-sl-dark-purple">
                <div className="mr-4 p-3 rounded-full bg-blue-500 bg-opacity-20">
                  <Calendar size={24} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-sm opacity-80">Joined</p>
                  <p className="text-xl font-bold">
                    {userProfile.createdAt ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Achievements */}
          <div className="sl-card">
            <h2 className="text-xl font-bold mb-4">Achievements</h2>
            
            <div className="space-y-4">
              {achievements.map(achievement => (
                <div key={achievement.id} className="flex items-start p-4 rounded-lg bg-sl-dark-purple">
                  <div className="mr-4 p-3 rounded-full bg-yellow-500 bg-opacity-20 text-yellow-500">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{achievement.title}</h3>
                      <span className="text-xs opacity-70">{achievement.date}</span>
                    </div>
                    <p className="text-sm opacity-80">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {achievements.length === 0 && (
              <div className="text-center py-8">
                <Award size={48} className="mx-auto mb-4 opacity-50" />
                <p className="opacity-80">No achievements yet. Keep working out to earn some!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Profile;