import { config } from 'dotenv';
config()
import TelegramBot from 'node-telegram-bot-api'
import TelegramIceCreamBot from './TelegramIceCreamBotClass';

const bot = new TelegramIceCreamBot(new TelegramBot(process.env.TOKEN || '', { polling: true }))

bot.bot.setMyCommands([
    {
        command: '/start',
        description: 'Приветствие'
    },
    {
        command: '/sort',
        description: 'Получить все сорты мороженого'
    },
    {
        command: '/exit',
        description: 'Отменить текщее действие'
    },
])

export default bot

