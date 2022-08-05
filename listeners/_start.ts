import axios from 'axios';
import IceCreamBot from "../bot"
import config from 'config'

IceCreamBot.bot.onText(/\/start/, async ({ chat: { id }, from}, match) => {
    IceCreamBot.bot.sendPhoto(id, Buffer.from((await axios.get(`${config.get('baseUrl')}default/logo.jpg`, {
        responseType: 'arraybuffer'
    })).data), {
        caption: IceCreamBot.__intro_message
    })
})