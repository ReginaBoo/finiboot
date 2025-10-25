export function SidebarNavigation() {
  return (
    <nav className="flex flex-col gap-4">
      <div className="text-2xl font-[Sofia-Sans] text-center py-5">
        <span className="text-[#B39BE3]">Fini</span>
        <span className="text-fuchsia-50">boot</span>
      </div>

      <button className="border-l-2 py-2 px-4 text-left hover:bg-purple-200 transition">Облигации</button>
      <button className="py-2 px-4 text-left rounded hover:bg-purple-200 transition">Портфель</button>
    </nav>
  );
}
