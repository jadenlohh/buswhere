"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [value, setValue] = useState("");
  const [allBusStops, setAllBusStops] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Close the results when the user taps or clicks anywhere outside the search bar
  useEffect(() => {
    const closeIfOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowPanel(false);
      }
    };
    document.addEventListener("pointerdown", closeIfOutside);
    return () => document.removeEventListener("pointerdown", closeIfOutside);
  }, []);

  // Get all bus stops on load
  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/stops", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((raw) => {
        const list = Object.entries(raw).map(
          ([code, [lng, lat, name, road]]) => ({
            code,
            lng,
            lat,
            name,
            road,
            haystack: `${code} ${name} ${road}`.toLowerCase(),
          }),
        );

        setAllBusStops(list);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      });

    return () => controller.abort();
  }, []);

  // Every word typed must appear in the code, name, or road.
  const results = useMemo(() => {
    const terms = value.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return [];
    const out = [];
    for (const stop of allBusStops) {
      if (terms.every((t) => stop.haystack.includes(t))) {
        out.push(stop);
        if (out.length >= 10) break;
      }
    }
    return out;
  }, [value, allBusStops]);

  const handleSelect = (stop) => {
    setValue(stop.name);
    setShowPanel(false);

    inputRef.current?.blur(); // Dismisses the mobile keyboard and drops focus
    router.push(`?search=${encodeURIComponent(stop.code)}`);
  };

  return (
    <div
      ref={wrapperRef}
      className="search-bar absolute left-0 right-0 mt-6 mx-4 bg-white shadow rounded-2xl overflow-hidden"
    >
      <div className="flex items-center px-5 py-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20px"
          height="20px"
          fill="#A7A7A7"
          viewBox="0 0 256 256"
        >
          <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
        </svg>

        <input
          className="w-full ms-2 focus:outline-none placeholder:text-grey placeholder:text-sm"
          ref={inputRef}
          type="text"
          placeholder="Search bus stop"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setShowPanel(true);
          }}
          onFocus={() => setShowPanel(true)}
        />
      </div>

      {showPanel && value.length !== 0 && (
        <div className="border-t text-sm shadow border-gray-100 max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <p className="px-5 py-3 text-sm text-gray-500">
              No bus stops match “{value}”
            </p>
          ) : (
            <ul>
              {results.map((stop) => (
                <li key={stop.code}>
                  <button
                    type="button"
                    onClick={() => handleSelect(stop)}
                    className="block cursor-pointer w-full text-left px-5 py-3 hover:bg-gray-100"
                  >
                    <span className="font-medium">{stop.name}</span>
                    <br />
                    <span className="text-sm text-gray-500">
                      {stop.road} • {stop.code}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
