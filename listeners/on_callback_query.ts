import axios from "axios"
import IceCreamBot from "../bot"
import { creams, orders, ordersCreams } from "../models"
import { chats } from "./_addsort"
import { sort_callback } from "./_sort"
import config from 'config'
import { Op } from "sequelize"
import creamsModel from '../models/creams'

const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk')
const api = new QiwiBillPaymentsAPI(config.get('SECRET_TOKEN'))
IceCreamBot.bot.on('callback_query', async (msg) => {
    // Always returns true
    if (msg.message?.chat?.id) {
        const __IS_CREAM_FORM_COMPLITE = (chats[msg.message?.chat?.id]?.photo && chats[msg.message?.chat?.id]?.ingredients && chats[msg.message?.chat?.id]?.price && chats[msg.message?.chat?.id]?.weight)
        switch (msg.data) {
            case '/sort':
                await sort_callback(msg.message)
            return
            case 'pay':
                const order = (await orders.findAll({
                    where: {
                        authorId: String(msg.from.id),
                        status: 'created'
                    },
                    raw: true
                }))?.[0]
                if (!order) {
                    IceCreamBot.bot.sendMessage(msg.message?.chat?.id, 'Произошла непредвиденая ошибка, попробуйте снова')
                    return
                }
                const creamData = (await ordersCreams.findAll({
                    where: {
                        orderId: order?.id
                    },
                    include: [
                        {
                            model: creamsModel
                        }
                    ],
                    raw: true
                })).reduce((prev, curr) => prev + (curr['cream.price'] as number || 0), 0)
                const pay_link = await api.createPaymentForm({
                    publicKey: config.get('JWT_TOKEN'),
                    billId: order.id,
                    amount: creamData
                })
                IceCreamBot.bot.sendMessage(msg.message?.chat?.id, 'Отлично, заказ создан ✅', {
                    reply_markup: {
                        inline_keyboard: [
                            [{text: 'Оплатить', url: pay_link}],
                            [{text: 'Оплатил(ла)', callback_data: 'payed'}]
                        ]
                    }
                })
                return
            case 'payed':
                const orderInfo = (await orders.findAll({
                    where: {
                        authorId: String(msg.from.id),
                        status: 'created'
                    },
                    raw: true
                }))?.[0]
                const offer = await api.getBillInfo(orderInfo.id)
                if (offer.status === 'PAID') {
                    await orders.update({
                        status: 'payed'
                    }, {
                        where: {
                            id: orderInfo.id
                        }
                    })
                    IceCreamBot.bot.sendMessage(msg.message?.chat?.id, 'Отлично, ожидайте заказ ✅')
                } else {
                    // IceCreamBot.bot.sendMessage(msg.message?.chat?.id, 'Что-то пошло не так попробуйте снова')
                }
                return
            case 'create_ice_cream':
                if (!__IS_CREAM_FORM_COMPLITE) return
                creams.create({
                    weight: chats[msg.message?.chat?.id].weight,
                    price: chats[msg.message?.chat?.id].price,
                    ingredients: chats[msg.message?.chat?.id].ingredients,
                    photo: chats[msg.message?.chat?.id].photo,
                    authorId: String(msg.from.id)
                })
                chats[msg.message?.chat?.id] = {
                    status: '',
                    photo: '',
                    weight: 0.0,
                    ingredients: '',
                    price: 0.0
                }
                IceCreamBot.bot.sendMessage(msg.message?.chat?.id, 'Мороженое было создано ✅')
                return 
            case 'cancel_ice_cream':
                if (!__IS_CREAM_FORM_COMPLITE) return
                chats[msg.message?.chat?.id] = {
                    status: '',
                    photo: '',
                    weight: 0.0,
                    ingredients: '',
                    price: 0.0
                }
                IceCreamBot.bot.sendMessage(msg.message?.chat?.id, 'Попробуйте создать мороженое ещё раз')
                return
        }
        if (msg.data?.split(' ')?.[0] === 'create_order') {
            const order = await orders.findAll({
                where: {
                    authorId: String(msg.from.id),
                    status: 'created'
                }
            })
            if (order.length) {
                await ordersCreams.create({
                    orderId: order[0].id,
                    creamId: msg.data?.split(' ')?.[1]
                })
                const orderCreamsCurrentOrder = (await ordersCreams.findAll({
                    where: {
                        orderId: order[0].id
                    },
                    include: [
                        {
                            model: creamsModel
                        }
                    ],
                    raw: true
                }))             
                IceCreamBot.bot.sendMessage(msg.message.chat.id, 'Общая сумма покупки состовляет ' + orderCreamsCurrentOrder.reduce((prev, curr) => prev + (curr['cream.price'] as number || 0), 0))
                IceCreamBot.bot.sendMessage(msg.message.chat.id, 'Добавленое ещё одно мороженое, желаете добавить ещё?', {
                    reply_markup: {
                        inline_keyboard: [
                            [{text: '✅', callback_data: '/sort'}],
                            [{text: '❌', callback_data: 'pay'}],
                        ]
                    }
                })
                return
            }
            const curr_order = await orders.create({
                authorId: String(msg.from.id)
            })

            await ordersCreams.create({
                orderId: curr_order.id,
                creamId: msg.data?.split(' ')?.[1]
            })
            IceCreamBot.bot.sendMessage(msg.message.chat.id, 'Ваш заказ создан, желаете добавить ещё мороженого?', {
                reply_markup: {
                    inline_keyboard: [
                        [{text: '✅', callback_data: '/sort'}],
                        [{text: '❌', callback_data: 'pay'}],
                    ]
                }
            })
        }
    }
    
})