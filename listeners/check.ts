import IceCreamBot from "../bot"
import { checkCreateUser } from "./utils"

IceCreamBot.bot.on('message', ({ from }) => {
    checkCreateUser(from)
})