import Redis, { Redis as RedisType } from "ioredis";

const redis: RedisType = new Redis({
    connectTimeout: 10000,
    host: 'localhost',
    port: 6379,
});

export default redis;
