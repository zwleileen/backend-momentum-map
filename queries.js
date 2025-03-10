/*------------------------------- Starter Code -------------------------------*/

const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const User = require("./models/user");
const Friend = require("./models/friend");
// const Hoot = require("./models/hoot");
const bcrypt = require("bcrypt");

const connect = async () => {
  // Connect to MongoDB using the MONGODB_URI specified in our .env file.
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  // Call the runQueries function, which will eventually hold functions to work
  // with data in our db.
  await runQueries();

  // Disconnect our app from MongoDB after our queries run.
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");

  // Close our app, bringing us back to the command line.
  process.exit();
};

const createDefaultUsers = async () => {
  //! ONLY USE THIS TO RESET TO DEFAULT USERS
  // https://www.npmjs.com/package/bcrypt
  await User.deleteMany({});
  const saltRounds = 10;
  const users = await User.create([
    {
      username: "aaa",
      hashedPassword: bcrypt.hashSync("aaa", saltRounds),
    },
    { username: "bbb", hashedPassword: bcrypt.hashSync("bbb", saltRounds) },
    // { username: "aaa", password: "aaa" },
    // { username: "bbb", password: "bbb" },
  ]);
  console.log(users);
};

const testingUpdateStatus = async () => {
  //! works, but why the express side not working................
  // for testing updating status from pending to accepted.
  const test = await Friend.findOneAndUpdate(
    {
      _id: "67b8825c2d7a7007a5f69b85", // returned from frontend mongodbId of the friend log.
      // recipient: "67b73e97d3855b5e92cdd61e", // returned from frontend user Test1
    },
    {
      status: "pending", // changing status from pending to accepted and vice versa.
    }
  );
  console.log(test);
};

//TODO Use this ONLY to test the above functions. Comment out when not in use.
//TODO Remember to use AWAIT before running the functions
const runQueries = async () => {
  console.log(`runQueris is running.`);
  // await createDefaultUsers(); //! ONLY USE THIS TO RESET TO DEFAULT USERS
  await testingUpdateStatus();
};

connect();
