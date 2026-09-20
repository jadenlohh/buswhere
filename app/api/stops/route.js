export async function GET(request) {
  const { searchParams } = new URL(request.url);

  if (!searchParams.has("code")) {
    const data = await fetch("https://data.busrouter.sg/v1/stops.json");

    const busStops = await data.json();

    return new Response(JSON.stringify(busStops), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    const data = await fetch(
      `https://datamall2.mytransport.sg/ltaodataservice/BusStops?BusStopCode=${searchParams.get("code")}`,
      { headers: { AccountKey: process.env.API_KEY } },
    );

    const busStop = await data.json();

    if (busStop.value.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid bus stop code", errorCode: 404 }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        name: busStop.value[0].Description,
        roadName: busStop.value[0].RoadName,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }
}
