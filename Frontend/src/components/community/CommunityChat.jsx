import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { API_URL } from '../../config/api';
import { Send, Hash, ChevronLeft, MessageSquare, Users, CircleDot } from 'lucide-react';
import { resolveAvatar } from '../../utils/avatarHelper';

const CommunityChat = ({ community, user, onBack }) => {

  // Stores all messages (including pagination)
  const [messagesMap, setMessagesMap] = useState([]);

  // Controlled input for message box
  const [newMessage, setNewMessage] = useState('');

  // Socket connection instance
  const [socket, setSocket] = useState(null);

   // Loading states (initial + pagination)
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Flag to know if more messages exist (for infinite scroll)
  const [hasMore, setHasMore] = useState(true);
  
  // Refs for scroll handling
  const scrollContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Used to control scroll behavior on first load vs pagination
  const isInitialLoad = useRef(true);
  const prevScrollHeight = useRef(0);

  // Smooth scroll to bottom (used after sending/receiving messages)
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Fetch messages (initial load + pagination)
  const fetchMessages = useCallback(async (before = null) => {

    //Decide which loading state to set based on whether we're fetching older messages (pagination) or initial load
    if (before) setLoadingMore(true);
    else setLoading(true);

    try {
      
      const url = new URL(`${API_URL}/community/${community._id}/messages`);
      
      //Pagination: if 'before' timestamp is provided, fetch messages older than that timestamp
      if (before) url.searchParams.append('before', before);
      url.searchParams.append('limit', '20');

      const response = await fetch(url.toString());
      if (response.ok) {
        const newMessages = await response.json();
        
         // If less than 20, no more messages left
        if (newMessages.length < 20) {
          setHasMore(false);
        }

        if (before) {

          // Preserve scroll position after loading older messages by calculating the difference in scroll height before and after new messages are added, then adjusting scrollTop accordingly
          if (scrollContainerRef.current) {
            prevScrollHeight.current = scrollContainerRef.current.scrollHeight;
          }
          setMessagesMap((prev) => [...newMessages, ...prev]);
        } else {

          // INTIAL LOAD: just set messages and scroll to bottom
          setMessagesMap (newMessages);
          isInitialLoad.current = true;
        }
      }
    } 
    catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }

  }, [community?._id]);


  // Socket setup (join room, receive messages)
  useEffect(() => {
    if (!community || !user) return;


     // Reset state when switching communities
    setMessagesMap([]);
    setHasMore(true);
    isInitialLoad.current = true;

    const newSocket = io(API_URL);
    setSocket(newSocket);

    // Join community room
    newSocket.emit('join_community', community._id);

    // Listen for incoming messages
    newSocket.on('receive_message', (message) => {
      setMessagesMap((prev) => [...prev, message]);

      // Slight delay ensures DOM is updated before scroll
      setTimeout(() => scrollToBottom('smooth'), 50);
    });

    fetchMessages();

    return () => {

      // Cleanup on unmount / switch
      newSocket.emit('leave_community', community._id);
      newSocket.disconnect();
    };
  }, [community?._id, user, fetchMessages, scrollToBottom]);
    

  // Infinite scroll (load older messages when reaching top)
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


  // ---------------- PRESERVE SCROLL POSITION ----------------
  useEffect(() => {
    if (
      loadingMore === false &&
      prevScrollHeight.current > 0 &&
      scrollContainerRef.current
    ) {
      const container = scrollContainerRef.current;

      const newHeight = container.scrollHeight;
      const diff = newHeight - prevScrollHeight.current;

      container.scrollTop = diff;

      prevScrollHeight.current = 0;
    }
  }, [loadingMore]);





  // ---------------- INITIAL SCROLL TO BOTTOM ----------------
  useEffect(() => {
    if (isInitialLoad.current && messagesMap.length > 0) {
      scrollToBottom("auto");
      isInitialLoad.current = false;
    }
  }, [messagesMap, scrollToBottom]);
  


  // ---------------- SEND MESSAGE ----------------
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !socket || !community || !user) return;
    
    const messageData = {
      communityId: community._id,
      senderId: user._id || user.id,
      text: newMessage.trim(),
    };
    
    socket.emit("send_message", messageData);
    
    setNewMessage("");
  };

  

  if (!community) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-transparent text-zinc-400 dark:text-zinc-600 h-full w-full">
        <Hash size={32} className="mb-3 opacity-50" />
        <p className="text-sm">Select a community to start messaging</p>
      </div>
    );
  }



  // ---------------- GROUP MESSAGES BY DATE ----------------
  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentDate = "";
    
    messages.forEach((msg) => {
      if (!msg.createdAt) return;
      
      const dateObj = new Date(msg.createdAt);
      
      const formattedDate = dateObj
      .toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      .toUpperCase();

    // Insert date separator
    if (formattedDate !== currentDate) {
      currentDate = formattedDate;

      groups.push({
        type: "date",
        date: formattedDate,
        _id: `date-${formattedDate}`,
      });
    }

    // Insert message
    groups.push({
      type: "message",
      ...msg,
    });
  });

  return groups;
};

  // const groupMessagesByDate = (messages) => {
  //   const groups = [];
  //   let currentDate = '';
    
  //   messages.forEach((msg) => {
  //     if (!msg.createdAt) return;
  //     const dateObj = new Date(msg.createdAt);
  //     const date = dateObj.toLocaleDateString('en-US', {
  //       month: 'short',
  //       day: 'numeric',
  //       year: 'numeric'
  //     }).toUpperCase();
      
  //     if (date !== currentDate) {
  //       currentDate = date;
  //       groups.push({ type: 'date', date, _id: `date-${date}` });
  //     }
  //     groups.push({ type: 'message', ...msg });
  //   });
    
  //   return groups;
  // };

  const displayItems = groupMessagesByDate(messagesMap);

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-zinc-950 overflow-hidden h-full w-full">
      {/* Header aligned with requested design */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 z-10 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            className="md:hidden mr-1 p-1.5 -ml-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          
          <div className="bg-black text-white p-2.5 rounded-xl">
            <MessageSquare size={20} className="fill-current" />
          </div>
          
          <div className="flex flex-col">
            <h2 className="font-semibold text-[15px] text-zinc-900 dark:text-zinc-100">
              Community Chat
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <CircleDot size={10} className="text-emerald-500 fill-emerald-500" />
              <span className="text-xs text-zinc-500 font-medium tracking-wide">1 online</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-full gap-2">
          <Users size={14} className="text-zinc-500" />
          <span className="text-xs font-medium text-zinc-500">1</span>
        </div>
      </div>

      {/* Messages Window */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide flex flex-col gap-6"
      >
        {loadingMore && (
          <div className="flex justify-center py-2">
            <div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-800 animate-spin rounded-full"></div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-full">
             <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-800 animate-spin rounded-full"></div>
          </div>
        ) : displayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400">
            <p className="text-sm">This is the beginning of the chat.</p>
          </div>
        ) : (
          displayItems.map((item, index) => {
            if (item.type === 'date') {
              return (
                <div key={item._id} className="relative flex justify-center py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-100 dark:border-zinc-800"></div>
                  </div>
                  <div className="relative bg-white dark:bg-zinc-950 px-4 text-[10px] font-semibold text-zinc-400 tracking-wider">
                    {item.date}
                  </div>
                </div>
              );
            }

            const msg = item;
            const isMe = msg.senderId?._id === (user._id || user.id) || msg.senderId === (user._id || user.id);
            const senderName = msg.senderId?.username || msg.senderId?.name || 'Unknown';
            const senderAvatar = resolveAvatar(msg.senderId?.avatar);
            const userInitial = senderName.charAt(0).toUpperCase();
            const timeString = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

            return (
              <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                  <div className="flex-shrink-0 mr-3 mt-4 mt-auto mb-1">
                    {senderAvatar ? (
                      <img src={senderAvatar} alt={senderName} className="w-8 h-8 rounded-full object-cover shadow-sm bg-white" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold text-xs shadow-sm">
                        {userInitial}
                      </div>
                    )}
                  </div>
                )}
                
                <div className={`flex flex-col max-w-[80%] md:max-w-[65%] ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-center gap-1.5 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                    {isMe ? (
                      <>
                        <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">You</span>
                        <span className="text-[10px] text-zinc-400">{timeString}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">{senderName}</span>
                        <span className="text-[10px] text-zinc-400">{timeString}</span>
                      </>
                    )}
                  </div>
                  
                  <div
                    className={`px-4 py-2.5 shadow-sm text-sm ${
                      isMe
                        ? 'bg-black text-white dark:bg-white dark:text-black rounded-2xl rounded-br-sm'
                        : 'bg-white text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 rounded-2xl rounded-bl-sm border border-zinc-100 dark:border-zinc-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  </div>
                </div>

                {isMe && (
                  <div className="flex-shrink-0 ml-3 mt-4">
                    {senderAvatar ? (
                      <img src={senderAvatar} alt="You" className="w-8 h-8 rounded-full object-cover shadow-sm bg-white" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center font-semibold text-xs shadow-sm">
                        {userInitial}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-4 py-4 md:px-6 md:py-5 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-b-2xl">
        <form onSubmit={handleSendMessage} className="relative flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-5 pr-14 py-3.5 text-[14px] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-300 dark:focus:border-zinc-700 transition-colors placeholder-zinc-400"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="absolute right-2 p-2 bg-zinc-400 rounded-lg text-white hover:bg-zinc-500 disabled:opacity-40 disabled:hover:bg-zinc-400 transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommunityChat;