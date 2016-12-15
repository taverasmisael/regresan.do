import { RegresandoPage } from './app.po';

describe('regresando App', function() {
  let page: RegresandoPage;

  beforeEach(() => {
    page = new RegresandoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
