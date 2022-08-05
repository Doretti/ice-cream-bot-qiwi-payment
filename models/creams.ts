import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelCtor, Optional } from 'sequelize'
import sequelize from '../database'

const creams: ModelCtor<Cream> = sequelize.define('creams', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    weight: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0
    },
    price: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0
    },
    ingredients: {
        type: DataTypes.STRING,
        allowNull: false
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default creams

class Cream extends Model<InferAttributes<Cream>, InferCreationAttributes<Cream>> {
    declare id: CreationOptional<string>
    declare weight: number
    declare price: number
    declare ingredients: string
    declare photo: string
    declare authorId: string
}