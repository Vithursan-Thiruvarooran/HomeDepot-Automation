import { expect } from '@wdio/globals';
import StorePage from '../pages/storePage';

describe('Automation Challenge', () => {
  it('Open WebPage and validate title', async () => {
    await StorePage.open();
    expect(await browser.getTitle()).toStrictEqual('QA Automation Assessment');
  });
});

