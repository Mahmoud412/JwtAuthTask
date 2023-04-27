import * as yup from 'yup';

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const phoneRegex = /^((\+7)|8)\d{10}$/;

export const isEmail = (str: string): boolean => {
  return str.match(emailRegex) !== null;
};

export const isPhoneNumber = (str: string): boolean => {
  return str.match(phoneRegex) !== null;
};

// export const credentialValidationSchema = yup.object().shape({
//     credential: yup
//       .string()
//       .required('Email or phone number is required')
//       .test('Invalid email or phone number', (text: any) => {
//         return isEmail(text) || isPhoneNumber(text);
//       }),
//   });
