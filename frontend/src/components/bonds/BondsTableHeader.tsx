export const BondsTableHeader = () => {
  return (
    <div className="grid grid-cols-13 gap-4 px-6 py-4 mr-4 text-[#331B4C] font-bold rounded-lg ">
      <div className="col-span-2  text-left">Название, тикер</div>
      <div className="col-span-2 text-center">Номинал</div>
      <div className="col-span-2 text-center">Кол-во выплат</div>
      <div className="col-span-2 text-center">Сектор</div>
      <div className="col-span-2  text-center">Дата выпуска</div>
      <div className="col-span-2  text-center">Погашение</div>
      <div className="col-span-1 text-center"></div>
    </div>
  );
};