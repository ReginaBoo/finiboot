interface SidebarFiltersProps {
  isCollapsed: boolean;
}

export function SidebarFilters({ isCollapsed }: SidebarFiltersProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex p-6 text-fuchsia-50">
        <div className="flex flex-row gap-8 items-baseline w-full">
          {!isCollapsed && (
            <span className="text-center font-semibold text-fuchsia-50 text-xl">Фильтры</span>
          )}
        </div>
      </div>
    </div>
  );
}