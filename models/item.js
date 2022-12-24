const { Schema, model } = require("mongoose");

const itemSchema = new Schema({
  productCode: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
});
