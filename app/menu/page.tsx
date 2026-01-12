"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function MenuPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/");
        return;
      }
      const user = data.user;
      setEmail(user.email ?? null);
      const meta = (user.user_metadata as Record<string, string>) ?? {};
      const displayName = meta.full_name || meta.name || (user.email ? user.email.split("@")[0] : null);
      setName(displayName);
    }
    load();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundImage: "url('/img/fondo.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}
    >
      <main className="h-screen w-full">
        <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center gap-8 px-6">
          <header className="w-full text-center">
            <h1 className="text-3xl font-semibold">Bienvenido{name ? `, ${name}` : ''}</h1>
            <p className="mt-1 text-sm text-zinc-600">{email ?? 'usuario'}</p>
          </header>

          <section className="flex w-full max-w-md flex-col items-center gap-4">
            <button
              onClick={() => router.push('/menu/generar-reporte')}
              className="flex w-full items-center gap-4 rounded-lg border border-zinc-200 bg-white px-6 py-4 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6M9 16h6M6 8h12M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
                </svg>
              </span>
              <div className="flex w-full flex-col items-start">
                <span className="font-medium">Generar reporte</span>
                <span className="text-sm text-zinc-500">Formulario para crear un nuevo reporte</span>
              </div>
            </button>

            <button
              onClick={() => router.push('/menu/estatus-de-reportes')}
              className="flex w-full items-center gap-4 rounded-lg border border-zinc-200 bg-white px-6 py-4 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-amber-50 text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
                </svg>
              </span>
              <div className="flex w-full flex-col items-start">
                <span className="font-medium">Estatus de reportes</span>
                <span className="text-sm text-zinc-500">Ver estado y advertencias de envíos</span>
              </div>
            </button>

            <button
              onClick={() => router.push('/menu/graficas')}
              className="flex w-full items-center gap-4 rounded-lg border border-zinc-200 bg-white px-6 py-4 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3v18h18M9 17V9m6 8V5M15 17v-6" />
                </svg>
              </span>
              <div className="flex w-full flex-col items-start">
                <span className="font-medium">Gráficas</span>
                <span className="text-sm text-zinc-500">Visualizaciones y métricas</span>
              </div>
            </button>
          </section>

          <footer className="w-full flex justify-center">
            <button onClick={handleLogout} className="rounded-lg bg-red-600 px-6 py-3 text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-red-400">
              Cerrar sesión
            </button>
          </footer>
        </div>
      </main>
    </div>
  );
}
