const mongoose = require("mongoose");

// Schema for storing grid-based art (pixel-style boolean matrix)
const GridArtSchema = new mongoose.Schema({
  rows: Number,
  cols: Number,
  color: String,

  grid: {
    // 2D array representing filled/unfilled cells
    type: [[Boolean]],   // 2D array
    required: true
  }

}, { timestamps: true });  // track creation & update time

module.exports = mongoose.model("Grid", GridArtSchema);