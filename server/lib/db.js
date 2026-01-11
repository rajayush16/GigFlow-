import mongoose from "mongoose";

export async function connectDb() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set");
  }

  await mongoose.connect(uri, {
    autoIndex: true,
  });

  return mongoose.connection;
}