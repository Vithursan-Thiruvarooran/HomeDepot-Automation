import { expect } from '@wdio/globals';
import { messages } from '../testData/messages';
import { users } from '../testData/users';

import loginPage from '../pages/loginPage';

const user = users.vault_locked;

describe('Automation Challenge', () => {
  it('should load the page with the correct title', async () => {
    await loginPage.open();
    expect(await browser.getTitle()).toStrictEqual('QA Automation Assessment');
  });

  it('should log in and land on the products page', async () => {
    await loginPage.login(user.username, user.password);
    await expect(await loginPage.getLoginErrorMsg()).toStrictEqual(messages.loginErrorMsg);
  });
});

