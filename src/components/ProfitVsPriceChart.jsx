import React, { useMemo, useContext } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCompactNumber, formatCurrency } from '@/lib/utils';
import { DashboardContext } from '@/context/DashboardContext';

const ProfitVsPriceChart = () => {
  const { data, filters } = useContext(DashboardContext);

  const filteredData = useMemo(() => {
    return data.filter(item =>
      (!filters.revenue || (item['TTM Revenue'] >= filters.revenue[0] && item['TTM Revenue'] <= filters.revenue[1])) &&
      (!filters.profit || (item['TTM Profit'] >= filters.profit[0] && item['TTM Profit'] <= filters.profit[1])) &&
      (!filters.price || (item['Asking Price'] >= filters.price[0] && item['Asking Price'] <= filters.price[1])) &&
      (!filters.businessType || filters.businessType === 'all' || item['Business Type'] === filters.businessType)
    );
  }, [data, filters]);

  const calculateDomain = (data, key, buffer = 0.1) => {
    if (data.length === 0) return [0, 1]; // Default domain if no data
    const minValue = Math.min(...data.map(item => item[key]));
    const maxValue = Math.max(...data.map(item => item[key]));
    const range = maxValue - minValue;
    return [
      minValue - range * buffer,
      maxValue + range * buffer
    ];
  };

  const profitDomain = useMemo(() => calculateDomain(filteredData, 'TTM Profit'), [filteredData]);
  const priceDomain = useMemo(() => calculateDomain(filteredData, 'Asking Price'), [filteredData]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 80 }}>
        <CartesianGrid />
        <XAxis
          type="number"
          dataKey="TTM Profit"
          name="Profit"
          unit="$"
          domain={profitDomain}
          tickFormatter={(value) => formatCompactNumber(value)}
        />
        <YAxis
          type="number"
          dataKey="Asking Price"
          name="Price"
          unit="$"
          domain={priceDomain}
          tickFormatter={(value) => formatCompactNumber(value)}
        />
        <Tooltip
          formatter={(value, name) => [formatCurrency(value), name]}
          labelFormatter={() => ''}
        />
        <Scatter name="Profit vs Price" data={filteredData} fill="#82ca9d" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default ProfitVsPriceChart;