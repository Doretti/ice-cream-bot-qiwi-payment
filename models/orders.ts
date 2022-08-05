import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelCtor } from 'sequelize'
import sequelize from '../database'

const orders: ModelCtor<Order> = sequelize.define('orders', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    status: {
        type: DataTypes.ENUM('created', 'payed', 'canceled'),
        defaultValue: 'created'
    }
})

export default orders

class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
    declare id: CreationOptional<string>
    declare status: CreationOptional<'created' | 'payed' | 'canceled'>
    declare authorId: string
}