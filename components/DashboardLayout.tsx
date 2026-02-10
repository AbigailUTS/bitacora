"use client";

import React, { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import GenerarReportePanel from "./panels/GenerarReportePanel";
import EstatusReportesPanel from "./panels/EstatusReportesPanel";
import GraficasPanel from "./panels/GraficasPanel";
import DependenciasPanel from "./panels/DependenciasPanel";
import UbicacionPanel from "./panels/UbicacionPanel";
import HoverCard from "./HoverCard";

interface DashboardLayoutProps {
  children: ReactNode;
  userEmail?: string;
  userName?: string;
  onLogout: () => void;
}

interface MenuLink {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  fullDescription: string;
}

const menuLinks: MenuLink[] = [
  {
    id: "generar-reporte",
    label: "Generar reporte",
    color: "indigo",
    fullDescription: "Crea un nuevo reporte con los datos necesarios. Completa el formulario con la información requerida.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12h6M9 16h6M6 8h12M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"
        />
      </svg>
    ),
  },
  {
    id: "estatus-de-reportes",
    label: "Estatus de reportes",
    color: "amber",
    fullDescription: "Visualiza el estado actual de todos tus reportes. Revisa las alertas y el progreso de cada uno.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"
        />
      </svg>
    ),
  },
  {
    id: "graficas",
    label: "Gráficas",
    color: "emerald",
    fullDescription: "Visualiza gráficas interactivas y métricas importantes. Analiza tendencias y datos históricos.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 3v18h18M9 17V9m6 8V5M15 17v-6"
        />
      </svg>
    ),
  },
  {
    id: "dependencias",
    label: "Dependencias",
    color: "indigo",
    fullDescription: "Administra todas las sucursales y dependencias de tu organización de manera centralizada.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1M9 7a1 1 0 011-1h2a1 1 0 011 1m0 0a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 011-1z"
        />
      </svg>
    ),
  },
  {
    id: "ubicacion",
    label: "Ubicación",
    color: "emerald",
    fullDescription: "Registra y gestiona las ubicaciones geográficas de todos tus puntos de operación.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

export default function DashboardLayout({
  children,
  userEmail,
  userName,
  onLogout,
}: DashboardLayoutProps) {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const closePanel = () => setActivePanel(null);

  const getHoverInfo = () => {
    if (!hoveredLink) return null;
    return menuLinks.find((link) => link.id === hoveredLink) || null;
  };

  // Pasar activePanel como prop al children solo si el child es un elemento React compuesto
  let childrenWithProps: React.ReactNode = children;
  if (React.isValidElement(children)) {
    const childType = (children as any).type;
    const isDOMElement = typeof childType === "string"; // 'div', 'span', etc.
    if (!isDOMElement) {
      childrenWithProps = React.cloneElement(children as React.ReactElement<any>, { activePanel });
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        links={menuLinks}
        userEmail={userEmail}
        onLogout={onLogout}
        onLinkClick={(id) => setActivePanel(id)}
        onLinkHover={setHoveredLink}
        activePanel={activePanel}
        hoveredLink={hoveredLink}
      />

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar con bienvenida - solo se muestra si no hay panel activo */}
        {!activePanel && (
          <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-gray-900">
              Bienvenido{userName ? `, ${userName}` : ""}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Gestiona tus reportes y visualiza tus datos
            </p>
          </div>
        )}

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-auto">
          {/* Si no hay panel activo, mostrar el contenido normal */}
          {!activePanel ? (
            <div className="p-8">
              {/* Mostrar tarjeta de hover en el centro o contenido normal */}
              {hoveredLink ? (
                <div className="h-full flex items-center justify-center">
                  <HoverCard info={getHoverInfo()} />
                </div>
              ) : (
                childrenWithProps
              )}
            </div>
          ) : (
            /* Paneles dinámicos expandidos en el área central */
            <div className="flex flex-col h-full bg-white">
              {/* Header del panel expandido */}
              {activePanel && (
                <div className="flex items-center justify-between border-b-2 border-gray-100 px-8 py-7 flex-shrink-0 bg-gradient-to-r from-gray-50 to-white shadow-sm">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {activePanel === "generar-reporte" && "Generar reporte"}
                      {activePanel === "estatus-de-reportes" && "Estatus de reportes"}
                      {activePanel === "graficas" && "Gráficas"}
                      {activePanel === "dependencias" && "Dependencias"}
                      {activePanel === "ubicacion" && "Ubicación"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {activePanel === "generar-reporte" && "Crea un nuevo reporte con los datos necesarios"}
                      {activePanel === "estatus-de-reportes" && "Revisa el estado de tus reportes enviados"}
                      {activePanel === "graficas" && "Visualiza métricas y análisis de datos"}
                      {activePanel === "dependencias" && "Administra tus sucursales y dependencias"}
                      {activePanel === "ubicacion" && "Gestiona las ubicaciones de tus puntos de operación"}
                    </p>
                  </div>
                  <button
                    onClick={closePanel}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition rounded-lg p-2"
                    aria-label="Cerrar panel"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
              
              {/* Contenido del panel */}
              <div className="flex-1 overflow-auto animate-in fade-in duration-300 px-8 py-8">
                {activePanel === "generar-reporte" && <GenerarReportePanel onClose={closePanel} />}
                {activePanel === "estatus-de-reportes" && <EstatusReportesPanel onClose={closePanel} />}
                {activePanel === "graficas" && <GraficasPanel onClose={closePanel} />}
                {activePanel === "dependencias" && <DependenciasPanel onClose={closePanel} />}
                {activePanel === "ubicacion" && <UbicacionPanel onClose={closePanel} />}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
