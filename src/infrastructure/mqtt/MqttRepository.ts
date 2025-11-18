import { MqttClient } from "./MqttClient";

export class MqttRepository {

    private client = MqttClient.getClient();

    /** Publica comando para actuadores del ESP32 */
    async publishActuatorCommand(sensor: string, value: boolean): Promise<void> {
        const topic = `pond/${sensor}/command`;

        const message = JSON.stringify({
            actuator: value ? 1 : 0,
            timestamp: Date.now()
        });

        console.log(`📤 MQTT Publish → Topic: ${topic} | Payload: ${message}`);

        this.client.publish(topic, message);
    }
}