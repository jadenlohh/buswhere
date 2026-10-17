"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Searchbar from "./components/Searchbar";
import Link from "next/link";
import NearestStops from "./components/NearestStops";

function distanceMetres(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export default function Home({ count = 10 }) {
  const [nearestStops, setNearestStops] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const response = await fetch("/api/stops");
        const data = await response.json();

        const nearest = Object.entries(data)
          .map(([code, [lon, lat, name, road]]) => ({
            code,
            name,
            road,
            distance: distanceMetres(latitude, longitude, lat, lon),
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, count);

        setNearestStops(nearest);
      },
      (err) => {
        setError(true);
      },
      { enableHighAccuracy: true },
    );
  }, [count]);

  return (
    <main className="relative w-full mx-4 lg:w-2xl">
      <Navbar />

      <div className="absolute top-20 left-0 right-0 z-10 lg:left-4 lg:right-4">
        <Searchbar />
      </div>

      <div className="absolute flex flex-col shadow-[0_6px_24px_0_rgba(0,0,0,0.05),0_0_0_1px_rgba(0,0,0,0.08) text-center justify-center items-center place-content-center rounded-xl top-40 left-0 right-0 h-90 lg:left-4 lg:right-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          fill="#000000"
          viewBox="0 0 256 256"
        >
          <path d="M34,64a6,6,0,0,1,6-6H216a6,6,0,0,1,0,12H40A6,6,0,0,1,34,64Zm6,70h64a6,6,0,0,0,0-12H40a6,6,0,0,0,0,12Zm80,52H40a6,6,0,0,0,0,12h80a6,6,0,0,0,0-12Zm126-42c0,35.3-49.22,60.32-51.32,61.37a6,6,0,0,1-5.36,0C187.22,204.32,138,179.3,138,144a30,30,0,0,1,54-18,30,30,0,0,1,54,18Zm-12,0a18,18,0,0,0-36,0,6,6,0,0,1-12,0,18,18,0,0,0-36,0c0,14.15,11.78,27,21.67,35.25A138.82,138.82,0,0,0,192,193.19a138,138,0,0,0,20.33-13.94C222.22,171,234,158.15,234,144Z"></path>
        </svg>

        <p className="text-sm mt-0.5">Add bus stops to your favourites<br /> to view them here</p>
      </div>

      <NearestStops>
        {!error ? (
          <ul className="mt-1">
            {nearestStops.map((s) => (
              <li key={s.code}>
                <Link
                  href={`/search?q=${s.code}`}
                  className="flex items-center justify-between px-7 py-3 hover:bg-gray-100"
                >
                  <span>
                    <span className="font-medium text-sm">{s.name}</span>
                    <span className="block text-sm text-grey">
                      {s.road} | {s.code}
                    </span>
                  </span>
                  <span className="text-sm text-grey">
                    {s.distance < 1000
                      ? `${Math.round(s.distance)} m`
                      : `${(s.distance / 1000).toFixed(1)} km`}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col gap-1.5 justify-center items-center place-content-center text-center h-full">
            <svg
              width={36}
              height={36}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="#000000"
              strokeWidth={1.25}
              stroke="#000000"
            >
              <path d="M16 9.2C16 13.1765 9 20 9 20C9 20 2 13.1765 2 9.2C2 5.22355 5.13401 2 9 2C12.866 2 16 5.22355 16 9.2Z"></path>
              <path
                d="M9 10C9.55228 10 10 9.55228 10 9C10 8.44772 9.55228 8 9 8C8.44772 8 8 8.44772 8 9C8 9.55228 8.44772 10 9 10Z"
                fill="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M16.8791 21.1213L19.0005 19M21.1218 16.8787L19.0005 19M19.0005 19L16.8791 16.8787M19.0005 19L21.1218 21.1213"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>

            <p className="text-sm">
              Uh oh, we couldn't find your <br />
              location
            </p>
          </div>
        )}
      </NearestStops>
    </main>
  );
}
