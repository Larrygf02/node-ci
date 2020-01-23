const mongoose = require('mongoose')
const redis = require('redis')
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl)
client.hget = util.promisify(client.hget)
//almacenando una copia exacta de la funcion exec de mongoose
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '')
    return this;
}

mongoose.Query.prototype.exec = async function () {
    if (!this.useCache) {
        return exec.apply(this, arguments);
    }
    console.log('IM ABOUT TO RUN A QUERY');
/*     console.log(this.getQuery());
    console.log(this.mongooseCollection.name); */

    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }))

    // Mirar si el key se encuentra en redis
    const cacheValue = await client.get(key)
    if (cacheValue) {
        console.log('Cache value');
        const doc = JSON.parse(cacheValue)
        return Array.isArray(doc) 
        ? doc.map(d => new this.model(d))
        : new this.model(doc)
    }

    const result = await exec.apply(this, arguments);
    client.hset(this.hashKey ,key, JSON.stringify(result), 'EX', 10)
    return result;
}

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey))
    }
}