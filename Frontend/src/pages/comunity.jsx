import React, { useState, useEffect } from 'react';
import CommunitySidebar from '@/components/community/CommunitySidebar';
import CommunityChat from '@/components/community/CommunityChat';
import Sidebar from '@/components/Sidebar';
import { API_URL } from '@/config/api';
import { useAuth } from '@/context/AuthContext';

function Community() {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await fetch(`${API_URL}/community`);
        if (response.ok) {
          const data = await response.json();
          setCommunities(data);
          if (data.length > 0) {
            setSelectedCommunity(data[0]); // Select the first one by default
          }
        }
      } catch (error) {
        console.error('Error fetching communities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  return (
    <div className='h-screen bg-zinc-50 dark:bg-zinc-950 font-sans overflow-hidden flex flex-col'>
      {/* Position app sidebar on the far left for this full-page dashboard view */}
      <Sidebar 
        className="!left-5 !right-auto" 
        style={{ left: '1.25rem', right: 'auto' }} 
      />
      
      <main className="flex-1 pt-[72px] md:pt-20 flex overflow-hidden w-full lg:pl-72 pr-0">
        <div className="w-full h-full flex bg-white dark:bg-zinc-950/80 border-t border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-800 dark:border-t-zinc-300 animate-spin rounded-full mb-4"></div>
              <p className="text-zinc-500 dark:text-zinc-500 text-sm">Loading communities...</p>
            </div>
          ) : (
            <>
              {/* Chat Panel - Primary focus, now on the left of the community list */}
              <div className={`flex-1 h-full bg-white dark:bg-zinc-950 overflow-hidden ${!selectedCommunity ? 'hidden md:flex' : 'flex'}`}>
                <CommunityChat
                  community={selectedCommunity}
                  user={user}
                  onBack={() => setSelectedCommunity(null)}
                />
              </div>

              {/* Community List Panel - Now on the RIGHT */}
              <div className={`w-full md:w-72 flex-shrink-0 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 h-full ${selectedCommunity ? 'hidden md:block' : 'block'}`}>
                <CommunitySidebar
                  communities={communities}
                  selectedCommunity={selectedCommunity}
                  onSelectCommunity={setSelectedCommunity}
                />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Community;