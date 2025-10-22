export function SidebarNavigation() {
  return (
    <nav className="flex flex-col gap-4">
      <button className="py-2 px-4 text-left rounded hover:bg-purple-200 transition">Список облигаций</button>
      <button className="py-2 px-4 text-left rounded hover:bg-purple-200 transition">Портфель</button>
    </nav>
  );
}
