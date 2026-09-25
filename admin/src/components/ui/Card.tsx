import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Card({
  children,
  className = "",
  header,
  footer
}: CardProps) {
  return (
    <div
      className={`bg-white border border-slate-200 text-slate-900 rounded-2xl overflow-hidden shadow-2xs ${className}`}
    >
      {header && (
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between text-slate-900 font-semibold">
          {header}
        </div>
      )}
      <div className="p-5">{children}</div>
      {footer && (
        <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-slate-600">
          {footer}
        </div>
      )}
    </div>
  );
}
