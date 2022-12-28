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

// set up pre-save middleware to create password
employeeSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// compare the incoming password with the hashed password
employeeSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const Employee = model("Employee", employeeSchema);
module.exports = { Employee };
