export interface Reporte {
  id: number;
  created_at: string; // timestamp - auto creada por BD
  usuario_id: string;
  asunto: string;
  descripcion: string;
  evidencias?: string; // puede ser null
  dependencia_id?: string; // referencia a tabla dependencias
  urgencia_reporte: string; // 'no urgente' | 'normal' | 'urgente' | 'muy urgente'
  estatus_ticket: string; // 'pendiente' | 'en progreso' | 'finalizado'
  // rol se obtiene de otra tabla mediante join
}

export type ReporteInsert = Omit<Reporte, 'id' | 'created_at'>;
