const { Schema, model, default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const employeeSchema = new Schema({
  employeeID: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  EmployeeName: {
    type: Array,
  },
  history: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HistoryEvent",
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
});

// set up pre-save middleware to create password
// userSchema.pre("save", async function (next) {
//   if (this.isNew || this.isModified("password")) {
//     const saltRounds = 10;
//     this.password = await bcrypt.hash(this.password, saltRounds);
//   }

//   next();
// });

// // compare the incoming password with the hashed password
// userSchema.methods.isCorrectPassword = async function (password) {
//   return bcrypt.compare(password, this.password);
// };

const Employee = model("Employee", employeeSchema);
module.exports = { Employee };
