require("dotenv").config();

const mongoose = require("mongoose");
const serverless = require("serverless-http");
const app = require("../../server/app");

let connectionPromise;

async function connect() {
  if (mongoose.connection.readyState === 1) return;

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI);
  }

  await connectionPromise;
}

const serverlessHandler = serverless(app);

module.exports.handler = async (event, context) => {
  try {
    await connect();
    return await serverlessHandler(event, context);
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ok: false,
        message: "Database connection failed.",
      }),
    };
  }
};
