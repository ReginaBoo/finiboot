import { SECTORS, COUPON_OPTIONS } from "../../assets/translator";
import { HiXMark } from "react-icons/hi2";
import { FilterSelect } from "../bonds/FilterSelect";

interface SidebarFiltersProps {
  isCollapsed: boolean;
  filters: {
    sector: string;
    couponQuantity: number;
    floatingCoupon: boolean | null;
    amortization: boolean | null;
  };
  onFilterChange: (newFilters: any) => void;
}

export function SidebarFilters({ isCollapsed, filters, onFilterChange }: SidebarFiltersProps) {
  if (isCollapsed) return null;

  const activeSectorName = SECTORS.find(s => s.id === filters.sector)?.name;
  const activeQuantity = COUPON_OPTIONS.find(s => s.id === filters.couponQuantity)?.name;
  return (
    <div className="flex flex-col h-full text-fuchsia-50">
      <div className="p-6 flex justify-between items-center">
        <span className="font-semibold text-xl">Фильтры</span>
        <button
          onClick={() => onFilterChange({ sector: "", couponQuantity: 0, floatingCoupon: null, amortization: null })}
          className="text-xs text-[#775B96] hover:text-white transition-colors cursor-pointer"
        >
          Сбросить
        </button>
      </div>

      <div className="px-4 flex flex-col gap-6">

        {/* Выбор Сектора */}
        <FilterSelect
          options={SECTORS}
          selectedValue={filters.sector}
          onSelect={(val) => onFilterChange({ ...filters, sector: filters.sector === val ? "" : val })}
          placeholder="Сектор"
        />

        {filters.sector && (
          <div className="flex items-center gap-2 px-4 py-2 bg-[#775B96]/50 border border-white rounded-full text-xs font-bold text-white  animate-in fade-in zoom-in duration-200 w-fit">
            <span className="truncate max-w-[180px]">{activeSectorName}</span>
            <HiXMark
              className="cursor-pointer hover:text-white"
              onClick={() => onFilterChange({ ...filters, sector: "" })}
            />
          </div>
        )}

        {/* Выбор Количества выплат */}
        <FilterSelect
          options={COUPON_OPTIONS}
          selectedValue={filters.couponQuantity}
          onSelect={(val) => onFilterChange({ ...filters, couponQuantity: val })}
          placeholder="Количество выплат в год"
        />

        {filters.couponQuantity > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-[#775B96]/50 border border-white rounded-full text-xs font-bold text-white animate-in fade-in zoom-in duration-200 w-fit">
            <span className="truncate max-w-[180px]">{activeQuantity}</span>
            <HiXMark
              className="cursor-pointer hover:text-white"
              onClick={() => onFilterChange({ ...filters, couponQuantity: 0 })}
            />
          </div>
        )}


        {/* Чекбоксы */}
        <div className="flex flex-col gap-4 pt-2 border-t border-white/5">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={!!filters.amortization}
              onChange={(e) => onFilterChange({ ...filters, amortization: e.target.checked || null })}
              className="w-4 h-4  cursor-pointer"
            />
            <span className="text-sm  transition-colors font-medium">Амортизация</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={!!filters.floatingCoupon}
              onChange={(e) => onFilterChange({ ...filters, floatingCoupon: e.target.checked || null })}
              className="w-4 h-4  cursor-pointer"
            />
            <span className="text-sm  transition-colors font-medium">Плавающий купон</span>
          </label>
        </div>
      </div>
    </div>
  );
}