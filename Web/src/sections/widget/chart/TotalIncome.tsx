import React from 'react';
import { Card, Typography, Box, Divider, useTheme, alpha } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface MonthlyDonation {
  year: number;
  month: number;
  totalEarnings: number;
}

interface TotalIncomeProps {
  monthlyDonations: MonthlyDonation[];
}

const TotalIncome: React.FC<TotalIncomeProps> = ({ monthlyDonations }) => {
  const theme = useTheme();

  // Function to fill in missing months
  const fillMissingMonths = (donations: MonthlyDonation[]): MonthlyDonation[] => {
    if (donations.length === 0) return [];

    const year = donations[0].year;
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

  function getMonthName(monthNumber: number): string {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('default', { month: 'short' });
  }

  // Calculate some statistics
  const filledMonthlyDonations = fillMissingMonths(monthlyDonations);
  const totalEarnings = getTotalEarnings(monthlyDonations);
  const averageMonthly = totalEarnings / monthlyDonations.length;

  const chartData = filledMonthlyDonations
    .sort((a, b) => a.month - b.month)
    .map((donation) => ({
      name: `${getMonthName(donation.month)}`,
      Income: donation.totalEarnings,
      Average: averageMonthly
    }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            boxShadow: theme.shadows[3]
          }}
        >
          <Typography variant="subtitle2" color="textSecondary">
            {label} {filledMonthlyDonations[0].year}
          </Typography>
          <Typography variant="body1" fontWeight="bold" color="primary">
            Income: R{payload[0].value.toLocaleString()}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        height: '100%'
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <TrendingUpIcon color="primary" />
          <Typography variant="h6" fontWeight="600">
            Total Income
          </Typography>
        </Box>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.5)} vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              tickFormatter={(value) => `R${value.toLocaleString()}`}
            />
            <Tooltip content={CustomTooltip} />
            <Bar dataKey="Income" fill="url(#incomeGradient)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Total Earnings
            </Typography>
            <Typography variant="h4" fontWeight="700" color="primary">
              R{totalEarnings.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="textSecondary">
              Monthly Average
            </Typography>
            <Typography variant="h6" fontWeight="600" color="text.secondary">
              R
              {averageMonthly.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

function getTotalEarnings(monthlyDonations: MonthlyDonation[]): number {
  return monthlyDonations.reduce((acc, donation) => acc + donation.totalEarnings, 0);
}

export default TotalIncome;
