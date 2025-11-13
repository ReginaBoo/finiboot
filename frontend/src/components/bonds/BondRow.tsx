import type { Bond } from '../../types/bond';
import { useState } from "react";
import { HiOutlineChevronDoubleDown, HiOutlineChevronDoubleUp } from "react-icons/hi2";

interface BondRowProps {
  bond: Bond;
}

const getBondTypeName = (type: string | number | null | undefined): string => {
  switch (type) {
    case "BOND_TYPE_UNSPECIFIED":
    case 0:
      return "Тип не определён";
    case "BOND_TYPE_REPLACED":
    case 1:
      return "Замещающая облигация";
    default:
      return "Другой тип";
  }
};

const translateSector = (sector?: string): string => {
  const map: Record<string, string> = {
    government: "Государственные облигации",
    financial: "Финансовый сектор",
    industrials: "Промышленность",
    consumer: "Потребительский сектор",
    materials: "Сырьевой сектор",
    energy: "Энергетика",
    utilities: "Коммунальные услуги",
    real_estate: "Недвижимость",
    it: "Информационные технологии",
    telecom: "Телекоммуникации",
    health_care: "Здравоохранение",
    municipal: "Муниципальные облигации",
    other: "Прочее",
  };

  return map[sector ?? ""] || "Неизвестно";
};

export const BondRow = ({ bond }: BondRowProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={` mb-2 transition-all duration-300 ${isOpen ? "border-1  border-[#482A69]/30 rounded-xl shadow-[0px_0px_15px_rgba(72,42,105,0.2)] " : "hover:shadow-[0px_0px_15px_rgba(72,42,105,0.2)] hover:rounded-xl"}`}>
      <div className={`grid grid-cols-13 gap-4 px-6 py-4 ${isOpen ? " border-b-1 border-[#482A69]/10" : ""}`}>
        {/* Название и тикер */}
        <div className="col-span-2 text-left">
          <p className="font-medium text-[#482A69]">{bond.name}</p>
          <p className="text-sm text-[#482A69]/60 mt-1">{bond.isin}</p>
        </div>

        {/* Номинал */}
        <div className="col-span-2 text-center">
          <p className="font-medium text-[#482A69]">
            {bond.nominal.toLocaleString('ru-RU')} ₽
          </p>
        </div>


        {/* Купон */}
        <div className="col-span-2 text-center">
          <p className="font-medium text-[#482A69]">
            {bond.coupon_quantity_per_year}
          </p>

        </div>
        {/* Сектор */}
        <div className="col-span-2 text-center">
          <p className="font-medium text-[#482A69]">
            {translateSector(bond.sector)}
          </p>
        </div>

        {/* Дата выпуска */}
        <div className="col-span-2  text-center">
          <p className="text-[#482A69]">
            {new Date(bond.placement_date).toLocaleDateString('ru-RU')}
          </p>
        </div>

        {/* Дата погашения */}
        <div className="col-span-2 text-center">
          <p className="text-[#482A69]">
            {bond.perpetual_flag
              ? "-"
              : bond.maturity_date
                ? new Date(bond.maturity_date).toLocaleDateString('ru-RU')
                : "-"}
          </p>
        </div>


        <div className="col-span-1 text-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="text-[#482A69] transition p-2 cursor-pointer hover:text-[#231136]"
          >
            {isOpen ? <HiOutlineChevronDoubleDown size={20} /> : <HiOutlineChevronDoubleUp size={20} />}
          </button>
        </div>
      </div>
      {
        isOpen && (
          <div className=" p-5 text-sm text-[#482A69] animate-fadeIn">
            <div className="grid grid-cols-3 w-full justify-between">
              <div className="text-left font-medium" >
                <p><span className="text-[#482A69]/60">TICKER:</span> {bond.ticker || "—"}</p>
                <p><span className="text-[#482A69]/60">FIGI:</span> {bond.figi || "—"}</p>
                <p><span className="text-[#482A69]/60">Тип:</span> {getBondTypeName(bond.bond_type)}</p>
              </div>
              <div className="text-left font-medium">
                <p><span className=" text-[#482A69]/60">Страна:</span> {bond.country_of_risk_name || "—"}</p>
                <p><span className=" text-[#482A69]/60">Валюта:</span> {bond.currency}</p>
                <p><span className=" text-[#482A69]/60">Можно купить:</span> {bond.buy_available_flag ? "Да" : "Нет"}</p>
              </div>
              <div className="font-medium text-left">
                <p><span className=" text-[#482A69]/60">Можно продать:</span> {bond.sell_available_flag ? "Да" : "Нет"}</p>
                <p><span className=" text-[#482A69]/60">Амортизация:</span> {bond.amortization_flag ? "Да" : "Нет"}</p>
                <p><span className=" text-[#482A69]/60">Бессрочная облигация:</span> {bond.perpetual_flag ? "Да" : "Нет"}</p>
              </div>
            </div>
          </div>
        )
      }
    </div >

  );
};