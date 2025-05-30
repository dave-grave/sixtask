"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleEmail = async () => {
    setLoading(true);
    setEmail(user?.email ?? "");
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
