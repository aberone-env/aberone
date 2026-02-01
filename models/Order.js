const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  phone: String,
  location: String,

  delivery: {
    type: Number,
    default: 0
  },

  total: Number,

  notes: {
    type: String,
    default: ""
  },

  extras: [
    {
      name: String,
      price: Number
    }
  ],

  items: [
    {
      name: String,
      price: Number,
      quantity: Number
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);