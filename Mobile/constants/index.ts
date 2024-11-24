import arrowDown from "@/assets/icons/arrow-down.png";
import arrowUp from "@/assets/icons/arrow-up.png";
import backArrow from "@/assets/icons/back-arrow.png";
import chat from "@/assets/icons/chat.png";
import checkmark from "@/assets/icons/check.png";
import close from "@/assets/icons/close.png";
import dollar from "@/assets/icons/dollar.png";
import email from "@/assets/icons/email.png";
import eyecross from "@/assets/icons/eyecross.png";
import google from "@/assets/icons/google.png";
import home from "@/assets/icons/home.png";
import list from "@/assets/icons/list.png";
import lock from "@/assets/icons/lock.png";
import map from "@/assets/icons/map.png";
import marker from "@/assets/icons/marker.png";
import out from "@/assets/icons/out.png";
import person from "@/assets/icons/person.png";
import pin from "@/assets/icons/pin.png";
import point from "@/assets/icons/point.png";
import profile from "@/assets/icons/profile.png";
import search from "@/assets/icons/search.png";
import selectedMarker from "@/assets/icons/selected-marker.png";
import star from "@/assets/icons/star.png";
import target from "@/assets/icons/target.png";
import to from "@/assets/icons/to.png";
import clearLogo from "@/assets/logo/SaleafClear.png"
import student from "@/assets/icons/student.png";
import calendar from "@/assets/icons/calendar.png";
import donate from "@/assets/icons/donate.png";
import event from "@/assets/images/event.png";
import graduated from "@/assets/images/graduated.png";
import golf from "@/assets/images/images.jpeg";
import students from "@/assets/images/student.jpg";
import { QuickReply } from "@/types/types";
export const images = {
  clearLogo,
  event,
  graduated,
  golf,
  students
};

export const icons = {
  arrowDown,
  arrowUp,
  backArrow,
  chat,
  checkmark,
  close,
  dollar,
  email,
  eyecross,
  google,
  home,
  list,
  lock,
  map,
  marker,
  out,
  person,
  pin,
  point,
  profile,
  search,
  selectedMarker,
  star,
  target,
  to,
  student,
  calendar,
  donate
};

export const onboarding = [
  {
    id: 1,
    title: "The perfect ride is just a tap away!",
    description:
      "Your journey begins with Ryde. Find your ideal ride effortlessly.",
    image: images.onboarding1,
  },
  {
    id: 2,
    title: "Best car in your hands with Ryde",
    description:
      "Discover the convenience of finding your perfect ride with Ryde",
    image: images.onboarding2,
  },
  {
    id: 3,
    title: "Your ride, your way. Let's go!",
    description:
      "Enter your destination, sit back, and let us take care of the rest.",
    image: images.onboarding3,
  },
];

export const data = {
  onboarding,
};
export const pretextDonationAmount = [
  { label: "R10", value: "10" },
  { label: "R100", value: "100" },
  { label: "R1000", value: "1000" },
  { label: "R10000", value: "10000" },
];
export const donationType =[
  {label:"Online Payments (Yoco Payment)", value:"3"},
  {label:"Bank Transfer (Manual Payment)", value:"4"},

]
 export const initialAppUser: AppUser = {
  appUserId: '',
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
  institutionAppliedFor: '',
  degreeOrDiploma: '',
  yearOfStudyAndCommencement: '',
  studentNumber: '',
  approximateFundingRequired: 0,
  nameOfInstitution: '',
  yearCommencedInstitution: 0,
  yearToBeCompletedInstitution: 0,
  tertiarySubjectsAndResultsFile: '',
  nameOfSchool: '',
  yearCommencedSchool: 0,
  yearToBeCompletedSchool: 0,
  grade12SubjectsAndResultsFile: '',
  grade11SubjectsAndResultsFile: '',
  leadershipRoles: '',
  sportsAndCulturalActivities: '',
  hobbiesAndInterests: '',
  reasonForStudyFieldChoice: '',
  selfDescription: '',
  intendsToStudyFurther: false,
  whySelectYou: '',
  hasSensitiveMatters: false,
  financialDetailsList: {},
  dependentsAtPreSchool: 0,
  dependentsAtSchool: 0,
  dependentsAtUniversity: 0,
  dependents: [],
  fixedProperties: [],
  vehicles: [],
  lifeAssurancePolicies: [],
  investments: [],
  jewelleryValue: 0,
  furnitureAndFittingsValue: 0,
  equipmentValue: 0,
  otherAssets: [""],
  overdrafts: 0,
  unsecuredLoans: 0,
  creditCardDebts: 0,
  incomeTaxDebts: 0,
  otherLiabilities: [""],
  contingentLiabilities: 0,
  totalOfAssetsAndLiabilities: 0,
  declarationSignedBy: '',
  declarationDate: Date.now().toString(),
};

export interface AppUser {
  appUserId: string;
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
  institutionAppliedFor: string;
  degreeOrDiploma: string;
  yearOfStudyAndCommencement: string;
  studentNumber: string;
  approximateFundingRequired: number;
  nameOfInstitution: string;
  yearCommencedInstitution: number;
  yearToBeCompletedInstitution: number;
  tertiarySubjectsAndResultsFile: string;
  nameOfSchool: string;
  yearCommencedSchool: number;
  yearToBeCompletedSchool: number;
  grade12SubjectsAndResultsFile: string;
  grade11SubjectsAndResultsFile: string;
  leadershipRoles: string;
  sportsAndCulturalActivities: string;
  hobbiesAndInterests: string;
  reasonForStudyFieldChoice: string;
  selfDescription: string;
  intendsToStudyFurther: boolean;
  whySelectYou: string;
  hasSensitiveMatters: boolean;
  financialDetailsList: {
    father?:FamilyBackground,
    mother?:FamilyBackground,
    siblings?:FamilyBackground,
    selfApplicant?:FamilyBackground,
    guardian_person?:FamilyBackground
  }; // Define a more specific type if needed
  dependentsAtPreSchool: number;
  dependentsAtSchool: number;
  dependentsAtUniversity: number;
  dependents: any[]; // Define a more specific type if needed
  fixedProperties: any[]; // Define a more specific type if needed
  vehicles: any[]; // Define a more specific type if needed
  lifeAssurancePolicies: any[]; // Define a more specific type if needed
  investments: any[]; // Define a more specific type if needed
  jewelleryValue: number;
  furnitureAndFittingsValue: number;
  equipmentValue: number;
  otherAssets: any[]; // Define a more specific type if needed
  overdrafts: number;
  unsecuredLoans: number;
  creditCardDebts: number;
  incomeTaxDebts: number;
  otherLiabilities: any[]; // Define a more specific type if needed
  contingentLiabilities: number;
  totalOfAssetsAndLiabilities: number;
  declarationSignedBy: string;
  declarationDate: string;
}

interface FamilyBackground {
  name?: string;
  surname?: string;
  idNumber?: string;
  occupation?: string;
  maritalStatus?: string;
  grossMonthly?: string;
  otherIncome?: string;
}

export const MOCK_QUICK_REPLIES: QuickReply[] = [
  { id: "1", text: "Technical Support" },
  { id: "2", text: "Billing Question" },
  { id: "3", text: "Feature Request" },
  { id: "4", text: "Account Help" },
];