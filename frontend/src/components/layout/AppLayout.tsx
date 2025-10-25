// components/layout/AppLayout.tsx
import type { ReactNode } from "react";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarFilters } from "./SidebarFilters";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen w-screen">
      {/* Левое главное меню */}
      <aside className="min-w-[100px] max-w-[250px] w-auto bg-[#331B4C] text-white flex flex-col">
        <SidebarNavigation />
      </aside>

      {/* Левая панель фильтров */}
      <aside className="w-auto min-w-[240px] bg-[#482A69] flex flex-col">
        <SidebarFilters />
      </aside>

      {/* Основной контент */}
      <main className="flex-1 overflow-auto p-6 bg-gray-50">
        {children}
      </main>
    </div>
  );
}
