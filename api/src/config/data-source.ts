import { DataSource } from "typeorm";
import { entities, migrations } from "../constants/typeorm";
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export default new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: entities,
    migrations: migrations,
    synchronize: false,
});