import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AudioProvider } from './contexts/AudioContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Workouts from './pages/Workouts';
import Challenges from './pages/Challenges';
import Leaderboard from './pages/Leaderboard';
import Social from './pages/Social';
import NotFound from './pages/NotFound';
import Landing from './pages/Landing';

// Components
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const { currentUser, loading } = useAuth();

  // Show loading screen while auth state is being determined
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AudioProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={!currentUser ? <Landing /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!currentUser ? <Register /> : <Navigate to="/dashboard" />} />
        
        {/* Protected routes */}
        <Route element={<Layout />}>
          {/* <Route path="/" element={<Navigate to={currentUser ? "/dashboard" : "/login"} />} /> */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/workouts" element={<PrivateRoute><Workouts /></PrivateRoute>} />
          <Route path="/challenges" element={<PrivateRoute><Challenges /></PrivateRoute>} />
          <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
          <Route path="/social" element={<PrivateRoute><Social /></PrivateRoute>} />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AudioProvider>
  );
}

export default App;