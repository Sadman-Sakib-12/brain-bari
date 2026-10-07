import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
}

export default function Card({
  children,
  className = "",
  header,
  footer,
  title,
  subtitle,
  headerAction,
}: CardProps) {
  return (
    <div
      className={`bg-white border border-slate-200/90 text-slate-900 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-all ${className}`}
    >
      {(header || title) && (
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between text-slate-900 font-bold tracking-tight text-sm">
          {header ? (
            header
          ) : (
            <div>
              <h3 className="text-sm font-bold text-slate-900">{title}</h3>
              {subtitle && <p className="text-xs text-slate-500 font-normal mt-0.5">{subtitle}</p>}
            </div>
          )}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-slate-600 text-xs">
          {footer}
        </div>
      )}
    </div>
  );
}
