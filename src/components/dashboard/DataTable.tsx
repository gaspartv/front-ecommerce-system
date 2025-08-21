import { ReactNode } from "react";
import Pagination from "../ui/Pagination";

interface Column<T = Record<string, unknown>> {
  header: string;
  key: keyof T | string;
  render?: (value: unknown, item: T) => ReactNode;
}

interface DataTableProps<T = Record<string, unknown>> {
  title: string;
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  // Paginação
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
}

export default function DataTable<
  T extends Record<string, unknown> & { id?: string | number }
>({
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
}: DataTableProps<T>) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch?.(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-text"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={`header-${index}`}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((item, index) => (
              <tr
                key={item.id || index}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={`cell-${index}-${colIndex}`}
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    {column.render ? (
                      column.render(item[column.key], item)
                    ) : (
                      <div className="text-sm text-gray-900 dark:text-white">
                        {String(item[column.key] || "")}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && onPageChange && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      )}
    </div>
  );
}
