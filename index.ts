function handlePreFlightRequest(): Response {
  return new Response("Preflight OK!", {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "content-type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    },
  });
}

async function handler(_req: Request): Promise<Response> {
  if (_req.method === "OPTIONS") {
    return handlePreFlightRequest();
  }
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type",
  };
  const url = new URL(_req.url);
  const word = url.searchParams.get("word")?.trim().toLowerCase();

  if (!word) {
    return new Response(JSON.stringify({ error: "Mot manquant" }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  const similarityRequestBody = JSON.stringify({
    word1: word,
    word2: "supelec",
  });

  try {
    const response = await fetch("https://word2vec-ten.vercel.app/similarity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: similarityRequestBody,
      redirect: "follow",
    });

    const result = await response.text();

    if (!response.ok) {
      console.error("API error:", response.status, result);

      return new Response(
        JSON.stringify({
          error: "Similarity API error",
          details: result,
        }),
        { status: response.status, headers: corsHeaders },
      );
    }

    return new Response(result, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Fetch error:", error);

    return new Response(
      JSON.stringify({ error: "Failed to contact similarity API" }),
      { status: 500, headers: corsHeaders },
    );
  }
}

Deno.serve(handler);
