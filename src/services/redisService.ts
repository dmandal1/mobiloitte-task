import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

const redisClient: RedisClientType = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    }
});

const connect = async (): Promise<void> => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};

const disconnect = async (): Promise<void> => {
    if (redisClient.isOpen) {
        await redisClient.disconnect();
    }
};

const set = async (key: string, value: string, expiry?: number): Promise<boolean> => {
    try {
        await redisClient.set(key, value);
        if (expiry) await redisClient.expire(key, expiry);
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const get = async (key: string): Promise<string | null> => {
    try {
        return await redisClient.get(key);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const del = async (key: string): Promise<void> => {
    try {
        await redisClient.del(key);
    } catch (error) {
        console.error(error);
        throw error;
    }
};




export default {
    connect,
    disconnect,
    set,
    get,
    del,
};