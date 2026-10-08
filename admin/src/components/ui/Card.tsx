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
      className={`bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all ${className}`}
    >
      {(header || title) && (
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-slate-900 dark:text-slate-100 font-bold tracking-tight text-sm">
          {header ? (
            header
          ) : (
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
              {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">{subtitle}</p>}
            </div>
          )}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs">
          {footer}
        </div>
      )}
    </div>
  );
}
