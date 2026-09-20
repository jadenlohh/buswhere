export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const busStopCode = searchParams.get("code");

  if (!busStopCode) {
    return new Response(JSON.stringify({ error: "Invalid bus stop code", errorCode: 404 }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = await fetch(
    `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${busStopCode}`,
    { headers: { AccountKey: process.env.API_KEY } },
  );

  const busArrival = await data.json();

  if (busArrival.Services.length === 0 && !data.ok) {
    return new Response(JSON.stringify({ error: "Invalid bus stop code", errorCode: 400 }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  else if (busArrival.Services.length === 0 && data.ok) {
    return new Response(JSON.stringify({ error: "No buses left", errorCode: 404}), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(busArrival.Services), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
