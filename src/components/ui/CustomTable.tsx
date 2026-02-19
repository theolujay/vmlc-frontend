

import React from "react";
import clsx from "clsx";

type ColumnType<T> = {
  key: keyof T | string;
  header: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, row: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
};

type CustomTableProps<T> = {
  columns: ColumnType<T>[];
  data: T[];
  emptyLabel?: string;
  emptyDesc?: React.ReactNode;
  footer?: React.ReactNode;
  minWidth?: string;
};


export default function CustomTable<T>({
  columns,
  data,
  emptyLabel = "No records found",
  emptyDesc = "There are currently no entries to display.",
  footer,
  minWidth = "100%",
}: Readonly<CustomTableProps<T>>) {
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto w-full custom-scrollbar">

      <table className="border-collapse" style={{ minWidth, width: '100%' }}>
        <thead>
          <tr className="border-b border-[#E4E7EC] bg-[#E4E7EC]">
            {columns.map((col, i) => (
              <th 
                key={i} 
                className={clsx(
                  "py-3 px-3 font-semibold text-gray-700",
                  !col.align || col.align === 'left' ? "text-left" : col.align === 'center' ? "text-center" : "text-right"
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-6 text-center">
                <EmptyRecords label={emptyLabel} desc={emptyDesc} />
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={index}
                className="border-b border-[#E4E7EC] last:border-0 hover:bg-gray-50 transition-colors"
              >
                {columns.map((col, ci) => {
                  const value =
                    typeof col.key === "string" && col.key.includes(".")
                      ? col.key
                          .split(".")
                          .reduce((acc: unknown, k) => (acc as Record<string, unknown>)?.[k] ?? "", row)
                      : (row as Record<string, unknown>)[col.key as string];

                  return (
                    <td 
                      key={ci} 
                      className={clsx(
                        "py-4 px-3 text-gray-600",
                        !col.align || col.align === 'left' ? "text-left" : col.align === 'center' ? "text-center" : "text-right"
                      )}
                    >
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {col.render ? col.render(value, row, index) : (value as any)}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {footer && <div className="py-3">{footer}</div>}
      </div>
    </div>
  );
}

function EmptyRecords({
  label,
  desc,
}: Readonly<{ label: string; desc: React.ReactNode }>) {
  return (
    <div className="w-full grid place-content-center py-12">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-xl font-semibold">{label}</h2>
        <p className="text-gray-500">{desc}</p>
      </div>
    </div>
  );
}
