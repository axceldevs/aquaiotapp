import { createClient } from "redis";
import { EnvConfig } from "../../config/EnvConfig";

export const redis = createClient({
    username: EnvConfig.REDIS.username,
    password: EnvConfig.REDIS.password,
    socket: {
        host: EnvConfig.REDIS.url,
        port: EnvConfig.REDIS.port 
    }
});
console.log("Connected to Redis redis://"+EnvConfig.REDIS.url+":"+EnvConfig.REDIS.port);
redis.on("error", (err) => {
    console.log("Failed to connect to Redis redis://"+EnvConfig.REDIS.url+":"+EnvConfig.REDIS.port);
    console.error("Redis error:", err);
});

redis.connect();