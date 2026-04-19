import React from 'react';
import { Hash, Users, Sparkles } from 'lucide-react';

const CommunitySidebar = ({ communities, selectedCommunity, onSelectCommunity }) => {
  return (
    <div className="w-full h-full bg-transparent flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-200/60 dark:border-zinc-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-600/10 dark:bg-blue-500/10">
              <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Communities
            </h2>
          </div>
          <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800/60 px-2 py-0.5 rounded-full">
            {communities.length}
          </span>
        </div>
      </div>

      {/* Community List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {communities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center mb-3">
              <Hash size={20} className="text-zinc-400 dark:text-zinc-500" />
            </div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-500">No communities yet</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">Communities will appear here</p>
          </div>
        ) : (
          communities.map((community) => {
            const isSelected = selectedCommunity?._id === community._id;
            return (
              <button
                key={community._id}
                onClick={() => onSelectCommunity(community)}
                className={`group w-full text-left px-3.5 py-3 rounded-xl transition-all duration-300 ease-out flex items-center gap-3 relative overflow-hidden
                  ${isSelected
                    ? 'bg-blue-600/10 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 shadow-sm ring-1 ring-blue-500/20 dark:ring-blue-400/15'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }
                `}
              >
                {/* Active indicator bar */}
                <div
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full transition-all duration-300 ease-out
                    ${isSelected ? 'h-5 bg-blue-600 dark:bg-blue-400 opacity-100' : 'h-0 bg-blue-600 opacity-0'}
                  `}
                />

                {/* Channel icon */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
                    ${isSelected
                      ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md shadow-blue-600/25 dark:shadow-blue-500/20'
                      : 'bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-400 dark:text-zinc-500 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700/60 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 group-hover:scale-105'
                    }
                  `}
                >
                  <Hash size={14} strokeWidth={2.5} />
                </div>

                {/* Channel name & info */}
                <div className="flex flex-col flex-1 overflow-hidden min-w-0">
                  <span
                    className={`font-semibold text-[13px] truncate transition-all duration-300
                      ${isSelected
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
                      }
                    `}
                  >
                    {community.name}
                  </span>
                  {community.description && (
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-600 truncate mt-0.5">
                      {community.description}
                    </span>
                  )}
                </div>

                {/* Members badge (if available) */}
                {community.members && (
                  <div
                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium transition-all duration-300
                      ${isSelected
                        ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400'
                        : 'bg-zinc-100 dark:bg-zinc-800/40 text-zinc-400 dark:text-zinc-500 group-hover:bg-zinc-200/80 dark:group-hover:bg-zinc-700/40'
                      }
                    `}
                  >
                    <Users size={10} />
                    <span>{community.members.length || community.members}</span>
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommunitySidebar;
