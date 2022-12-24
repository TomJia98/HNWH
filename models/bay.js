const { Schema, model } = require("mongoose");
// const bcrypt = require("bcrypt");

const baySchema = new Schema({
  bayID: {
    //uses a 3 digit number, where the first digit is the isle,
    //the 2nd digit is the row, and the 3rd digit is the column
    //e.g 112 (first isle, first in,  2nd up)
    type: String,
    required: true,
    unique: true,
  },
  bayType: {
    // defines what type of items or the location of the bay e.g electrical, offsite 1
    type: String,
    required: false,
  },
  bayHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: "HistoryEvent",
      //this secton of the schema need to link to a history event
    },
  ],
  itemsInBay: {
    type: Array,
  },
});

const Bay = model("Bay", baySchema);

module.exports = { Bay };
