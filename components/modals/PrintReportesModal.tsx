"use client";

import React, { useState, useEffect } from "react";
import { Reporte } from "../../lib/models/reporte";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PrintReportesModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportes: (Reporte & {
    user_name?: string;
    dependencia_nombre?: string;
    area_nombre?: string;
    clasificacion_nombre?: string;
  })[];
  getUrgenciaColor: (urgencia: string) => string;
  getEstatusColor: (estatus: string) => string;
}

export default function PrintReportesModal({
  isOpen,
  onClose,
  reportes,
  getUrgenciaColor,
  getEstatusColor,
}: PrintReportesModalProps) {
  const [selectedEstatuses, setSelectedEstatuses] = useState<string[]>([
    "pendiente",
    "en progreso",
    "finalizado",
  ]);
  const [selectedDependencias, setSelectedDependencias] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [filtering, setFiltering] = useState(false);

  // Get unique dependencias
  const uniqueDependencias = Array.from(
    new Set(reportes.map((r) => r.dependencia_nombre).filter(Boolean))
  );

  // Initialize selectedDependencias on mount
  useEffect(() => {
    if (isOpen && selectedDependencias.length === 0 && uniqueDependencias.length > 0) {
      setSelectedDependencias(uniqueDependencias);
    }
  }, [isOpen, uniqueDependencias, selectedDependencias.length]);

  const getFilteredReportes = () => {
    let filtered = reportes;

    // Filter by estatus
    if (selectedEstatuses.length > 0) {
      filtered = filtered.filter((r) => selectedEstatuses.includes(r.estatus_ticket));
    }

    // Filter by dependencia
    if (selectedDependencias.length > 0) {
      filtered = filtered.filter((r) => selectedDependencias.includes(r.dependencia_nombre));
    }

    // Filter by date range
    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter((r) => new Date(r.created_at) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((r) => new Date(r.created_at) <= end);
    }

    return filtered;
  };

  const handleToggleEstatus = (estatus: string) => {
    setSelectedEstatuses((prev) =>
      prev.includes(estatus)
        ? prev.filter((e) => e !== estatus)
        : [...prev, estatus]
    );
  };

  const handleToggleDependencia = (dependencia: string) => {
    setSelectedDependencias((prev) =>
      prev.includes(dependencia)
        ? prev.filter((d) => d !== dependencia)
        : [...prev, dependencia]
    );
  };

  const generatePDF = async () => {
    setFiltering(true);
    try {
      const pdf = new jsPDF("portrait", "mm", "a4");
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      let yPosition = margin;

      // Title
      pdf.setFontSize(16);
      pdf.text("Reporte de Tickets", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 10;

      // Date range info
      pdf.setFontSize(10);
      const dateInfo =
        startDate || endDate
          ? `Período: ${startDate || "Inicio"} a ${endDate || "Hoy"}`
          : "Todos los reportes";
      pdf.text(dateInfo, margin, yPosition);
      yPosition += 7;

      // Table data
      const tableData = filteredReportes.map((reporte) => [
        reporte.id.toString(),
        reporte.clasificacion_nombre || "",
        reporte.urgencia_reporte || "",
        reporte.estatus_ticket || "",
        new Date(reporte.created_at).toLocaleDateString("es-ES"),
        reporte.descripcion || "",
        reporte.dependencia_nombre || "",
      ]);

      autoTable(pdf, {
        head: [
          ["ID", "Clasificación", "Urgencia", "Estado", "Fecha", "Descripción", "Dependencia"],
        ],
        body: tableData,
        startY: yPosition,
        margin: margin,
        styles: {
          fontSize: 9,
          cellPadding: 3,
          halign: "left",
          valign: "top",
        },
        columnStyles: {
          5: { cellWidth: 50 },
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        didDrawPage: (data) => {
          // Footer
          const pageCount = (pdf as any).internal.getNumberOfPages();
          const pageSize = pdf.internal.pageSize;
          const pageHeight = pageSize.getHeight();
          const pageWidth = pageSize.getWidth();

          pdf.setFontSize(8);
          pdf.text(
            `Página ${data.pageNumber} de ${pageCount}`,
            pageWidth / 2,
            pageHeight - 5,
            { align: "center" }
          );
        },
      });

      pdf.save(`reportes_${new Date().toISOString().split("T")[0]}.pdf`);
    } finally {
      setFiltering(false);
    }
  };

  const filteredReportes = getFilteredReportes();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Imprimir Reportes</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Filters */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-900">Filtros</h3>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inicial
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Final
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <div className="flex flex-wrap gap-2">
                {["pendiente", "en progreso", "finalizado"].map((estatus) => (
                  <button
                    key={estatus}
                    onClick={() => handleToggleEstatus(estatus)}
                    className={`px-3 py-1 rounded text-sm font-medium transition ${
                      selectedEstatuses.includes(estatus)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {estatus}
                  </button>
                ))}
              </div>
            </div>

            {/* Dependencia Filter */}
            {uniqueDependencias.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dependencias
                </label>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {uniqueDependencias.map((dependencia) => (
                    <label key={dependencia} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedDependencias.includes(dependencia)}
                        onChange={() => handleToggleDependencia(dependencia)}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">{dependencia}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Reportes a imprimir ({filteredReportes.length})
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {filteredReportes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No hay reportes que coincidan con los filtros seleccionados
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-200">
                        <th className="px-4 py-2 text-left font-semibold">ID</th>
                        <th className="px-4 py-2 text-left font-semibold">Clasificación</th>
                        <th className="px-4 py-2 text-left font-semibold">Urgencia</th>
                        <th className="px-4 py-2 text-left font-semibold">Estado</th>
                        <th className="px-4 py-2 text-left font-semibold">Fecha</th>
                        <th className="px-4 py-2 text-left font-semibold">Descripción</th>
                        <th className="px-4 py-2 text-left font-semibold">Dependencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReportes.map((reporte) => (
                        <tr key={reporte.id} className="border-b border-gray-200 hover:bg-gray-50 align-top">
                          <td className="px-4 py-2 whitespace-nowrap">#{reporte.id}</td>
                          <td className="px-4 py-2">{reporte.clasificacion_nombre}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded ${getUrgenciaColor(
                                reporte.urgencia_reporte
                              )}`}
                            >
                              {reporte.urgencia_reporte}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded ${getEstatusColor(
                                reporte.estatus_ticket
                              )}`}
                            >
                              {reporte.estatus_ticket}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {new Date(reporte.created_at).toLocaleDateString("es-ES")}
                          </td>
                          <td className="px-4 py-2 text-xs break-words max-w-xs">{reporte.descripcion}</td>
                          <td className="px-4 py-2">{reporte.dependencia_nombre}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Cerrar
          </button>
          <button
            onClick={generatePDF}
            disabled={filteredReportes.length === 0 || filtering}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {filtering ? "Generando..." : "📥 Descargar PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
