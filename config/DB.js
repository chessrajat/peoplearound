import mongoose from "mongoose";
import config from "./default.json";

const db = config.mongoURI;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connection successful");
  } catch (err) {
    console.log("db connection error", err);

    // Exit the program
    process.exit(1);
  }
};

export { connectDB };
