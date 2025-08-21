"use client";

import {
  BuildingOfficeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  UsersIcon,
} from "@/components/icons";
import Link from "next/link";
import { ReactNode, useState } from "react";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: "dashboard" | "empresas" | "usuarios";
  title: string;
  subtitle: string;
  actionButton?: {
    label: string;
    onClick?: () => void;
  };
}

export default function DashboardLayout({
  children,
  currentPage,
  title,
  subtitle,
  actionButton,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems: MenuItem[] = [
    {
      name: "Início",
      href: "/dashboard",
      icon: HomeIcon,
      current: currentPage === "dashboard",
    },
    {
      name: "Empresas",
      href: "/dashboard/empresas",
      icon: BuildingOfficeIcon,
      current: currentPage === "empresas",
    },
    {
      name: "Usuários",
      href: "/dashboard/usuarios",
      icon: UsersIcon,
      current: currentPage === "usuarios",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {sidebarOpen && (
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              E-Commerce
            </h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {sidebarOpen ? (
              <ChevronLeftIcon className="h-5 w-5" />
            ) : (
              <ChevronRightIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  item.current
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span className="ml-3">{item.name}</span>}
                {!sidebarOpen && (
                  <div className="absolute left-16 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Admin
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  admin@email.com
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            </div>

            {actionButton && (
              <button
                onClick={actionButton.onClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {actionButton.label}
              </button>
            )}
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
