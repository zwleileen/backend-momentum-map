// npm
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("morgan");

// Import routers
const authRouter = require("./controllers/auth");
const usersRouter = require("./controllers/users");
const valuesRouter = require("./controllers/values");
const friendsRouter = require("./controllers/friends");
const messagesRouter = require("./controllers/messages");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger("dev"));

// Routes
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/values", valuesRouter);
app.use("/friends", friendsRouter);
app.use("/messages", messagesRouter);

//testing
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.path} - No route matched`);
//   res.status(404).json({ error: "Not found" });
// });

// app.use((err, req, res, next) => {
//   console.error("Error:", err);
//   res.status(500).json({ error: "Internal server error" });
// });

// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log("The express app is ready!");
});
