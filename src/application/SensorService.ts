import { SensorRepository } from "../infrastructure/redis/SensorRepository";
import { SensorPayload } from "../domain/Sensor";
import { AlertService } from "./AlertService";
import { MqttRepository } from "../infrastructure/mqtt/MqttRepository";

export class SensorService {
  constructor(
    private repo: SensorRepository, 
    private mqtt: MqttRepository) {}

  async getAll(): Promise<SensorPayload> {
    return this.repo.getAll();
  }

  async saveAll(payload: SensorPayload): Promise<void> {
    // 1. Guardamos los datos en Redis (Repositorio)
    await this.repo.saveAll(payload);

    // 2. Buscar sensor de temperatura en el JSON recibido
    const tempSensor = payload.sensors.find((s) => s.type === "temperature");

    if (tempSensor) {
      await AlertService.checkTemperature(tempSensor.value!);
    }

    // 3. Buscar sensor de pH en el JSON recibido
    const phSensor = payload.sensors.find((s) => s.type === "ph");

    if (phSensor) {
      await AlertService.checkPH(phSensor.value!);
    }

    // 4. Buscar sensor de oxígeno disuelto en el JSON recibido
    const doSensor = payload.sensors.find((s) => s.type === "oxygen");

    if (doSensor) {
      await AlertService.checkDissolvedOxygen(doSensor.value!);
    }

    // 5. Buscar sensor de turbidez en el JSON recibido
    const turbiditySensor = payload.sensors.find((s) => s.type === "turbidity");

    if (turbiditySensor) {
      await AlertService.checkTurbidity(turbiditySensor.value!);
    }

  }

  async activateActuator(sensor: string, value: boolean) {
        await this.mqtt.publishActuatorCommand(sensor, value);
        return { ok: true };
  }
}
