/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { User } from '@vending-machine/domains/user/entity';
import 'next';

declare module 'next' {
  export interface NextApiRequest extends IncomingMessage {
    user?: User;
    tokenId?: string;
  }
}
