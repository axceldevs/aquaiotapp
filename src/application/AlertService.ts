import { SmsService } from "./TwilioService";

export class AlertService {

    static async checkTemperature(value: number) {
        const threshold = parseFloat(process.env.TEMP_THRESHOLD || "26.0");

        if (value > threshold) {
            const msg = `⚠️ Alerta: la temperatura del agua llegó a ${value}°C (umbral: ${threshold}°C)`;
            await SmsService.sendSMS(msg);
        } else {
            console.log("✅ Temperatura dentro de límites normales");
        }
    }

    static async checkPH(value: number) {
        const lowerThreshold = parseFloat(process.env.PH_LOWER_THRESHOLD || "6.5");
        const upperThreshold = parseFloat(process.env.PH_UPPER_THRESHOLD || "8.5");

        if (value < lowerThreshold || value > upperThreshold) {
            const msg = `⚠️ Alerta: el pH del agua llegó a ${value} (umbral: ${lowerThreshold}-${upperThreshold})`;
            await SmsService.sendSMS(msg);
        } else {
            console.log("✅ pH dentro de límites normales");
        }
    }

    static async checkDissolvedOxygen(value: number) {
        const threshold = parseFloat(process.env.DO_THRESHOLD || "5.0");
        
        if (value < threshold) {
            const msg = `⚠️ Alerta: el oxígeno disuelto del agua llegó a ${value} mg/L (umbral: ${threshold} mg/L)`;
            await SmsService.sendSMS(msg);
        } else {
            console.log("✅ Oxígeno disuelto dentro de límites normales");
        }
    }

    static async checkTurbidity(value: number) {
        const threshold = parseFloat(process.env.TURBIDITY_THRESHOLD || "5.0");

        if (value > threshold) {
            const msg = `⚠️ Alerta: la turbidez del agua llegó a ${value} NTU (umbral: ${threshold} NTU)`;
            await SmsService.sendSMS(msg);
        } else {
            console.log("✅ Turbidez dentro de límites normales");
        }
    }
}