import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Area } from 'recharts';
import { useTheme } from '@mui/material/styles';

interface MonthlyDonation {
  year: number;
  month: number;
  totalEarnings: number;
}

interface RepeatCustomerChartProps {
  monthlyDonations: MonthlyDonation[];
}

const RepeatCustomerChart: React.FC<RepeatCustomerChartProps> = ({ monthlyDonations }) => {
  const theme = useTheme();

  // Function to fill in missing months
  const fillMissingMonths = (donations: MonthlyDonation[]): MonthlyDonation[] => {
    if (donations.length === 0) return [];

    const year = donations[0].year; // Get the year from the first donation
    const filledData: MonthlyDonation[] = [];

    // Create array for all 12 months
    for (let month = 1; month <= 12; month++) {
      const existingDonation = donations.find((d) => d.month === month && d.year === year);
      filledData.push({
        year,
        month,
        totalEarnings: existingDonation ? existingDonation.totalEarnings : 0
      });
    }

    return filledData;
  };

  // Get month name helper function
  function getMonthName(monthNumber: number): string {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('default', { month: 'short' });
  }

  // Fill missing months and prepare chart data
  const filledMonthlyDonations = fillMissingMonths(monthlyDonations);
  const chartData = filledMonthlyDonations
    .sort((a, b) => a.month - b.month)
    .map((donation) => ({
      name: `${getMonthName(donation.month)}/${donation.year}`,
      totalEarnings: donation.totalEarnings
    }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 50, right: 30, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorTotalEarnings" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
            <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <XAxis dataKey="name" stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }} />
        <YAxis stroke={theme.palette.text.secondary} tickFormatter={(value) => `R${value.toLocaleString()}`} />
        <Tooltip
          formatter={(value: number) => [`R${value.toLocaleString()}`, 'Total Earnings']}
          labelFormatter={(label: string) => `Month: ${label}`}
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`
          }}
        />
        <Legend
          verticalAlign="top"
          height={36}
          wrapperStyle={{
            paddingTop: '20px'
          }}
        />

        <Area type="monotone" dataKey="totalEarnings" stroke={theme.palette.primary.main} fillOpacity={1} fill="url(#colorTotalEarnings)" />

        <Line
          type="monotone"
          dataKey="totalEarnings"
          stroke={theme.palette.primary.main}
          strokeWidth={2}
          dot={{
            r: 5,
            stroke: theme.palette.background.paper,
            strokeWidth: 2,
            fill: theme.palette.primary.main
          }}
          activeDot={{
            r: 8,
            stroke: theme.palette.background.paper,
            strokeWidth: 2,
            fill: theme.palette.primary.main
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RepeatCustomerChart;
