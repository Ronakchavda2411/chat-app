const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      // useFindAndModify: true,
    });

    console.log(`mongodb connected ${conn.connection.host}`.yellow.bold);
  } catch (error) {
    console.log("error: ", error);
  }
};

module.exports = connectDB;
