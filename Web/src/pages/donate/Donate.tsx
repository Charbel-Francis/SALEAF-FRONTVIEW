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
  styled,
  CircularProgress
} from '@mui/material';
import { CardSend, CloseCircle, Heart, WalletMoney, Warning2 } from 'iconsax-react';
import { validationSchema } from 'utils/validation';
import { BankAccountInfo, DonationFormValues } from 'types/types';
import useAuth from 'hooks/useAuth';
import router from 'routes';
import axiosServices from 'utils/axios';
import { set } from 'lodash';
import { a } from 'react-spring';
import { s } from '@fullcalendar/core/internal-common';

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

const LoadingButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#14783D',
  '&:hover': {
    backgroundColor: '#0f5f31'
  },
  '&.Mui-disabled': {
    backgroundColor: '#14783D',
    opacity: 0.7
  }
}));

const DonationPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDonorInfoLoading, setIsDonorInfoLoading] = useState(false);
  const [isBankInfoLoading, setIsBankInfoLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [bankInfo, setBankInfo] = useState<BankAccountInfo[]>([]);
  const [referenceNumber, setReferenceNumber] = useState<number | null>(null);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const BASE_URL = '/SALEAF';

  const steps = ['Choose Amount', 'Donor Information', 'Payment Method', 'Process Payment', 'Confirmation'];
  const predefinedAmounts = [50, 100, 1000, 5000];
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [countdown, setCountdown] = useState<number>(10);
  const [shouldStartCountdown, setShouldStartCountdown] = useState(false);

  // Add this useEffect for countdown handling
  useEffect(() => {
    if (shouldStartCountdown && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (countdown === 0) {
      // Reset everything when countdown reaches 0
      window.history.replaceState({}, document.title, '/SALEAF/donate');
      formik.resetForm();
      setActiveStep(0);
      setShouldStartCountdown(false);
      setCountdown(10);
    }
  }, [shouldStartCountdown, countdown]);

  // Add this effect to handle URL status parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');

    if (status) {
      setPaymentStatus(status);
      setActiveStep(4);
      setShouldStartCountdown(true); // Start countdown when status is received
    }
  }, []);

  const validateFile = (file: File) => {
    // Define allowed file types
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return 'File type not supported. Please upload a PDF, JPG, JPEG, or PNG file.';
    }

    if (file.size > maxSize) {
      return 'File is too large. Maximum size is 5MB.';
    }

    return null;
  };
  const handleFileUpload = async () => {
    if (!selectedFile) {
      return;
    }

    setUploadStatus('uploading');
    const formData = new FormData();
    formData.append('DocFile', selectedFile);
    formData.append('ReferenceNumber', referenceNumber?.toString() || '');
    formData.append('Amount', formik.values.donationAmount.toString());
    try {
      const response = await axiosServices.post('/api/ManualPaymentDoc/upload-manual-payment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUploadStatus('success');
      setPaymentStatus('success');
      setShouldStartCountdown(true);
      setActiveStep(4);
      console.log(response);
    } catch (error: any) {
      setUploadStatus('error');
      if (error.response?.data?.errors) {
        // Handle specific validation errors
        const errorMessages = Object.values(error.response.data.errors).flat();
        setUploadError(errorMessages.join(', '));
      } else {
        setUploadError('Failed to upload proof of payment');
      }
    }
  };

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
    onSubmit: async (values) => {}
  });

  const continueStepper = async () => {
    if (isLoggedIn) {
      if (activeStep === 0) {
        if (formik.values.donationAmount === '') {
          return;
        }
        setIsDonorInfoLoading(true);
        try {
          const response = await axiosServices.get('/api/DonorCertificateInfo/donor-certificate-info-exist');
          console.log(response);
          const DonatorInformation = response.data;
          if (DonatorInformation) {
            setActiveStep((prev) => prev + 2);
          }
        } catch (error) {
          setUploadError('Failed to fetch donor information');
        } finally {
          setIsDonorInfoLoading(false);
        }
      } else if (activeStep === 1) {
        if (
          formik.values.donorInfo.name === '' ||
          formik.values.donorInfo.email === '' ||
          formik.values.donorInfo.phone === '' ||
          formik.values.donorInfo.identityNoOrCompanyRegNo === '' ||
          formik.values.donorInfo.incomeTaxNumber === '' ||
          formik.values.donorInfo.address === ''
        ) {
          return;
        }
        setActiveStep((prev) => prev + 1);
      } else if (activeStep === 2) {
        if (formik.values.paymentType === '') {
          return;
        }
        if (formik.values.paymentType === 'online') {
          console.log(formik.values.donationAmount);
          const response = await axiosServices.post('/api/Donation', {
            amount: formik.values.donationAmount,
            currency: 'ZAR',
            cancelUrl: `${window.location.origin}${BASE_URL}/donate?status=cancelled`,
            successUrl: `${window.location.origin}${BASE_URL}/donate?status=success`,
            failureUrl: `${window.location.origin}${BASE_URL}/donate?status=failed`,
            isAnonymous: false
          });
          const data = await response.data;
          window.location.href = data.redirectUrl;
          setActiveStep((prev) => prev + 1);
        } else if (formik.values.paymentType === 'manual') {
          setIsBankInfoLoading(true);
          try {
            const response = await axiosServices.post('/api/Donation/manual-payment-donation', {
              amount: formik.values.donationAmount,
              currency: 'ZAR',
              isAnonymous: false
            });
            const data = await response.data;
            setReferenceNumber(data.donationId);
            const bankDetails = await axiosServices.get('/api/BankAccountInfo');
            console.log(bankDetails);
            setBankInfo(bankDetails.data);
            console.log(bankInfo);
            setActiveStep((prev) => prev + 1);
          } catch (error) {
            setUploadError('Failed to fetch bank information');
          } finally {
            setIsBankInfoLoading(false);
          }
        }
      } else {
        setActiveStep((prev) => prev + 1);
      }
    } else {
      router.navigate('/login', { state: { from: location.pathname } });
    }
  };

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
            R{amt}
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
          startAdornment: 'R'
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
          {/* Bank info section remains the same */}
          {isBankInfoLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : bankInfo.length > 0 ? (
            <Box sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Bank Account Details
              </Typography>
              <Typography>Reference Number: {referenceNumber}</Typography>
              <Typography>Bank: {bankInfo[0].branch}</Typography>
              <Typography>Account Number: {bankInfo[0].accountNo}</Typography>
              <Typography>Account Name: {bankInfo[0].branchCode}</Typography>
            </Box>
          ) : null}

          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Please make your payment using the bank details above and upload your proof of payment below.
          </Typography>

          {/* Updated File Upload Section */}
          <Box sx={{ mt: 2, p: 3, border: '2px dashed', borderColor: 'grey.300', borderRadius: 1 }}>
            <input
              type="file"
              id="proof-of-payment"
              accept="application/pdf,image/jpeg,image/jpg,image/png"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const errorMessage = validateFile(file);
                  if (errorMessage) {
                    setUploadError(errorMessage);
                    return;
                  }
                  setSelectedFile(file);
                  setUploadError(null);
                  setUploadStatus('idle');
                }
              }}
            />

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              {!selectedFile ? (
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    component="label"
                    htmlFor="proof-of-payment"
                    startIcon={<CardSend />}
                    sx={{
                      bgcolor: '#14783D',
                      '&:hover': {
                        bgcolor: '#0f5f31'
                      }
                    }}
                  >
                    Select File
                  </Button>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Click to select your proof of payment
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      bgcolor: 'rgba(20, 120, 61, 0.1)',
                      p: 1,
                      borderRadius: 1,
                      width: '100%',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="body2">{selectedFile.name}</Typography>
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedFile(null);
                        setUploadStatus('idle');
                        setUploadError(null);
                      }}
                      sx={{ minWidth: 'auto', color: '#14783D' }}
                    >
                      Change
                    </Button>
                  </Box>

                  {uploadStatus !== 'success' && (
                    <Button
                      variant="contained"
                      onClick={handleFileUpload}
                      disabled={uploadStatus === 'uploading'}
                      fullWidth
                      sx={{
                        bgcolor: '#14783D',
                        '&:hover': {
                          bgcolor: '#0f5f31'
                        }
                      }}
                    >
                      {uploadStatus === 'uploading' ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={20} sx={{ color: 'white' }} />
                          <span>Uploading...</span>
                        </Box>
                      ) : (
                        'Upload Proof of Payment'
                      )}
                    </Button>
                  )}
                </Box>
              )}

              {uploadStatus === 'success' && (
                <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
                  Proof of payment uploaded successfully!
                </Alert>
              )}

              {uploadError && (
                <Alert severity="error" sx={{ mt: 2, width: '100%' }} onClose={() => setUploadError(null)}>
                  {uploadError}
                </Alert>
              )}
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Accepted file types: PDF, JPG, JPEG, PNG (Max size: 5MB)
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography variant="h6">Redirecting to Payment Gateway...</Typography>
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Please wait while we redirect you to our secure payment partner.
        </Typography>
      </Box>
    );
  };

  const renderConfirmationStep = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      {paymentStatus === 'success' && (
        <>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'rgba(20, 120, 61, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto'
            }}
          >
            <Heart size="48" variant="Bulk" color="#14783D" />
          </Box>
          <Typography variant="h5" sx={{ color: '#14783D', mt: 3 }}>
            Thank You for Your Donation!
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Your payment was successful. You will receive a confirmation email shortly.
          </Typography>
        </>
      )}

      {paymentStatus === 'failed' && (
        <>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto'
            }}
          >
            <CloseCircle size="48" variant="Bulk" color="#DC2626" />
          </Box>
          <Typography variant="h5" sx={{ color: '#DC2626', mt: 3 }}>
            Payment Failed
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            We couldn't process your payment. Please try again.
          </Typography>
        </>
      )}

      {paymentStatus === 'cancelled' && (
        <>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto'
            }}
          >
            <Warning2 size="48" variant="Bulk" color="#D97706" />
          </Box>
          <Typography variant="h5" sx={{ color: '#D97706', mt: 3 }}>
            Payment Cancelled
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Your donation process was cancelled.
          </Typography>
        </>
      )}

      {shouldStartCountdown && (
        <>
          {/* Countdown circle */}
          <Box sx={{ position: 'relative', width: 60, height: 60, margin: '2rem auto' }}>
            <CircularProgress
              variant="determinate"
              value={(countdown / 10) * 100}
              size={60}
              thickness={4}
              sx={{
                color: paymentStatus === 'success' ? '#14783D' : paymentStatus === 'failed' ? '#DC2626' : '#D97706'
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: paymentStatus === 'success' ? '#14783D' : paymentStatus === 'failed' ? '#DC2626' : '#D97706'
                }}
              >
                {countdown}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Redirecting in {countdown} seconds...
          </Typography>
        </>
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
      case 3:
        if (formik.values.paymentType === 'manual') {
          return uploadStatus === 'success';
        }
        return true;
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
          {uploadError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setUploadError(null)}>
              {uploadError}
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit}>
            {isDonorInfoLoading && activeStep === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              renderStepContent()
            )}

            {activeStep !== 4 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                {activeStep > 0 && (
                  <Button
                    variant="outlined"
                    onClick={() => setActiveStep((prev) => prev - 1)}
                    disabled={isLoading || isDonorInfoLoading || isBankInfoLoading}
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
                <LoadingButton
                  type={activeStep === 3 ? 'submit' : 'button'}
                  onClick={() => continueStepper()}
                  disabled={!isStepValid() || isLoading || isDonorInfoLoading || isBankInfoLoading}
                  sx={{
                    ...(activeStep === 0 && { width: '100%' }),
                    minWidth: 120,
                    color: 'white',
                    '&:disabled': {
                      color: 'rgba(255, 255, 255, 0.8)'
                    }
                  }}
                >
                  {isLoading || isDonorInfoLoading || isBankInfoLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} sx={{ color: 'inherit' }} />
                      <span>
                        {isLoading
                          ? 'Processing...'
                          : isDonorInfoLoading
                            ? 'Loading Info...'
                            : isBankInfoLoading
                              ? 'Loading Bank Details...'
                              : 'Loading...'}
                      </span>
                    </Box>
                  ) : activeStep === 3 ? (
                    'Complete Payment'
                  ) : activeStep === steps.length - 1 ? (
                    'Finish'
                  ) : (
                    'Continue'
                  )}
                </LoadingButton>
              </Box>
            )}
          </form>
        </CardContent>
      </StyledCard>

      {/* Optional: Add a global loading overlay for critical operations */}
      {isLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <Box
            sx={{
              bgcolor: 'white',
              p: 3,
              borderRadius: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2
            }}
          >
            <CircularProgress size={40} sx={{ color: '#14783D' }} />
            <Typography>Processing your donation...</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DonationPage;
