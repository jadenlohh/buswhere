"use client";

import useSWR from "swr";
import ArrivalTiming from "./ArrivalTiming";

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function Arrivals({ arrivalData }) {
  const { data: origin } = useSWR(
    `/api/stops?code=${arrivalData.NextBus.OriginCode}`,
    fetcher,
  );
  const { data: destination } = useSWR(
    `/api/stops?code=${arrivalData.NextBus.DestinationCode}`,
    fetcher,
  );

  return (
    <div className="flex items-start py-4.5">
      <div className="bg-red text-white rounded-lg text-center w-18 p-3">
        <p>{arrivalData.ServiceNo}</p>
      </div>

      <div className="flex flex-col w-full ms-5">
        <div className="border-b border-b-[#E6E6E6] text-grey pb-1">
          <p className="text-xs">
            {origin?.name} → {destination?.name}
          </p>
        </div>

        <div className="timings flex flex-col justify-between w-full lg:flex-row lg:items-center lg:pt-3">
          <ArrivalTiming
            estimatedArrival={arrivalData.NextBus.EstimatedArrival}
            busLoad={arrivalData.NextBus.Load}
            busType={arrivalData.NextBus.Type}
            wheelchairAccessible={arrivalData.NextBus.Feature == "WAB" && true}
            visitNumber={arrivalData.NextBus.VisitNumber}
          />

          <ArrivalTiming
            estimatedArrival={arrivalData.NextBus2.EstimatedArrival}
            busLoad={arrivalData.NextBus2.Load}
            busType={arrivalData.NextBus2.Type}
            wheelchairAccessible={arrivalData.NextBus2.Feature == "WAB" && true}
            visitNumber={arrivalData.NextBus2.VisitNumber}
          />

          <ArrivalTiming
            estimatedArrival={arrivalData.NextBus3.EstimatedArrival}
            busLoad={arrivalData.NextBus3.Load}
            busType={arrivalData.NextBus3.Type}
            wheelchairAccessible={arrivalData.NextBus3.Feature == "WAB" && true}
            visitNumber={arrivalData.NextBus3.VisitNumber}
          />
        </div>
      </div>
    </div>
  );
}
