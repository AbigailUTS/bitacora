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

export async function addClasificacion(nombre: string): Promise<{
  data: ClasificacionItem | null;
  error: string | null;
}> {
  if (!nombre.trim()) {
    return { data: null, error: "El nombre no puede estar vacío" };
  }

  const { data, error } = await supabase
    .from("clasificacion")
    .insert([{ nombre: nombre.trim() }])
    .select("id,nombre,created_at");

  if (error) {
    return { data: null, error: error.message };
  }

  if (!data || data.length === 0) {
    return { data: null, error: "No se pudo crear la clasificación" };
  }

  const clasificacion: ClasificacionItem = {
    id: String(data[0].id),
    nombre: data[0].nombre,
    created_at: data[0].created_at,
  };

  return { data: clasificacion, error: null };
}

export async function updateClasificacion(
  clasificacionId: string,
  nombre: string
): Promise<{
  data: ClasificacionItem | null;
  error: string | null;
}> {
  if (!nombre.trim()) {
    return { data: null, error: "El nombre no puede estar vacío" };
  }

  const { data, error } = await supabase
    .from("clasificacion")
    .update({ nombre: nombre.trim() })
    .eq("id", parseInt(clasificacionId))
    .select("id,nombre,created_at");

  if (error) {
    return { data: null, error: error.message };
  }

  if (!data || data.length === 0) {
    return { data: null, error: "No se pudo actualizar la clasificación" };
  }

  const clasificacion: ClasificacionItem = {
    id: String(data[0].id),
    nombre: data[0].nombre,
    created_at: data[0].created_at,
  };

  return { data: clasificacion, error: null };
}

export async function removeClasificacion(clasificacionId: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  const { error } = await supabase
    .from("clasificacion")
    .delete()
    .eq("id", parseInt(clasificacionId));

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}