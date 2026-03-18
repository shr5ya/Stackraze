import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { API_URL } from '../../config/api';
import { Send, Hash, ChevronLeft } from 'lucide-react';
import { resolveAvatar } from '../../utils/avatarHelper';

const CommunityChat = ({ community, user, onBack }) => {
  const [messagesMap, setMessagesMap] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const scrollContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const isInitialLoad = useRef(true);
  const prevScrollHeight = useRef(0);

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Fetch older messages
  const fetchMessages = useCallback(async (before = null) => {
    if (before) setLoadingMore(true);
    else setLoading(true);

    try {
      const url = new URL(`${API_URL}/community/${community._id}/messages`);
      if (before) url.searchParams.append('before', before);
      url.searchParams.append('limit', '20');

      const response = await fetch(url.toString());
      if (response.ok) {
        const newMessages = await response.json();
        
        if (newMessages.length < 20) {
          setHasMore(false);
        }

        if (before) {
          // Store current scroll height to restore position after prepend
          if (scrollContainerRef.current) {
            prevScrollHeight.current = scrollContainerRef.current.scrollHeight;
          }
          setMessagesMap((prev) => [...newMessages, ...prev]);
        } else {
          setMessagesMap(newMessages);
          isInitialLoad.current = true;
        }
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [community?._id]);

  useEffect(() => {
    if (!community || !user) return;

    // Reset state for new community
    setMessagesMap([]);
    setHasMore(true);
    isInitialLoad.current = true;
    
    // Connect to Socket
    const newSocket = io(API_URL);
    setSocket(newSocket);
    newSocket.emit('join_community', community._id);

    newSocket.on('receive_message', (message) => {
      setMessagesMap((prev) => [...prev, message]);
      // Small delay to ensure DOM is updated
      setTimeout(() => scrollToBottom('smooth'), 50);
    });

    fetchMessages();

    return () => {
      newSocket.emit('leave_community', community._id);
      newSocket.disconnect();
    };
  }, [community?._id, user, fetchMessages, scrollToBottom]);

  // Handle scroll to top logic
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      if (scrollContainer.scrollTop === 0 && hasMore && !loadingMore && !loading) {
        const oldestMessage = messagesMap[0];
        if (oldestMessage) {
          fetchMessages(oldestMessage.createdAt);
        }
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadingMore, loading, messagesMap, fetchMessages]);

  // Adjust scroll position after prepending older messages
  useEffect(() => {
    if (loadingMore === false && prevScrollHeight.current > 0 && scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      const newScrollHeight = scrollContainer.scrollHeight;
      const heightDifference = newScrollHeight - prevScrollHeight.current;
      scrollContainer.scrollTop = heightDifference;
      prevScrollHeight.current = 0;
    }
  }, [loadingMore]);

  // Initial scroll to bottom
  useEffect(() => {
    if (isInitialLoad.current && messagesMap.length > 0) {
      scrollToBottom('auto');
      isInitialLoad.current = false;
    }
  }, [messagesMap, scrollToBottom]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !community || !user) return;

    const messageData = {
      communityId: community._id,
      senderId: user._id || user.id,
      text: newMessage.trim(),
    };

    socket.emit('send_message', messageData);
    setNewMessage('');
  };

  if (!community) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-transparent text-zinc-400 dark:text-zinc-600 h-full w-full">
        <Hash size={32} className="mb-3 opacity-50" />
        <p className="text-sm">Select a community to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-transparent overflow-hidden h-full w-full">
      {/* Header */}
      <div className="flex items-center px-4 md:px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 z-10 justify-between">
        <div className="flex items-center">
          <button 
            onClick={onBack} 
            className="md:hidden mr-3 p-1.5 -ml-2 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
            aria-label="Back to communities"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="flex flex-col">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Hash size={16} className="text-zinc-400" />
              {community.name}
            </h2>
            {community.description && <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5">{community.description}</p>}
          </div>
        </div>
      </div>

      {/* Messages Window */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide"
      >
        {loadingMore && (
          <div className="flex justify-center py-2">
            <div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-800 dark:border-t-zinc-300 animate-spin rounded-full"></div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-full">
             <div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-800 dark:border-t-zinc-300 animate-spin rounded-full"></div>
          </div>
        ) : messagesMap.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-600">
            <p className="text-sm">This is the beginning of the #{community.name} community.</p>
          </div>
        ) : (
          messagesMap.map((msg, index) => {
            const isMe = msg.senderId?._id === (user._id || user.id) || msg.senderId === (user._id || user.id);
            const senderName = msg.senderId?.username || msg.senderId?.name || 'Unknown';
            const senderAvatar = resolveAvatar(msg.senderId?.avatar);
            const userInitial = senderName.charAt(0).toUpperCase();

            return (
              <div key={msg._id || index} className={`flex group ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                   <div className="flex-shrink-0 mr-3">
                    {senderAvatar ? (
                      <img
                        src={senderAvatar}
                        alt={senderName}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-zinc-800"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 font-bold text-sm">
                        {userInitial}
                      </div>
                    )}
                  </div>
                )}
                
                <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && (
                    <div className="flex items-center gap-2 mb-1 pl-1">
                      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{senderName}</span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-600">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  )}
                  
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-[14px] shadow-sm ${
                      isMe
                        ? 'bg-zinc-800 text-zinc-50 dark:bg-zinc-200 dark:text-zinc-900 rounded-br-sm'
                        : 'bg-white text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 rounded-bl-sm border border-zinc-100 dark:border-zinc-700/50'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-zinc-950/50 border-t border-zinc-200 dark:border-zinc-800">
        <form onSubmit={handleSendMessage} className="relative flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message #${community.name}`}
            className="w-full bg-zinc-100 dark:bg-zinc-900 border border-transparent dark:border-zinc-800 rounded-full pl-5 pr-12 py-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-700 transition-all placeholder-zinc-400 dark:placeholder-zinc-600 shadow-inner"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="absolute right-1.5 p-2 rounded-full text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 disabled:opacity-30 transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommunityChat;
