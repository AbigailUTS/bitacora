"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

function parseHash(hash: string): Record<string, string> {
  // remove leading #
  const str = hash.startsWith("#") ? hash.slice(1) : hash;
  return Object.fromEntries(new URLSearchParams(str));
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

export default function ResetPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Try to extract access_token from hash (Supabase may append it)
    if (typeof window === "undefined") return;
    const hashParams = parseHash(window.location.hash || "");
    const searchParams = Object.fromEntries(new URLSearchParams(window.location.search)) as Record<string, string>;

    const accessToken = hashParams['access_token'] || searchParams['access_token'] || searchParams['token'];

    // If Supabase provided an access token, set session so we can call updateUser
    (async () => {
      if (accessToken) {
        try {
          const refresh_token = hashParams['refresh_token'] || searchParams['refresh_token'] || "";
          await supabase.auth.setSession({ access_token: accessToken, refresh_token });
          const { data } = await supabase.auth.getUser();
          setEmail(data.user?.email ?? null);
        } catch (err: unknown) {
          console.error(err);
          setError("No se pudo establecer la sesión automáticamente. Abre el link completo o prueba a solicitar otro correo.");
        }
      } else {
        // If no access token, try to read email from querystring (if Supabase included it)
        if (searchParams['email']) setEmail(searchParams['email']);
      }
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== password2) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      setLoading(false);
      if (error) setError(error.message);
      else {
        setMessage("Contraseña actualizada correctamente.");
        setTimeout(() => router.push("/menu"), 1500);
      }
    } catch (err: unknown) {
      setLoading(false);
      setError(getErrorMessage(err) || "Error al actualizar la contraseña");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center font-sans" style={{ backgroundImage: "url('/img/fondo.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
      <main className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-4 text-2xl font-semibold">Crear nueva contraseña</h1>
        <p className="mb-4 text-sm text-black">Introduce una nueva contraseña para la cuenta{email ? ` (${email})` : ''}.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="text-sm text-black">Correo</label>
          <input className="w-full rounded-md border border-zinc-200 px-3 py-2 bg-zinc-100" value={email ?? ''} readOnly />

          <label className="text-sm text-black">Nueva contraseña</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full rounded-md border border-zinc-200 px-3 py-2" required />

          <label className="text-sm text-black">Repetir nueva contraseña</label>
          <input value={password2} onChange={(e) => setPassword2(e.target.value)} type="password" className="w-full rounded-md border border-zinc-200 px-3 py-2" required />

          {error && <div className="text-sm text-red-600">{error}</div>}
          {message && <div className="text-sm text-green-600">{message}</div>}

          <div className="mt-3 flex gap-3">
            <button type="submit" className="rounded-md bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700 disabled:opacity-60" disabled={loading}>{loading ? 'Guardando...' : 'Guardar contraseña'}</button>
            <button type="button" onClick={() => router.push('/')} className="rounded-md border border-zinc-200 px-4 py-2 text-black">Cancelar</button>
          </div>
        </form>
      </main>
    </div>
  );
}
