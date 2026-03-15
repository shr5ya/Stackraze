const mongoose = require("mongoose");

const GridArtSchema = new mongoose.Schema({
  rows: Number,
  cols: Number,
  color: String,

  grid: {
    type: [[Boolean]],   // 2D array
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Grid", GridArtSchema);