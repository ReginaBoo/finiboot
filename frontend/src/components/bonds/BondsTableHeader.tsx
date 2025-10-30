export const BondsTableHeader = () => {
  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 rounded-t-lg border-b border-gray-100">
      <div className="col-span-4 font-semibold text-gray-600">Название, эмитент</div>
      <div className="col-span-2 font-semibold text-gray-600 text-right">Номинал</div>
      <div className="col-span-2 font-semibold text-gray-600 text-right">Купон</div>
      <div className="col-span-2 font-semibold text-gray-600 text-right">Дата выпуска</div>
      <div className="col-span-2 font-semibold text-gray-600 text-right">Погашение</div>
    </div>
  );
};