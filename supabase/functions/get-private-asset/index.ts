const ALLOWED_ORIGINS = ["http://localhost:3000"];
const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS.join(","),
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, range, if-match",
  "Access-Control-Expose-Headers": "range, accept-ranges, etag",
  "Access-Control-Max-Age": "300",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Validate request origin.
  const origin = req.headers.get("Origin");
  console.log(origin);
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return new Response("Not Allowed", { status: 405 });
  }

  // Construct private bucket storage URL.
  const reqUrl = new URL(req.url);
  const url = `${Deno.env.get("SUPABASE_URL")}/storage/v1/object/authenticated${
    reqUrl.pathname
  }`;
  console.log(url);

  const { method, headers } = req;
  // Add auth header to access file in private bucket.
  const modHeaders = new Headers(headers);
  modHeaders.append(
    "authorization",
    `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!}`
  );
  return fetch(url, { method, headers: modHeaders });
});
