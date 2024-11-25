// BursaryApplicationForm.tsx
import React, { useCallback, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  styled,
  InputAdornment,
  IconButton,
  Snackbar
} from '@mui/material';
import { Add, ArrowForward, ArrowLeft, CloseCircle, DocumentUpload, Trash } from 'iconsax-react';
import { BursaryFormData, BursaryFormProps, FamilyBackground } from 'types/types';
import { defaultFormData } from 'types/defaultFormData';
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4)
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3)
}));

const BursaryApplicationForm: React.FC<BursaryFormProps> = ({ onSubmit, initialData, onStepChange }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<BursaryFormData>({
    ...defaultFormData,
    ...initialData
  });

  const steps: string[] = [
    'Personal Details',
    'Study Details',
    'Academic History',
    'Additional Information',
    'Financial Details',
    'Assets & Liabilities',
    'Review & Submit'
  ];

  const handleBack = useCallback(() => {
    const prevStep = activeStep - 1;
    setActiveStep(prevStep);
    onStepChange?.(prevStep);
  }, [activeStep, onStepChange]);

  const handleInputChange = useCallback((field: keyof BursaryFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  }, []);
  const handleFileChange = useCallback(
    (
      field: keyof Pick<
        BursaryFormData,
        'grade11SubjectsAndResultsFile' | 'grade12SubjectsAndResultsFile' | 'tertiarySubjectsAndResultsFile'
      >,
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file = event.target.files?.[0];
      if (file) {
        // Store both the file data and the file name
        setFormData((prev) => ({
          ...prev,
          [field]: {
            name: file.name,
            data: file
          }
        }));
      }
    },
    []
  );
  const handleFileRemove = useCallback(
    (
      field: keyof Pick<
        BursaryFormData,
        'grade11SubjectsAndResultsFile' | 'grade12SubjectsAndResultsFile' | 'tertiarySubjectsAndResultsFile'
      >
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: undefined
      }));
    },
    []
  );

  const isStepValid = (step: number): boolean => {
    console.log(formData);
    switch (step) {
      case 0: // Personal Details
        return Boolean(formData.name && formData.surname && formData.saIdNumber && formData.email && formData.contactNumber);
      case 1: // Study Details
        return Boolean(formData.institutionAppliedFor && formData.degreeOrDiploma && formData.yearOfStudyAndCommencement);
      case 6: // Review
        return Boolean(formData.declarationSignedBy && formData.declarationDate);
      default:
        return true;
    }
  };

  const renderPersonalDetails = () => (
    <StyledCard>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          Personal Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Surname"
              value={formData.surname}
              onChange={(e) => handleInputChange('surname', e.target.value)}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="SA ID Number"
              value={formData.saIdNumber}
              onChange={(e) => handleInputChange('saIdNumber', e.target.value)}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Place of Birth"
              value={formData.placeOfBirth}
              onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isOfLebaneseOrigin}
                  onChange={(e) => handleInputChange('isOfLebaneseOrigin', e.target.checked)}
                />
              }
              label="Are you of Lebanese origin?"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Home Physical Address"
              multiline
              rows={3}
              value={formData.homePhysicalAddress}
              onChange={(e) => handleInputChange('homePhysicalAddress', e.target.value)}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Home Postal Address"
              multiline
              rows={3}
              value={formData.homePostalAddress}
              onChange={(e) => handleInputChange('homePostalAddress', e.target.value)}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contact Number"
              value={formData.contactNumber}
              onChange={(e) => handleInputChange('contactNumber', e.target.value)}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox checked={formData.hasDisabilities} onChange={(e) => handleInputChange('hasDisabilities', e.target.checked)} />
              }
              label="Do you have any disabilities?"
            />
          </Grid>
          {formData.hasDisabilities && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Please explain your disability"
                multiline
                rows={4}
                value={formData.disabilityExplanation}
                onChange={(e) => handleInputChange('disabilityExplanation', e.target.value)}
                required
                variant="outlined"
              />
            </Grid>
          )}
        </Grid>
      </CardContent>
    </StyledCard>
  );

  const renderStudyDetails = () => (
    <StyledCard>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          Study Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Institution Applied For"
              value={formData.institutionAppliedFor}
              onChange={(e) => handleInputChange('institutionAppliedFor', e.target.value)}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Degree/Diploma"
              value={formData.degreeOrDiploma}
              onChange={(e) => handleInputChange('degreeOrDiploma', e.target.value)}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Year of Study and Commencement"
              value={formData.yearOfStudyAndCommencement}
              onChange={(e) => handleInputChange('yearOfStudyAndCommencement', e.target.value)}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Student Number (if already a student)"
              value={formData.studentNumber}
              onChange={(e) => handleInputChange('studentNumber', e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Approximate Funding Required (R)"
              type="number"
              value={formData.approximateFundingRequired}
              onChange={(e) => handleInputChange('approximateFundingRequired', Number(e.target.value))}
              required
              variant="outlined"
            />
          </Grid>
        </Grid>
      </CardContent>
    </StyledCard>
  );

  const renderAcademicHistory = () => (
    <StyledCard>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          Academic History
        </Typography>

        {/* Tertiary Education Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Tertiary Education (if applicable)
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name of Institution"
                value={formData.nameOfInstitution}
                onChange={(e) => handleInputChange('nameOfInstitution', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Year Commenced"
                type="number"
                value={formData.yearCommencedInstitution}
                onChange={(e) => handleInputChange('yearCommencedInstitution', Number(e.target.value))}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Year to be Completed"
                type="number"
                value={formData.yearToBeCompletedInstitution}
                onChange={(e) => handleInputChange('yearToBeCompletedInstitution', Number(e.target.value))}
                variant="outlined"
              />
            </Grid>

            {/* Tertiary Results Upload */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Tertiary Results
                </Typography>
                {!formData.tertiarySubjectsAndResultsFile ? (
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<DocumentUpload />}
                    sx={{ height: '56px' }} // Match TextField height
                  >
                    Upload Tertiary Results
                    <input
                      type="file"
                      hidden
                      onChange={(e) => handleFileChange('tertiarySubjectsAndResultsFile', e)}
                      accept=".pdf,.doc,.docx"
                    />
                  </Button>
                ) : (
                  <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs>
                        <Typography variant="body2">{formData.tertiarySubjectsAndResultsFile.name}</Typography>
                      </Grid>
                      <Grid item>
                        <IconButton onClick={() => handleFileRemove('tertiarySubjectsAndResultsFile')} color="error" size="small">
                          <Trash size={20} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* School Education Section */}
        <Box sx={{ mb: 4 }}>
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle1" gutterBottom>
            School Education
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name of School"
                value={formData.nameOfSchool}
                onChange={(e) => handleInputChange('nameOfSchool', e.target.value)}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Year Commenced"
                type="number"
                value={formData.yearCommencedSchool}
                onChange={(e) => handleInputChange('yearCommencedSchool', Number(e.target.value))}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Year to be Completed"
                type="number"
                value={formData.yearToBeCompletedSchool}
                onChange={(e) => handleInputChange('yearToBeCompletedSchool', Number(e.target.value))}
                required
                variant="outlined"
              />
            </Grid>

            {/* Grade 12 Results Upload */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Grade 12 Results
                </Typography>
                {!formData.grade12SubjectsAndResultsFile ? (
                  <Button variant="outlined" component="label" fullWidth startIcon={<DocumentUpload />} sx={{ height: '56px' }}>
                    Upload Grade 12 Results
                    <input
                      type="file"
                      hidden
                      onChange={(e) => handleFileChange('grade12SubjectsAndResultsFile', e)}
                      accept=".pdf,.doc,.docx"
                    />
                  </Button>
                ) : (
                  <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs>
                        <Typography variant="body2">{formData.grade12SubjectsAndResultsFile.name}</Typography>
                      </Grid>
                      <Grid item>
                        <IconButton onClick={() => handleFileRemove('grade12SubjectsAndResultsFile')} color="error" size="small">
                          <Trash size={20} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Grade 11 Results Upload */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Grade 11 Results
                </Typography>
                {!formData.grade11SubjectsAndResultsFile ? (
                  <Button variant="outlined" component="label" fullWidth startIcon={<DocumentUpload />} sx={{ height: '56px' }}>
                    Upload Grade 11 Results
                    <input
                      type="file"
                      hidden
                      onChange={(e) => handleFileChange('grade11SubjectsAndResultsFile', e)}
                      accept=".pdf,.doc,.docx"
                    />
                  </Button>
                ) : (
                  <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs>
                        <Typography variant="body2">{formData.grade11SubjectsAndResultsFile.name}</Typography>
                      </Grid>
                      <Grid item>
                        <IconButton onClick={() => handleFileRemove('grade11SubjectsAndResultsFile')} color="error" size="small">
                          <Trash size={20} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* File Upload Guidelines */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
            Accepted file types: PDF, DOC, DOCX
          </Typography>
          <Typography variant="caption" color="textSecondary" display="block">
            Maximum file size: 5MB
          </Typography>
        </Box>
      </CardContent>
    </StyledCard>
  );

  const renderAdditionalInformation = () => (
    <StyledCard>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          Additional Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Details of Leadership Roles in School"
              multiline
              rows={4}
              value={formData.leadershipRoles}
              onChange={(e) => handleInputChange('leadershipRoles', e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Details of Sports and Cultural Activities"
              multiline
              rows={4}
              value={formData.sportsAndCulturalActivities}
              onChange={(e) => handleInputChange('sportsAndCulturalActivities', e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Hobbies and Interests"
              multiline
              rows={4}
              value={formData.hobbiesAndInterests}
              onChange={(e) => handleInputChange('hobbiesAndInterests', e.target.value)}
              variant="outlined"
              inputProps={{ maxLength: 600 }}
              helperText="Maximum 600 characters"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Why have you chosen this particular field of study?"
              multiline
              rows={4}
              value={formData.reasonForStudyFieldChoice}
              onChange={(e) => handleInputChange('reasonForStudyFieldChoice', e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="How would you describe yourself?"
              multiline
              rows={4}
              value={formData.selfDescription}
              onChange={(e) => handleInputChange('selfDescription', e.target.value)}
              variant="outlined"
              inputProps={{ maxLength: 600 }}
              helperText="Maximum 600 characters"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.intendsToStudyFurther}
                  onChange={(e) => handleInputChange('intendsToStudyFurther', e.target.checked)}
                />
              }
              label="Do you intend to study further after attaining your first qualification?"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Why would SALEAF select you as a bursary recipient?"
              multiline
              rows={4}
              value={formData.whySelectYou}
              onChange={(e) => handleInputChange('whySelectYou', e.target.value)}
              variant="outlined"
              inputProps={{ maxLength: 600 }}
              helperText="Maximum 600 characters"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.hasSensitiveMatters}
                  onChange={(e) => handleInputChange('hasSensitiveMatters', e.target.checked)}
                />
              }
              label="Are there any matters which you would prefer not to disclose on this application form but would rather discuss face to face?"
            />
          </Grid>
        </Grid>
      </CardContent>
    </StyledCard>
  );

  const FamilyMemberForm: React.FC<{
    member: FamilyBackground;
    onUpdate: (data: FamilyBackground) => void;
    title: string;
  }> = ({ member, onUpdate, title }) => (
    <>
      <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
        {title}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Full Name"
            value={member.name}
            onChange={(e) => onUpdate({ ...member, name: e.target.value })}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Surname"
            value={member.surname}
            onChange={(e) => onUpdate({ ...member, surname: e.target.value })}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="ID Number"
            value={member.idNumber}
            onChange={(e) => onUpdate({ ...member, idNumber: e.target.value })}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Occupation"
            value={member.occupation}
            onChange={(e) => onUpdate({ ...member, occupation: e.target.value })}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Marital Status"
            value={member.maritalStatus}
            onChange={(e) => onUpdate({ ...member, maritalStatus: e.target.value })}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Gross Monthly Income"
            value={member.grossMonthly}
            onChange={(e) => onUpdate({ ...member, grossMonthly: e.target.value })}
            variant="outlined"
            InputProps={{
              startAdornment: <InputAdornment position="start">R</InputAdornment>
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Other Income"
            value={member.otherIncome}
            onChange={(e) => onUpdate({ ...member, otherIncome: e.target.value })}
            variant="outlined"
            InputProps={{
              startAdornment: <InputAdornment position="start">R</InputAdornment>
            }}
          />
        </Grid>
      </Grid>
    </>
  );
  const createEmptyFamilyMember = (): FamilyBackground => ({
    name: '',
    surname: '',
    idNumber: '',
    occupation: '',
    maritalStatus: '',
    grossMonthly: '',
    otherIncome: ''
  });

  const renderFinancialDetails = () => (
    <StyledCard>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          Financial Details
        </Typography>

        {/* Family Background Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            1. Family Background and Source of Income
          </Typography>

          {/* Father's Details */}
          <Box sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
              Father's Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.financialDetailsList?.father?.name || ''}
                  onChange={(e) =>
                    handleInputChange('financialDetailsList', {
                      ...formData.financialDetailsList,
                      father: {
                        ...(formData.financialDetailsList?.father || createEmptyFamilyMember()),
                        name: e.target.value
                      }
                    })
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Surname"
                  value={formData.financialDetailsList?.father?.surname || ''}
                  onChange={(e) =>
                    handleInputChange('financialDetailsList', {
                      ...formData.financialDetailsList,
                      father: {
                        ...(formData.financialDetailsList?.father || createEmptyFamilyMember()),
                        surname: e.target.value
                      }
                    })
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ID Number"
                  value={formData.financialDetailsList?.father?.idNumber || ''}
                  onChange={(e) =>
                    handleInputChange('financialDetailsList', {
                      ...formData.financialDetailsList,
                      father: {
                        ...(formData.financialDetailsList?.father || createEmptyFamilyMember()),
                        idNumber: e.target.value
                      }
                    })
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Occupation"
                  value={formData.financialDetailsList?.father?.occupation || ''}
                  onChange={(e) =>
                    handleInputChange('financialDetailsList', {
                      ...formData.financialDetailsList,
                      father: {
                        ...(formData.financialDetailsList?.father || createEmptyFamilyMember()),
                        occupation: e.target.value
                      }
                    })
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Marital Status"
                  value={formData.financialDetailsList?.father?.maritalStatus || ''}
                  onChange={(e) =>
                    handleInputChange('financialDetailsList', {
                      ...formData.financialDetailsList,
                      father: {
                        ...(formData.financialDetailsList?.father || createEmptyFamilyMember()),
                        maritalStatus: e.target.value
                      }
                    })
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Gross Monthly Income"
                  value={formData.financialDetailsList?.father?.grossMonthly || ''}
                  onChange={(e) =>
                    handleInputChange('financialDetailsList', {
                      ...formData.financialDetailsList,
                      father: {
                        ...(formData.financialDetailsList?.father || createEmptyFamilyMember()),
                        grossMonthly: e.target.value
                      }
                    })
                  }
                  variant="outlined"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Other Income"
                  value={formData.financialDetailsList?.father?.otherIncome || ''}
                  onChange={(e) =>
                    handleInputChange('financialDetailsList', {
                      ...formData.financialDetailsList,
                      father: {
                        ...(formData.financialDetailsList?.father || createEmptyFamilyMember()),
                        otherIncome: e.target.value
                      }
                    })
                  }
                  variant="outlined"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R</InputAdornment>
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Mother's Details */}
          <Box sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
              Mother's Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.financialDetailsList?.mother?.name || ''}
                  onChange={(e) =>
                    handleInputChange('financialDetailsList', {
                      ...formData.financialDetailsList,
                      mother: {
                        ...(formData.financialDetailsList?.mother || createEmptyFamilyMember()),
                        name: e.target.value
                      }
                    })
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Surname"
                  value={formData.financialDetailsList?.mother?.surname || ''}
                  onChange={(e) =>
                    handleInputChange('financialDetailsList', {
                      ...formData.financialDetailsList,
                      mother: {
                        ...(formData.financialDetailsList?.mother || createEmptyFamilyMember()),
                        surname: e.target.value
                      }
                    })
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ID Number"
                  value={formData.financialDetailsList?.mother?.idNumber || ''}
                  onChange={(e) =>
                    handleInputChange('financialDetailsList', {
                      ...formData.financialDetailsList,
                      mother: {
                        ...(formData.financialDetailsList?.mother || createEmptyFamilyMember()),
                        idNumber: e.target.value
                      }
                    })
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Occupation"
                  value={formData.financialDetailsList?.mother?.occupation || ''}
                  onChange={(e) =>
                    handleInputChange('financialDetailsList', {
                      ...formData.financialDetailsList,
                      mother: {
                        ...(formData.financialDetailsList?.mother || createEmptyFamilyMember()),
                        occupation: e.target.value
                      }
                    })
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Marital Status"
                  value={formData.financialDetailsList?.mother?.maritalStatus || ''}
                  onChange={(e) =>
                    handleInputChange('financialDetailsList', {
                      ...formData.financialDetailsList,
                      mother: {
                        ...(formData.financialDetailsList?.mother || createEmptyFamilyMember()),
                        maritalStatus: e.target.value
                      }
                    })
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Gross Monthly Income"
                  value={formData.financialDetailsList?.mother?.grossMonthly || ''}
                  onChange={(e) =>
                    handleInputChange('financialDetailsList', {
                      ...formData.financialDetailsList,
                      mother: {
                        ...(formData.financialDetailsList?.mother || createEmptyFamilyMember()),
                        grossMonthly: e.target.value
                      }
                    })
                  }
                  variant="outlined"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Other Income"
                  value={formData.financialDetailsList?.mother?.otherIncome || ''}
                  onChange={(e) =>
                    handleInputChange('financialDetailsList', {
                      ...formData.financialDetailsList,
                      mother: {
                        ...(formData.financialDetailsList?.mother || createEmptyFamilyMember()),
                        otherIncome: e.target.value
                      }
                    })
                  }
                  variant="outlined"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R</InputAdornment>
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Siblings Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
              Siblings
            </Typography>
            {formData.financialDetailsList?.siblings?.map((sibling, index) => (
              <Box key={index} sx={{ mb: 3, p: 3, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={11}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom>
                          Sibling {index + 1}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          value={sibling.name}
                          onChange={(e) => {
                            const newSiblings = [...(formData.financialDetailsList?.siblings || [])];
                            newSiblings[index] = { ...sibling, name: e.target.value };
                            handleInputChange('financialDetailsList', {
                              ...formData.financialDetailsList,
                              siblings: newSiblings
                            });
                          }}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Surname"
                          value={sibling.surname}
                          onChange={(e) => {
                            const newSiblings = [...(formData.financialDetailsList?.siblings || [])];
                            newSiblings[index] = { ...sibling, surname: e.target.value };
                            handleInputChange('financialDetailsList', {
                              ...formData.financialDetailsList,
                              siblings: newSiblings
                            });
                          }}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="ID Number"
                          value={sibling.idNumber}
                          onChange={(e) => {
                            const newSiblings = [...(formData.financialDetailsList?.siblings || [])];
                            newSiblings[index] = { ...sibling, idNumber: e.target.value };
                            handleInputChange('financialDetailsList', {
                              ...formData.financialDetailsList,
                              siblings: newSiblings
                            });
                          }}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Occupation"
                          value={sibling.occupation}
                          onChange={(e) => {
                            const newSiblings = [...(formData.financialDetailsList?.siblings || [])];
                            newSiblings[index] = { ...sibling, occupation: e.target.value };
                            handleInputChange('financialDetailsList', {
                              ...formData.financialDetailsList,
                              siblings: newSiblings
                            });
                          }}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Marital Status"
                          value={sibling.maritalStatus}
                          onChange={(e) => {
                            const newSiblings = [...(formData.financialDetailsList?.siblings || [])];
                            newSiblings[index] = { ...sibling, maritalStatus: e.target.value };
                            handleInputChange('financialDetailsList', {
                              ...formData.financialDetailsList,
                              siblings: newSiblings
                            });
                          }}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Gross Monthly Income"
                          value={sibling.grossMonthly}
                          onChange={(e) => {
                            const newSiblings = [...(formData.financialDetailsList?.siblings || [])];
                            newSiblings[index] = { ...sibling, grossMonthly: e.target.value };
                            handleInputChange('financialDetailsList', {
                              ...formData.financialDetailsList,
                              siblings: newSiblings
                            });
                          }}
                          variant="outlined"
                          InputProps={{
                            startAdornment: <InputAdornment position="start">R</InputAdornment>
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Other Income"
                          value={sibling.otherIncome}
                          onChange={(e) => {
                            const newSiblings = [...(formData.financialDetailsList?.siblings || [])];
                            newSiblings[index] = { ...sibling, otherIncome: e.target.value };
                            handleInputChange('financialDetailsList', {
                              ...formData.financialDetailsList,
                              siblings: newSiblings
                            });
                          }}
                          variant="outlined"
                          InputProps={{
                            startAdornment: <InputAdornment position="start">R</InputAdornment>
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      onClick={() => {
                        const newSiblings = formData.financialDetailsList?.siblings?.filter((_, i) => i !== index) || [];
                        handleInputChange('financialDetailsList', {
                          ...formData.financialDetailsList,
                          siblings: newSiblings
                        });
                      }}
                      color="error"
                    >
                      <Trash />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => {
                const newSiblings = [...(formData.financialDetailsList?.siblings || []), createEmptyFamilyMember()];
                handleInputChange('financialDetailsList', {
                  ...formData.financialDetailsList,
                  siblings: newSiblings
                });
              }}
              sx={{ mt: 2 }}
            >
              Add Sibling
            </Button>
          </Box>

          {/* Dependents Section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              2. Dependents
            </Typography>

            {/* Dependent Counts */}
            <Box sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Number of Dependents by Category
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Number at Pre-School"
                    type="number"
                    value={formData.dependentsAtPreSchool || 0}
                    onChange={(e) => handleInputChange('dependentsAtPreSchool', Number(e.target.value))}
                    variant="outlined"
                    InputProps={{
                      inputProps: { min: 0 }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Number at School"
                    type="number"
                    value={formData.dependentsAtSchool || 0}
                    onChange={(e) => handleInputChange('dependentsAtSchool', Number(e.target.value))}
                    variant="outlined"
                    InputProps={{
                      inputProps: { min: 0 }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Number at University"
                    type="number"
                    value={formData.dependentsAtUniversity || 0}
                    onChange={(e) => handleInputChange('dependentsAtUniversity', Number(e.target.value))}
                    variant="outlined"
                    InputProps={{
                      inputProps: { min: 0 }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Dependent Details */}
            <Typography variant="subtitle1" gutterBottom>
              Dependent Details
            </Typography>
            {formData.dependents?.map((dependent, index) => (
              <Box key={index} sx={{ mb: 3, p: 3, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={11}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom>
                          Dependent {index + 1}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          value={dependent.fullName}
                          onChange={(e) => {
                            const newDependents = [...(formData.dependents || [])];
                            newDependents[index] = { ...dependent, fullName: e.target.value };
                            handleInputChange('dependents', newDependents);
                          }}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Relationship"
                          value={dependent.relationship}
                          onChange={(e) => {
                            const newDependents = [...(formData.dependents || [])];
                            newDependents[index] = { ...dependent, relationship: e.target.value };
                            handleInputChange('dependents', newDependents);
                          }}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Age"
                          type="number"
                          value={dependent.age}
                          onChange={(e) => {
                            const newDependents = [...(formData.dependents || [])];
                            newDependents[index] = { ...dependent, age: Number(e.target.value) };
                            handleInputChange('dependents', newDependents);
                          }}
                          variant="outlined"
                          InputProps={{
                            inputProps: { min: 0 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="School/University"
                          value={dependent.schoolOrUniversity}
                          onChange={(e) => {
                            const newDependents = [...(formData.dependents || [])];
                            newDependents[index] = { ...dependent, schoolOrUniversity: e.target.value };
                            handleInputChange('dependents', newDependents);
                          }}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      onClick={() => {
                        const newDependents = formData.dependents?.filter((_, i) => i !== index) || [];
                        handleInputChange('dependents', newDependents);
                      }}
                      color="error"
                    >
                      <Trash />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}

            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => {
                handleInputChange('dependents', [
                  ...(formData.dependents || []),
                  {
                    fullName: '',
                    relationship: '',
                    age: 0,
                    schoolOrUniversity: ''
                  }
                ]);
              }}
              sx={{ mt: 2 }}
            >
              Add Dependent
            </Button>
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
  const renderAssetsAndLiabilities = () => (
    <StyledCard>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          Personal Statement of Assets and Liabilities
        </Typography>

        {/* Fixed Properties Section */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
          Fixed Properties
        </Typography>
        {formData.fixedProperties.map((property, index) => (
          <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={11}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Physical Address"
                      value={property.physicalAddress}
                      onChange={(e) => {
                        const newProperties = [...formData.fixedProperties];
                        newProperties[index] = { ...property, physicalAddress: e.target.value };
                        handleInputChange('fixedProperties', newProperties);
                      }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="ERF No. Township"
                      value={property.erfNoTownship}
                      onChange={(e) => {
                        const newProperties = [...formData.fixedProperties];
                        newProperties[index] = { ...property, erfNoTownship: e.target.value };
                        handleInputChange('fixedProperties', newProperties);
                      }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Date Purchased"
                      type="date"
                      value={property.datePurchased}
                      onChange={(e) => {
                        const newProperties = [...formData.fixedProperties];
                        newProperties[index] = { ...property, datePurchased: e.target.value };
                        handleInputChange('fixedProperties', newProperties);
                      }}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Municipal Value"
                      type="number"
                      value={property.municipalValue}
                      onChange={(e) => {
                        const newProperties = [...formData.fixedProperties];
                        newProperties[index] = { ...property, municipalValue: Number(e.target.value) };
                        handleInputChange('fixedProperties', newProperties);
                      }}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">R</InputAdornment>
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Present Value"
                      type="number"
                      value={property.presentValue}
                      onChange={(e) => {
                        const newProperties = [...formData.fixedProperties];
                        newProperties[index] = { ...property, presentValue: Number(e.target.value) };
                        handleInputChange('fixedProperties', newProperties);
                      }}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">R</InputAdornment>
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={1}>
                <IconButton
                  onClick={() => {
                    const newProperties = formData.fixedProperties.filter((_, i) => i !== index);
                    handleInputChange('fixedProperties', newProperties);
                  }}
                >
                  <Trash />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}

        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => {
            handleInputChange('fixedProperties', [
              ...formData.fixedProperties,
              {
                physicalAddress: '',
                erfNoTownship: '',
                datePurchased: '',
                municipalValue: 0,
                presentValue: 0
              }
            ]);
          }}
          sx={{ mb: 4 }}
        >
          Add Property
        </Button>

        {/* Vehicles Section */}
        <Typography variant="subtitle1" gutterBottom>
          Vehicles
        </Typography>
        {formData.vehicles.map((vehicle, index) => (
          <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={11}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Make, Model and Year"
                      value={vehicle.makeModelYear}
                      onChange={(e) => {
                        const newVehicles = [...formData.vehicles];
                        newVehicles[index] = { ...vehicle, makeModelYear: e.target.value };
                        handleInputChange('vehicles', newVehicles);
                      }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Registration No"
                      value={vehicle.registrationNo}
                      onChange={(e) => {
                        const newVehicles = [...formData.vehicles];
                        newVehicles[index] = { ...vehicle, registrationNo: e.target.value };
                        handleInputChange('vehicles', newVehicles);
                      }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Present Value"
                      type="number"
                      value={vehicle.presentValue}
                      onChange={(e) => {
                        const newVehicles = [...formData.vehicles];
                        newVehicles[index] = { ...vehicle, presentValue: Number(e.target.value) };
                        handleInputChange('vehicles', newVehicles);
                      }}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">R</InputAdornment>
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={1}>
                <IconButton
                  onClick={() => {
                    const newVehicles = formData.vehicles.filter((_, i) => i !== index);
                    handleInputChange('vehicles', newVehicles);
                  }}
                >
                  <Trash />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}

        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => {
            handleInputChange('vehicles', [
              ...formData.vehicles,
              {
                makeModelYear: '',
                registrationNo: '',
                presentValue: 0
              }
            ]);
          }}
          sx={{ mb: 4 }}
        >
          Add Vehicle
        </Button>

        {/* Other Assets Section */}
        <Typography variant="subtitle1" gutterBottom>
          Other Assets
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Value of Jewellery"
              type="number"
              value={formData.jewelleryValue}
              onChange={(e) => handleInputChange('jewelleryValue', Number(e.target.value))}
              variant="outlined"
              InputProps={{
                startAdornment: <InputAdornment position="start">R</InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Value of Furniture and Fittings"
              type="number"
              value={formData.furnitureAndFittingsValue}
              onChange={(e) => handleInputChange('furnitureAndFittingsValue', Number(e.target.value))}
              variant="outlined"
              InputProps={{
                startAdornment: <InputAdornment position="start">R</InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Value of Equipment"
              type="number"
              value={formData.equipmentValue}
              onChange={(e) => handleInputChange('equipmentValue', Number(e.target.value))}
              variant="outlined"
              InputProps={{
                startAdornment: <InputAdornment position="start">R</InputAdornment>
              }}
            />
          </Grid>
        </Grid>

        {/* Liabilities Section */}
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Liabilities
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Overdrafts"
              type="number"
              value={formData.overdrafts}
              onChange={(e) => handleInputChange('overdrafts', Number(e.target.value))}
              variant="outlined"
              InputProps={{
                startAdornment: <InputAdornment position="start">R</InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Unsecured Loans"
              type="number"
              value={formData.unsecuredLoans}
              onChange={(e) => handleInputChange('unsecuredLoans', Number(e.target.value))}
              variant="outlined"
              InputProps={{
                startAdornment: <InputAdornment position="start">R</InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Credit Card Debts"
              type="number"
              value={formData.creditCardDebts}
              onChange={(e) => handleInputChange('creditCardDebts', Number(e.target.value))}
              variant="outlined"
              InputProps={{
                startAdornment: <InputAdornment position="start">R</InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Income Tax Debts"
              type="number"
              value={formData.incomeTaxDebts}
              onChange={(e) => handleInputChange('incomeTaxDebts', Number(e.target.value))}
              variant="outlined"
              InputProps={{
                startAdornment: <InputAdornment position="start">R</InputAdornment>
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </StyledCard>
  );

  const renderReviewSection = () => (
    <StyledCard>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          Application Review
        </Typography>

        {/* Personal Information Review */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            Personal Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">
                Full Name
              </Typography>
              <Typography>
                {formData.name} {formData.surname}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">
                ID Number
              </Typography>
              <Typography>{formData.saIdNumber}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">
                Contact Number
              </Typography>
              <Typography>{formData.contactNumber}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">
                Email
              </Typography>
              <Typography>{formData.email}</Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Study Details Review */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            Study Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">
                Institution
              </Typography>
              <Typography>{formData.institutionAppliedFor}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">
                Course
              </Typography>
              <Typography>{formData.degreeOrDiploma}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">
                Year of Study
              </Typography>
              <Typography>{formData.yearOfStudyAndCommencement}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">
                Funding Required
              </Typography>
              <Typography>R {formData.approximateFundingRequired?.toLocaleString()}</Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Financial Summary */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            Financial Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">
                Total Assets
              </Typography>
              <Typography>R {calculateTotalAssets().toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">
                Total Liabilities
              </Typography>
              <Typography>R {calculateTotalLiabilities().toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                Net Worth
              </Typography>
              <Typography>R {(calculateTotalAssets() - calculateTotalLiabilities()).toLocaleString()}</Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Declaration */}
        <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Declaration
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            I declare that all the information provided in this application is true and correct. I understand that any false information may
            result in the rejection of my application or the withdrawal of any bursary awarded.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name (as signature)"
                value={formData.declarationSignedBy}
                onChange={(e) => handleInputChange('declarationSignedBy', e.target.value)}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={formData.declarationDate}
                onChange={(e) => handleInputChange('declarationDate', e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </StyledCard>
  );

  const calculateTotalAssets = () => {
    const propertyValues = formData.fixedProperties.reduce((sum, prop) => sum + (prop.presentValue || 0), 0);
    const vehicleValues = formData.vehicles.reduce((sum, vehicle) => sum + (vehicle.presentValue || 0), 0);
    return (
      propertyValues +
      vehicleValues +
      (formData.jewelleryValue || 0) +
      (formData.furnitureAndFittingsValue || 0) +
      (formData.equipmentValue || 0)
    );
  };

  const calculateTotalLiabilities = () => {
    return (
      (formData.overdrafts || 0) +
      (formData.unsecuredLoans || 0) +
      (formData.creditCardDebts || 0) +
      (formData.incomeTaxDebts || 0) +
      (formData.contingentLiabilities || 0)
    );
  };

  // Update the renderStepContent function to include all sections
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderPersonalDetails();
      case 1:
        return renderStudyDetails();
      case 2:
        return renderAcademicHistory();
      case 3:
        return renderAdditionalInformation();
      case 4:
        return renderFinancialDetails();
      case 5:
        return renderAssetsAndLiabilities();
      case 6:
        return renderReviewSection();
      default:
        return null;
    }
  };

  const handleNext = useCallback(() => {
    const nextStep = activeStep + 1;
    setActiveStep(nextStep);
    onStepChange?.(nextStep);
  }, [activeStep, onStepChange]);

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto', p: 3 }}>
      <StyledPaper>
        <Typography variant="h4" align="center" gutterBottom>
          Bursary Application Form
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {renderStepContent(activeStep)}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button disabled={activeStep === 0} onClick={handleBack} startIcon={<ArrowLeft />} variant="outlined">
            Back
          </Button>
          <Button
            variant="contained"
            onClick={activeStep === steps.length - 1 ? () => onSubmit(formData) : handleNext}
            endIcon={activeStep === steps.length - 1 ? null : <ArrowForward />}
            disabled={!isStepValid(activeStep)}
          >
            {activeStep === steps.length - 1 ? 'Submit Application' : 'Continue'}
          </Button>
        </Box>
      </StyledPaper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        action={
          <IconButton size="small" color="inherit" onClick={() => setSnackbarOpen(false)}>
            <CloseCircle />
          </IconButton>
        }
      />
    </Box>
  );
};

export default BursaryApplicationForm;
