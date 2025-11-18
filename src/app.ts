import express from "express";
import cors from "cors";
import { sensorRouter } from "./entrypoints/routes/SensorRoutes";
export const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1/sensors", sensorRouter);
app.use(express.static("public"));