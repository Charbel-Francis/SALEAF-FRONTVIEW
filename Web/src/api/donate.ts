import { BankAccountInfo, ManualPaymentPayload, OnlinePaymentPayload } from "types/types";
export const donationAPI = {
  submitOnlinePayment: async (payload: OnlinePaymentPayload): Promise<{ redirectUrl: string }> => {
    const response = await fetch('/api/Donation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error('Failed to process online payment');
    }
    return response.json();
  },

  submitManualPayment: async (payload: ManualPaymentPayload): Promise<void> => {
    const response = await fetch('/api/Donation/manual-payment-donation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error('Failed to process manual payment');
    }
  },

  getBankAccountInfo: async (): Promise<BankAccountInfo> => {
    const response = await fetch('/api/BankAccountInfo');
    if (!response.ok) {
      throw new Error('Failed to fetch bank account information');
    }
    return response.json();
  }
};