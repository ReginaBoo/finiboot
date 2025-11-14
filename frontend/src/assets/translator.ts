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
