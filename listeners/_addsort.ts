import config from 'config'
import IceCreamBot from "../bot"
import axios from 'axios'
import request from 'request'
import { v4 } from 'uuid'
import { createWriteStream } from "fs"
import path from 'path'
import { users } from '../models'

export const chats: {
    [key: string]: {
        photo: string,
        status: string,
        weight: number,
        price: number,
        ingredients: string
    }
} = {}

IceCreamBot.bot.onText(/\/addsort/, async ({ chat: { id }, from}, match) => {
    const user = await users.findByPk(String(from?.id))
    
    if ((user?.role === 'buyer' || !user) && false) {
        IceCreamBot.bot.sendMessage(id, 'У вас не достаточно прав для продажи своего продукта')
        return
    }
    IceCreamBot.bot.sendMessage(id, 'Отправь фото мороженого')
    chats[id] = {
        status: 'set_photo',
        photo: '',
        weight: 0.0,
        ingredients: '',
        price: 0.0
    }
})

IceCreamBot.bot.on('message', async ({ chat: { id }, text, photo, from}, match) => {
    if (text === '/exit') return
    switch (chats[id]?.status) {
        case 'set_photo':
            if (!photo?.[photo?.length - 1].file_id) {
                IceCreamBot.bot.sendMessage(id, 'Произошла ошибка попробуйте ещё раз')
                return
            }
            const file = (await axios.get(`https://api.telegram.org/bot${process.env.TOKEN}/getFile?file_id=${photo?.[photo?.length - 1].file_id}`)).data.result            
            const file_name = v4().replace(/\n$/, "")
            request.head(`https://api.telegram.org/file/bot${process.env.TOKEN}/${file.file_path}`, (_err, _res, _body) => {
                request(`https://api.telegram.org/file/bot${process.env.TOKEN}/${file.file_path}`).pipe(createWriteStream(path.resolve(__dirname, '..', 'static', file_name + '.jpg')))
                    .on('close', async () => {
                        chats[id].photo = config.get('baseUrl') + file_name + '.jpg' + '?i=0'
                        chats[id].status = 'set_weight'                
                        IceCreamBot.bot.sendMessage(id, 'Укажите вес мороженого')
                    })
            })
            break;
    
        case 'set_weight':          
            let weight = parseFloat(text || '')
            if (!weight) {
                IceCreamBot.bot.sendMessage(id, 'Неверный формат')
                IceCreamBot.bot.sendMessage(id, 'Попробуйте снова создать мороженое')
                chats[id] = {
                    status: '',
                    photo: '',
                    weight: 0.0,
                    ingredients: '',
                    price: 0.0
                }
                return
            }
            chats[id].weight = weight
            chats[id].status = 'set_ingredients'
            IceCreamBot.bot.sendMessage(id, 'Укажите ингредиенты')
            break;
        case 'set_ingredients':
            chats[id].ingredients = text || ''
            chats[id].status = 'set_price'   
            IceCreamBot.bot.sendMessage(id, 'Укажите цену')
            break;
        case 'set_price':
            let price = parseFloat(text || '')
            if (!price) {
                IceCreamBot.bot.sendMessage(id, 'Неверный формат')
                IceCreamBot.bot.sendMessage(id, 'Попробуйте снова создать мороженое')
                chats[id] = {
                    status: '',
                    photo: '',
                    weight: 0.0,
                    ingredients: '',
                    price: 0.0
                }
                return
            }
            chats[id].price = price
            await IceCreamBot.bot.sendPhoto(id, Buffer.from((await axios.get(chats[id].photo, {
                responseType: 'arraybuffer'
            })).data), {
                caption: `
                *Вес*: ${chats[id].weight}
*Ингредиенты*: ${chats[id].ingredients}
*Цена*: ${chats[id].price} руб

Верно?
            `,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{text: '✅', callback_data: 'create_ice_cream'}],
                    [{text: '❌', callback_data: 'cancel_ice_cream'}],
                ]
            }
            })
            break;
        default:
            break;
    }
})