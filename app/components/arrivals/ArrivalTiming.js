export default function NextArrivalTiming({
  estimatedArrival,
  busLoad,
  busType,
  wheelchairAccessible,
  visitNumber,
}) {
  function getBusArrivalTime(arrival) {
    if (!arrival) return "N/A";

    const arrivalTime = new Date(arrival);
    const currentTime = new Date();

    const timeDiff = (arrivalTime - currentTime) / 1000; // Time difference in seconds

    if (timeDiff < 60) {
      return "Arr";
    } else {
      return Math.floor(timeDiff / 60);
    }
  }

  function getBusType(type) {
    switch (type) {
      case "SD":
        return "Single Decker";
      case "DD":
        return "Double Decker";
      case "BD":
        return "Bendy";
    }
  }

  return (
    <div className="arrival-time pt-4 lg:pt-2">
      <div className="flex h-9">
        {busLoad === "SEA" && (
          <div className="border-2 border-green-600 rounded-full me-2.5"></div>
        )}

        {busLoad === "SDA" && (
          <div className="border-2 border-yellow-600 rounded-full me-2.5"></div>
        )}

        {busLoad === "LSD" && (
          <div className="border-2 border-red-600 rounded-full me-2.5"></div>
        )}

        <h1 className="text-2xl font-semibold my-auto">
          {getBusArrivalTime(estimatedArrival)}

          {getBusArrivalTime(estimatedArrival) !== "Arr" &&
            getBusArrivalTime(estimatedArrival) !== "N/A" && (
              <span className="text-sm font-normal"> min</span>
            )}
        </h1>

        {wheelchairAccessible && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#171717"
            viewBox="0 0 256 256"
            className="my-auto ms-1"
          >
            <path d="M255.59,189.47a8,8,0,0,0-10.12-5.06l-17.42,5.81-28.9-57.8A8,8,0,0,0,192,128H112V104h56a8,8,0,0,0,0-16H112V79a32,32,0,1,0-16,0V89.81A72,72,0,0,0,112,232c33.52,0,63.69-22.71,71.75-54a8,8,0,1,0-15.5-4C162.09,198,137.91,216,112,216A56,56,0,0,1,96,106.34V136a8,8,0,0,0,8,8h83.05l29.79,59.58a8,8,0,0,0,9.69,4l24-8A8,8,0,0,0,255.59,189.47ZM88,48a16,16,0,1,1,16,16A16,16,0,0,1,88,48Z"></path>
          </svg>
        )}

        {visitNumber === "2" && (
          <span className="bg-grey rounded-full text-xs ms-1 px-1 text-white my-auto">
            {visitNumber}nd Visit
          </span>
        )}
      </div>

      <p className="text-xs text-grey pt-1">
        {estimatedArrival !== "" ? (
          <>
            <span>ETA {estimatedArrival.slice(0, -9).split("T")[1]} • </span>
            <span>{getBusType(busType)}</span>
          </>
        ) : (
          <span>No Estimate Available</span>
        )}
      </p>
    </div>
  );
}
