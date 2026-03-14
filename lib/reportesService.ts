import { supabase } from './supabaseClient';
import { ReporteInsert, Reporte } from './models/reporte';

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

export async function fetchReportes(userId: string, isAdmin: boolean): Promise<{ data: Reporte[] | null; error: string | null }> {
  let query = supabase.from('reportes').select('*');

  if (!isAdmin) {
    query = query.eq('usuario_id', userId);
  }

  const { data, error } = await query;

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}
