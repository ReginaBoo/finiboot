import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarFilters } from "./SidebarFilters";


interface LayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 bg-white border-r p-4">
        <SidebarNavigation />
      </div>
      <div className="w-64 bg-gray-100 border-r p-4">
        <SidebarFilters />
      </div>
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
