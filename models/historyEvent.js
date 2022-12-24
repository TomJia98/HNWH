const { schema, model, Schema, default: mongoose } = require("mongoose");

const historyEventSchema = new Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  date: {
    type: Date,
    required: true,
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
  },
});

const HistoryEvent = model("HistoryEvent", historyEventSchema);

module.exports = { HistoryEvent };
