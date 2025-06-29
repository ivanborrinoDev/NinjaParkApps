import React from "react";

interface ParkingMarkerProps {
  type: "public" | "private";
  onClick: () => void;
  className?: string;
}

export function ParkingMarker({ type, onClick, className }: ParkingMarkerProps) {
  const bgColor = type === "public" ? "bg-ninja-blue" : "bg-ninja-mint";
  const icon = type === "public" ? "P" : "H";

  return (
    <button
      onClick={onClick}
      className={`${bgColor} w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ${className}`}
    >
      <span className="text-white text-sm font-bold">{icon}</span>
    </button>
  );
}
