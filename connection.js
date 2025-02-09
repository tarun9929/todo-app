import mongoose from "mongoose";

async function connectDatabase() {
  try {
    return await mongoose.connect(process.env.DB_CONNECTION);
  } catch (err) {
    throw err;
  }
}

export default connectDatabase;
