// File: lib/Utils/Scraper.js
// Module: Chatify Framework

const axios = require('axios');
const cheerio = require('cheerio');
const { USER_AGENT } = require('./Constants');

/**
 * Fetch JSON dari URL API
 * @param {String} url 
 * @param {Object} options 
 */
const fetchJson = async (url, options = {}) => {
    try {
        const res = await axios({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': USER_AGENT,
                ...options.headers
            },
            ...options
        });
        return res.data;
    } catch (err) {
        throw new Error(err.response ? `${err.response.status} ${err.response.statusText}` : err.message);
    }
};

/**
 * Fetch Text/HTML dari URL
 * @param {String} url 
 * @param {Object} options 
 */
const fetchText = async (url, options = {}) => {
    try {
        const res = await axios({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': USER_AGENT,
                ...options.headers
            },
            ...options
        });
        return res.data;
    } catch (err) {
        throw err;
    }
};

/**
 * Ambil Metadata Website (Title, Description, Image)
 * Berguna untuk fitur "Link Preview" buatan sendiri
 * @param {String} url 
 */
const getMetadata = async (url) => {
    try {
        const html = await fetchText(url);
        const $ = cheerio.load(html);
        
        const title = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
        const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';
        const image = $('meta[property="og:image"]').attr('content') || '';
        const url_site = $('meta[property="og:url"]').attr('content') || url;

        return {
            title: title.trim(),
            description: description.trim(),
            image: image,
            url: url_site
        };
    } catch (e) {
        return {
            title: 'No Title',
            description: 'Could not fetch metadata',
            image: '',
            url: url
        };
    }
};

/**
 * Shortlink Sederhana (TinyURL)
 * @param {String} url 
 */
const shortlink = async (url) => {
    try {
        const res = await axios.get(`https://tinyurl.com/api-create.php?url=${url}`);
        return res.data;
    } catch (e) {
        return url; // Return original jika gagal
    }
};

module.exports = {
    fetchJson,
    fetchText,
    getMetadata,
    shortlink
};