import * as Yup from 'yup';

export const validationSchema = Yup.object({
  donationAmount: Yup.number()
    .required('Donation amount is required')
    .min(1, 'Donation amount must be greater than 0'),
  donorInfo: Yup.object({
    name: Yup.string().required('Full name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: Yup.string().required('Contact number is required'),
    identityNoOrCompanyRegNo: Yup.string()
      .required('Identity/Company Registration No. is required'),
    incomeTaxNumber: Yup.string().test(
      'incomeTaxNumber',
      'Please enter a valid Income Tax Number or N/A',
      (value) => value === 'N/A' || value === 'n/a' || (!!value && value.length > 0)
    ),
    address: Yup.string().required('Address is required')
  }),
  paymentType: Yup.string().required('Please select a payment method'),
  isAnonymous: Yup.boolean(),
  proofOfPayment: Yup.mixed().when('paymentType', {
    is: 'manual',
    then: (schema) => schema.nullable()
  })
});