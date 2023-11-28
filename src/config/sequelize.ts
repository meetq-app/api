import Sequelize from "sequelize";

// @ts-ignore
const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.PG_USER!,
  process.env.PG_PASS!,
  {
    dialect: "postgres",
    host: "localhost",
  }
);

export default sequelize;

//todo add indexes and cascade deletions
