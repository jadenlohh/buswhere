"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Searchbar from "./components/Searchbar";
import Link from "next/link";

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

export default function Home({ count = 5 }) {
  const [nearestStops, setNearestStops] = useState([]);
  const [error, setError] = useState("");

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
        console.log(err);
      },
      { enableHighAccuracy: true },
    );
  }, [count]);

  return (
    <main className="relative w-full mx-4 lg:w-xl">
      <Navbar />
      <Searchbar />

      <ul className="absolute top-38 left-0 right-0 bg-white shadow rounded-2xl">
        <p className="px-5 pt-4 pb-1 lg:px-6 text-xs text-grey">NEAREST BUS STOPS</p>

        {nearestStops.map((s) => (
          <li key={s.code}>
            <Link
              href={`/search?q=${s.code}`}
              className="flex items-center justify-between px-5 py-4 lg:px-6 hover:bg-gray-100"
            >
              <span>
                <span className="font-medium">{s.name}</span>
                <span className="block text-sm text-gray-500">
                  {s.road} | {s.code}
                </span>
              </span>
              <span className="text-sm text-gray-600">
                {s.distance < 1000
                  ? `${Math.round(s.distance)} m`
                  : `${(s.distance / 1000).toFixed(1)} km`}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
