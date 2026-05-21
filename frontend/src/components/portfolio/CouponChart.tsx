import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Brush
} from "recharts";

type CouponData = {
  month: string;  // Формат "YYYY-MM"
  amount: number;
};

export function CouponChart({ data }: { data: CouponData[] }) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const currentMonthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
  const targetEndMonthKey = `${currentYear + 1}-${String(currentMonth).padStart(2, '0')}`;

  // --- ЗАПОЛНЯЕМ ПРОПУЩЕННЫЕ МЕСЯЦЫ С ПОМОЩЬЮ USEMEMO ---
  const filledData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Превращаем массив от бэка в Map для моментального поиска по ключу "YYYY-MM"
    const dataMap = new Map<string, number>();
    data.forEach(item => dataMap.set(item.month, item.amount));

    // Находим самую раннюю и самую позднюю даты из бэкенда
    const sortedMonths = data.map(item => item.month).sort();
    const [startYear, startMonth] = sortedMonths[0].split('-').map(Number);
    const [endYear, endMonth] = sortedMonths[sortedMonths.length - 1].split('-').map(Number);

    const result: CouponData[] = [];

    // Создаем два объекта дат для цикла
    const startDate = new Date(startYear, startMonth - 1, 1);
    const endDate = new Date(endYear, endMonth - 1, 1);

    // Шагаем по каждому месяцу от начала до конца
    while (startDate <= endDate) {
      const yearStr = startDate.getFullYear();
      const monthStr = String(startDate.getMonth() + 1).padStart(2, '0');
      const monthKey = `${yearStr}-${monthStr}`;

      // Если у бэка есть данные — берем их сумму, если нет — ставим 0
      result.push({
        month: monthKey,
        amount: dataMap.has(monthKey) ? dataMap.get(monthKey)! : 0
      });

      // Переходим к следующему месяцу
      startDate.setMonth(startDate.getMonth() + 1);
    }

    return result;
  }, [data]);

  // --- РАСЧЕТ ИНДЕКСОВ (теперь по заполненному массиву filledData) ---
  let startIndex = filledData.findIndex(item => item.month >= currentMonthKey);
  if (startIndex === -1) startIndex = 0;

  let endIndex = filledData.findIndex(item => item.month >= targetEndMonthKey);
  if (endIndex === -1) endIndex = filledData.length - 1;

  return (
    <div className="coupon-chart-card">
      <h3 className="coupon-chart-title">Выплаты купонов</h3>

      <ResponsiveContainer width="100%" height={400}>
        {/* Передаем ИСПРАВЛЕННЫЕ данные filledData вместо data */}
        <BarChart data={filledData} margin={{ top: 20, right: 80, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />

          <XAxis
            dataKey="month"
            tickFormatter={(value) => {
              return new Date(value).toLocaleString('ru', { month: 'short' });
            }}
            tick={{ fontSize: 11, fill: '#666' }}
            axisLine={{ stroke: '#E0E0E0' }}
            interval={1} // Вернули 1, чтобы месяцы не наслаивались друг на друга, когда их станет много
            minTickGap={25}
          />

          <YAxis
            tick={{ fontSize: 12, fill: '#666' }}
            tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{ fill: 'rgba(72, 42, 105, 0.05)' }}
            formatter={(value: any) => [`${Number(value).toFixed(2)} ₽`, "Выплата"]}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />

          <Bar
            dataKey="amount"
            barSize={25}
            shape={(props: any) => {
              const { x, y, width, height, payload } = props;

              // Железно скрываем отрисовку столбика, если значение 0
              if (!payload || !payload.amount || payload.amount === 0) return <g />;

              const isPast = payload.month < currentMonthKey;
              const barColor = isPast ? "#D1C7D9" : "#8B759E";

              return (
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={barColor}
                  rx={6}
                  ry={6}
                />
              );
            }}
            label={(props: any) => {
              const { x, y, width, value, payload } = props;
              const numericValue = Number(value);

              if (!numericValue || numericValue === 0) return null;

              const isPast = payload && payload.month ? payload.month < currentMonthKey : false;

              return (
                <text
                  x={x + width / 2}
                  y={y - 10}
                  fill={isPast ? "#9E9E9E" : "#482A69"}
                  fontSize={10}
                  fontWeight="500"
                  textAnchor="middle"
                >
                  {numericValue >= 1000 ? `${(numericValue / 1000).toFixed(1)}k` : numericValue.toFixed(2)}
                </text>
              );
            }}
          />

          <Brush
            dataKey="month"
            height={15}
            stroke="#482A69"
            fill="#fff"
            startIndex={startIndex}
            endIndex={endIndex}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleString('ru', { month: 'short', year: '2-digit' }).replace(' г.', '');
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}