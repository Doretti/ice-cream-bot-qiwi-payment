import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelCtor } from 'sequelize'
import sequelize from '../database'

const users: ModelCtor<User> = sequelize.define('users', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    role: {
        type: DataTypes.ENUM('buyer', 'seller')
    }
})

export default users

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<string>
    declare role: string
}