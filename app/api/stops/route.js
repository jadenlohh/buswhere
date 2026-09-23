export async function GET(request) {
  const { searchParams } = new URL(request.url);

  if (!searchParams.has("code")) {
    const data = await fetch("https://data.busrouter.sg/v1/stops.json");
    const busStops = await data.json();
    return Response.json(busStops);
  }

  const code = searchParams.get("code")?.trim();

  if (!code) {
    return Response.json(
      { error: "Missing bus stop code", errorCode: 404 },
      { status: 400 },
    );
  }

  const res = await fetch(
    `https://datamall2.mytransport.sg/ltaodataservice/BusStops?BusStopCode=${encodeURIComponent(code)}`,
    { headers: { AccountKey: process.env.API_KEY } },
  );
  const body = await res.json().catch(() => null);

  // Invalid bus stop code
  if (body.value.length === 0) {
    return Response.json(
      { error: "Invalid bus stop code", errorCode: 404 },
      { status: 404 },
    );
  }

  return Response.json({
    name: body.value[0].Description,
    roadName: body.value[0].RoadName,
  });
}
