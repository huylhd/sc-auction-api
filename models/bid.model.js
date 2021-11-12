const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  productId: { 
    type: String, 
    required: true 
  },
  userId: { 
    type: String, 
    required: true 
  },
  amount: { 
    type: Number,
    required: true 
  },
  isAutomated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

schema.index({ productId: 1, userId: 1 });

module.exports = mongoose.model("Bids", schema, "Bids");
