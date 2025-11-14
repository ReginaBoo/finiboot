import { useState } from "react";
import type { Coupon } from "../../types/bond";

interface CouponListProps {
  coupons: Coupon[];
  bondNominal: number;
}

export const CouponList = ({ coupons, bondNominal }: CouponListProps) => {
  const [showFutureCoupons, setShowFutureCoupons] = useState(false);
  const [showPastCoupons, setShowPastCoupons] = useState(false);

  const today = new Date();

  const sortedCoupons = [...coupons].sort(
    (a, b) => new Date(b.coupon_date).getTime() - new Date(a.coupon_date).getTime()
  );

  const pastCoupons = sortedCoupons.filter(c => new Date(c.coupon_date) < today);
  const futureCoupons = sortedCoupons.filter(c => new Date(c.coupon_date) >= today);

  const displayCoupons = [
    ...(showFutureCoupons ? futureCoupons : futureCoupons.slice(-2)),
    ...(showPastCoupons ? pastCoupons : pastCoupons.slice(0, 2))
  ];

  const remainingFuture = futureCoupons.length - (showFutureCoupons ? futureCoupons.length : 2);
  const remainingPast = pastCoupons.length - (showPastCoupons ? pastCoupons.length : 2);
  if (coupons.length === 0) return null;

  return (
    <div className=" p-5 border-t border-[#482A69]/10 ">
      {/* Таблица заголовков */}
      <div className="grid grid-cols-3 gap-2 font-medium text-md text-[#482A69]  pb-4">
        <div className="col-span-1 text-center" >Дата выплаты</div>
        <div className="col-span-1 text-center mr-5" >Купон</div>
        <div className="col-span-1 text-center mr-10" >Ставка</div>
      </div>

      <div className="my-2">
        {!showFutureCoupons && remainingFuture > 0 && (
          <button
            className="text-sm text-[#482A69]/80 hover:text-[#482A69] font-medium text-left"
            onClick={() => setShowFutureCoupons(true)}
          >
            Еще {remainingFuture} будущих выплат
          </button>
        )}
      </div>
      {/* Список купонов */}
      <div className="flex flex-col gap-1 max-h-70 overflow-y-scroll">
        {displayCoupons.map(coupon => {
          const couponDate = new Date(coupon.coupon_date);
          const isPast = couponDate < today;

          return (
            <div
              key={coupon.coupon_id}
              className={`grid grid-cols-3 py-2 rounded border border-[#482A69]/30 text- ${isPast ? "text-[#482A69]/50" : " text-[#482A69]"
                }`}
            >
              <div className="col-span-1 text-center" >{couponDate.toLocaleDateString("ru-RU")}</div>
              <div className="col-span-1 text-center" >{coupon.pay_one_bond.toLocaleString("ru-RU")} ₽</div>
              <div className="col-span-1 text-center" >
                {((coupon.pay_one_bond / bondNominal) * 100).toFixed(2)} %
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2">
        {!showPastCoupons && remainingPast > 0 && (
          <button
            className="text-sm text-[#482A69]/80 hover:text-[#482A69] font-medium text-left"
            onClick={() => setShowPastCoupons(true)}
          >
            Еще {remainingPast} прошлых выплат
          </button>
        )}

      </div>
    </div>
  );
};
