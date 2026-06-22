import { users } from '../../../testData/users';
import { runCheckoutFlow } from './helpers/checkoutFlow';

runCheckoutFlow(users.mirage_user);

