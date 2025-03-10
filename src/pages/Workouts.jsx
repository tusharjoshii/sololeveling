import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import gsap from "gsap"

const workoutCategories = [
  { id: "all", name: "All Workouts" },
  { id: "strength", name: "Strength" },
  { id: "cardio", name: "Cardio" },
  { id: "flexibility", name: "Flexibility" },
  { id: "hiit", name: "HIIT" },
]

const workouts = [
  {
    id: "w1",
    title: "Upper Body Strength",
    category: "strength",
    duration: 45,
    difficulty: "Intermediate",
    experience: 50,
    description: "Focus on building upper body strength with this comprehensive workout.",
    image: "/images/workout-upper.jpg",
    exercises: [
      { name: "Push-ups", sets: 3, reps: "12-15", rest: 60 },
      { name: "Pull-ups", sets: 3, reps: "8-10", rest: 90 },
      { name: "Dumbbell Shoulder Press", sets: 3, reps: "10-12", rest: 60 },
      { name: "Bent-over Rows", sets: 3, reps: "12", rest: 60 },
      { name: "Tricep Dips", sets: 3, reps: "12-15", rest: 60 },
      { name: "Bicep Curls", sets: 3, reps: "12", rest: 60 },
    ],
  },
  {
    id: "w2",
    title: "Lower Body Power",
    category: "strength",
    duration: 50,
    difficulty: "Intermediate",
    experience: 55,
    description: "Build leg strength and power with this intense lower body workout.",
    image: "/images/workout-lower.jpg",
    exercises: [
      { name: "Squats", sets: 4, reps: "12", rest: 90 },
      { name: "Deadlifts", sets: 4, reps: "10", rest: 120 },
      { name: "Lunges", sets: 3, reps: "12 each leg", rest: 60 },
      { name: "Leg Press", sets: 3, reps: "15", rest: 90 },
      { name: "Calf Raises", sets: 4, reps: "20", rest: 60 },
    ],
  },
  {
    id: "w3",
    title: "HIIT Cardio Blast",
    category: "hiit",
    duration: 30,
    difficulty: "Advanced",
    experience: 60,
    description: "Intense interval training to maximize calorie burn and improve cardiovascular fitness.",
    image: "/images/workout-hiit.jpg",
    exercises: [
      { name: "Jumping Jacks", duration: "45 sec", rest: "15 sec" },
      { name: "Mountain Climbers", duration: "45 sec", rest: "15 sec" },
      { name: "Burpees", duration: "45 sec", rest: "15 sec" },
      { name: "High Knees", duration: "45 sec", rest: "15 sec" },
      { name: "Jump Squats", duration: "45 sec", rest: "15 sec" },
      { name: "Plank Jacks", duration: "45 sec", rest: "15 sec" },
      { name: "Speed Skaters", duration: "45 sec", rest: "15 sec" },
      { name: "Push-up to Side Plank", duration: "45 sec", rest: "15 sec" },
    ],
  },
  {
    id: "w4",
    title: "Core Crusher",
    category: "strength",
    duration: 25,
    difficulty: "Beginner",
    experience: 40,
    description: "Strengthen your core with this targeted ab and lower back workout.",
    image: "/images/workout-core.jpg",
    exercises: [
      { name: "Plank", duration: "60 sec", rest: "30 sec" },
      { name: "Crunches", sets: 3, reps: "20", rest: 45 },
      { name: "Russian Twists", sets: 3, reps: "16 total", rest: 45 },
      { name: "Leg Raises", sets: 3, reps: "15", rest: 45 },
      { name: "Superman", sets: 3, reps: "12", rest: 45 },
      { name: "Mountain Climbers", duration: "45 sec", rest: "30 sec" },
    ],
  },
  {
    id: "w5",
    title: "Flexibility Flow",
    category: "flexibility",
    duration: 35,
    difficulty: "Beginner",
    experience: 35,
    description: "Improve your flexibility and reduce muscle tension with this flowing routine.",
    image: "/images/workout-flexibility.jpg",
    exercises: [
      { name: "Cat-Cow Stretch", duration: "60 sec" },
      { name: "Downward Dog", duration: "60 sec" },
      { name: "Forward Fold", duration: "60 sec" },
      { name: "Pigeon Pose", duration: "60 sec each side" },
      { name: "Butterfly Stretch", duration: "60 sec" },
      { name: "Child's Pose", duration: "60 sec" },
      { name: "Cobra Stretch", duration: "60 sec" },
      { name: "Seated Forward Bend", duration: "60 sec" },
    ],
  },
  {
    id: "w6",
    title: "Endurance Run",
    category: "cardio",
    duration: 40,
    difficulty: "Intermediate",
    experience: 50,
    description: "Build your cardiovascular endurance with this progressive running workout.",
    image: "/images/workout-cardio.jpg",
    exercises: [
      { name: "Warm-up Jog", duration: "5 min" },
      { name: "Moderate Pace Run", duration: "10 min" },
      { name: "Sprint Intervals", sets: 5, duration: "30 sec sprint, 90 sec jog" },
      { name: "Steady State Run", duration: "15 min" },
      { name: "Cool Down Walk", duration: "5 min" },
    ],
  },
]

const Workouts = () => {
  const { currentUser } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [filteredWorkouts, setFilteredWorkouts] = useState(workouts)
  const [searchQuery, setSearchQuery] = useState("")
  const containerRef = useRef(null)

  useEffect(() => {
    // Filter workouts based on category and search query
    let filtered = workouts

    if (selectedCategory !== "all") {
      filtered = filtered.filter((workout) => workout.category === selectedCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (workout) =>
          workout.title.toLowerCase().includes(query) ||
          workout.description.toLowerCase().includes(query) ||
          workout.category.toLowerCase().includes(query),
      )
    }

    setFilteredWorkouts(filtered)

    // Particle effect
    const container = containerRef.current
    const particles = []
    const particleCount = 30

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.className = "absolute w-1 h-1 rounded-full bg-blue-500 opacity-0"
      container.appendChild(particle)

      const size = Math.random() * 3
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight

      gsap.set(particle, {
        x,
        y,
        width: size,
        height: size,
        backgroundColor:
          i % 5 === 0
            ? "#3b82f6"
            : i % 5 === 1
              ? "#1e40af"
              : i % 5 === 2
                ? "#60a5fa"
                : i % 5 === 3
                  ? "#7c3aed"
                  : "#4f46e5",
      })

      const tl = gsap.timeline({ repeat: -1, delay: Math.random() * 5 })

      tl.to(particle, {
        opacity: Math.random() * 0.6 + 0.1,
        duration: Math.random() * 2 + 1,
      })
        .to(
          particle,
          {
            y: y - Math.random() * 100 - 50,
            x: x + Math.random() * 100 - 50,
            duration: Math.random() * 10 + 10,
            ease: "none",
          },
          "-=2",
        )
        .to(
          particle,
          {
            opacity: 0,
            duration: Math.random() * 2 + 1,
          },
          "-=3",
        )

      particles.push({ element: particle, timeline: tl })
    }

    return () => {
      particles.forEach((p) => {
        p.timeline.kill()
        if (p.element.parentNode) {
          p.element.parentNode.removeChild(p.element)
        }
      })
    }
  }, [selectedCategory, searchQuery])

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
  }

  const handleWorkoutSelect = (workout) => {
    setSelectedWorkout(workout)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCloseWorkout = () => {
    setSelectedWorkout(null)
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-gray-900 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/30 via-gray-900/70 to-gray-900"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/90 to-gray-900"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-white mb-2"
          >
            {selectedWorkout ? selectedWorkout.title : "Workouts"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400"
          >
            {selectedWorkout 
              ? selectedWorkout.description 
              : "Choose your battle and grow stronger with each workout."}
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {selectedWorkout ? (
            <motion.div
              key="workout-detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 shadow-xl overflow-hidden mb-8">
                <div className="relative h-64 sm:h-80">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
                  <img 
                    src={selectedWorkout.image || "/placeholder.svg?height=400&width=800"} 
                    alt={selectedWorkout.title}
                    className="w-full h-full object-cover"
                  />
                  <button 
                    onClick={handleCloseWorkout}
                    className="absolute top-4 right-4 z-20 bg-gray-900/50 hover:bg-gray-900/70 rounded-full p-2 transition-colors duration-300"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedWorkout.title}</h2>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                        {selectedWorkout.category.charAt(0).toUpperCase() + selectedWorkout.category.slice(1)}
                      </span>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
                        {selectedWorkout.difficulty}
                      </span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                        {selectedWorkout.duration} min
                      </span>
                      <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium">
                        +{selectedWorkout.experience} XP
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Exercises</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {selectedWorkout.exercises.map((exercise, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-gray-700/50 rounded-lg p-4"
                      >
                        <h4 className="font-medium text-white mb-2">{exercise.name}</h4>
                        <div className="flex flex-wrap gap-2 text-sm">
                          {exercise.sets && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md">
                              {exercise.sets} sets
                            </span>
                          )}
                          {exercise.reps && (
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-md">
                              {exercise.reps} reps
                            </span>
                          )}
                          {exercise.duration && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-md">
                              {exercise.duration}
                            </span>
                          )}
                          {exercise.rest && (
                            <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-md">
                              {exercise.rest} rest
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 rounded-lg font-medium shadow-lg shadow-blue-600/30 transition-all duration-300">
                      Start Workout
                    </button>
                    <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors duration-300">
                      Save for Later
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button 
                  onClick={handleCloseWorkout}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Workouts
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="workout-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Search and filter */}
              <div className="mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search workouts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 focus:border-blue-500 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all pl-10"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div className="flex overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                    {workoutCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap mr-2 transition-colors duration-300 ${
                          selectedCategory === category.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-800/50 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Workout grid */}
              {filteredWorkouts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredWorkouts.map((workout, index) => (
                    <motion.div
                      key={workout.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1
                      }}
                      // transition={{ duration: 0.5, delay: index * 0.1, opacity: 1, y: 0}}
                      // transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 shadow-xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 group"
                      onClick={() => handleWorkoutSelect(workout)}
                    >
                      <div className="relative h-48">
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
                        <img 
                          src={workout.image || "/placeholder.svg?height=300&width=500"} 
                          alt={workout.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute bottom-4 left-4 right-4 z-20">
                          <h3 className="text-xl font-bold text-white mb-1">{workout.title}</h3>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                              {workout.category.charAt(0).toUpperCase() + workout.category.slice(1)}
                            </span>
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                              {workout.duration} min
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{workout.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-purple-400">{workout.difficulty}</span>
                          <span className="text-sm font-medium text-amber-400">+{workout.experience} XP</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8 text-center">
                  <svg className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-bold text-white mb-2">No workouts found</h3>
                  <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Workouts

