import React, { ReactNode, useEffect, useRef, useState } from "react";
import Pagination from "../ui/Pagination";

export interface Column<T = Record<string, unknown>> {
  header: string;
  key: keyof T | string;
  render?: (value: unknown, item: T) => ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T = Record<string, unknown>> {
  title: string;
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSortChange?: (key: string) => void;
  reorderable?: boolean;
  onColumnOrderChange?: (newOrderKeys: string[]) => void;
  showStatusFilter?: boolean;
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
}

export default function DataTable<
  T extends Record<string, unknown> & { id?: string | number }
>(props: DataTableProps<T>) {
  const {
    title,
    columns,
    data,
    searchPlaceholder = "Buscar...",
    onSearch,
    showPagination = false,
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    itemsPerPage = 10,
    totalItems = 0,
    pageSizeOptions = [5, 10, 20, 50],
    onPageSizeChange,
    sortKey,
    sortDirection,
    onSortChange,
    reorderable = false,
    onColumnOrderChange,
    showStatusFilter = false,
    statusFilter = "all",
    onStatusFilterChange,
  } = props;

  // Estado local para o campo de busca com debounce
  const [searchValue, setSearchValue] = useState("");

  // Effect para implementar debounce na busca
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(searchValue);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchValue, onSearch]);

  const dragStartIndexRef = useRef<number | null>(null);
  const handleDragStart = (
    e: React.DragEvent<HTMLTableCellElement>,
    index: number
  ) => {
    dragStartIndexRef.current = index;
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e: React.DragEvent) => {
    if (!reorderable) return;
    e.preventDefault();
  };
  const handleDrop = (
    e: React.DragEvent<HTMLTableCellElement>,
    dropIndex: number
  ) => {
    e.preventDefault();
    if (!reorderable) return;
    const from = dragStartIndexRef.current;
    if (from == null || from === dropIndex) return;
    const cols = columns.filter((c) => c.key !== "actions");
    const movedCol = cols[from];
    if (!movedCol) return;
    const newOrder = [...cols];
    newOrder.splice(from, 1);
    newOrder.splice(dropIndex, 0, movedCol);
    onColumnOrderChange?.(newOrder.map((c) => String(c.key)));
    dragStartIndexRef.current = null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 w-full max-w-full">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <div className="flex items-center gap-3 flex-wrap">
            {showStatusFilter && (
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => onStatusFilterChange?.(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">Todos</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
            )}
            <div>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full max-w-full overflow-x-auto">
        <table className="min-w-max w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              {columns.map((column, index) => {
                const isActive = sortKey === String(column.key);
                const isSortable =
                  column.sortable !== false &&
                  column.key !== "actions" &&
                  !!onSortChange;
                const isDraggable = reorderable && column.key !== "actions";
                const isActions = column.key === "actions";
                return (
                  <th
                    key={`head-${index}`}
                    className={`px-4 py-2 text-left text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider select-none sticky top-0 ${
                      isDraggable ? "cursor-move" : ""
                    } ${
                      isActions
                        ? "right-0 bg-gray-50 dark:bg-gray-700/50 shadow-left z-30 w-[140px] min-w-[140px]"
                        : "bg-gray-50 dark:bg-gray-700/50 z-20 w-[160px] min-w-[160px]"
                    }`}
                    draggable={isDraggable}
                    onDragStart={(e) =>
                      isDraggable && handleDragStart(e, index)
                    }
                    onDragOver={handleDragOver}
                    onDrop={(e) => isDraggable && handleDrop(e, index)}
                  >
                    {isSortable ? (
                      <button
                        type="button"
                        onClick={() => onSortChange?.(String(column.key))}
                        className={`group inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors ${
                          isActive ? "text-gray-900 dark:text-white" : ""
                        }`}
                      >
                        <span className="truncate max-w-[110px] inline-block align-top">
                          {column.header}
                        </span>
                        <span className="text-[9px] leading-none opacity-60 group-hover:opacity-100">
                          {isActive
                            ? sortDirection === "asc"
                              ? "▲"
                              : "▼"
                            : "△"}
                        </span>
                      </button>
                    ) : (
                      <span className="truncate max-w-[110px] inline-block">
                        {column.header}
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((item, rowIdx) => (
              <tr
                key={item.id || rowIdx}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                {columns.map((column, colIdx) => {
                  const isActions = column.key === "actions";
                  const rawValue = item[column.key];
                  const display = rawValue == null ? "" : String(rawValue);
                  const isLong = display.length > 60;
                  return (
                    <td
                      key={`cell-${rowIdx}-${colIdx}`}
                      className={`px-4 py-2 align-top text-sm ${
                        isActions
                          ? "sticky right-0 bg-white dark:bg-gray-800 shadow-left z-10 w-[140px] min-w-[140px]"
                          : "w-[160px] min-w-[160px] max-w-[200px]"
                      } ${!isActions ? "whitespace-nowrap" : ""}`}
                      title={isLong ? display : undefined}
                    >
                      {column.render ? (
                        column.render(rawValue, item)
                      ) : (
                        <span
                          className={`${
                            isLong ? "truncate inline-block max-w-[240px]" : ""
                          }`}
                        >
                          {display}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showPagination && onPageChange && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
            <label htmlFor="page-size-select" className="font-medium">
              Itens/página:
            </label>
            <select
              id="page-size-select"
              value={itemsPerPage}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
          />
        </div>
      )}
    </div>
  );
}
