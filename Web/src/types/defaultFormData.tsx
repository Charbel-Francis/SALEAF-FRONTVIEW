import { BursaryFormData, FamilyBackground } from 'types/types';

const emptyFamilyBackground: FamilyBackground = {
  name: '',
  surname: '',
  idNumber: '',
  occupation: '',
  maritalStatus: '',
  grossMonthly: '',
  otherIncome: ''
};

export const defaultFormData: BursaryFormData = {
  name: '',
  surname: '',
  dateOfBirth: '',
  saIdNumber: '',
  placeOfBirth: '',
  isOfLebaneseOrigin: false,
  homePhysicalAddress: '',
  homePostalAddress: '',
  contactNumber: '',
  email: '',
  hasDisabilities: false,
  disabilityExplanation: '',

  // Study Details
  institutionAppliedFor: '',
  degreeOrDiploma: '',
  yearOfStudyAndCommencement: '',
  studentNumber: '',
  approximateFundingRequired: 0,

  // Academic History
  nameOfInstitution: '',
  yearCommencedInstitution: 0,
  yearToBeCompletedInstitution: 0,
  tertiarySubjectsAndResultsFile: new File([], ''),
  nameOfSchool: '',
  yearCommencedSchool: 0,
  yearToBeCompletedSchool: 0,
  grade12SubjectsAndResultsFile: new File([], ''),
  grade11SubjectsAndResultsFile: new File([], ''),

  // Additional Information
  leadershipRoles: '',
  sportsAndCulturalActivities: '',
  hobbiesAndInterests: '',
  reasonForStudyFieldChoice: '',
  selfDescription: '',
  intendsToStudyFurther: false,
  whySelectYou: '',
  hasSensitiveMatters: false,

  // Financial Details
  financialDetailsList: {
    father: { ...emptyFamilyBackground },
    mother: { ...emptyFamilyBackground },
    siblings: [],
    selfApplicant: { ...emptyFamilyBackground },
    guardian_person: { ...emptyFamilyBackground }
  },

  // Dependents
  dependentsAtPreSchool: 0,
  dependentsAtSchool: 0,
  dependentsAtUniversity: 0,
  dependents: [],

  // Assets
  fixedProperties: [],
  vehicles: [],
  lifeAssurancePolicies: [],
  investments: [],
  jewelleryValue: 0,
  furnitureAndFittingsValue: 0,
  equipmentValue: 0,
  otherAssets: [],

  // Liabilities
  overdrafts: 0,
  unsecuredLoans: 0,
  creditCardDebts: 0,
  incomeTaxDebts: 0,
  otherLiabilities: [],
  contingentLiabilities: 0,
  totalOfAssetsAndLiabilities: 0,

  // Declaration
  declarationSignedBy: '',
  declarationDate: ''
};

// Empty item creators for arrays
export const createEmptyDependent = () => ({
  fullName: '',
  relationship: '',
  age: 0,
  schoolOrUniversity: ''
});

export const createEmptyProperty = () => ({
  physicalAddress: '',
  erfNoTownship: '',
  datePurchased: '',
  municipalValue: 0,
  presentValue: 0
});

export const createEmptyVehicle = () => ({
  makeModelYear: '',
  registrationNo: '',
  presentValue: 0
});

export const createEmptyLifeAssurancePolicy = () => ({
  company: '',
  description: '',
  surrenderValue: 0
});

export const createEmptyInvestment = () => ({
  company: '',
  description: '',
  marketValue: 0
});

export const createEmptyOtherAsset = () => ({
  description: '',
  value: 0
});

export const createEmptyOtherLiability = () => ({
  description: '',
  value: 0
});

export const createEmptySibling = () => ({
  ...emptyFamilyBackground
});
