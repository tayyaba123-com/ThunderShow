
import Redis from "ioredis"

const redis = new Redis({
    host: process.env.REDIS_HOST || "redis-15947.crce179.ap-south-1-1.ec2.cloud.redislabs.com",
    port: process.env.REDIS_PORT || 15947,
    password: process.env.REDIS_PASSWORD || "55fUtsYsJWvh49Tv2n2LaWxGdUDPH1u2",
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    reconnectOnError: (err) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
            return true;
        }
        return false;
    }
})

redis.on("connect", () => {
    console.log("server is connected to redis")
})

redis.on("error", (err) => {
    console.log(err)
})

export default redis