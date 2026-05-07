export const translateCouponType = (type?: string | number): string => {
  switch (type) {
    case "COUPON_TYPE_UNSPECIFIED":
    case 0:
      return "Неопределённый";
    case "COUPON_TYPE_CONSTANT":
    case 1:
      return "Постоянный";
    case "COUPON_TYPE_FLOATING":
    case 2:
      return "Плавающий";
    case "COUPON_TYPE_DISCOUNT":
    case 3:
      return "Дисконт";
    case "COUPON_TYPE_MORTGAGE":
    case 4:
      return "Ипотечный";
    case "COUPON_TYPE_FIX":
    case 5:
      return "Фиксированный";
    case "COUPON_TYPE_VARIABLE":
    case 6:
      return "Переменный";
    case "COUPON_TYPE_OTHER":
    case 7:
      return "Прочее";
    default:
      return "Неизвестно";
  }
};


export const translateSector = (sector?: string): string => {
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

export const SECTORS = [
  { id: 'government', name: 'Государственные' },
  { id: 'financial', name: 'Финансовый сектор' },
  { id: 'industrials', name: 'Промышленность' },
  { id: 'consumer', name: 'Потребительский сектор' },
  { id: 'materials', name: 'Сырьевой сектор' },
  { id: 'energy', name: 'Энергетика' },
  { id: 'utilities', name: 'Коммунальные услуги' },
  { id: 'real_estate', name: 'Недвижимость' },
  { id: 'it', name: 'ИТ' },
  { id: 'telecom', name: 'Телекоммуникации' },
  { id: 'health_care', name: 'Здравоохранение' },
  { id: 'municipal', name: 'Муниципальные облигации' },
  { id: 'other', name: 'Прочее' },
];


export const COUPON_OPTIONS = [
  { id: 1, name: "1 раз в год" },
  { id: 2, name: "2 раза в год" },
  { id: 4, name: "4 раза в год" },
  { id: 12, name: "12 раз в год" },
];

export const getBondTypeName = (type: string | number | null | undefined): string => {
  switch (type) {
    case "BOND_TYPE_UNSPECIFIED":
    case 0:
      return "Не определён";
    case "BOND_TYPE_REPLACED":
    case 1:
      return "Замещающая облигация";
    default:
      return "Другой тип";
  }
};
