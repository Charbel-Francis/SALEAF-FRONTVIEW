// BursaryPage.tsx
import React from 'react';
import { Container, Paper, Typography, Grid, Card, CardContent } from '@mui/material';
import { Alert, AlertTitle } from '@mui/material';
import { BursaryFormData } from 'types/types';
import { Clock, Educare, Information } from 'iconsax-react';
import BursaryApplicationForm from 'components/applicationform/Application_Form';
import { defaultFormData } from 'types/defaultFormData';
import axiosServices from 'utils/axios';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import { redirect } from 'react-router';

const BursaryPage: React.FC = () => {
  const handleSubmit = async (data: BursaryFormData) => {
    try {
      const formData = new FormData();

      const submissionData = {
        ...data,
        dateOfBirth: data.dateOfBirth || new Date().toISOString().split('T')[0], // Required field
        dependents: data.dependents || [], // Required field
        investments: data.investments || [], // Required field
        lifeAssurancePolicies: data.lifeAssurancePolicies || [], // Required field
        otherAssets: data.otherAssets || [], // Required field
        otherLiabilities: data.otherLiabilities || [] // Required field
      };

      // Handle file uploads with proper blob conversion
      if (data.grade11SubjectsAndResultsFile) {
        const file = data.grade11SubjectsAndResultsFile;
        formData.append('grade11SubjectsAndResultsFile', file);
      }
      if (data.grade12SubjectsAndResultsFile) {
        const file = data.grade12SubjectsAndResultsFile;
        formData.append('grade12SubjectsAndResultsFile', file);
      }
      if (data.tertiarySubjectsAndResultsFile) {
        const file = data.tertiarySubjectsAndResultsFile;
        formData.append('tertiarySubjectsAndResultsFile', file);
      }

      // Handle arrays with JSON stringify
      const arrayFields = [
        'dependents',
        'fixedProperties',
        'vehicles',
        'lifeAssurancePolicies',
        'investments',
        'otherAssets',
        'otherLiabilities'
      ];

      arrayFields.forEach((field) => {
        formData.append(field, JSON.stringify((submissionData as any)[field] || []));
      });

      // Handle financial details list
      if (submissionData.financialDetailsList) {
        const financialDetails = {
          father: submissionData.financialDetailsList.father || null,
          mother: submissionData.financialDetailsList.mother || null,
          siblings: submissionData.financialDetailsList.siblings || [],
          selfApplicant: submissionData.financialDetailsList.selfApplicant || {
            name: '',
            surname: '',
            idNumber: '',
            occupation: '',
            maritalStatus: '',
            grossMonthly: '',
            otherIncome: ''
          },
          guardian_person: submissionData.financialDetailsList.guardian_person || {
            name: '',
            surname: '',
            idNumber: '',
            occupation: '',
            maritalStatus: '',
            grossMonthly: '',
            otherIncome: ''
          }
        };
        formData.append('financialDetailsList', JSON.stringify(financialDetails));
      }

      // Add all other fields
      Object.entries(submissionData).forEach(([key, value]) => {
        // Skip files and arrays as they're handled separately
        if (!key.includes('File') && !arrayFields.includes(key) && key !== 'financialDetailsList') {
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        }
      });
      // Make the API call
      const response = await axiosServices.post('/api/BursaryApplication', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        enqueueSnackbar('Application submitted successfully', {
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          action: (key) => (
            <Alert severity="success" onClose={() => closeSnackbar(key)} sx={{ width: '100%' }}>
              <AlertTitle>Success</AlertTitle>
              Your application has been submitted successfully
            </Alert>
          )
        });
        redirect('/');
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.entries(error.response.data.errors)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
          .join('\n');

        enqueueSnackbar('Validation Error', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          action: (key) => (
            <Alert severity="error" onClose={() => closeSnackbar(key)} sx={{ width: '100%' }}>
              <AlertTitle>Validation Error</AlertTitle>
              {errorMessages}
            </Alert>
          )
        });
      } else {
        enqueueSnackbar('Error submitting application', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          action: (key) => (
            <Alert severity="error" onClose={() => closeSnackbar(key)} sx={{ width: '100%' }}>
              <AlertTitle>Error</AlertTitle>
              {error.message}
            </Alert>
          )
        });
      }
    }
  };

  const handleStepChange = (step: number) => {
    console.log('Current step:', step);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, backgroundColor: '#f5f5f5', minHeight: '200vh', mt: 15 }}>
      <Paper elevation={0} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          Student Bursary Application
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" sx={{ mb: 4 }}>
          Take the first step towards your future by applying for our student bursary program
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Information style={{ fontSize: 40, marginBottom: 2, color: 'primary.main' }} />
                <Typography variant="h6" gutterBottom>
                  Required Documents
                </Typography>
                <Typography component="ul" sx={{ color: 'text.secondary', pl: 2 }}>
                  <li>Grade 11 Results</li>
                  <li>Grade 12 Results</li>
                  <li>ID Document</li>
                  <li>Proof of Registration</li>
                  <li>Financial Statements (if applicable)</li>
                  <li>Parents'/Guardian's Income Proof</li>
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Educare style={{ fontSize: 40, marginBottom: 2, color: 'primary.main' }} />
                <Typography variant="h6" gutterBottom>
                  Eligibility
                </Typography>
                <Typography component="ul" sx={{ color: 'text.secondary', pl: 2 }}>
                  <li>South African Citizen</li>
                  <li>Financial Need</li>
                  <li>Full-time Student</li>
                  <li>Lebanese Origin (if applicable)</li>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper
          elevation={1}
          sx={{
            p: 2,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            borderRadius: '8px'
          }}
        >
          <BursaryApplicationForm onSubmit={handleSubmit} onStepChange={handleStepChange} initialData={defaultFormData} />
        </Paper>
      </Paper>
    </Container>
  );
};

export default BursaryPage;
