import { DataSource } from 'typeorm'
import { envs } from './env'

import entities from '../../entity'

const dataSource = new DataSource({
    type: "postgres",
    host: envs.DB_HOST,
    port: Number(envs.DB_PORT),
    username: envs.DB_USERNAME,
    password: envs.DB_PASSWORD,
    database: envs.DB_NAME,
    synchronize: true,
    logging: envs.NODE_ENV === 'production' ? false : true,
    entities: entities
})

export default dataSource