import { useEffect, useState } from "react";
import axios from "axios";
import { AppLayout } from "../components/layout/AppLayout";

interface Bond {
  id: number;
  name: string;
  issuer: string;
  coupon_rate: number;
  price: number;
  maturity_date: string;
}

export default function BondsPage() {
  const [bonds, setBonds] = useState<Bond[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    axios.get("http://localhost:8080/bonds/bonds", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => setBonds(res.data))
      .catch(err => {
        if (err.response?.status === 401) {
          alert("Пожалуйста, войдите в систему");
        } else {
          console.error(err);
        }
      });
  }, []);

  return (
    <AppLayout>
      <div className="p-8 text-[#482A69]">
        <h1 className="text-3xl font-semibold mb-6">Список облигаций</h1>
        <ul className="space-y-4">
          {bonds.map(b => (
            <li key={b.id} className="border-b border-gray-300 pb-2">
              <p className="text-xl">{b.name}</p>
              <p className="text-sm text-gray-500">{b.issuer}</p>
              <p>Купон: {b.coupon_rate}% — Цена: {b.price}</p>
              <p>Погашение: {new Date(b.maturity_date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </div>

    </AppLayout>
  );
}
