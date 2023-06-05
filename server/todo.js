const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
  state: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
