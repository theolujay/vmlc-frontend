import React from "react";
import clsx from "clsx";
import { Checkbox } from "@/components/ui/Checkbox";

type ColumnType<T> = {
  key: keyof T | string;
  header: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, row: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  helpText?: string;
};

type CustomTableProps<T> = {
  columns: ColumnType<T>[];
  data: T[];
  emptyLabel?: string;
  emptyDesc?: React.ReactNode;
  footer?: React.ReactNode;
  minWidth?: string;
  stickyTopOffset?: string;
  // Selection props
  isAdminOrAbove?: boolean;
  onSelectAll?: (checked: boolean) => void;
  onSelectRow?: (id: string | number, checked: boolean) => void;
  selectedIds?: (string | number)[];
  getRowId?: (row: T) => string | number;
  onRowClick?: (row: T) => void;
};

export default function CustomTable<T extends object>({
  columns,
  data,
  emptyLabel = "No records found",
  emptyDesc = "There are currently no entries to display.",
  footer,
  minWidth = "100%",
  stickyTopOffset = "0px",
  isAdminOrAbove = false,
  onSelectAll,
  onSelectRow,
  selectedIds = [],
  getRowId = (row: T) =>
    (row as Record<string, unknown>).id
      ? String((row as Record<string, unknown>).id)
      : JSON.stringify(row),
  onRowClick,
}: Readonly<CustomTableProps<T>>) {
  const allSelected =
    data.length > 0 &&
    data.every((row) => {
      const id = getRowId(row);
      return selectedIds.includes(id);
    });

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto w-full custom-scrollbar">
        <table
          className="min-w-full border-collapse"
          style={{ minWidth, width: "100%" }}
        >
          <thead>
            <tr className="border-b border-[#E4E7EC] bg-[#E4E7EC]">
              {isAdminOrAbove && (
                <th className="py-2 px-3 text-center w-10">
                  <div className="flex justify-center">
                    <Checkbox
                      checked={allSelected}
                      onChange={(checked) => onSelectAll?.(checked)}
                    />
                  </div>
                </th>
              )}
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={clsx(
                    "sticky top-0 z-10 py-3 px-3 text-[9px] font-black uppercase tracking-widest text-gray-500",
                    !col.align || col.align === "left"
                      ? "text-left"
                      : col.align === "center"
                        ? "text-center"
                        : "text-right",
                  )}
                  style={{ top: stickyTopOffset }}
                >
                  <div className="flex items-center gap-1">
                    <span>{col.header}</span>
                    {col.helpText && (
                      <div className="group relative inline-flex">
                        <i className="fas fa-info-circle text-[10px] text-gray-400 hover:text-[#3E4095] cursor-help transition-colors"></i>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-[10px] font-bold rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                          {col.helpText}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (isAdminOrAbove ? 1 : 0)}
                  className="py-6 text-center"
                >
                  <EmptyRecords label={emptyLabel} desc={emptyDesc} />
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={getRowId(row)}
                  onClick={() => onRowClick?.(row)}
                  className={clsx(
                    "border-b border-[#E4E7EC] last:border-0 hover:bg-gray-50 transition-colors",
                    onRowClick && "cursor-pointer",
                  )}
                >
                  {isAdminOrAbove && (
                    <td className="py-2 px-3">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={selectedIds.includes(getRowId(row))}
                          onChange={(checked) =>
                            onSelectRow?.(getRowId(row), checked)
                          }
                        />
                      </div>
                    </td>
                  )}

                  {columns.map((col, ci) => {
                    const value =
                      typeof col.key === "string" && col.key.includes(".")
                        ? col.key
                            .split(".")
                            .reduce(
                              (acc: unknown, k) =>
                                (acc as Record<string, unknown>)?.[k] ?? "",
                              row,
                            )
                        : (row as Record<string, unknown>)[col.key as string];

                    return (
                      <td
                        key={ci}
                        className={clsx(
                          "py-2 px-3",
                          !col.align || col.align === "left"
                            ? "text-left"
                            : col.align === "center"
                              ? "text-center"
                              : "text-right",
                        )}
                      >
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {col.render
                          ? col.render(value, row, index)
                          : (value as any)}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {footer && <div className="py-3">{footer}</div>}
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
