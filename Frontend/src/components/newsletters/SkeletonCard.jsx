import React from 'react'

export default function SkeletonCard() {
    const NEWS_API_KEY = "353c11d7734a4837993646fd893c0961";

  
  return (
    <div className="bg-white dark:bg-[#09090b] rounded- border border-gray-100 dark:border-zinc-800/50 overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-100 dark:bg-zinc-800" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-gray-100 dark:bg-zinc-800 rounded-full" />
          <div className="h-5 w-24 bg-gray-100 dark:bg-zinc-800 rounded-full" />
        </div>
        <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded w-full" />
        <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded w-5/6" />
        <div className="h-3 bg-gray-100 dark:bg-zinc-800 rounded w-full" />
        <div className="h-3 bg-gray-100 dark:bg-zinc-800 rounded w-4/5" />
      </div>
    </div>
  );
}

