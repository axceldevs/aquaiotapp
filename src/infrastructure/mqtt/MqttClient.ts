import mqtt, { MqttClient as Client } from "mqtt";
import { EnvConfig } from "../../config/EnvConfig";

export class MqttClient {

    private static instance: Client;

    static getClient(): Client {
        if (!MqttClient.instance) {
            const host = EnvConfig.MQTT.url;
            const username = EnvConfig.MQTT.username;
            const password = EnvConfig.MQTT.password;
            const port = EnvConfig.MQTT.port;
            console.log("Connecting to MQTT Broker at", host, "on port", port);
            const client = mqtt.connect(host, {
                port,
                username,
                password
            });

            client.on("connect", () => {
                console.log("MQTT connected to CloudMQTT");
            });

            client.on("error", (err) => {
                console.error("❌ MQTT error:", err);
            });

            MqttClient.instance = client;
        }

        return MqttClient.instance;
    }
}