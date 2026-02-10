"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Create the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    // Show success message and redirect to login
    router.push("/");
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center font-sans"
      style={{ backgroundImage: "url('/img/fondo.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}
    >
      <main className="w-full max-w-3xl rounded-xl bg-white p-8 shadow-md">
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-8">
          <div className="hidden md:block md:w-1/3">
            <div className="rounded-lg bg-gradient-to-tr from-green-500 to-teal-500 p-6 text-white">
              <h2 className="text-xl font-bold">Comienza ahora</h2>
              <p className="mt-2 text-sm opacity-90">Regístrate para crear y gestionar tu bitácora personal.</p>
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <h1 className="mb-2 text-2xl font-semibold">Crear cuenta</h1>
            <p className="mb-4 text-sm text-black">Usa tu correo para registrarte.</p>

            <form onSubmit={handleRegister} className="flex flex-col gap-3">
              <label className="text-sm text-black">Correo</label>
              <input
                aria-label="Email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-zinc-200 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                type="email"
                required
              />

              <label className="text-sm text-black">Contraseña</label>
              <input
                aria-label="Password"
                placeholder="Al menos 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-zinc-200 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                type="password"
                required
              />

              {error && <div className="text-sm text-red-600">{error}</div>}

              <div className="mt-2 flex gap-3">
                <button
                  type="submit"
                  className="rounded-md bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700 disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? "Creando..." : "Registrarte"}
                </button>

                <button
                  onClick={() => router.push("/")}
                  type="button"
                  className="rounded-md border border-zinc-200 px-4 py-2 text-black hover:bg-zinc-50"
                >
                  Volver al login
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
