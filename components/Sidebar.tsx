"use client";

import React from "react";

interface SidebarLink {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface SidebarProps {
  links: SidebarLink[];
  userEmail?: string;
  onLogout: () => void;
  onLinkClick: (id: string) => void;
  onLinkHover: (id: string | null) => void;
  activePanel?: string | null;
  hoveredLink?: string | null;
  isMobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
}

export default function Sidebar({
  links,
  userEmail,
  onLogout,
  onLinkClick,
  onLinkHover,
  activePanel,
  hoveredLink,
  isMobileMenuOpen = false,
  onCloseMobileMenu,
}: SidebarProps) {
  return (
    <>
      {/* Overlay para móvil */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onCloseMobileMenu}
        />
      )}

      <aside className={`w-64 bg-slate-900 text-white shadow-lg flex flex-col h-screen fixed top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 md:block`}>
      {/* Header del Sidebar */}
      <div className="px-6 py-8 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Bitácora</h2>
            <p className="text-xs text-slate-400 mt-2">{userEmail ?? "usuario"}</p>
          </div>
          {/* Botón cerrar para móvil */}
          <button
            onClick={onCloseMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Cerrar menú"
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
      </div>

      {/* Links del menú */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const isActive = activePanel === link.id;
          const isHovered = hoveredLink === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onLinkClick(link.id)}
              onMouseEnter={() => onLinkHover(link.id)}
              onMouseLeave={() => onLinkHover(null)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-slate-700 text-white"
                  : isHovered
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center flex-shrink-0">
                {link.icon}
              </span>
              <span className="text-sm font-medium text-left">{link.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer del Sidebar */}
      <div className="px-4 py-4 border-t border-slate-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
    </>
  );
}
