"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import Modal from "@/components/ui/register/Modal";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      router.push("/home");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col gap-4 w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Login to sixtask
        </h2>
        <input
          type="email"
          placeholder="Email"
          className="border rounded px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border rounded px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-center">
          New user? Register{" "}
          <a
            href="/register"
            className="text-blue-500 font-bold hover:underline hover:cursor-pointer"
          >
            here.
          </a>
        </p>
      </form>
      <Modal show={showModal} onClose={closeModal}>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-600 text-center">{success}</p>}
      </Modal>
    </div>
  );
}
