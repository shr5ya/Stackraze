import { useEffect, useState } from "react";

export default function GridGallery() {
  const [grids, setGrids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrids();
  }, []);

  async function fetchGrids() {
    try {
      const res = await fetch("http://localhost:5000/user/grid");
      const data = await res.json();

      setGrids(data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-center py-10">Loading grids...</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10">

      <h2 className="text-2xl font-bold mb-8 text-center">
        Community Grid Art
      </h2>

      {/* Masonry Layout */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">

        {grids.map((gridDoc) => (
          <div key={gridDoc._id} className="mb-6 break-inside-avoid">
            <GridCard gridDoc={gridDoc} />
          </div>
        ))}

      </div>

    </div>
  );
}

function GridCard({ gridDoc }) {
  const { grid, color } = gridDoc;

  return (
    <div className="p-6 rounded-xl transition">

      <div
        className="grid gap-[2px] justify-center"
        style={{
          gridTemplateColumns: `repeat(${grid[0].length}, 12px)`
        }}
      >
        {grid.map((row, rIndex) =>
          row.map((cell, cIndex) => (
            <div
              key={`${rIndex}-${cIndex}`}
              className="w-3 h-3"
              style={{
                backgroundColor: cell ? color : "#e5e7eb"
              }}
            />
          ))
        )}
      </div>

      <p className="text-xs text-center mt-4 text-gray-500">
        {/* {new Date(gridDoc.createdAt).toLocaleString()} */}
      </p>

    </div>
  );
}