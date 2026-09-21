const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 });

const getCache = (key) => cache.get(key);
const setCache = (key, value, ttl = 300) => cache.set(key, value, ttl);
const flushCache = () => cache.flushAll();

module.exports = { getCache, setCache, flushCache };