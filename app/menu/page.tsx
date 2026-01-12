"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function MenuPage() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/");
        return;
      }
      setEmail(data.user.email ?? null);
    }
    load();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-md rounded bg-white p-8 shadow text-center">
        <h1 className="mb-4 text-2xl font-semibold">Bienvenido</h1>
        <p className="mb-6">{email ?? "usuario"}</p>
        <div className="flex justify-center gap-4">
          <button onClick={handleLogout} className="rounded bg-red-600 px-4 py-2 text-white">
            Cerrar sesión
          </button>
        </div>
      </main>
    </div>
  );
}
