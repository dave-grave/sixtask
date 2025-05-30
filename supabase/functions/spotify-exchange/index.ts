import { serve } from "std/server";

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

console.log("Hello from Functions!");

serve(async (req) => {
  const { code } = await req.json();

  const client_id = Deno.env.get("NEXT_PUBLIC_SPOTIFY_CLIENT_ID")!;
  const client_secret = Deno.env.get("SPOTIFY_CLIENT_SECRET")!;
  const redirect_uri = Deno.env.get("NEXT_PUBLIC_SPOTIFY_REDIRECT_URI")!;

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri,
    client_id,
    client_secret,
  });

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!tokenRes.ok) {
    return new Response("Failed to exchange code", { status: 400 });
  }

  const tokenData = await tokenRes.json();

  // Optionally: store tokens in your Supabase DB here using the Supabase client
  // Example: (pseudo-code)
  // await supabase.from("spotify_tokens").upsert({ ... });

  return new Response(JSON.stringify(tokenData), {
    headers: { "Content-Type": "application/json" },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/spotify-exchange' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
