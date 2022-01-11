import logger from "../util/logger";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

if (fs.existsSync(path.resolve(__dirname, "../.env"))) {
  logger.debug("Using .env file to supply config environment variables");
  dotenv.config({ path: path.resolve(__dirname, "../.env") });
} else {
  logger.warn("No environment file to load. Will use currently set env vars.");
}

// NODE_ENV
export const ENVIRONMENT = process.env["NODE_ENV"];
const prod = ENVIRONMENT === "prod"; // Anything else is treated as 'int'

// SESSION_SECRET
export const SESSION_SECRET = process.env["SESSION_SECRET"];
export const MONGODB_URI = process.env["MONGODB_URI"];

if (!SESSION_SECRET) {
  logger.error("No client secret. Set SESSION_SECRET environment variable.");
  process.exit(1);
}

// MONGO_DB_URI
if (!MONGODB_URI) {
  if (prod) {
    logger.error(
      "No mongo connection string. Set MONGODB_URI environment variable."
    );
  } else {
    logger.error(
      "No mongo connection string. Set MONGODB_URI_LOCAL environment variable."
    );
  }
  process.exit(1);
}

// DB Username and Password
export const DB_PASSWORD = process.env["DB_PASSWORD"];
export const DB_USERNAME = process.env["DB_USERNAME"];

if (!DB_PASSWORD) {
  logger.error("No mongo password. Set DB_PASSWORD environment variable.");
  process.exit(1);
}

if (!DB_USERNAME) {
  logger.error("No mongo password. Set DB_USERNAME environment variable.");
  process.exit(1);
}

// CA directory
export const CA_DIR = process.env["CA_DIR"];
