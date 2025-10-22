export function SidebarFilters() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold text-gray-700">Фильтры</h3>

      <div>
        <label className="block text-sm">Доходность %</label>
        <input type="number" className="w-full mt-1 p-2 border rounded" placeholder="от 0 до 10" />
      </div>

      <div>
        <label className="block text-sm">Дата погашения</label>
        <input type="date" className="w-full mt-1 p-2 border rounded" />
      </div>

      <button className="mt-4 py-2 px-4 bg-purple-500 text-white rounded hover:bg-purple-600 transition">
        Применить
      </button>
    </div>
  );
}
