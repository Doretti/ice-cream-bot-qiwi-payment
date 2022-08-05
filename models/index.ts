import users from './users'
import creams from './creams'
import orders from './orders'
import ordersCreams from './orderCreams'

users.hasMany(creams, {
    foreignKey: 'authorId'
})

orders.hasMany(ordersCreams, {
    foreignKey: 'orderId'
})
ordersCreams.belongsTo(orders)
users.hasOne(orders, {
    foreignKey: 'authorId'
})
creams.hasMany(ordersCreams, {
    foreignKey: 'creamId'
})

ordersCreams.belongsTo(creams)

export {
    users,
    creams,
    orders,
    ordersCreams
}