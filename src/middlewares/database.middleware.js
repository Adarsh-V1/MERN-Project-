import connectDB from "../db/db_index.js";

async function ensureDatabaseConnection(req, res, next) {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
}

export { ensureDatabaseConnection };
