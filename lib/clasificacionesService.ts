import { supabase } from "./supabaseClient";

export interface ClasificacionItem {
  id: string;
  nombre: string;
  created_at: string;
}

interface ClasificacionRow {
  id: number;
  nombre: string;
  created_at: string;
}

export async function fetchClasificaciones(): Promise<{
  data: ClasificacionItem[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("clasificacion")
    .select("id,nombre,created_at")
    .order("nombre", { ascending: true });

  if (error) {
    return { data: [], error: error.message };
  }

  const clasificaciones: ClasificacionItem[] = (data || []).map((c: ClasificacionRow) => ({
    id: String(c.id),
    nombre: c.nombre,
    created_at: c.created_at,
  }));

  return { data: clasificaciones, error: null };
}