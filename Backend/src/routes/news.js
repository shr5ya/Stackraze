const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

router.get('/articles', async (req, res) => {
    try {
        const { q, domains, from, pageSize, sortBy, language } = req.query;
        
        const envPath = path.join(__dirname, '../config/config.env');
        const envConfig = fs.existsSync(envPath) ? dotenv.parse(fs.readFileSync(envPath)) : {};
        const apiKey = process.env.VITE_NEWS_API_KEY || process.env.NEWS_API_KEY || envConfig.NEWS_API_KEY || '';
        
        // Build the NewsAPI URL
        const queryParams = new URLSearchParams({
            q: q || '',
            domains: domains || '',
            from: from || '',
            sortBy: sortBy || 'relevancy',
            language: language || 'en',
            pageSize: pageSize || 20,
            apiKey: apiKey
        });

        const url = `https://newsapi.org/v2/everything?${queryParams.toString()}`;

        const response = await fetch(url);
        
        if (!response.ok) {
            return res.status(response.status).json({ 
                status: 'error', 
                message: `News API responded with ${response.status}: ${response.statusText}`
            });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("NewsProxy Error:", error);
        res.status(500).json({ status: 'error', message: "Failed to fetch from NewsAPI" });
    }
});

module.exports = router;
