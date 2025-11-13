import { useNavigate, useLocation } from "react-router-dom";
import { PiListMagnifyingGlassFill } from "react-icons/pi";
import { HiOutlineBriefcase } from "react-icons/hi2";

interface SidebarNavigationProps {
  isExpanded: boolean;
  onLogoClick: () => void;
}

export function SidebarNavigation({ isExpanded, onLogoClick }: SidebarNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;


  return (
    <nav className="flex flex-col gap-2 h-full">
      <button
        onClick={onLogoClick}
        className="text-2xl cursor-pointer font-[Sofia-Sans] text-center py-6 flex items-center justify-center transition-colors w-full"
      >
        {isExpanded ? (
          <>
            <span className="text-[#B39BE3]">Fini</span>
            <span className="text-fuchsia-50">boot</span>
          </>
        ) : (
          <>
            <span className="text-[#B39BE3] text-2xl">F</span>
            <span className="text-fuchsia-50 text-2xl">b</span>
          </>
        )}
      </button>

      {/* Навигационные кнопки */}
      <div className="flex-1 flex flex-col">
        <button
          onClick={() => handleNavigation('/bonds')}
          className={`border-l-2 py-3 px-2 text-left hover:bg-gradient-to-r cursor-pointer from-[#9775B9] to-[#331B4C]  hover:border-l-[#EEDEFE] transition ${isExpanded ? '  px-4' : ''
            } ${isActive('/bonds') ? 'bg-gradient-to-r from-[#9775B9] to-[#331B4C] font-bold  border-l-[#EEDEFE]' : 'border-transparent '
            }`}
        >
          {isExpanded ? "Облигации" : <PiListMagnifyingGlassFill size={24} />}
        </button>

        <button
          onClick={() => handleNavigation('/portfolio')}
          className={`border-l-2 py-3 px-2 text-left hover:bg-gradient-to-r from-[#9775B9] cursor-pointer to-[#331B4C]  hover:border-l-[#EEDEFE] transition  ${isExpanded ? 'px-4 ' : ''
            } ${isActive('/portfolio') ? ' mb-4 bg-gradient-to-r from-[#9775B9] to-[#331B4C] font-medium  border-l-[#EEDEFE]' : 'border-transparent'
            }`}
        >
          {isExpanded ? "Портфель" : < HiOutlineBriefcase size={24} />}
        </button>
      </div>
    </nav >
  );
}