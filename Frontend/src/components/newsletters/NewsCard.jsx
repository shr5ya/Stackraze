import { useEffect, useState, useCallback } from "react";
import { TrendingUp, Clock, User } from "lucide-react";

function NewsCard() {
  const [imgError, setImgError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (!article) return null;

  return (
    <div className="group bg-white dark:bg-[#09090b] rounded-sm border border-gray-100 dark:border-zinc-800/50 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="w-full h-[250px] sm:h-[350px] bg-gray-100 dark:bg-zinc-800 relative">
        {article.urlToImage && !imgError ? (
          <img src={article.urlToImage} alt="" className="w-full h-full object-cover" onError={() => setImgError(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl opacity-20">📰</div>
        )}
      </div>
      <div className="p-6 sm:p-8 flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-white shadow-sm overflow-hidden shrink-0">
              {article.author ? (
                <span className="font-semibold text-sm">{article.author.charAt(0).toUpperCase()}</span>
              ) : (
                <User size={20} />
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-widest">
              <span className="truncate max-w-[150px] sm:max-w-[200px]">{article.author || article.source?.name || "Unknown"}</span>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-1.5 text-gray-500">
                <Clock size={14} />
                <span className="normal-case tracking-normal">{timeAgo(article.publishedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
          {article.title}
        </h3>

        <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
          <p className={expanded ? "" : "line-clamp-3"}>
            {article.description}
            {expanded && article.content && article.content.length > 50 && (
              <>
                <br /><br />
                {article.content.replace(/\[\+\d+ chars\]/, '...')}
              </>
            )}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 mt-2 font-medium"
          >
            {expanded ? "Show Less" : "Read More"}
          </button>
        </div>

        <div className="mt-2 pt-4 border-t border-gray-100 dark:border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-pink-500 dark:text-pink-400 font-bold">
            <TrendingUp size={20} />
            <span className="text-sm sm:text-base">+{Math.floor(Math.random() * 500) + 100} engaged</span>
          </div>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black font-medium text-xs sm:text-sm rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors whitespace-nowrap"
          >
            Read on Source →
          </a>
        </div>
      </div>
    </div>
  );
}


export default NewsCard