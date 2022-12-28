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
  // isInStock: {
  //   type: Boolean,
  //   required: true,
  // }, // can be done by checking if onHand = =
  onHand: {
    type: Number,
  },
  inBays: [
    {
      type: Schema.Types.ObjectId,
      ref: "Bay",
    },
  ],
});

const Item = model("Item", itemSchema);

module.exports = { Item };
