import React from "react";

export default function Legend() {
  return (
    <div className="legend bg-white rounded-2xl text-xs shadow py-8 px-5 mb-4 lg:px-6">
        <p>LEGEND</p>

        <div className="flex flex-wrap justify-between items-center">
          <div className="pt-5 lg:pt-3">
            <div className="border-2 border-green-600 rounded-full w-8"></div>
            <p className="pt-1">Seats Available</p>
          </div>

          <div className="pt-5 lg:pt-3">
            <div className="border-2 border-yellow-600 rounded-full w-8"></div>
            <p className="pt-1">Standing Available</p>
          </div>

          <div className="pt-5 lg:pt-3">
            <div className="border-2 border-red-600 rounded-full w-8"></div>
            <p className="pt-1">Limited Standing</p>
          </div>

          <div className="pt-5 lg:pt-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="#171717"
              viewBox="0 0 256 256"
            >
              <path d="M255.59,189.47a8,8,0,0,0-10.12-5.06l-17.42,5.81-28.9-57.8A8,8,0,0,0,192,128H112V104h56a8,8,0,0,0,0-16H112V79a32,32,0,1,0-16,0V89.81A72,72,0,0,0,112,232c33.52,0,63.69-22.71,71.75-54a8,8,0,1,0-15.5-4C162.09,198,137.91,216,112,216A56,56,0,0,1,96,106.34V136a8,8,0,0,0,8,8h83.05l29.79,59.58a8,8,0,0,0,9.69,4l24-8A8,8,0,0,0,255.59,189.47ZM88,48a16,16,0,1,1,16,16A16,16,0,0,1,88,48Z"></path>
            </svg>

            <p className="pt-1">Wheelchair Accessible</p>
          </div>
        </div>
      </div>
  );
}
