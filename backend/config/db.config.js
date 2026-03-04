import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Db connection successful");
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

export default connectToDb;
