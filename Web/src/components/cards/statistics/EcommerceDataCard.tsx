import React from 'react';
import { Card, Typography, Stack, Box } from '@mui/material';

interface EcommerceDataCardProps {
  title: string;
  count: string;
  iconPrimary: React.ReactNode;
  percentage?: React.ReactNode; // Made optional
  color?: 'success' | 'error' | 'warning' | 'info';
  children?: React.ReactNode;
}

const EcommerceDataCard: React.FC<EcommerceDataCardProps> = ({ title, count, iconPrimary, percentage, color = 'primary', children }) => {
  return (
    <Card
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        bgcolor: (theme) => theme.palette.background.paper,
        boxShadow: 3,
        borderRadius: 2
      }}
    >
      <Stack spacing={1}>
        <Typography variant="subtitle2" color="textSecondary">
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          {count}
        </Typography>
        {percentage && percentage}
      </Stack>
      <Box>{iconPrimary}</Box>
      {children && <Box sx={{ width: '40%' }}>{children}</Box>}
    </Card>
  );
};

export default EcommerceDataCard;
