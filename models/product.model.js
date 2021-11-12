const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  id: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  details : { 
    type: String 
  },
  imageUrl: { 
    type: String 
  },
  expiredAt: { 
    type: Date, 
    default: new Date(Date.now() + 1000 * 60 * 60)
  },
  minimumAmount: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

schema.index({ id: 1 });

module.exports = mongoose.model("Products", schema, "Products");
