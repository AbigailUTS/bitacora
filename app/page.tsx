"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else router.push("/menu");
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center font-sans"
      style={{ backgroundImage: "url('/img/fondo.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}
    >
      <main className="flex w-full max-w-4xl items-center justify-center gap-10 p-8">
        <section className="hidden w-1/2 flex-col items-start gap-6 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-10 text-white shadow-lg md:flex">
          <h2 className="text-3xl font-bold">Bitácora</h2>
          <p className="max-w-sm text-sm opacity-90">Accede a tu cuenta para gestionar entradas y notas. Si no tienes cuenta, crea una en el registro.</p>
          <div className="mt-auto text-xs opacity-85">Soporte: soporte@tudominio.com</div>
        </section>

        <section className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
            <p className="text-sm text-black">Introduce tu correo y contraseña para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <label className="text-sm text-black">Correo</label>
            <input
              aria-label="Email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-zinc-200 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="email"
              required
            />

            <label className="text-sm text-black">Contraseña</label>
            <input
              aria-label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-zinc-200 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="password"
              required
            />

            {error && <div className="text-sm text-red-600">{error}</div>}

            <button
              type="submit"
              className="rounded-md bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Cargando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <button
              onClick={() => router.push("/register")}
              type="button"
              className="rounded-md border border-zinc-200 px-4 py-2 text-black hover:bg-zinc-50"
            >
              Crear cuenta
            </button>
            <button
              onClick={() => { setShowResetModal(true); setResetError(null); setResetSuccess(null); setResetEmail(email); }}
              type="button"
              className="rounded-md border border-zinc-200 px-4 py-2 text-black hover:bg-zinc-50 text-sm"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </section>
      </main>
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowResetModal(false)} />

          <div className="relative w-full max-w-md rounded bg-white p-6 shadow-lg">
            <h3 className="mb-2 text-lg font-semibold">Recuperar contraseña</h3>
            <p className="mb-4 text-sm text-black">Introduce el correo asociado a tu cuenta y recibirás instrucciones.</p>

            <input
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="w-full rounded-md border border-zinc-200 px-3 py-2 mb-3"
              type="email"
            />

            {resetError && <div className="mb-2 text-sm text-red-600">{resetError}</div>}
            {resetSuccess && <div className="mb-2 text-sm text-green-600">{resetSuccess}</div>}

            <div className="mt-3 flex justify-end gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="rounded-md border border-zinc-200 px-4 py-2 text-black hover:bg-zinc-50"
                type="button"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  setResetError(null);
                  setResetSuccess(null);
                  setResetLoading(true);
                  try {
                    // Use Supabase function to send reset email
                    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
                      redirectTo: `${window.location.origin}/reset`
                    });
                    setResetLoading(false);
                    if (error) setResetError(error.message);
                    else setResetSuccess('Se ha enviado el correo de recuperación si la cuenta existe.');
                  } catch (err: any) {
                    setResetLoading(false);
                    setResetError(err?.message ?? 'Error al intentar recuperar contraseña');
                  }
                }}
                className="rounded-md bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700 disabled:opacity-60"
                type="button"
                disabled={resetLoading}
              >
                {resetLoading ? 'Enviando...' : 'Recuperar contraseña'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
