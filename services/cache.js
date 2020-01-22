const mongoose = require('mongoose')
const redis = require('redis')
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl)
client.get = util.promisify(client.get)
//almacenando una copia exacta de la funcion exec de mongoose
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function () {
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
    client.set(key, JSON.stringify(result))
    return result;
}