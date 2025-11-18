import { redis } from "./redisClient";
import { SensorPayload, SensorData } from "../../domain/Sensor";

export class SensorRepository {

    private key = "sensors";

    async getAll(): Promise<SensorPayload> {
        const raw = await redis.get(this.key);

        if (!raw) {
            // default structure
            return {
                sensors: [
                    { type: "temperature", value: null, actuator: false, message: "" },
                    { type: "ph", value: null, actuator: false, message: "" },
                    { type: "oxygen", value: null, actuator: false, message: "" },
                    { type: "turbidity", value: null, actuator: false, message: "" }
                ]
            };
        }

        return JSON.parse(raw) as SensorPayload;
    }

    async saveAll(payload: SensorPayload): Promise<void> {
        await redis.set(this.key, JSON.stringify(payload));
    }
}