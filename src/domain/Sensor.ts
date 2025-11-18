export interface SensorData {
    type: "temperature" | "ph" | "oxygen" | "turbidity";
    value: number | null;
    actuator: boolean;
    message: string;
}

export interface SensorPayload {
    sensors: SensorData[];
}