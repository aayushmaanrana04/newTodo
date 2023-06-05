const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("./user");

const generateToken = require("./token");
const Todo = require("./todo");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.exists({ email });
    //pehle se exist toni krta
    if (userExists) {
      return res.status(500).json({ msg: "ye to pehele se h" });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const user = new User({
      email: email,
      password: hashedPass,
    });
    await user.save();
    const token = generateToken(user);
    res.status(200).json({ msg: "ban gya user", token: token });
  } catch (e) {
    return console.log(e);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(500).json({ msg: "nahi h bhai" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(500).json({ msg: "galat pass h bhadwe" });
    }
    const token = generateToken(user);
    res.status(200).json({ msg: "ho gya login", token: token });
  } catch (e) {
    return console.log(e);
  }
});

app.post("/postTodo", async (req, res) => {
  try {
    const { todoItem, email } = req.body;
    const checkEmail = await User.findOne({ email });
    if (!checkEmail) {
      return res.status(500).json({ msg: "email does not exist" });
    }

    const todoObject = new Todo({
      item: todoItem,
      email: email,
    });
    await todoObject.save();
    res.status(200).json({ msg: "hogya post" });
  } catch (e) {
    console.log(e);
  }
});

app.get("/getTodo", async (req, res) => {
  try {
    const { email } = req.query;
    const todos = await Todo.find({ email }).sort({ createdAt: "desc" });
    // console.log(todos);
    res.json(todos);
  } catch (e) {
    console.log(e);
  }
});

app.get("/deleteItem", async (req, res) => {
  try {
    const { id } = req.query;
    // console.log(id);
    const del = await Todo.deleteOne({ _id: id });
    res.json({ msg: "hogya del" });
  } catch (e) {}
});

app.get("/updateItem", async (req, res) => {
  try {
    const { id, state } = req.query;
    const item = await Todo.findById({ _id: id });
    const upd = await item.updateOne({ state: !item.state });
    if (!upd) {
      res.json({ msg: "failed to update" });
    }
    res.json({ msg: "hogya update" });
  } catch (e) {
    console.log(e);
  }
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("connected to db"))
  .catch((e) => {
    console.log(e);
  });

app.listen(5000, () => {
  console.log("yessir at 5000");
});
