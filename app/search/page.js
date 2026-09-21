"use client";

import { use } from "react";
import useSWR from "swr";
import Navbar from "../components/Navbar";
import Searchbar from "../components/Searchbar";
import Arrivals from "../components/arrivals/Arrivals";
import Legend from "../components/Legend";
import Footer from "../components/Footer";
const fetcher = (url) => fetch(url).then((response) => response.json());

export default function Search({ searchParams }) {
  const busStop = use(searchParams).q;

  const { data, isLoading } = useSWR(
    busStop ? `/api/arrivals?code=${encodeURIComponent(busStop)}` : null,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      keepPreviousData: true, // Keep previous data while fetching new data
    },
  );

  const { data: busStopInfo } = useSWR(
    busStop ? `/api/stops?code=${encodeURIComponent(busStop)}` : null,
    fetcher,
  );

  return (
    <main className="relative w-full mx-4 lg:w-2xl">
      <Navbar />
      <Searchbar />

      <div className="absolute top-38 left-0 right-0">
        {isLoading || !data ? (
          <div className="loading py-30">
            <div className="flex place-content-center w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                fill="#171717"
                viewBox="0 0 256 256"
                className="animate-spin"
              >
                <path d="M232,128a104,104,0,0,1-208,0c0-41,23.81-78.36,60.66-95.27a8,8,0,0,1,6.68,14.54C60.15,61.59,40,93.27,40,128a88,88,0,0,0,176,0c0-34.73-20.15-66.41-51.34-80.73a8,8,0,0,1,6.68-14.54C208.19,49.64,232,87,232,128Z"></path>
              </svg>
            </div>
          </div>
        ) : data.errorCode === 400 ? (
          <div className="flex flex-col bg-white shadow rounded-2xl place-content-center items-center text-sm py-30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={36}
              height={36}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M15 20l-6 -3l-6 3v-13l6 -3l6 3l6 -3v7.5" />
              <path d="M9 4v13" />
              <path d="M15 7v5.5" />
              <path d="M19 22v.01" />
              <path d="M19 19a2.003 2.003 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483" />
            </svg>

            <p className="pt-1.5 text-center">
              You've entered a invalid <br />
              bus stop
            </p>
          </div>
        ) : data.errorCode === 404 ? (
          <div className="flex flex-col bg-white shadow rounded-2xl place-content-center items-center text-sm py-30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={36}
              height={36}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M16.18 16.172a2 2 0 0 0 2.652 2.648" />
              <path d="M4 17h-2v-11a1 1 0 0 1 1 -1h2m4 0h8c2.761 0 5 3.134 5 7v5h-1m-5 0h-8" />
              <path d="M16 5l1.5 7h4.5" />
              <path d="M2 10h8m4 0h3" />
              <path d="M7 7v3" />
              <path d="M12 5v3" />
              <path d="M3 3l18 18" />
            </svg>

            <p className="pt-1.5 text-center">
              Uh oh, there's no more buses <br />
              available
            </p>
          </div>
        ) : (
          <>
            <div className="arrival-timings bg-white shadow rounded-2xl ps-5 pe-8 pt-6.5 pb-2 mb-4 lg:ps-6 lg:pe-8">
              <div className="stop-name">
                <p className="font-semibold text-sm lg:text-base">
                  {busStopInfo?.name}
                </p>
                <p className="text-xs text-grey">
                  {busStop} | {busStopInfo?.roadName}
                </p>
              </div>

              <div className="timings pt-6">
                {data.map((bus) => {
                  return <Arrivals key={bus.ServiceNo} arrivalData={bus} />;
                })}
              </div>
            </div>

            <Legend />
          </>
        )}
      </div>

      {/* <Footer /> */}
    </main>
  );
}
