import { Sequelize } from "sequelize";

const {
    USER,
    PASS,
    HOST,
    DB_PORT,
    DB_NAME
} = process.env

const db = new Sequelize(`postgres://${USER}:${PASS}@${HOST}:${DB_PORT}/${DB_NAME}`)

export default db