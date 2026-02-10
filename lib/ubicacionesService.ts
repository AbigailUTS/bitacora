import { supabase } from "./supabaseClient";

export interface UbicacionItem {
  id: string;
  nombre: string;
  direccion: string;
  link: string;
}

interface UbicacionRow {
  id: number;
  nombre: string;
  descripcion: string;
  link: string;
}

export async function fetchUbicaciones(): Promise<{
  data: UbicacionItem[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("ubicacion")
    .select("id,nombre,descripcion,link")
    .order("nombre", { ascending: true });

  if (error) {
    return { data: [], error: error.message };
  }

  const ubicaciones: UbicacionItem[] = (data || []).map((d: UbicacionRow) => ({
    id: String(d.id),
    nombre: d.nombre,
    direccion: d.descripcion,
    link: d.link,
  }));

  return { data: ubicaciones, error: null };
}

export async function addUbicacion(
  nombre: string,
  direccion: string,
  link: string
): Promise<{
  data: UbicacionItem | null;
  error: string | null;
}> {
  if (!nombre.trim() || !direccion.trim() || !link.trim()) {
    return { data: null, error: "Todos los campos son requeridos" };
  }

  const { data, error } = await supabase
    .from("ubicacion")
    .insert([
      {
        nombre: nombre.trim(),
        descripcion: direccion.trim(),
        link: link.trim(),
      },
    ])
    .select("id,nombre,descripcion,link");

  if (error) {
    return { data: null, error: error.message };
  }

  if (data && data.length > 0) {
    return {
      data: {
        id: String(data[0].id),
        nombre: data[0].nombre,
        direccion: data[0].descripcion,
        link: data[0].link,
      },
      error: null,
    };
  }

  return { data: null, error: "Error al agregar ubicación" };
}

export async function removeUbicacion(id: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  const { error } = await supabase
    .from("ubicacion")
    .delete()
    .eq("id", parseInt(id));

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
