"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import Searchbar from "./components/Searchbar";
import Link from "next/link";
import NearestStops from "./components/NearestStops";
import useFavourites from "./hooks/useFavourites";

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
  const [allStops, setAllStops] = useState({});
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(false);

  const { favourites, toggleFavourite } = useFavourites();

  useEffect(() => {
    let cancelled = false;

    async function loadStops() {
      try {
        const response = await fetch("/api/stops");
        const data = await response.json();
        if (!cancelled) setAllStops(data);
      } catch {}
    }

    loadStops();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ latitude, longitude });
      },
      () => {
        setError(true);
      },
      { enableHighAccuracy: true },
    );
  }, []);

  const nearestStops = useMemo(() => {
    if (!position) return [];

    return Object.entries(allStops)
      .map(([code, [lon, lat, name, road]]) => ({
        code,
        name,
        road,
        distance: distanceMetres(
          position.latitude,
          position.longitude,
          lat,
          lon,
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, count);
  }, [allStops, position, count]);

  const favouriteStops = useMemo(
    () =>
      favourites
        .filter((code) => allStops[code])
        .map((code) => {
          const [, , name, road] = allStops[code];
          return { code, name, road };
        }),
    [favourites, allStops],
  );

  return (
    <main className="relative w-full mx-4 lg:w-2xl">
      <Navbar />

      <div className="absolute top-20 left-0 right-0 z-10 lg:left-4 lg:right-4">
        <Searchbar />
      </div>

      <h1 className="absolute top-42 text-xs left-0 right-0 h-90 lg:left-4 lg:right-4">
        FAVOURITES
      </h1>

      <div className="absolute top-48 left-0 right-0 h-100 overflow-y-auto lg:left-4 lg:right-4">
        {favourites.length === 0 ? (
          <div className="flex flex-col h-full items-center place-content-center text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              fill="#000000"
              viewBox="0 0 256 256"
            >
              <path d="M34,64a6,6,0,0,1,6-6H216a6,6,0,0,1,0,12H40A6,6,0,0,1,34,64Zm6,70H96a6,6,0,0,0,0-12H40a6,6,0,0,0,0,12Zm72,52H40a6,6,0,0,0,0,12h72a6,6,0,0,0,0-12Zm123.82-43.76-23.49,19.39,7.16,28.93a6,6,0,0,1-8.87,6.61L184,181.5l-26.62,15.67a6,6,0,0,1-8.87-6.61l7.16-28.93-23.49-19.39a6,6,0,0,1,3.36-10.61l31-2.4,11.91-27.61a6,6,0,0,1,11,0l11.91,27.61,31,2.4a6,6,0,0,1,3.36,10.61Zm-19.1.21-19.83-1.53a6,6,0,0,1-5-3.61L184,119.14l-7.84,18.17a6,6,0,0,1-5,3.61l-19.83,1.53,14.94,12.33a6,6,0,0,1,2,6.07l-4.63,18.74L181,169.37a6,6,0,0,1,6.08,0l17.37,10.22-4.63-18.74a6,6,0,0,1,2-6.07Z"></path>
            </svg>

            <p className="text-xs mt-0.5 lg:text-sm">
              Tap the star icon on a bus stop to
              <br />
              add it to your favourites
            </p>
          </div>
        ) : (
          <ul>
            {favouriteStops.map((s) => (
              <li key={s.code}>
                <Link
                  href={`/search?q=${s.code}`}
                  className="flex bg-white justify-between border border-[#eeeeee] mt-1.5 rounded-xl px-4 py-4.5"
                >
                  <div className="flex flex-col">
                    <p className="font-semibold text-sm">{s.name}</p>
                    <p className="text-[0.8rem] text-grey">
                      {s.road} | {s.code}
                    </p>
                  </div>

                  <button
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavourite(s.code);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="#f9dc5c"
                      stroke="#f9dc5c"
                      strokeWidth={1}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-colors duration-150 ease-in"
                    >
                      <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245" />
                    </svg>
                  </button>
                </Link>
              </li>
            ))}
          </ul>
        )}
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
                    <span className="font-semibold text-sm">{s.name}</span>
                    <span className="block text-[0.8rem] text-grey">
                      {s.road} | {s.code}
                    </span>
                  </span>
                  
                  <span className="text-[0.8rem] text-grey">
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
