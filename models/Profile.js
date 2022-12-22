const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// const linkingSchema = new Schema({
//   linkingCode: { type: String, required: true },
//   userWhoIsLinking: { type: String, required: true },
//   linkedToPerson: { type: String, required: true },
// });

// const personSchema = new Schema({
//   //this is the actual node
//   name: { type: String }, //leave as not required, incase a relative isnt known, but their decendants/acendants are
//   deathDate: { type: Date }, //
//   birthday: { type: Date }, //used for data, as well as for reminding the user through email if isClose is selected
//   parents: [{ type: String }],
//   //picture
//   createdBy: [{ type: String }], //need to limit this to two through resolvers
//   children: [{ type: String }],
//   isClose: {
//     type: Boolean,
//     required: true,
//     default: false,
//   },
//   isLinked: {
//     //this field can only be changed by linking someone to the site
//     type: Boolean,
//     required: true,
//     default: false,
//   },
// });

// const userSchema = new Schema({
//   // this schema is what the user creates to control login, links to their ancestry through personSchema
//   name: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     match: [/.+@.+\..+/, "Must match an email address!"],
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 5,
//   },
//   person: { type: String },
// });

const historyEventSchema = new Schema({
  time: {
    type: Date,
  },
  person: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  item: {
    type: String,
  },
  event: {
    type: String,
  },
});

const baySchema = new Schema({
  bayID: {
    type: String,
    required: true,
    unique: true,
  },
  bayType: {
    type: String,
    required: false,
  },
  bayHistory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HistoryEvent",
    //this secton of the schema need to link to a history event
  },
  itemsInBay: {
    type: Array,
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
const Bay = model("Bay", baySchema);
// const User = model("User", userSchema);

// const LinkingCode = model("LinkingCode", linkingSchema);

// const Person = model("Person", personSchema);

module.exports = { Bay };
