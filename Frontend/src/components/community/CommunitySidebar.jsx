import React from 'react';

const CommunitySidebar = ({ communities, selectedCommunity, onSelectCommunity }) => {
  return (
    <div className="w-full h-full bg-transparent flex flex-col">
      <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800/50">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Communities</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {communities.length === 0 ? (
          <p className="p-2 text-sm text-zinc-500 dark:text-zinc-500">No communities.</p>
        ) : (
          communities.map((community) => {
            const isSelected = selectedCommunity?._id === community._id;
            return (
              <button
                key={community._id}
                onClick={() => onSelectCommunity(community)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex flex-col items-start
                  ${isSelected 
                    ? 'bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200/50 dark:border-zinc-700/50' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-200 border border-transparent'}
                `}
              >
                <div className="flex items-center gap-2.5 w-full">
                  <span className={`text-xl font-light leading-none ${isSelected ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-400/50 dark:text-zinc-600'}`}>#</span>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="font-semibold text-[13px] truncate">
                      {community.name}
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommunitySidebar;
