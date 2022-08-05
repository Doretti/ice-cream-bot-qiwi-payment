import IceCreamBot from '../bot'
import { orders, ordersCreams } from '../models'
import { chats } from './_addsort'

IceCreamBot.bot.onText(/\/exit/, async ({ chat: { id }, from }) => {
    chats[id] = {
        status: '',
        photo: '',
        weight: 0.0,
        ingredients: '',
        price: 0.0
    }
    const order = (await orders.findAll({
        where: {
            authorId: String(from?.id),
            status: 'created'
        },
        raw: true
    }))?.[0]
    if (order) {
        await ordersCreams.destroy({
            where: {
                orderId: order.id
            }
        })
        await orders.destroy({
            where: {
                authorId: String(from?.id),
                status: 'created'
            }
        })
    }
    IceCreamBot.bot.sendMessage(id, 'Вы отменили текущее действие')
    return
})