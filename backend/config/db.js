import mongoose from "mongoose";

const db = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URL);
    console.log("Mongodb Connected ");
  } catch (error) {
    console.error(error, "Database Connection Error");
  }
};

export default db;
