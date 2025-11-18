import { Request, Response } from "express";
import { SensorService } from "../../application/SensorService";

export class SensorController {

    constructor(private service: SensorService) {}

    getAll = async (req: Request, res: Response) => {
        try {
            const data = await this.service.getAll();
            res.json(data);
        } catch (error) {
            res.status(500).json({ message: "Error leyendo sensores" });
        }
    };

    saveAll = async (req: Request, res: Response) => {
        try {
            await this.service.saveAll(req.body);
            res.json({ message: "Datos guardados correctamente" });
        } catch (error) {
            res.status(500).json({ message: "Error guardando datos" });
        }
    };

    activateActuator = async (req: Request, res: Response) => {
        try {
            const { sensor, value } = req.body;
            const result = await this.service.activateActuator(sensor, value);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: "Error activando actuador" });
        }
    };
}