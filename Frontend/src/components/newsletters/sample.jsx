import { useEffect, useState, useCallback } from "react";
import { TrendingUp, Clock, User } from "lucide-react";
import { API_URL } from "../../config/api";
import SkeletonCard from "./SkeletonCard";

// 1. Restrict to high-quality tech and developer domains
const TECH_DOMAINS = "techcrunch.com,arstechnica.com,wired.com,thenextweb.com,hackernoon.com,theverge.com,infoworld.com";

// 2. Simplified queries (no need for massive OR statements now that domains are restricted)
const CATEGORIES = [
  { label: "All", query: "developer OR software OR technology OR startup" },
  { label: "AI", query: "artificial intelligence OR OpenAI OR ChatGPT OR LLM" },
  { label: "Startups", query: "startup funding OR venture capital OR tech launch" },
  { label: "Open Source", query: "open source OR github OR developer tool" },
  { label: "Cloud", query: "cloud computing OR AWS OR Azure OR serverless" },
  { label: "Security", query: "cybersecurity OR vulnerability OR malware OR hack" },
  { label: "Web", query: "web development OR React OR frontend OR JavaScript" },
];

const TAG_STYLES = {
  AI: "bg-blue-50 text-blue-700",
  Startups: "bg-yellow-50 text-yellow-700",
  "Open Source": "bg-green-50 text-green-700",
  Cloud: "bg-indigo-50 text-indigo-700",
  Security: "bg-red-50 text-red-700",
  Web: "bg-orange-50 text-orange-700",
  Tech: "bg-gray-100 text-gray-600",
};

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// Simplified tag inference
function inferTag(text) {
  const t = text.toLowerCase();
  if (t.includes("ai") || t.includes("openai") || t.includes("llm")) return "AI";
  if (t.includes("startup") || t.includes("funding")) return "Startups";
  if (t.includes("open source") || t.includes("github")) return "Open Source";
  if (t.includes("cloud") || t.includes("aws")) return "Cloud";
  if (t.includes("security") || t.includes("hack")) return "Security";
  if (t.includes("web") || t.includes("react") || t.includes("javascript")) return "Web";
  return "Tech";
}

function NewsCard({ article }) {
  const [imgError, setImgError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (!article) return null;

  return (
    <div className="group bg-white dark:bg-[#09090b] rounded-sm border border-gray-100 dark:border-zinc-800/50 overflow-hidden hover:shadow-lg transition-all duration-300">
      
      {/* 🔽 Smaller Image */}
      <div className="w-full h-[250px] sm:h-[350px] bg-gray-100 dark:bg-zinc-800 relative">
        {article.urlToImage && !imgError ? (
          <img
            src={article.urlToImage}
            alt=""
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">
            📰
          </div>
        )}
      </div>

      {/* 🔽 Reduced Padding */}
      <div className="p-4 sm:p-5 flex flex-col gap-3">

        {/* 🔽 Smaller meta */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{timeAgo(article.publishedAt)}</span>
          </div>
        </div>

        {/* 🔽 Smaller Heading */}
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white leading-snug">
          {article.title}
        </h3>

        {/* 🔽 Smaller description */}
        <div className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
          <p className={expanded ? "" : "line-clamp-2"}>
            {article.description}
            {expanded && article.content && article.content.length > 50 && (
              <>
                <br /><br />
                {article.content.replace(/\[\+\d+ chars\]/, "")}
              </>
            )}
          </p>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 mt-1 text-xs font-medium"
          >
            {expanded ? "Show Less" : "Read More"}
          </button>
        </div>

        {/* 🔽 Compact footer */}
        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-zinc-800/50 flex items-center justify-between">
          
          <div className="flex items-center gap-1 text-pink-500 dark:text-pink-400 text-xs font-semibold">
            <TrendingUp size={16} />
            <span>+{Math.floor(Math.random() * 500) + 100}</span>
          </div>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-black text-xs rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition"
          >
            Read →
          </a>
        </div>
      </div>
    </div>
  );
}
export default function TechNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const fetchNews = useCallback(async (categoryIndex = 0) => {
    setLoading(true);
    setError(null);
    const category = CATEGORIES[categoryIndex];
    
    // Calculate 10 days ago date string
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    const fromDate = tenDaysAgo.toISOString().split('T')[0];
    
    try {
      // 3. Request through backend proxy to bypass NewsAPI prod restrictions
      const url = `${API_URL}/api/news/articles?q=${encodeURIComponent(category.query)}&domains=${TECH_DOMAINS}&from=${fromDate}&language=en&sortBy=relevancy&pageSize=20`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      
      const data = await res.json();
      if (data.status !== "ok") throw new Error(data.message || "NewsAPI error");

      // 4. Cleaned up filtering logic
      const filtered = data.articles
        .filter(a => 
          a.urlToImage && 
          a.title && 
          a.title !== "[Removed]" && 
          a.description
        )
        .slice(0, 12)
        .map(a => ({
          ...a,
          _tag: category.label === "All" 
            ? inferTag(a.title + " " + a.description) 
            : category.label,
        }));
        console.log(filtered);
        

      setArticles(filtered);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNews(0); }, [fetchNews]);

  const handleCategory = (index) => {
    setActiveIndex(index);
    fetchNews(index);
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="w-full mx-auto py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 px-4">
          <div>
            
            <p className="text-sm text-gray-400 mt-1">Latest in software, AI &amp; the dev ecosystem</p>
          </div>
          <button
            onClick={() => fetchNews(activeIndex)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <span className={loading ? "animate-spin inline-block" : ""}>↻</span>
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 flex-wrap mb-8 px-4">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.label}
              onClick={() => handleCategory(i)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                activeIndex === i
                  ? "bg-gray-900 dark:bg-white text-white dark:text-black border-gray-900 dark:border-white"
                  : "bg-white dark:bg-zinc-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl p-6 text-center mb-8">
            <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
            <button
              onClick={() => fetchNews(activeIndex)}
              className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-all"
            >
              ↻ Try again
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="flex flex-col gap-">
          {loading
            ? Array(6).fill(null).map((_, i) => <SkeletonCard key={i} />)
            : articles.map((article, i) => <NewsCard key={i} article={article} />)
          }
        </div>

        {!loading && !error && articles.length === 0 && (
          <p className="text-center text-gray-400 py-16 text-sm">No articles found.</p>
        )}

      </div>
    </div>
  );
}