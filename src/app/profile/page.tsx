"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Profile() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmail = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.log(error.message);
    } else {
      setEmail(data.user.email ?? "");
    }
    setLoading(false);
  };

  useEffect(() => {
    handleEmail();
  }, []);
  return (
    <div>
      This is <span>{email}</span>'s profile page
    </div>
  );
}
