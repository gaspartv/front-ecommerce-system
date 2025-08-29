"use client";

import { BuildingOfficeIcon, HomeIcon, UsersIcon } from "@/components/icons";
import Link from "next/link";
import { ReactNode } from "react";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: "dashboard" | "businesses" | "users";
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
  const menuItems: MenuItem[] = [
    {
      name: "Início",
      href: "/dashboard",
      icon: HomeIcon,
      current: currentPage === "dashboard",
    },
    {
      name: "Empresas",
      href: "/dashboard/businesses",
      icon: BuildingOfficeIcon,
      current: currentPage === "businesses",
    },
    {
      name: "Usuários",
      href: "/dashboard/users",
      icon: UsersIcon,
      current: currentPage === "users",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Sidebar (agora no topo) */}
      <div
        className={`w-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out flex flex-row items-center justify-between`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center p-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            E-Commerce
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex flex-row space-x-2 p-4">
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
                <span className="ml-3">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white text-sm font-medium">A</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Admin
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              admin@email.com
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header removido, pois o sidebar está no topo */}
        {/* Dashboard Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
