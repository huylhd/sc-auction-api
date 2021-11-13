const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  id: { 
    type: String, 
    required: true
  },
  username: { 
    type: String, 
    required: true
  },
  setting: new Schema({
    maxAmount: {
      type: String,
      default: 0
    },
    alertPerc: {
      type: Number,
      default: 100
    }
  }, {
    _id: false
  })
}, {
  timestamps: true
});

schema.index({ id: 1 }, { unique: true });
schema.index({ username: 1 }, { unique: true });

module.exports = mongoose.model("Users", schema, "Users");
