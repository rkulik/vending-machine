import { Role } from '@vending-machine/types/user';
import { ALLOWED_DEPOSIT_VALUES } from '@vending-machine/utils/deposit';
import { boolean, InferType, number, object, string } from 'yup';

export const saveProductSchema = object({
  productName: string().required('No product name provided'),
  cost: number()
    .required('No cost provided')
    .test(
      'cost',
      `Cost must be greater than 0 and dividable by ${Math.min(...ALLOWED_DEPOSIT_VALUES)}`,
      cost => !!cost && cost % Math.min(...ALLOWED_DEPOSIT_VALUES) === 0,
    ),
  amountAvailable: number()
    .required('No amount available provided')
    .test(
      'amountAvailable',
      'Amount must be greater or equal to 0',
      amountAvailable => amountAvailable !== undefined && amountAvailable >= 0,
    ),
})
  .noUnknown()
  .defined();

export type SaveProduct = InferType<typeof saveProductSchema>;

const passwordSchema = string().required('No password provided').min(8, 'Password must be at least 8 characters long');

export const saveUserFormSchema = object({
  username: string().required('No username provided'),
  password: passwordSchema,
  seller: boolean().required('No seller flag provided'),
});

export const saveUserSchema = object({
  username: string().required('No username provided'),
  password: passwordSchema,
  role: string()
    .required('No role provided')
    .test(
      'role',
      `Role must be one of the following: ${Object.values(Role).join(', ')}`,
      role => !!role && Object.values(Role).includes(role as Role),
    ),
})
  .noUnknown()
  .defined();

export type SaveUser = InferType<typeof saveUserSchema>;

export const loginSchema = object({
  username: string().required('No username provided'),
  password: string().required('No password provided'),
})
  .noUnknown()
  .defined();

export type Login = InferType<typeof loginSchema>;

export const depositSchema = object({
  cents: number()
    .required('No cents provided')
    .test(
      'cents',
      `Only ${ALLOWED_DEPOSIT_VALUES.join(', ')} cents allowed`,
      cents => !!cents && ALLOWED_DEPOSIT_VALUES.includes(cents),
    ),
})
  .noUnknown()
  .defined();

export type Deposit = InferType<typeof depositSchema>;

export const buySchema = object({
  productId: number().required('No product ID provided'),
  amount: number()
    .required('No amount provided')
    .test('amount', 'Amount must be greater than 0', amount => amount !== undefined && amount > 0),
})
  .noUnknown()
  .defined();

export type Buy = InferType<typeof buySchema>;
