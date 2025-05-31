import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

serve(async (req) => {
  // TODO: understand CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  try {
    // create supabase client w/ JWT
    // TODO: understand what createclient does here
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // get user from JWT
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // fetch tokens from db
    const { data: tokenRow, error } = await supabase
      .from("spotify_tokens")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (error || !tokenRow) {
      return new Response(JSON.stringify({ error: "No tokens found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // check expired
    const fetchedAt = new Date(tokenRow.fetched_at).getTime();
    const expiresIn = tokenRow.expires_in * 1000;
    const now = Date.now();
    const buffer = 60 * 1000;

    let access_token = tokenRow.access_token;

    if (now >= fetchedAt + expiresIn - buffer) {
      // Token expired, refresh it
      const client_id = Deno.env.get("NEXT_PUBLIC_SPOTIFY_CLIENT_ID")!;
      const client_secret = Deno.env.get("SPOTIFY_CLIENT_SECRET")!;
      const params = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: tokenRow.refresh_token,
        client_id,
        client_secret,
      });

      const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      });

      const tokenData = await tokenRes.json();

      if (!tokenRes.ok || !tokenData.access_token) {
        return new Response(
          JSON.stringify({
            error: "Failed to refresh token",
            details: tokenData,
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }

      // update db with new token
      const { error: dbError } = await supabase.from("spotify_tokens").upsert({
        user_id: user.id,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token || tokenRow.refresh_token, // Spotify may not always return a new refresh token
        expires_in: tokenData.expires_in,
        fetched_at: new Date().toISOString(),
      });

      if (dbError) {
        return new Response(
          JSON.stringify({
            error: "Failed to update tokens",
            details: dbError,
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }
      access_token = tokenData.access_token;
    }

    // fetch devices from api for playback
    const devicesRes = await fetch(
      "https://api.spotify.com/v1/me/player/devices",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    const devicesData = await devicesRes.json();
    console.log(devicesData);

    return new Response(
      JSON.stringify({ access_token, devices: devicesData.devices || [] }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: String(err) }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});
