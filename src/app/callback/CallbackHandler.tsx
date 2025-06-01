"use client";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    console.log(code);
    // send unique code to supabase backend edge function
    if (code) {
      (async () => {
        const { data } = await supabase.auth.getSession();
        const access_token = data.session?.access_token;
        console.log(access_token);
        if (!access_token) {
          console.error("No supabase access token found");
          router.push("/home");
          return;
        }

        // Send code to Edge Function
        // TODO: understand post calls
        const edgeFunctionUrl =
          "https://jnnnzjivyiuzekcqdgnh.functions.supabase.co/spotify-exchange";
        fetch(edgeFunctionUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify({ code }),
        })
          .then(async (res) => {
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              // const result = await res.json();
              // console.log("Edge Function response:", result);
            } else {
              const text = await res.text();
              console.error("Non-JSON response:", text);
            }
            router.push("/home");
          })
          .catch((err) => {
            console.error("Error calling Edge Function:", err);
            router.push("/home");
          });
      })();
    } else {
      router.push("/home");
    }
  }, [searchParams, router]);

  return <div>connecting to spotify</div>;
}
