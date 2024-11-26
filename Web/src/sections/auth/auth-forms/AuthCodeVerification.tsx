import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Card, CardContent, Grid, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';

// third-party
import OtpInput from 'react18-input-otp';

// project-imports
import AnimateButton from 'components/@extended/AnimateButton';
import { ThemeMode } from 'config';

// icons
import { Visibility, VisibilityOff } from '@mui/icons-material';
import useAuth from 'hooks/useAuth';
import { SnackbarProps } from 'types/snackbar';
import { openSnackbar } from 'api/snackbar';
import { useNavigate } from 'react-router';

// validation schema
const validationSchema = Yup.object().shape({
  email: Yup.string().email('Must be a valid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  otp: Yup.string()
    .length(6, 'OTP must be exactly 6 digits')
    .matches(/^[0-9]+$/, 'OTP must be numbers only')
    .required('OTP is required')
});

// ============================|| AUTHENTICATION - CODE VERIFICATION ||============================ //

export default function AuthCodeVerification() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const { resetPassword } = useAuth();
  const formik = useFormik({
    initialValues: {
      email: params.get('email') || '',
      password: '',
      otp: ''
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Form submitted with values:', values);
      if (resetPassword) {
        resetPassword(values.email, values.password, values.otp).then(
          () => {
            openSnackbar({
              open: true,
              message: 'Password reset successfully',
              variant: 'alert',
              alert: {
                color: 'success'
              }
            } as SnackbarProps);
            setTimeout(() => {
              navigate('/login', {
                replace: true
              });
            }, 1500);
          },
          (err: any) => {
            formik.setFieldError('otp', err.message);
            formik.setFieldError('password', err.message);
            formik.setFieldError('email', err.message);
          }
        );
      }
    }
  });

  const borderColor = theme.palette.mode === ThemeMode.DARK ? theme.palette.secondary[200] : theme.palette.secondary.light;

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleOtpChange = (value: string) => {
    formik.setFieldValue('otp', value);
    formik.setFieldTouched('otp', true, false);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card elevation={1}>
        <CardContent>
          <Grid container spacing={3}>
            {/* Email Input */}
            <Grid item xs={12}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Email Address</Typography>
                <TextField
                  fullWidth
                  disabled
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  placeholder="Enter email address"
                  type="email"
                />
              </Stack>
            </Grid>

            {/* Password Input */}
            <Grid item xs={12}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Password</Typography>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Stack>
            </Grid>

            {/* OTP Input */}
            <Grid item xs={12}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Verification Code</Typography>
                <OtpInput
                  value={formik.values.otp}
                  onChange={handleOtpChange}
                  numInputs={6}
                  containerStyle={{ justifyContent: 'space-between' }}
                  inputStyle={{
                    width: '100%',
                    margin: '8px',
                    padding: '10px',
                    border: `1px solid ${formik.touched.otp && formik.errors.otp ? theme.palette.error.main : borderColor}`,
                    borderRadius: 4,
                    ':hover': {
                      borderColor: theme.palette.primary.main
                    }
                  }}
                  focusStyle={{
                    outline: 'none',
                    boxShadow: theme.customShadows.z1,
                    border: '1px solid',
                    borderColor: theme.palette.primary.main
                  }}
                />
                {formik.touched.otp && formik.errors.otp && (
                  <Typography color="error" variant="caption">
                    {formik.errors.otp}
                  </Typography>
                )}
              </Stack>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <AnimateButton>
                <Button
                  disableElevation
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  disabled={!formik.isValid || formik.isSubmitting}
                  sx={{
                    py: 2
                  }}
                >
                  Verify
                </Button>
              </AnimateButton>
            </Grid>

            {/* Resend Code */}
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                <Typography variant="body1" color="textSecondary">
                  Not received Code?
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    minWidth: 85,
                    ml: 2,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    color: theme.palette.primary.main
                  }}
                >
                  Resend code
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
}
