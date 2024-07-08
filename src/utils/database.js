import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
import { logger } from "./logger.js";
const {
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_HOST,
  CA_CERT,
} = process.env;

export const sequelize = new Sequelize(
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
  {
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true,
        ca: CA_CERT.replace(/\\n/g, "\n"),
      },
    },
  }
);

export async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    logger.info("Connected to the database");
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

export async function syncDatabase(){
  try{
   if (process.env.NODE_ENV === "test") {
      await sequelize.sync({ force: true });
    }
    await sequelize.sync();
  }catch(err){
    logger.error(err.stack);
    throw Error(err);
  }
}
