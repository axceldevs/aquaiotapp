import { Router } from "express";
import { SensorRepository } from "../../infrastructure/redis/SensorRepository";
import { MqttRepository } from "../../infrastructure/mqtt/MqttRepository";
import { SensorService } from "../../application/SensorService";
import { SensorController } from "../controllers/SensorController";

const repo = new SensorRepository();
const mqtt = new MqttRepository();
const service = new SensorService(repo, mqtt);
const controller = new SensorController(service);

export const sensorRouter = Router();

sensorRouter.get("/all", controller.getAll);
sensorRouter.post("/save", controller.saveAll);
sensorRouter.post("/actuator/command", controller.activateActuator);