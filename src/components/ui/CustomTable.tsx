

import React from "react";


type ColumnType<T> = {
  key: keyof T | string;
  header: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
};

type CustomTableProps<T> = {
  columns: ColumnType<T>[];
  data: T[];
  emptyLabel?: string;
  emptyDesc?: React.ReactNode;
  footer?: React.ReactNode;
};


export default function CustomTable<T>({
  columns,
  data,
  emptyLabel = "No records found",
  emptyDesc = "There are currently no entries to display.",
  footer,
}: Readonly<CustomTableProps<T>>) {
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto w-full">

      <table className=" min-w-full border-collapse">
        <thead>
          <tr className="border-b border-[#E4E7EC] bg-[#E4E7EC]">
            {columns.map((col, i) => (
              <th key={i} className="py-3 text-left px-3">
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
                          .reduce(
                            (acc, k) => (acc && acc[k as keyof typeof acc]) || "",
                            row as any
                          )
                      : (row as any)[col.key as keyof T];

                  return (
                    <td key={ci} className="py-2 px-3 text-center">
                      {col.render ? col.render(value, row, index) : value}
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
