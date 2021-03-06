const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

/* afterEach(async () => {
  await page.close();
}); */




describe('While logged in ', async () => {
  beforeEach(async () => {
      await page.login();
      await page.click('a.btn-floating');
  })

  test.only('can see blog create form', async () => {
      const label = await page.getContentsOf('form label')
      expect(label).toEqual('Blog Title')
  });

  describe('And using valid inputs', async () => {
      beforeEach(async () => {
          await page.type('.title input', 'My title');
          await page.type('.content input', 'My content');
          await page.click('form button');
      })
  
      test.only('Submitting takes user to review screen', async () => {
          const text = await page.getContentsOf('h5');
          expect(text).toEqual('Please confirm your entries')
      })
  })


})