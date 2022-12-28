const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const employeeSchema = new Schema({
  employeeID: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  employeeFirstName: {
    type: String,
  },
  employeeLastName: {
    type: String,
  },
  history: {
    //links to events that have been undertaken by the employee
    type: Schema.Types.ObjectId,
    ref: "HistoryEvent",
  },
  isAdmin: {
    //used to allow someone to create new accounts
    type: Boolean,
    required: true,
  },
});

const Employee = model("Employee", employeeSchema);
module.exports = { Employee };
