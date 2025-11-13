import type { ReactNode } from "react";
import { useState } from "react";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarFilters } from "./SidebarFilters";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState<boolean>(() => {
    const saved = localStorage.getItem("isNavExpanded");
    return saved ? JSON.parse(saved) : false;
  });

  const toggleNav = () => {
    const newState = !isNavExpanded;
    setIsNavExpanded(newState);
    localStorage.setItem("isNavExpanded", JSON.stringify(newState));
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Левое главное меню */}
      <div className="relative h-full">
        <aside className={`
          ${isNavExpanded ? 'min-w-[150px] max-w-[150px]' : 'min-w-[50px] max-w-[50px]'} 
          bg-[#331B4C] text-white flex flex-col transition-all duration-300 h-full
        `}>
          <SidebarNavigation
            isExpanded={isNavExpanded}
            onLogoClick={toggleNav}
          />
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
          className="absolute cursor-pointer -right-3 top-7 w-6 h-6 bg-[#482A69] rounded-full border-2 border-white shadow-lg grid place-items-center text-white text-sm pt-0  hover:bg-[#5a3480] transition-colors z-10 ">
          {isFiltersCollapsed ? < HiOutlineChevronRight /> : < HiOutlineChevronLeft />}
        </button>
      </div>

      {/* Основной контент */}
      <main className="flex-1 overflow-auto  bg-gray-50">
        {children}
      </main>
    </div >
  );
}
