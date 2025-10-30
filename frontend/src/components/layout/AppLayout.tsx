import type { ReactNode } from "react";
import { useState } from "react";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarFilters } from "./SidebarFilters";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  const [isNavHovered, setIsNavHovered] = useState(false);

  return (
    <div className="flex h-screen w-screen">
      {/* Левое главное меню */}
      <div
        className="relative h-full"
        onMouseEnter={() => setIsNavHovered(true)}
        onMouseLeave={() => setIsNavHovered(false)}
      >
        <aside className={`
          ${isNavHovered ? 'min-w-[150px] max-w-[150px]' : 'min-w-[50px] max-w-[50px]'} 
          bg-[#331B4C] text-white flex flex-col transition-all duration-300 h-full
        `}>
          <SidebarNavigation isExpanded={isNavHovered} />
        </aside>
      </div>



      <div className="relative h-full">
        {/* Левая панель фильтров */}
        <aside className={`
        ${isFiltersCollapsed ? 'min-w-[20px] max-w-[20px]' : 'min-w-[280px] max-w-[280px]'} 
        bg-[#482A69] flex flex-col transition-all duration-300 h-full
      `}>
          <SidebarFilters
            isCollapsed={isFiltersCollapsed}
          />
        </aside>

        {/* Кнопка сворачивания фильтров */}
        <button
          onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
          className="absolute -right-3 top-7 w-6 h-6 bg-[#482A69] rounded-full border-2 border-white shadow-lg grid place-items-center text-white text-sm pt-0  hover:bg-[#5a3480] transition-colors z-10 ">
        </button>
      </div>

      {/* Основной контент */}
      <main className="flex-1 overflow-auto  bg-gray-50">
        {children}
      </main>
    </div >
  );
}
