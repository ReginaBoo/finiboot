// components/layout/SidebarNavigation.tsx
interface SidebarNavigationProps {
  isExpanded: boolean;
}

export function SidebarNavigation({ isExpanded }: SidebarNavigationProps) {
  return (
    <nav className="flex flex-col gap-4 h-full">

      <div className="text-2xl font-[Sofia-Sans] text-center py-6 flex items-center justify-center">
        {isExpanded ? (
          <>
            <span className="text-[#B39BE3]">Fini</span>
            <span className="text-fuchsia-50">boot</span>
          </>
        ) : (
          <>
            <span className="text-[#B39BE3] text-2xl ">F</span>
            <span className="text-fuchsia-50 text-2xl ">b</span>
          </>
        )}
      </div>

      {/* Навигационные кнопки */}
      <div className="flex-1 flex flex-col px-2">
        <button
          className={`border-l-2 py-2 px-4 text-left hover:bg-purple-200 transition  ${isExpanded ? 'px-4' : ''
            }`}
        >
          {isExpanded ? "Облигации" : ""}
        </button>

        <button
          className={`py-3 text-left  hover:bg-purple-200 transition ${isExpanded ? 'px-4' : ''
            }`}
        >
          {isExpanded ? "Портфель" : ""}
        </button>
      </div>
    </nav>
  );
}