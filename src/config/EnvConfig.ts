import dotenv from "dotenv";
dotenv.config();

export class EnvConfig {
    // ================================
    // 🔶 PORT
    // ================================
    static readonly PORT: number = Number(process.env.PORT ?? 3000);

    // ================================
    // 🔶 REDIS
    // ================================
    static readonly REDIS = {
        url: process.env.REDIS_URL ?? "",
        username: process.env.REDIS_USERNAME ?? "",
        password: process.env.REDIS_PASSWORD ?? "",
        port: Number(process.env.REDIS_PORT ?? 0),
    };

    // ================================
    // 🔶 SENSOR THRESHOLDS
    // ================================
    static readonly THRESHOLDS = {
        temperature: Number(process.env.TEMP_THRESHOLD ?? 0),
        phLower: Number(process.env.PH_LOWER_THRESHOLD ?? 0),
        phUpper: Number(process.env.PH_UPPER_THRESHOLD ?? 0),
        dissolvedOxygen: Number(process.env.DO_THRESHOLD ?? 0),
        turbidity: Number(process.env.TURBIDITY_THRESHOLD ?? 0),
    };

    // ================================
    // 🔶 TWILIO
    // ================================
    static readonly TWILIO = {
        accountSid: process.env.TWILIO_ACCOUNT_SID ?? "",
        authToken: process.env.TWILIO_AUTH_TOKEN ?? "",
        fromNumber: process.env.TWILIO_FROM_NUMBER ?? "",
        toNumber: process.env.TWILIO_TO_NUMBER ?? "",
    };

    // ================================
    // 🔶 MQTT
    // ================================
    static readonly MQTT = {
        url: process.env.MQTT_BROKER_URL ?? "mqtt://localhost:1883",
        username: process.env.MQTT_BROKER_USERNAME ?? "",
        password: process.env.MQTT_BROKER_PASSWORD ?? "",
        port: Number(process.env.MQTT_BROKER_PORT ?? 1883),
    };
    
    // ================================
    // 🔶 Helper: Validación rápida
    // ================================
    static validate(): void {
        const requiredVars: { key: string; value: any }[] = [
            { key: "PORT", value: this.PORT },
            { key: "REDIS_URL", value: this.REDIS.url },
            { key: "TWILIO_ACCOUNT_SID", value: this.TWILIO.accountSid },
            { key: "MQTT_BROKER_URL", value: this.MQTT.url },
        ];

        const missing = requiredVars.filter(v => !v.value);

        if (missing.length > 0) {
            console.error("❌ Missing environment variables:");
            missing.forEach(v => console.error(` - ${v.key}`));
            process.exit(1);
        }
    }
}