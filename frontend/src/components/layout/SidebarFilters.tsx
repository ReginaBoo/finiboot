export function SidebarFilters() {
  return (
    <div className="flex p-5 text-fuchsia-50">
      <div className="flex flex-row gap-8 items-baseline w-full">
        <span className="font-semibold text-fuchsia-50 text-xl">Фильтры</span>
        <div className="flex flex-row gap-3 ml-auto ">
          <span className="font-semibold text-xs text-white/30">Применить</span>
          <span className="font-semibold text-xs text-white/30">Сбросить</span>
        </div>
      </div>
    </div>
  );
}
