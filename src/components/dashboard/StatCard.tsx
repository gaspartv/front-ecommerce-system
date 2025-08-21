import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  bgColor?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  bgColor = "bg-blue-50 dark:bg-blue-900/20",
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className={`p-3 ${bgColor} rounded-lg`}>{icon}</div>
      </div>
    </div>
  );
}
