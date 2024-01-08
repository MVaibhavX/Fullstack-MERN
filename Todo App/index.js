const express = require("express");
const { connectDb, Todo } = require("./db/index");

require("dotenv").config();
console.log("ENV:", process.env.MONGODB_URL);
const app = express();

//connect db
connectDb();
app.post("/todo", async (req, res) => {
  const todo = req.body;
  await todo.save();
});

app.listen(3000);
