const { schema, model, Schema } = require("mongoose");

const historyEventSchema = new Schema({
  employee: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
  },
  date: {
    type: Date,
    required: true,
  },
  item: {
    type: Schema.Types.ObjectId,
    ref: "Item",
  },
  event: {
    type: String,
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: "Bay",
  },
});

const HistoryEvent = model("HistoryEvent", historyEventSchema);

module.exports = { HistoryEvent };
