export interface DonorInfo {
  name: string;
  email: string;
  phone: string;
  identityNoOrCompanyRegNo: string;
  incomeTaxNumber: string;
  address: string;
}

export interface BankAccountInfo {
  branch: string;
  branchCode: string;
  accountNo: string;
}

export interface DonationFormValues {
  donationAmount: string;
  donorInfo: DonorInfo;
  paymentType: string;
  isAnonymous: boolean;
  proofOfPayment?: File | null;
}

export interface OnlinePaymentPayload {
  amount: number;
  currency: string;
  cancelUrl: string;
  successUrl: string;
  failureUrl: string;
  isAnonymous: boolean;
}

export interface ManualPaymentPayload {
  amount: number;
  currency: string;
  isAnonymous: boolean;
}

// types.ts
export interface FamilyBackground {
  name: string;
  surname: string;
  idNumber: string;
  occupation: string;
  maritalStatus: string;
  grossMonthly: string;
  otherIncome: string;
}

export interface Dependent {
  fullName: string;
  relationship: string;
  age: number;
  schoolOrUniversity: string;
}

export interface FixedProperty {
  physicalAddress: string;
  erfNoTownship: string;
  datePurchased: string;
  municipalValue: number;
  presentValue: number;
}

export interface Vehicle {
  makeModelYear: string;
  registrationNo: string;
  presentValue: number;
}

export interface LifeAssurancePolicy {
  company: string;
  description: string;
  surrenderValue: number;
}

export interface Investment {
  company: string;
  description: string;
  marketValue: number;
}

export interface OtherAsset {
  description: string;
  value: number;
}

export interface OtherLiability {
  description: string;
  value: number;
}

export interface BursaryFormData {
  // Personal Details
  name: string;
  surname: string;
  dateOfBirth: string;
  saIdNumber: string;
  placeOfBirth: string;
  isOfLebaneseOrigin: boolean;
  homePhysicalAddress: string;
  homePostalAddress: string;
  contactNumber: string;
  email: string;
  hasDisabilities: boolean;
  disabilityExplanation: string;

  // Study Details
  institutionAppliedFor: string;
  degreeOrDiploma: string;
  yearOfStudyAndCommencement: string;
  studentNumber: string;
  approximateFundingRequired: number;

  // Academic History
  nameOfInstitution: string;
  yearCommencedInstitution: number;
  yearToBeCompletedInstitution: number;
  tertiarySubjectsAndResultsFile: File | null;
  nameOfSchool: string;
  yearCommencedSchool: number;
  yearToBeCompletedSchool: number;
  grade12SubjectsAndResultsFile: File | null;
  grade11SubjectsAndResultsFile: File | null;

  // Additional Information
  leadershipRoles: string;
  sportsAndCulturalActivities: string;
  hobbiesAndInterests: string;
  reasonForStudyFieldChoice: string;
  selfDescription: string;
  intendsToStudyFurther: boolean;
  whySelectYou: string;
  hasSensitiveMatters: boolean;

  // Financial Details
  financialDetailsList: {
    father?: FamilyBackground;
    mother?: FamilyBackground;
    siblings?: FamilyBackground[];
    selfApplicant?: FamilyBackground;
    guardian_person?: FamilyBackground;
  };

  // Dependents
  dependentsAtPreSchool: number;
  dependentsAtSchool: number;
  dependentsAtUniversity: number;
  dependents: Dependent[];

  // Assets
  fixedProperties: FixedProperty[];
  vehicles: Vehicle[];
  lifeAssurancePolicies: LifeAssurancePolicy[];
  investments: Investment[];
  jewelleryValue: number;
  furnitureAndFittingsValue: number;
  equipmentValue: number;
  otherAssets: OtherAsset[];

  // Liabilities
  overdrafts: number;
  unsecuredLoans: number;
  creditCardDebts: number;
  incomeTaxDebts: number;
  otherLiabilities: OtherLiability[];
  contingentLiabilities: number;
  totalOfAssetsAndLiabilities: number;

  // Declaration
  declarationSignedBy: string;
  declarationDate: string;
}

export interface BursaryFormProps {
  onSubmit: (data: BursaryFormData) => void;
  initialData?: Partial<BursaryFormData>;
  onStepChange?: (step: number) => void;
}
