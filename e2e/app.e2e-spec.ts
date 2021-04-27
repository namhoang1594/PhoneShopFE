import { PhoneShopATemplatePage } from './app.po';

describe('PhoneShopA App', function() {
  let page: PhoneShopATemplatePage;

  beforeEach(() => {
    page = new PhoneShopATemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
