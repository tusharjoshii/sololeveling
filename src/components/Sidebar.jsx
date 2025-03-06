import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Trophy, 
  BarChart3, 
  Users, 
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  
  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/workouts', icon: <Dumbbell size={20} />, label: 'Workouts' },
    { path: '/challenges', icon: <Trophy size={20} />, label: 'Challenges' },
    { path: '/leaderboard', icon: <BarChart3 size={20} />, label: 'Leaderboard' },
    { path: '/social', icon: <Users size={20} />, label: 'Social' },
    { path: '/profile', icon: <User size={20} />, label: 'Profile' },
  ];
  
  return (
    <motion.div 
      className="bg-sl-dark-violet bg-opacity-90 border-r border-sl-soft-purple border-opacity-30 h-screen flex flex-col"
      initial={{ width: collapsed ? 80 : 240 }}
      animate={{ width: collapsed ? 80 : 240 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-1 py-8 overflow-y-auto">
        <ul className="space-y-2 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-sl-soft-purple bg-opacity-20 text-sl-soft-purple' 
                      : 'text-sl-light-gray hover:bg-sl-soft-purple hover:bg-opacity-10'
                  }`
                }
              >
                <div className="flex items-center justify-center">
                  {item.icon}
                </div>
                {!collapsed && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="ml-3 font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Collapse button */}
      <div className="p-4 border-t border-sl-soft-purple border-opacity-30">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full p-2 rounded-lg hover:bg-sl-soft-purple hover:bg-opacity-10 transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span className="ml-2">Collapse</span>}
        </button>
      </div>
    </motion.div>
  );
}

export default Sidebar;