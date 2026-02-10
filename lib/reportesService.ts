import { supabase } from './supabaseClient';
import { ReporteInsert } from './models/reporte';

export async function fetchUserRole(userId: string): Promise<{ role: string | null; error: string | null }> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('id', userId)
    .limit(1)
    .single();

  if (error) return { role: null, error: error.message };
  return { role: data?.role ?? null, error: null };
}

export async function createReporte(reporte: ReporteInsert): Promise<{ data: ReporteInsert[] | null; error: string | null }> {
  console.log('createReporte called with:', reporte);
    const { data, error } = await supabase.from('reportes').insert([reporte]).select();
console.log('createReporte result:', { data, error });
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}
