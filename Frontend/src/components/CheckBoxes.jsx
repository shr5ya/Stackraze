import { useState } from "react";

export default function CheckboxGrid() {

  const mobileRows = 15;
  const mobileCols = 15;

  const desktopRows = 15;
  const desktopCols = 30;

  const [color, setColor] = useState("#000000");

  const createGrid = (rows, cols) =>
    Array.from({ length: rows }, () => Array(cols).fill(false));

  const [mobileGrid, setMobileGrid] = useState(createGrid(mobileRows, mobileCols));
  const [desktopGrid, setDesktopGrid] = useState(createGrid(desktopRows, desktopCols));

  function toggleMobileCell(r, c) {
    const newGrid = mobileGrid.map(row => [...row]);
    newGrid[r][c] = !newGrid[r][c];
    setMobileGrid(newGrid);
  }

  function toggleDesktopCell(r, c) {
    const newGrid = desktopGrid.map(row => [...row]);
    newGrid[r][c] = !newGrid[r][c];
    setDesktopGrid(newGrid);
  }

  async function handleSubmit(grid, rows, cols) {
    try {

      const res = await fetch("http://localhost:5000/user/grid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          rows,
          cols,
          color,
          grid
        })
      });

      const data = await res.json();
      console.log("Saved grid:", data);

      alert("Grid art saved!");

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col items-center px-6 py-10 font-sans bg-white dark:bg-black dark:text-white">
      <div className="w-full max-w-4xl">

        <h2 className="text-2xl font-bold text-center mb-4">
          Send a message!
        </h2>

        {/* Color Picker */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex border items-center gap-3 justify-center border-gray-400 rounded-2xl px-2 bg-white dark:text-black">
            <span className="text-sm">Choose color:</span>

            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded-full cursor-pointer border-none bg-transparent"
            />
          </div>
        </div>

        {/* MOBILE GRID */}
        <div className="flex flex-col items-center md:hidden">

          <div
            className="grid gap-1 w-full max-w-xs"
            style={{ gridTemplateColumns: `repeat(${mobileCols}, 1fr)` }}
          >
            {mobileGrid.map((row, rIndex) =>
              row.map((cell, cIndex) => (
                <input
                  key={`${rIndex}-${cIndex}`}
                  type="checkbox"
                  checked={cell}
                  onChange={() => toggleMobileCell(rIndex, cIndex)}
                  style={{ accentColor: color }}
                  className="w-full aspect-square cursor-pointer"
                />
              ))
            )}
          </div>

          <button
            onClick={() => handleSubmit(mobileGrid, mobileRows, mobileCols)}
            className="mt-6 px-4 py-2 bg-black text-white rounded-lg"
          >
            Post Grid
          </button>

        </div>

        {/* DESKTOP GRID */}
        <div className="hidden md:flex flex-col items-center">

          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${desktopCols}, 18px)` }}
          >
            {desktopGrid.map((row, rIndex) =>
              row.map((cell, cIndex) => (
                <input
                  key={`${rIndex}-${cIndex}`}
                  type="checkbox"
                  checked={cell}
                  onChange={() => toggleDesktopCell(rIndex, cIndex)}
                  style={{ accentColor: color }}
                  className="w-4 h-4 cursor-pointer"
                />
              ))
            )}
          </div>

          <button
            onClick={() => handleSubmit(desktopGrid, desktopRows, desktopCols)}
            className="mt-6 px-4 py-2 bg-black text-white rounded-lg"
          >
            Post Grid
          </button>

        </div>

      </div>
    </div>
  );
}