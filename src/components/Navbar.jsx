"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { signOut } from "firebase/auth"
import { auth } from "../firebase/config"
import { useAuth } from "../contexts/AuthContext"
import RankBadge from "./RankBadge"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { currentUser } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Check if we're on the landing page
  const isLandingPage = location.pathname === "/"

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // If on landing page and not logged in, show transparent navbar
  if (isLandingPage && !currentUser) {
    return (
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4 transition-all duration-300 ${
          scrolled ? "bg-gray-900/80 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              ARISE
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/login" className="text-gray-300 hover:text-white transition-colors duration-300">
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 rounded-lg font-medium shadow-md shadow-blue-600/20 transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Register
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 bg-gray-800/90 backdrop-blur-md rounded-lg overflow-hidden"
            >
              <div className="px-4 py-2 space-y-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    )
  }

  // Main navbar for authenticated users or non-landing pages
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md shadow-lg px-4 sm:px-6 lg:px-8 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to={currentUser ? "/dashboard" : "/"} className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            ARISE
          </span>
        </Link>

        {currentUser ? (
          <>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/dashboard"
                className={`text-gray-300 hover:text-white transition-colors duration-300 ${
                  location.pathname === "/dashboard" ? "text-white font-medium" : ""
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/workouts"
                className={`text-gray-300 hover:text-white transition-colors duration-300 ${
                  location.pathname === "/workouts" ? "text-white font-medium" : ""
                }`}
              >
                Workouts
              </Link>
              <Link
                to="/challenges"
                className={`text-gray-300 hover:text-white transition-colors duration-300 ${
                  location.pathname === "/challenges" ? "text-white font-medium" : ""
                }`}
              >
                Challenges
              </Link>
              <Link
                to="/leaderboard"
                className={`text-gray-300 hover:text-white transition-colors duration-300 ${
                  location.pathname === "/leaderboard" ? "text-white font-medium" : ""
                }`}
              >
                Leaderboard
              </Link>
              <Link
                to="/social"
                className={`text-gray-300 hover:text-white transition-colors duration-300 ${
                  location.pathname === "/social" ? "text-white font-medium" : ""
                }`}
              >
                Social
              </Link>

              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL || "/placeholder.svg"}
                        alt={currentUser.displayName || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium">
                        {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : "U"}
                      </span>
                    )}
                  </div>
                  <RankBadge rank="E" className="w-6 h-6" />
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-300"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-300"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-300"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors duration-300">
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 rounded-lg font-medium shadow-md shadow-blue-600/20 transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Register
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 bg-gray-800/90 backdrop-blur-md rounded-lg overflow-hidden"
          >
            <div className="px-4 py-2 space-y-1">
              {currentUser ? (
                <>
                  <div className="flex items-center space-x-2 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL || "/placeholder.svg"}
                          alt={currentUser.displayName || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium">
                          {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : "U"}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{currentUser.displayName || "User"}</div>
                      <div className="text-xs text-gray-400">Level 1 • Rank E</div>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 my-2"></div>

                  <Link
                    to="/dashboard"
                    className={`block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-300 ${
                      location.pathname === "/dashboard" ? "bg-gray-700 text-white" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/workouts"
                    className={`block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-300 ${
                      location.pathname === "/workouts" ? "bg-gray-700 text-white" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Workouts
                  </Link>
                  <Link
                    to="/challenges"
                    className={`block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-300 ${
                      location.pathname === "/challenges" ? "bg-gray-700 text-white" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Challenges
                  </Link>
                  <Link
                    to="/leaderboard"
                    className={`block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-300 ${
                      location.pathname === "/leaderboard" ? "bg-gray-700 text-white" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Leaderboard
                  </Link>
                  <Link
                    to="/social"
                    className={`block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-300 ${
                      location.pathname === "/social" ? "bg-gray-700 text-white" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Social
                  </Link>
                  <Link
                    to="/profile"
                    className={`block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-300 ${
                      location.pathname === "/profile" ? "bg-gray-700 text-white" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className={`block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-300 ${
                      location.pathname === "/settings" ? "bg-gray-700 text-white" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Settings
                  </Link>

                  <div className="border-t border-gray-700 my-2"></div>

                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-red-300 hover:bg-gray-700 transition-colors duration-300"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar

