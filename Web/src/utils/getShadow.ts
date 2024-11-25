// material-ui
import { Theme } from '@mui/material/styles';

// ==============================|| CUSTOM FUNCTION - COLOR SHADOWS ||============================== //

export default function getShadow(theme: Theme, shadow: string) {
  switch (shadow) {
    case 'secondary':
      return theme.shadows[1];
    case 'error':
      return theme.shadows[2];
    case 'warning':
      return theme.shadows[3];
    case 'info':
      return theme.shadows[4];
    case 'success':
      return theme.shadows[5];
    case 'primaryButton':
      return theme.shadows[6];
    case 'secondaryButton':
      return theme.shadows[7];
    case 'errorButton':
      return theme.shadows[8];
    case 'warningButton':
      return theme.shadows[9];
    case 'infoButton':
      return theme.shadows[10];
    case 'successButton':
      return theme.shadows[11];
    default:
      return theme.customShadows.z1;
  }
}
