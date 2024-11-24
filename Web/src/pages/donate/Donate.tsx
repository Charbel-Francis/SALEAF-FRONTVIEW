import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useFormik } from 'formik';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  Alert,
  styled
} from '@mui/material';
import { CardSend, Heart, WalletMoney } from 'iconsax-react';
import { validationSchema } from 'utils/validation';
import { BankAccountInfo, DonationFormValues } from 'types/types';
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.9)'
}));

const ColorButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#14783D',
  '&:hover': {
    backgroundColor: '#0f5f31'
  }
}));

const DonationPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [bankInfo, setBankInfo] = useState<BankAccountInfo | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const steps = ['Choose Amount', 'Donor Information', 'Payment Method', 'Process Payment', 'Confirmation'];
  const predefinedAmounts = [10, 25, 50, 100];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    if (status) {
      setPaymentStatus(status);
      setActiveStep(4);
    }
  }, []);

  const formik = useFormik<DonationFormValues>({
    initialValues: {
      donationAmount: '',
      donorInfo: {
        name: '',
        email: '',
        phone: '',
        identityNoOrCompanyRegNo: '',
        incomeTaxNumber: '',
        address: ''
      },
      paymentType: '',
      isAnonymous: false
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        if (values.paymentType === 'online') {
          const response = await fetch('/api/Donation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: Number(values.donationAmount),
              currency: 'USD',
              cancelUrl: `${window.location.origin}/donate?status=cancelled`,
              successUrl: `${window.location.origin}/donate?status=success`,
              failureUrl: `${window.location.origin}/donate?status=failed`,
              isAnonymous: values.isAnonymous
            })
          });
          const data = await response.json();
          window.location.href = data.redirectUrl;
        } else {
          // Get bank info
          const bankResponse = await fetch('/api/BankAccountInfo');
          const bankData = await bankResponse.json();
          setBankInfo(bankData);

          // Submit manual payment
          await fetch('/api/Donation/manual-payment-donation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: Number(values.donationAmount),
              currency: 'USD',
              isAnonymous: values.isAnonymous
            })
          });
          setActiveStep(4);
        }
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : String(error));
      } finally {
        setIsLoading(false);
      }
    }
  });

  const renderAmountStep = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        {predefinedAmounts.map((amt) => (
          <Button
            key={amt}
            variant={formik.values.donationAmount === amt.toString() ? 'contained' : 'outlined'}
            onClick={() => formik.setFieldValue('donationAmount', amt.toString())}
            sx={{
              height: 64,
              fontSize: '1.25rem',
              bgcolor: formik.values.donationAmount === amt.toString() ? '#14783D' : 'transparent',
              '&:hover': {
                bgcolor: formik.values.donationAmount === amt.toString() ? '#0f5f31' : 'rgba(20, 120, 61, 0.04)'
              }
            }}
          >
            ${amt}
          </Button>
        ))}
      </Box>
      <TextField
        fullWidth
        name="donationAmount"
        label="Custom Amount"
        value={formik.values.donationAmount}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.donationAmount && !!formik.errors.donationAmount}
        helperText={formik.touched.donationAmount && formik.errors.donationAmount}
        type="number"
        InputProps={{
          startAdornment: '$'
        }}
      />
    </Box>
  );

  const renderDonorInfoStep = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {[
        { name: 'name', label: 'Full Name' },
        { name: 'email', label: 'Email Address', type: 'email' },
        { name: 'phone', label: 'Contact Number', type: 'tel' },
        { name: 'identityNoOrCompanyRegNo', label: 'Identity/Company Registration No.' },
        { name: 'incomeTaxNumber', label: 'Income Tax Number (Enter N/A if not applicable)' },
        { name: 'address', label: 'Complete Address', multiline: true, rows: 3 }
      ].map((field) => (
        <TextField
          key={field.name}
          fullWidth
          name={`donorInfo.${field.name}`}
          label={field.label}
          value={formik.values.donorInfo[field.name as keyof typeof formik.values.donorInfo]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.donorInfo?.[field.name as keyof typeof formik.values.donorInfo] &&
            !!formik.errors.donorInfo?.[field.name as keyof typeof formik.values.donorInfo]
          }
          helperText={
            formik.touched.donorInfo?.[field.name as keyof typeof formik.values.donorInfo] &&
            formik.errors.donorInfo?.[field.name as keyof typeof formik.values.donorInfo]
          }
          type={field.type || 'text'}
          multiline={field.multiline}
          rows={field.rows}
        />
      ))}
      <FormControlLabel
        control={
          <Checkbox
            checked={formik.values.isAnonymous}
            onChange={(e) => formik.setFieldValue('isAnonymous', e.target.checked)}
            sx={{
              color: '#14783D',
              '&.Mui-checked': {
                color: '#14783D'
              }
            }}
          />
        }
        label="Make this donation anonymous"
      />
    </Box>
  );

  const renderPaymentStep = () => (
    <RadioGroup name="paymentType" value={formik.values.paymentType} onChange={formik.handleChange}>
      {[
        { value: 'online', label: 'Online Payment', icon: <CardSend variant="Bulk" color="#14783D" /> },
        { value: 'manual', label: 'Manual Payment', icon: <WalletMoney variant="Bulk" color="#14783D" /> }
      ].map((option) => (
        <FormControlLabel
          key={option.value}
          value={option.value}
          control={
            <Radio
              sx={{
                color: '#14783D',
                '&.Mui-checked': {
                  color: '#14783D'
                }
              }}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {option.icon}
              {option.label}
            </Box>
          }
          sx={{
            m: 1,
            p: 2,
            width: 'calc(100% - 16px)',
            border: '1px solid',
            borderColor: formik.values.paymentType === option.value ? '#14783D' : '#e0e0e0',
            borderRadius: 1,
            '&:hover': {
              bgcolor: 'rgba(20, 120, 61, 0.04)'
            }
          }}
        />
      ))}
    </RadioGroup>
  );

  const renderPaymentProcessStep = () => {
    if (formik.values.paymentType === 'manual') {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {bankInfo && (
            <Box sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Bank Account Details
              </Typography>
              <Typography>Bank: {bankInfo.bankName}</Typography>
              <Typography>Account Number: {bankInfo.accountNumber}</Typography>
              <Typography>Account Name: {bankInfo.accountName}</Typography>
            </Box>
          )}
          <Typography color="text.secondary">
            Please make your payment using the bank details above and proceed to complete your donation.
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6">Redirecting to Payment Gateway...</Typography>
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Please wait while we redirect you to our secure payment partner.
        </Typography>
      </Box>
    );
  };

  const renderConfirmationStep = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Heart size="48" variant="Bulk" color="#14783D" />
      <Typography variant="h5" sx={{ color: '#14783D', mt: 3 }}>
        Thank You for Your Donation!
      </Typography>
      {paymentStatus === 'success' && (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Your payment was successful. You will receive a confirmation email shortly.
        </Typography>
      )}
      {paymentStatus === 'failed' && (
        <Typography color="error" sx={{ mt: 2 }}>
          We couldn't process your payment. Please try again.
        </Typography>
      )}
    </Box>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderAmountStep();
      case 1:
        return renderDonorInfoStep();
      case 2:
        return renderPaymentStep();
      case 3:
        return renderPaymentProcessStep();
      case 4:
        return renderConfirmationStep();
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return !formik.errors.donationAmount && !!formik.values.donationAmount;
      case 1:
        return (
          !Object.keys(formik.errors.donorInfo || {}).length && Object.values(formik.values.donorInfo).every((value) => value.trim() !== '')
        );
      case 2:
        return !formik.errors.paymentType && !!formik.values.paymentType;
      default:
        return true;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <StyledCard>
        <CardHeader
          title={
            <Box sx={{ width: '100%', mb: 4 }}>
              <Stepper activeStep={activeStep}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          }
        />

        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            {renderStepContent()}

            {activeStep !== 4 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                {activeStep > 0 && (
                  <Button
                    variant="outlined"
                    onClick={() => setActiveStep((prev) => prev - 1)}
                    sx={{
                      color: '#14783D',
                      borderColor: '#14783D',
                      '&:hover': {
                        borderColor: '#0f5f31',
                        bgcolor: 'rgba(20, 120, 61, 0.04)'
                      }
                    }}
                  >
                    Back
                  </Button>
                )}
                <ColorButton
                  type={activeStep === 3 ? 'submit' : 'button'}
                  onClick={activeStep === 3 ? undefined : () => setActiveStep((prev) => prev + 1)}
                  disabled={!isStepValid() || isLoading}
                  sx={{
                    ...(activeStep === 0 && { width: '100%' })
                  }}
                >
                  {isLoading
                    ? 'Processing...'
                    : activeStep === 3
                      ? 'Complete Payment'
                      : activeStep === steps.length - 1
                        ? 'Finish'
                        : 'Continue'}
                </ColorButton>
              </Box>
            )}
          </form>
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default DonationPage;
