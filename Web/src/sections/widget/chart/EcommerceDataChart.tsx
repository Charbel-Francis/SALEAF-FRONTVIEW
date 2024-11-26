import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface EcommerceDataChartProps {
  color: string;
  data?: any[]; // Replace with actual data type if available
}

const sampleData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 500 },
  { name: 'Apr', value: 200 },
  { name: 'May', value: 700 }
];

const EcommerceDataChart: React.FC<EcommerceDataChartProps> = ({ color, data = sampleData }) => {
  return (
    <ResponsiveContainer width="100%" height={50}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EcommerceDataChart;
