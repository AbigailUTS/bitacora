"use client";

import React from "react";

interface HoverInfo {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  fullDescription: string;
}

interface HoverCardProps {
  info: HoverInfo | null;
}

export default function HoverCard({ info }: HoverCardProps) {
  if (!info) return null;

  const colorClasses = {
    indigo: "bg-indigo-100 text-indigo-600",
    amber: "bg-amber-100 text-amber-600",
    emerald: "bg-emerald-100 text-emerald-600",
  };

  const getColorClass = (color: string) => {
    return colorClasses[color as keyof typeof colorClasses] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md border-t-4 border-indigo-600">
        <div className="flex items-center justify-center mb-6">
          <div className={`flex h-16 w-16 items-center justify-center rounded-lg ${getColorClass(info.color)}`}>
            {info.icon}
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
          {info.label}
        </h3>

        <p className="text-gray-600 text-center mb-6">{info.fullDescription}</p>

        <div className="flex items-center justify-center text-sm text-gray-500 animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
          Haz clic para abrir
        </div>
      </div>
    </div>
  );
}
