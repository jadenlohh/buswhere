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
      <Searchbar />

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
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth={1.25}
              strokeLinecap="round"
              strokeLinejoin="round"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#000000"
            >
              <path d="M9 19L3.78974 20.7368C3.40122 20.8663 3 20.5771 3 20.1675L3 5.43246C3 5.1742 3.16526 4.94491 3.41026 4.86325L9 3M9 19L14.2103 20.7368C14.5988 20.8663 15 20.5771 15 20.1675L15 5.43246C15 5.1742 14.8347 4.94491 14.5897 4.86325L9 3M9 19L9 3"></path>
              <path d="M15 5L20.2103 3.26325C20.5988 3.13374 21 3.42292 21 3.83246L21 15"></path>
              <path d="M17.1213 22.364L19.2427 20.2427M19.2427 20.2427L21.364 18.1213M19.2427 20.2427L17.1213 18.1213M19.2427 20.2427L21.364 22.364"></path>
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
