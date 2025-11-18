import twilio from "twilio";
import { EnvConfig } from "../config/EnvConfig";

const client = twilio(
    EnvConfig.TWILIO.accountSid,
    EnvConfig.TWILIO.authToken
);

export class SmsService {
    static async sendSMS(message: string) {
        try {
            await client.messages.create({
                body: message,
                from: EnvConfig.TWILIO.fromNumber,
                to: EnvConfig.TWILIO.toNumber
            });

            console.log("📨 SMS enviado correctamente");
        } catch (err) {
            console.error("❌ Error enviando SMS", err);
        }
    }
}