import TelegramBot from "node-telegram-bot-api"
import { users } from "../models"

export async function checkCreateUser(from: TelegramBot.User | undefined): Promise<void> {
    if (!from?.is_bot && from) {
        if (!(await users.findByPk(String(from.id)))) {
            await users.create({
                id: String(from.id),
                role: 'buyer'
            })
        }
    }
}