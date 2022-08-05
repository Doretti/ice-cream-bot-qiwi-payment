import express, { Application } from 'express'
import sequelize from './database'
import './models'

const app: Application = express();

app.use(express.static(__dirname + '/static'));

const start = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connection has been established successfully');
    } catch (error) {
        console.error(error);
    }
    app.listen(process.env.PORT, () => {
        console.log('Server has been started');
    })
}

start()