import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bell, MessageCircle, User, LogOut, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import RankBadge from './RankBadge';

function Navbar() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  return (
    <nav className="bg-sl-dark-violet bg-opacity-90 border-b border-sl-soft-purple border-opacity-30 px-4 py-3 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        {/* Logo and title */}
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mr-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A480F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <h1 className="sl-gradient-text text-xl hidden md:block">SOLO LEVELING</h1>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-sl-light-gray"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <Menu size={24} />
        </button>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {userProfile && (
            <>
              {/* Coins */}
              <div className="flex items-center">
                <motion.div
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="text-yellow-400 mr-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v12"></path>
                    <path d="M8 10h8"></path>
                  </svg>
                </motion.div>
                <span className="font-medium">{userProfile.coins}</span>
              </div>
              
              {/* Rank */}
              <RankBadge rank={userProfile.rank} />
              
              {/* Notifications */}
              <button className="relative p-1 rounded-full hover:bg-sl-soft-purple hover:bg-opacity-20 transition-colors">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Messages */}
              <button className="relative p-1 rounded-full hover:bg-sl-soft-purple hover:bg-opacity-20 transition-colors">
                <MessageCircle size={20} />
              </button>
            </>
          )}
          
          {/* User profile */}
          <div className="relative">
            <button 
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-sl-soft-purple hover:bg-opacity-20 transition-colors"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="w-8 h-8 rounded-full bg-sl-soft-purple flex items-center justify-center overflow-hidden border-2 border-sl-soft-purple">
                <User size={16} />
              </div>
              <span className="hidden lg:block">{currentUser?.displayName || 'User'}</span>
            </button>
            
            {/* Dropdown menu */}
            {showDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-48 bg-sl-dark-violet rounded-md shadow-lg py-1 z-50 border border-sl-soft-purple border-opacity-30"
              >
                <Link 
                  to="/profile" 
                  className="block px-4 py-2 text-sm hover:bg-sl-soft-purple hover:bg-opacity-20 transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-sl-soft-purple hover:bg-opacity-20 transition-colors"
                >
                  <div className="flex items-center">
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </div>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {showMobileMenu && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden mt-4 pt-2 border-t border-sl-soft-purple border-opacity-30"
        >
          {userProfile && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <motion.div
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="text-yellow-400 mr-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v12"></path>
                    <path d="M8 10h8"></path>
                  </svg>
                </motion.div>
                <span className="font-medium">{userProfile.coins}</span>
              </div>
              
              <RankBadge rank={userProfile.rank} />
            </div>
          )}
          
          <div className="flex flex-col space-y-2">
            <Link 
              to="/profile" 
              className="px-4 py-2 rounded-md hover:bg-sl-soft-purple hover:bg-opacity-20 transition-colors"
              onClick={() => setShowMobileMenu(false)}
            >
              Profile
            </Link>
            <button 
              onClick={handleLogout}
              className="text-left px-4 py-2 rounded-md hover:bg-sl-soft-purple hover:bg-opacity-20 transition-colors"
            >
              <div className="flex items-center">
                <LogOut size={16} className="mr-2" />
                Logout
              </div>
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

export default Navbar;