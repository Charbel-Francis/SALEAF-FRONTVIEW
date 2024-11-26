import React, { useEffect, useState } from 'react';
import {
  useTheme,
  Grid,
  Stack,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Divider,
  Paper,
  alpha
} from '@mui/material';
import axios from 'utils/axios';

import RepeatCustomerRate from 'sections/widget/chart/RepeatCustomerRate';
import Transactions from 'sections/widget/data/Transactions';
import TotalIncome from 'sections/widget/chart/TotalIncome';

// Import icons
import { ArrowDown, ArrowUp, Book, Calendar, CloudChange, Wallet3 } from 'iconsax-react';

// Keep your existing interfaces
interface MonthlyDonation {
  year: number;
  month: number;
  totalEarnings: number;
}

interface DonationTransaction {
  id: number;
  amount: number;
  currency: string;
  paymentId: string;
  isPaid: boolean;
  createdAt: string;
  isAnonymous: boolean;
  appUserId: string;
  appUser: any;
}

interface DashboardData {
  allDonationsAmount: number;
  totalEarningsMonth: number;
  numberOfEvents: number;
  numberOfStudents: number;
  monthlyDonations: MonthlyDonation[];
  donationsTransactions: DonationTransaction[];
}

interface StyledStatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  subtitle?: string;
  trend?: number;
}

const StyledStatCard: React.FC<StyledStatCardProps> = ({ title, value, icon: Icon, color = 'primary', subtitle, trend }) => {
  const theme = useTheme();

  // Enhanced styles for the card
  const cardStyles = {
    height: '100%',
    position: 'relative',
    overflow: 'visible',
    transition: theme.transitions.create(['box-shadow', 'transform']),
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[8],
      '& .icon-container': {
        transform: 'scale(1.1)'
      }
    }
  };

  // Styles for the floating icon container
  const iconContainerStyles = {
    position: 'absolute',
    top: -16,
    left: 20,
    backgroundColor: theme.palette[color].main,
    borderRadius: 2,
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0 8px 16px ${alpha(theme.palette[color].main, 0.24)}`,
    transition: theme.transitions.create('transform'),
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 2,
      background: `linear-gradient(135deg, ${alpha(theme.palette[color].light, 0.2)} 0%, ${alpha(theme.palette[color].dark, 0.2)} 100%)`
    }
  };

  // Content container styles
  const contentStyles = {
    pt: 4,
    pb: '16px !important',
    px: 3,
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(135deg, ${alpha(theme.palette[color].light, 0.05)} 0%, transparent 100%)`,
      borderRadius: theme.shape.borderRadius,
      pointerEvents: 'none'
    }
  };

  // Trend indicator styles
  const getTrendColor = () => {
    if (!trend) return 'inherit';
    return trend > 0 ? theme.palette.success.main : theme.palette.error.main;
  };

  return (
    <Card sx={cardStyles}>
      <Box className="icon-container" sx={iconContainerStyles}>
        <Icon sx={{ fontSize: 24, color: 'common.white' }} />
      </Box>

      <CardContent sx={contentStyles}>
        <Typography
          variant="subtitle2"
          color="textSecondary"
          sx={{
            mb: 0.5,
            fontSize: '0.875rem',
            fontWeight: 500,
            letterSpacing: '0.1px'
          }}
        >
          {title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '-0.5px'
            }}
          >
            {value}
          </Typography>

          {trend !== undefined && (
            <Typography
              variant="subtitle2"
              sx={{
                color: getTrendColor(),
                display: 'flex',
                alignItems: 'center',
                fontWeight: 600
              }}
            >
              {trend > 0 ? '+' : ''}
            </Typography>
          )}
        </Box>

        {subtitle && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1, fontSize: '0.75rem' }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardDefault: React.FC = () => {
  const theme = useTheme();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axios.get<DashboardData>('/api/DashBoard');
      setDashboardData(response.data);
      console.log('Dashboard data:', response.data);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch dashboard data.');
      setSnackbar({
        open: true,
        message: 'Failed to fetch dashboard data.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      notation: amount >= 1000000 ? 'compact' : 'standard',
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!dashboardData) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No data available.
      </Alert>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} lg={3}>
          <StyledStatCard
            title="Total Donations"
            value={formatAmount(dashboardData.allDonationsAmount)}
            icon={Wallet3}
            color="primary"
            subtitle="Total amount of donations received"
            trend={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StyledStatCard
            title="Monthly Earnings"
            value={formatAmount(dashboardData.totalEarningsMonth)}
            icon={Book}
            color="warning"
            subtitle="Earnings for the current month"
            trend={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StyledStatCard
            title="Total Events"
            value={dashboardData.numberOfEvents.toString()}
            icon={Calendar}
            color="success"
            subtitle="Number of events held"
            trend={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StyledStatCard
            title="Active Students"
            value={dashboardData.numberOfStudents.toString()}
            icon={CloudChange}
            color="error"
            subtitle="Number of active students"
            trend={0}
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <RepeatCustomerRate monthlyDonations={dashboardData.monthlyDonations} />
            </CardContent>
          </Card>
        </Grid>

        {/* Transactions and Income */}
        <Grid item xs={12}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Transactions donationsTransactions={dashboardData.donationsTransactions} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <TotalIncome monthlyDonations={dashboardData.monthlyDonations} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardDefault;
