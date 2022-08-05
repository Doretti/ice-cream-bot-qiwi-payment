import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelCtor } from 'sequelize'
import sequelize from '../database'

const orderCreams: ModelCtor<OrderCream> = sequelize.define('orderCreams', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    }
})

export default orderCreams

export class OrderCream extends Model<InferAttributes<OrderCream>, InferCreationAttributes<OrderCream>> {
    declare id: CreationOptional<string>
    declare orderId: String
    declare creamId: String
    declare 'cream.price'?: number
}