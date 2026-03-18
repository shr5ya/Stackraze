import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import NewsletterPost from '@/components/newsletter/NewsletterPost';
import NewsletterSkeleton from '@/components/newsletter/NewsletterSkeleton';

const RSS_URLS = [
    'https://techcrunch.com/feed/',
    'https://www.theverge.com/rss/index.xml'
];

const NewsLetters = () => {
    // Tech News State
    const [techNews, setTechNews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Strip out HTML syntax so that we can show readable text in the feed
    const stripHtml = (html) => {
        let tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    // Get article image utility
    const getArticleImage = (article) => {
        if (article.thumbnail && article.thumbnail.trim() !== '') return article.thumbnail;
        if (article.enclosure && article.enclosure.link) return article.enclosure.link;
        const div = document.createElement('div');
        div.innerHTML = article.content || article.description;
        const img = div.querySelector('img');
        if (img && img.src) return img.src;
        return null;
    };

    // 1. Fetch Tech News
    useEffect(() => {
        const fetchTechNews = async () => {
            setLoading(true);
            try {
                const fetchPromises = RSS_URLS.map(url =>
                    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`)
                        .then(res => res.json())
                );
                const results = await Promise.all(fetchPromises);
                
                let allArticles = [];
                results.forEach((data, index) => {
                    if (data.status === 'ok') {
                        const items = data.items.map(article => ({
                            _id: article.link,
                            title: article.title,
                            // Content will be expandable right inside the post
                            content: stripHtml(article.content || article.description),
                            coverImage: getArticleImage(article),
                            category: 'Tech News',
                            author: {
                                name: data.feed.title || (index === 0 ? 'TechCrunch' : 'The Verge'),
                                username: 'news',
                                avatar: data.feed.image || ''
                            },
                            createdAt: article.pubDate,
                            isExternal: true, // Prevents Like / Comment buttons from breaking MongoDB paths
                            link: article.link
                        }));
                        allArticles = [...allArticles, ...items];
                    }
                });
                
                // Sort by date descending
                allArticles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                
                setTechNews(allArticles);
            } catch (err) {
                console.error('Error fetching tech news:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTechNews();
    }, []);


    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black w-full flex">
            <Sidebar />

            <main className="flex-1 w-full flex flex-col items-center">
                <div className="w-full max-w-xl pt-16 lg:pt-5 pb-20 px-0 flex flex-col gap-0 border-x-0 sm:border-x sm:border-neutral-200 dark:sm:border-neutral-800 min-h-screen">
                    
                    {/* Header */}
                    <div className="px-4 py-3 sm:py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-20">
                        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-zinc-100">
                            Tech News
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Latest stories from around the web
                        </p>
                    </div>

                    {/* Loading Skeletons */}
                    {loading && techNews.length === 0 && (
                        <div className="flex flex-col gap-6">
                            <NewsletterSkeleton />
                            <NewsletterSkeleton />
                        </div>
                    )}

                    {/* Feed */}
                    {techNews.map((post) => (
                        <NewsletterPost key={post._id} newsletter={post} />
                    ))}

                    {/* Empty State */}
                    {!loading && techNews.length === 0 && (
                        <div className="text-center py-16 text-gray-500 text-sm">
                            No tech stories available right now.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default NewsLetters;