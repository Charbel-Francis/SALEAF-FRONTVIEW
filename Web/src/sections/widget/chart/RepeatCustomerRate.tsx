import { useState, MouseEvent } from 'react';

// material-ui
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

// project-imports
import RepeatCustomerChart from './RepeatCustomerChart';
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import MoreIcon from 'components/@extended/MoreIcon';

// Define TypeScript interfaces based on the API response
interface MonthlyDonation {
  year: number;
  month: number;
  totalEarnings: number;
}

interface RepeatCustomerRateProps {
  monthlyDonations: MonthlyDonation[];
}

export default function RepeatCustomerRate({ monthlyDonations }: RepeatCustomerRateProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Calculate percentage change or any other logic if needed

  return (
    <MainCard>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
        <Typography variant="h5">Monthly Donations</Typography>
        <IconButton
          color="secondary"
          id="donations-button"
          aria-controls={open ? 'donations-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          sx={{ transform: 'rotate(90deg)' }}
        >
          <MoreIcon />
        </IconButton>
      </Stack>

      <Menu
        id="donations-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'donations-button',
          sx: { p: 1.25, minWidth: 150 }
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <ListItemButton onClick={handleClose}>Today</ListItemButton>
        <ListItemButton onClick={handleClose}>Weekly</ListItemButton>
        <ListItemButton onClick={handleClose}>Monthly</ListItemButton>
      </Menu>

      <RepeatCustomerChart monthlyDonations={monthlyDonations} />
    </MainCard>
  );
}
