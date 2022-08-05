import TelegramBot from "node-telegram-bot-api";

export default class TelegramIceCreamBot {
    protected __telegram_bot: TelegramBot;
    public __name: string | undefined | null = undefined;
    public __intro_message: string = `
        Добро пожаловать, мы начинающая компания основной целью которой является повысить вам настроение и пордовать хорошим ассортиментом мороженого

Напиши /sort для того чтобы посмотреть на всё имеющиеся виды
    `;

    private static instance: null | TelegramIceCreamBot = null;

    constructor(bot: TelegramBot) {
        if (TelegramIceCreamBot.instance) {
            return TelegramIceCreamBot.instance
        }
        TelegramIceCreamBot.instance = this
        this.__telegram_bot = bot
    }

    get bot() {
        return this.__telegram_bot
    }
}