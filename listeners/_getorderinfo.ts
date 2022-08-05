import IceCreamBot from '../bot'
import { creams as CreamModel, orders, ordersCreams as ordersCreamsModel } from '../models'
import XLSX from 'xlsx'
import path from 'path'

IceCreamBot.bot.onText(/\/getorderinfo/, async ({ chat: { id }, from }) => {
    const ordersData: any = []
    const creams = (await CreamModel.findAll({
        where: {
            authorId: String(from?.id)
        },
        raw: true
    })).map(i => String(i.id))
    const ordersCreams = Array.from(new Set((await ordersCreamsModel.findAll({
        where: {
            creamId: creams
        }
    })).map(i => String(i.orderId))))
    
    const orderInfo: any[] = await orders.findAll({
        where: {
            id: ordersCreams
        },
        raw: true
    })
    for (const o of orderInfo) {     
        const oc: any[] = (await ordersCreamsModel.findAll({
            where: {
                orderId: String(o.id)
            },
            include: [{
                model: CreamModel
            }],
            raw: true
        }))

        ordersData.push({
            id: o.id,
            status: o.status,
            createdAt: o.createdAt,
            buyerId: o.authorId,
            price: oc.reduce((prev, curr) => prev + curr['cream.price'], 0)
        }) 
    }    
    const worksheet = XLSX.utils.json_to_sheet(ordersData)   
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, path.resolve(__dirname, '..', 'static', `orders_${String(from?.id)}.xlsx`));
    IceCreamBot.bot.sendDocument(id, path.resolve(__dirname, '..', 'static', `orders_${String(from?.id)}.xlsx`))
    return
})