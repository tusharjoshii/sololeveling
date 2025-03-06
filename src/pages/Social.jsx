import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  MessageCircle, 
  Search, 
  Send,
  Image,
  Smile,
  UserCheck,
  UserX,
  ChevronLeft
} from 'lucide-react';
import RankBadge from '../components/RankBadge';
import { toast } from 'react-toastify';

function Social() {
  const { userProfile } = useAuth();
  const { playSoundEffect } = useAudio();
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [pendingFriends, setPendingFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Mock data for friends
    const mockFriends = [
      {
        id: 'friend1',
        username: 'FitnessMaster',
        rank: 'A',
        online: true,
        lastActive: '2 hours ago',
        verified: true,
        lastMessage: {
          text: 'How was your workout today?',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          unread: true
        }
      },
      {
        id: 'friend2',
        username: 'RunnerPro',
        rank: 'B',
        online: false,
        lastActive: '5 hours ago',
        verified: false,
        lastMessage: {
          text: 'Let\'s do a challenge tomorrow!',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          unread: false
        }
      },
      {
        id: 'friend3',
        username: 'GymRat',
        rank: 'C',
        online: true,
        lastActive: 'Just now',
        verified: false,
        lastMessage: {
          text: 'Thanks for the workout tips!',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          unread: false
        }
      }
    ];
    
    const mockPendingFriends = [
      {
        id: 'pending1',
        username: 'StrengthGuru',
        rank: 'S',
        sentByMe: false
      },
      {
        id: 'pending2',
        username: 'FitnessNewbie',
        rank: 'E',
        sentByMe: true
      }
    ];
    
    setFriends(mockFriends);
    setPendingFriends(mockPendingFriends);
    setLoading(false);
  }, []);
  
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    // Mock search results
    const results = [
      {
        id: 'user1',
        username: 'CardioKing',
        rank: 'A',
        isFriend: false,
        isPending: false
      },
      {
        id: 'user2',
        username: 'FlexMaster',
        rank: 'D',
        isFriend: false,
        isPending: false
      },
      {
        id: 'user3',
        username: 'IronPumper',
        rank: 'B',
        isFriend: false,
        isPending: false
      }
    ];
    
    setSearchResults(results);
    playSoundEffect('buttonClick');
  };
  
  const sendFriendRequest = (userId) => {
    // Update search results to show pending
    setSearchResults(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, isPending: true } 
          : user
      )
    );
    
    playSoundEffect('buttonClick');
    toast.success('Friend request sent!');
  };
  
  const acceptFriendRequest = (userId) => {
    // Find the pending friend
    const pendingFriend = pendingFriends.find(friend => friend.id === userId);
    
    if (pendingFriend) {
      // Add to friends list
      setFriends(prev => [...prev, {
        ...pendingFriend,
        online: false,
        lastActive: 'Recently',
        lastMessage: null
      }]);
      
      // Remove from pending
      setPendingFriends(prev => prev.filter(friend => friend.id !== userId));
      
      playSoundEffect('taskComplete');
      toast.success(`You are now friends with ${pendingFriend.username}!`);
    }
  };
  
  const rejectFriendRequest = (userId) => {
    // Remove from pending
    setPendingFriends(prev => prev.filter(friend => friend.id !== userId));
    
    playSoundEffect('buttonClick');
    toast.info('Friend request rejected');
  };
  
  const selectFriend = (friend) => {
    setSelectedFriend(friend);
    
    // Generate mock messages
    const mockMessages = [
      {
        id: 'msg1',
        senderId: 'friend1',
        text: 'Hey, how\'s your training going?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: true
      },
      {
        id: 'msg2',
        senderId: 'currentUser',
        text: 'Pretty good! I just completed the HIIT challenge.',
        timestamp: new Date(Date.now() - 3500000).toISOString(),
        read: true
      },
      {
        id: 'msg3',
        senderId: 'friend1',
        text: 'That\'s awesome! I\'m still working on it.',
        timestamp: new Date(Date.now() - 3400000).toISOString(),
        read: true
      },
      {
        id: 'msg4',
        senderId: 'currentUser',
        text: 'You\'ll get there! The key is consistency.',
        timestamp: new Date(Date.now() - 3300000).toISOString(),
        read: true
      },
      {
        id: 'msg5',
        senderId: 'friend1',
        text: 'How was your workout today?',
        timestamp: new Date(Date.now() - 3200000).toISOString(),
        read: false
      }
    ];
    
    setMessages(mockMessages);
    playSoundEffect('buttonClick');
    
    // Mark friend's last message as read
    setFriends(prev => 
      prev.map(f => 
        f.id === friend.id && f.lastMessage?.unread
          ? { ...f, lastMessage: { ...f.lastMessage, unread: false } }
          : f
      )
    );
  };
  
  const sendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const newMsg = {
      id: `msg${Date.now()}`,
      senderId: 'currentUser',
      text: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    playSoundEffect('buttonClick');
  };
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatLastMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return formatTimestamp(timestamp);
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
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
        <h1 className="text-3xl font-bold mb-2">Social</h1>
        <p className="text-sl-light-gray opacity-80">
          Connect with other hunters and make friends
        </p>
      </motion.div>
      
      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex border-b border-sl-soft-purple border-opacity-30">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'friends'
                ? 'text-sl-soft-purple border-b-2 border-sl-soft-purple'
                : 'text-sl-light-gray opacity-70 hover:opacity-100'
            }`}
            onClick={() => setActiveTab('friends')}
          >
            <div className="flex items-center">
              <Users size={18} className="mr-2" />
              Friends
            </div>
          </button>
          
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'pending'
                ? 'text-sl-soft-purple border-b-2 border-sl-soft-purple'
                : 'text-sl-light-gray opacity-70 hover:opacity-100'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            <div className="flex items-center">
              <UserPlus size={18} className="mr-2" />
              Requests
              {pendingFriends.filter(f => !f.sentByMe).length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingFriends.filter(f => !f.sentByMe).length}
                </span>
              )}
            </div>
          </button>
          
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'search'
                ? 'text-sl-soft-purple border-b-2 border-sl-soft-purple'
                : 'text-sl-light-gray opacity-70 hover:opacity-100'
            }`}
            onClick={() => setActiveTab('search')}
          >
            <div className="flex items-center">
              <Search size={18} className="mr-2" />
              Find Friends
            </div>
          </button>
        </div>
      </motion.div>
      
      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Friends list or search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-1"
        >
          {activeTab === 'friends' && (
            <div className="sl-card h-full">
              <h2 className="text-xl font-bold mb-4">Friends</h2>
              
              {friends.length === 0 ? (
                <div className="text-center py-8">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-bold mb-2">No friends yet</h3>
                  <p className="opacity-80 mb-4">Find and add friends to chat with them</p>
                  <button 
                    className="sl-button"
                    onClick={() => setActiveTab('search')}
                  >
                    <UserPlus size={18} className="mr-2" />
                    Find Friends
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {friends.map(friend => (
                    <div 
                      key={friend.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedFriend?.id === friend.id
                          ? 'bg-sl-soft-purple bg-opacity-20'
                          : 'hover:bg-sl-soft-purple hover:bg-opacity-10'
                      }`}
                      onClick={() => selectFriend(friend)}
                    >
                      <div className="flex items-start">
                        <div className="relative mr-3">
                          <div className="w-10 h-10 rounded-full bg-sl-dark-purple flex items-center justify-center border border-sl-soft-purple">
                            <span className="font-bold">{friend.username.charAt(0)}</span>
                          </div>
                          {friend.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-sl-dark-purple"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <p className="font-medium truncate">{friend.username}</p>
                              {friend.verified && (
                                <span className="ml-1 text-blue-400">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                  </svg>
                                </span>
                              )}
                            </div>
                            <RankBadge rank={friend.rank} />
                          </div>
                          
                          {friend.lastMessage ? (
                            <>
                              <p className="text-sm truncate opacity-80">
                                {friend.lastMessage.text}
                              </p>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-xs opacity-70">
                                  {formatLastMessageTime(friend.lastMessage.timestamp)}
                                </span>
                                {friend.lastMessage.unread && (
                                  <span className="w-2 h-2 bg-sl-soft-purple rounded-full"></span>
                                )}
                              </div>
                            </>
                          ) : (
                            <p className="text-sm opacity-70">
                              {friend.online ? 'Online' : `Last active ${friend.lastActive}`}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'pending' && (
            <div className="sl-card h-full">
              <h2 className="text-xl font-bold mb-4">Friend Requests</h2>
              
              {pendingFriends.length === 0 ? (
                <div className="text-center py-8">
                  <UserPlus size={48} className="mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-bold mb-2">No pending requests</h3>
                  <p className="opacity-80">Find and add friends to see requests here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingFriends.some(f => !f.sentByMe) && (
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">Received Requests</h3>
                      {pendingFriends
                        .filter(friend => !friend.sentByMe)
                        .map(friend => (
                          <div 
                            key={friend.id}
                            className="p-3 rounded-lg bg-sl-dark-purple mb-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-sl-soft-purple bg-opacity-20 flex items-center justify-center mr-3">
                                  <span className="font-bold">{friend.username.charAt(0)}</span>
                                </div>
                                <div>
                                  <p className="font-medium">{friend.username}</p>
                                  <div className="flex items-center">
                                    <RankBadge rank={friend.rank} />
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex space-x-2">
                                <button 
                                  className="p-2 rounded-full bg-green-500 bg-opacity-20 hover:bg-opacity-30 transition-colors text-green-500"
                                  onClick={() => acceptFriendRequest(friend.id)}
                                >
                                  <UserCheck size={18} />
                                </button>
                                <button 
                                  className="p-2 rounded-full bg-red-500 bg-opacity-20 hover:bg-opacity-30 transition-colors text-red-500"
                                  onClick={() => rejectFriendRequest(friend.id)}
                                >
                                  <UserX size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                  
                  {pendingFriends.some(f => f.sentByMe) && (
                    <div>
                      <h3 className="font-medium mb-2">Sent Requests</h3>
                      {pendingFriends
                        .filter(friend => friend.sentByMe)
                        .map(friend => (
                          <div 
                            key={friend.id}
                            className="p-3 rounded-lg bg-sl-dark-purple mb-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-sl-soft-purple bg-opacity-20 flex items-center justify-center mr-3">
                                  <span className="font-bold">{friend.username.charAt(0)}</span>
                                </div>
                                <div>
                                  <p className="font-medium">{friend.username}</p>
                                  <div className="flex items-center">
                                    <RankBadge rank={friend.rank} />
                                    <span className="ml-2 text-xs opacity-70">Pending</span>
                                  </div>
                                </div>
                              </div>
                              
                              <button 
                                className="p-2 rounded-full bg-red-500 bg-opacity-20 hover:bg-opacity-30 transition-colors text-red-500"
                                onClick={() => rejectFriendRequest(friend.id)}
                              >
                                <UserX size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'search' && (
            <div className="sl-card h-full">
              <h2 className="text-xl font-bold mb-4">Find Friends</h2>
              
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    className="sl-input w-full pl-10 pr-4"
                    placeholder="Search by username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-sl-light-gray opacity-50" />
                  </div>
                  <button 
                    type="submit"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <div className="p-1 rounded-full hover:bg-sl-soft-purple hover:bg-opacity-20 transition-colors">
                      <Search size={18} />
                    </div>
                  </button>
                </div>
              </form>
              
              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map(user => (
                    <div 
                      key={user.id}
                      className="p-3 rounded-lg bg-sl-dark-purple"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-sl-soft-purple bg-opacity-20 flex items-center justify-center mr-3">
                            <span className="font-bold">{user.username.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium">{user.username}</p>
                            <div className="flex items-center">
                              <RankBadge rank={user.rank} />
                            </div>
                          </div>
                        </div>
                        
                        {user.isFriend ? (
                          <span className="text-green-500 text-sm">Friends</span>
                        ) : user.isPending ? (
                          <span className="text-yellow-500 text-sm">Request Sent</span>
                        ) : (
                          <button 
                            className="sl-button py-1 px-3 text-sm"
                            onClick={() => sendFriendRequest(user.id)}
                          >
                            <UserPlus size={16} className="mr-1" />
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchTerm ? (
                <div className="text-center py-8">
                  <Search size={48} className="mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-bold mb-2">No results found</h3>
                  <p className="opacity-80">Try a different search term</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search size={48} className="mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-bold mb-2">Search for hunters</h3>
                  <p className="opacity-80">Find and add friends to chat with them</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
        
        {/* Chat area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 h-[600px]"
        >
          {selectedFriend ? (
            <div className="sl-card h-full flex flex-col">
              {/* Chat header */}
              <div className="border-b border-sl-soft-purple border-opacity-30 p-4">
                <div className="flex items-center">
                  <button 
                    className="p-2 rounded-full hover:bg-sl-soft-purple hover:bg-opacity-20 transition-colors mr-2 lg:hidden"
                    onClick={() => setSelectedFriend(null)}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <div className="relative mr-3">
                    <div className="w-10 h-10 rounded-full bg-sl-dark-purple flex items-center justify-center border border-sl-soft-purple">
                      <span className="font-bold">{selectedFriend.username.charAt(0)}</span>
                    </div>
                    {selectedFriend.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-sl-dark-purple"></div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium">{selectedFriend.username}</p>
                      {selectedFriend.verified && (
                        <span className="ml-1 text-blue-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-xs">
                      <RankBadge rank={selectedFriend.rank} />
                      <span className="ml-2 opacity-70">
                        {selectedFriend.online ? 'Online' : `Last active ${selectedFriend.lastActive}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.senderId === 'currentUser' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderId === 'currentUser'
                          ? 'bg-sl-soft-purple bg-opacity-30 rounded-tr-none'
                          : 'bg-sl-dark-purple rounded-tl-none'
                      }`}
                    >
                      <p>{message.text}</p>
                      <div className="flex justify-end items-center mt-1">
                        <span className="text-xs opacity-70 mr-1">
                          {formatTimestamp(message.timestamp)}
                        </span>
                        {message.senderId === 'currentUser' && (
                          <span className="text-xs text-blue-400">
                            {message.read ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6L7 17l-5-5"></path>
                                <path d="M22 10L13 19l-3-3"></path>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5"></path>
                              </svg>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Message input */}
              <div className="border-t border-sl-soft-purple border-opacity-30 p-4">
                <form onSubmit={sendMessage} className="flex items-center">
                  <button 
                    type="button"
                    className="p-2 rounded-full hover:bg-sl-soft-purple hover:bg-opacity-20 transition-colors mr-2"
                  >
                    <Image size={20} />
                  </button>
                  <button 
                    type="button"
                    className="p-2 rounded-full hover:bg-sl-soft-purple hover:bg-opacity-20 transition-colors mr-2"
                  >
                    <Smile size={20} />
                  </button>
                  <input
                    type="text"
                    className="sl-input flex-1"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className="p-2 rounded-full bg-sl-soft-purple ml-2 hover:bg-sl-blue transition-colors"
                    disabled={!newMessage.trim()}
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="sl-card h-full flex flex-col items-center justify-center text-center p-8">
              <MessageCircle size={64} className="text-sl-soft-purple opacity-30 mb-6" />
              <h2 className="text-2xl font-bold mb-2">No conversation selected</h2>
              <p className="opacity-80 mb-6">
                Select a friend from the list to start chatting
              </p>
              {friends.length === 0 && (
                <button 
                  className="sl-button"
                  onClick={() => setActiveTab('search')}
                >
                  Find Friends
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Social;