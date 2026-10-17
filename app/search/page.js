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

      <div className="absolute top-20 left-0 right-0 z-10 lg:left-4 lg:right-4">
        <Searchbar />
      </div>

      <div className="absolute w-full top-40 lg:left-4 lg:right-4 lg:w-auto ">
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
          <div className="flex flex-col bg-white shadow-[0_6px_24px_0_rgba(0,0,0,0.05),0_0_0_1px_rgba(0,0,0,0.08)] rounded-xl place-content-center items-center text-sm py-30">
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

            <p className="pt-1.5 text-center">
              You've entered a invalid <br />
              bus stop
            </p>
          </div>
        ) : (
          <>
            <div className="arrival-timings bg-white shadow-[0_6px_24px_0_rgba(0,0,0,0.05),0_0_0_1px_rgba(0,0,0,0.08)] rounded-xl mb-6">
              <div className="stop-name flex items-center justify-between pt-6.5 pb-3.5 px-6">
                <div>
                  <p className="font-semibold text-sm">{busStopInfo?.name}</p>
                  <p className="text-sm text-grey">
                    {busStop} | {busStopInfo?.roadName}
                  </p>
                </div>

                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="#000000"
                    viewBox="0 0 256 256"
                  >
                    <path d="M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z"></path>
                  </svg>
                </div>
              </div>

              {data.errorCode === 404 ? (
                <div className="no-buses flex flex-col items-center place-content-center py-30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={36}
                    height={36}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.25}
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

                  <p className="text-center text-sm">No more buses available</p>
                </div>
              ) : (
                <div className="timings ps-5 pe-8 pb-2 lg:px-8">
                  {data.map((bus) => {
                    return <Arrivals key={bus.ServiceNo} arrivalData={bus} />;
                  })}
                </div>
              )}
            </div>

            <Legend />
          </>
        )}
      </div>

      {/* <Footer /> */}
    </main>
  );
}
