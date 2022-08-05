import axios from "axios";
import IceCreamBot from "../bot"
import { creams } from '../models/index'

export const sort_callback = async ({ chat: { id }}: any) => {
    const sorts = await creams.findAll({
        raw: true
    })
    sorts.forEach(async (cream) => {
        if (!cream?.photo) {
            return
        }
        await IceCreamBot.bot.sendPhoto(id, Buffer.from((await axios.get(cream?.photo, {
            responseType: 'arraybuffer'
        })).data), {
            caption: `
            *Вес*: ${cream?.weight}
*Ингредиенты*: ${cream?.ingredients}
*Цена*: ${cream?.price} руб
        `,
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{text: 'Заказать', callback_data: 'create_order ' + cream.id}]
            ]
        }
        })
    });
}

IceCreamBot.bot.onText(/\/sort/, sort_callback)