const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ["supermarket", "spices"],
    required: true
  },

  image: {
    type: String,
    required: true
  },

  location: {
    type: String
  },

  description: {
    type: String
  }
});

module.exports = mongoose.model("Store", storeSchema);