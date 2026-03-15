const Grid = require("../../models/gridArt")

async function handleAddGridArt(req, res) {
  try {

    const { rows, cols, color, grid } = req.body;

    if (!rows || !cols || !grid) {
      return res.status(400).json({
        message: "rows, cols and grid are required"
      });
    }

    const savedGrid = await Grid.create({
      rows,
      cols,
      color,
      grid
    });

    return res.status(201).json({
      message: "Grid created successfully",
    //   data: savedGrid
    });

  } catch (error) {

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }
}

async function handleGetGrids(req, res) {
  try {

    const grids = await Grid
      .find()
      .sort({ createdAt: -1 })   // newest first
      .limit(10);                // only last 10

    return res.status(200).json({
      count: grids.length,
      data: grids
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch grids",
      error: error.message
    });

  }
}


module.exports = { handleAddGridArt, handleGetGrids };