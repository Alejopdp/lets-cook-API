require("dotenv").config();

const { XXX_DB_USER, XXX_DB_PASS, XXX_DB_HOST, XXX_DB_DEV_DB_NAME, XXX_DB_STAGING_DB_NAME, XXX_DB_PROD_DB_NAME, NODE_ENV } = process.env;

type credentialsType = {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: string;
};

type IDatabaseCredentials = {
  [index: string]: credentialsType;
};

const databaseCredentials: IDatabaseCredentials = {
  development: {
    username: XXX_DB_USER as string,
    password: XXX_DB_PASS as string,
    database: XXX_DB_DEV_DB_NAME as string,
    host: XXX_DB_HOST as string,
    dialect: "postgres",
  },
  staging: {
    username: XXX_DB_USER as string,
    password: XXX_DB_PASS as string,
    database: XXX_DB_STAGING_DB_NAME as string,
    host: XXX_DB_HOST as string,
    dialect: "postgres",
  },
  production: {
    username: XXX_DB_USER as string,
    password: XXX_DB_PASS as string,
    database: XXX_DB_PROD_DB_NAME as string,
    host: XXX_DB_HOST as string,
    dialect: "postgres",
  },
};

// @ts-ignore
const credentials: credentialsType = databaseCredentials[NODE_ENV];

export { credentials };
