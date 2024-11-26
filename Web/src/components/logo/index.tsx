import { Link } from 'react-router-dom';
import { To } from 'history';

// material-ui
import ButtonBase from '@mui/material/ButtonBase';
import { SxProps } from '@mui/system';
import { Box } from '@mui/material';

import logoimg from '../../assets/images/SaleafClear.png';
// project-imports
import useAuth from 'hooks/useAuth';
import { APP_DEFAULT_PATH } from 'config';

// Define props interface
interface Props {
  isIcon?: boolean;
  sx?: SxProps;
  to?: To;
}

// ==============================|| MAIN LOGO ||============================== //

export default function LogoSection({ isIcon, sx, to }: Props) {
  const { isLoggedIn } = useAuth();

  // Use img elements with proper src paths
  const LogoImage = () => <Box component="img" src={logoimg} alt="Saleaf Logo" sx={{ height: isIcon ? 50 : 80, width: 'auto' }} />;

  return (
    <ButtonBase disableRipple component={isLoggedIn ? Link : 'button'} to={isLoggedIn && !to ? APP_DEFAULT_PATH : to} sx={sx}>
      <LogoImage />
    </ButtonBase>
  );
}
