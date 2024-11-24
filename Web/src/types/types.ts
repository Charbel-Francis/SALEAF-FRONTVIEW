export interface DonorInfo {
    name: string;
    email: string;
    phone: string;
    identityNoOrCompanyRegNo: string;
    incomeTaxNumber: string;
    address: string;
  }
  
  export interface BankAccountInfo {
    bankName: string;
    accountNumber: string;
    accountName: string;
    branchCode?: string;
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