import "reflect-metadata";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import * as dotenv from "dotenv";

dotenv.config();

const dataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    extra: { max: 5, min: 2 }, // connection pool
    synchronize: false,
    logging: false,
    namingStrategy: new SnakeNamingStrategy(),
    entities: ["dist/entity/*.js"],
    migrations: ["dist/db/migrations/*.js"],
});

export default dataSource;
