import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Brush, Cell
} from "recharts";

type CouponData = {
  month: string;
  amount: number;
};

export function CouponChart({ data }: { data: CouponData[] }) {
  const currentDate = new Date();
  const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const getBarColor = (monthKey: string) => {
    return monthKey < currentMonthKey ? "#D1C7D9" : "#8B759E";
  };
  return (
    <div className="coupon-chart-card">
      <h3 className="coupon-chart-title">Выплаты купонов</h3>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 80, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />

          <XAxis
            dataKey="month"
            tickFormatter={(value) => {
              return new Date(value).toLocaleString('ru', { month: 'short' });
            }}
            tick={{ fontSize: 11, fill: '#666' }}
            axisLine={{ stroke: '#E0E0E0' }}


            interval={1}
            minTickGap={20}
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
            radius={[6, 6, 0, 0]}
            barSize={25}
            label={(props: any) => {
              const { x, y, width, value, index } = props;
              const numericValue = Number(value);
              if (!numericValue || numericValue === 0) return null;

              const isPast = data[index].month < currentMonthKey;

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
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.month)} />
            ))}
          </Bar>

          <Brush
            dataKey="month"
            height={15}
            stroke="#482A69"
            fill="#fff"

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