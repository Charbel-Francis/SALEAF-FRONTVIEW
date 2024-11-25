import React from 'react';
import { FormikProps } from 'formik';
import { Box } from '@mui/system';
import { Alert, FormControlLabel, TextField, Typography } from '@mui/material';
import { BankAccountInfo, DonationFormValues } from 'types/types';

interface StepContentProps {
  activeStep: number;
  formik: FormikProps<DonationFormValues>;
  bankInfo: BankAccountInfo | null;
  uploadError: string | null;
  paymentStatus: string | null;
  predefinedAmounts: number[];
}

export const StepContent: React.FC<StepContentProps> = ({
  activeStep,
  formik,
  bankInfo,
  uploadError,
  paymentStatus,
  predefinedAmounts
}) => {
  const renderAmountStep = () => (
    <Box className="flex flex-col gap-4">
      <Box className="grid grid-cols-2 gap-2">
        {predefinedAmounts.map((amt) => (
          <button
            key={amt}
            type="button"
            onClick={() => formik.setFieldValue('donationAmount', amt.toString())}
            className={`h-16 text-xl ${
              formik.values.donationAmount === amt.toString() ? 'bg-green-700 text-white' : 'border border-green-700 text-green-700'
            }`}
          >
            ${amt}
          </button>
        ))}
      </Box>
      <TextField
        name="donationAmount"
        label="Custom Amount"
        value={formik.values.donationAmount}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.donationAmount && !!formik.errors.donationAmount}
        helperText={formik.touched.donationAmount && formik.errors.donationAmount}
        type="number"
        className="mt-4"
      />
    </Box>
  );

  const renderDonorInfoStep = () => (
    <Box className="flex flex-col gap-4">
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
          <input
            type="checkbox"
            checked={formik.values.isAnonymous}
            onChange={(e) => formik.setFieldValue('isAnonymous', e.target.checked)}
            className="mr-2"
          />
        }
        label="Make this donation anonymous"
      />
    </Box>
  );

  const renderPaymentStep = () => (
    <Box className="flex flex-col gap-4">
      {[
        { value: 'online', label: 'Online Payment' },
        { value: 'manual', label: 'Manual Payment' }
      ].map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => formik.setFieldValue('paymentType', option.value)}
          className={`p-4 border rounded ${
            formik.values.paymentType === option.value ? 'border-green-700 bg-green-50' : 'border-gray-300'
          }`}
        >
          {option.label}
        </button>
      ))}
    </Box>
  );

  const renderPaymentProcessStep = () => {
    if (formik.values.paymentType === 'manual') {
      return (
        <Box className="flex flex-col gap-4">
          {bankInfo && (
            <Box className="p-4 bg-gray-50 rounded">
              <Typography variant="h6" className="mb-2">
                Bank Account Details
              </Typography>
              <Typography>Bank: {bankInfo.branch}</Typography>
              <Typography>Account Number: {bankInfo.accountNo}</Typography>
              <Typography>Account Name: {bankInfo.branchCode}</Typography>
              {bankInfo.branchCode && <Typography>Branch Code: {bankInfo.branchCode}</Typography>}
            </Box>
          )}
          <Typography className="text-gray-600">
            Please make your payment using the bank details above and proceed to complete your donation.
          </Typography>

          {uploadError && (
            <Alert severity="error" className="mt-4">
              {uploadError}
            </Alert>
          )}
        </Box>
      );
    }

    return (
      <Box className="text-center py-4">
        <Typography variant="h6">Redirecting to Payment Gateway...</Typography>
        <Typography className="text-gray-600 mt-2">Please wait while we redirect you to our secure payment partner.</Typography>
      </Box>
    );
  };

  const renderConfirmationStep = () => (
    <Box className="text-center py-4">
      <Typography variant="h5" className="text-green-700 mb-4">
        Thank You for Your Donation!
      </Typography>
      {paymentStatus === 'success' && (
        <Typography className="text-gray-600">Your payment was successful. You will receive a confirmation email shortly.</Typography>
      )}
      {paymentStatus === 'failed' && <Typography className="text-red-600">We couldn't process your payment. Please try again.</Typography>}
    </Box>
  );

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
