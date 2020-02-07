const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory')
const userFactory = require('./factories/userFactory')

let browser, page;

// antes de cada prueba
beforeEach( async () => {
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    await page.goto('localhost:3000')
})

// despues de cada prueba
afterEach(async () => {
    // await browser.close()
})

test('We can launch a browser', async () => {
    // Logo de la pagina 
    const text = await page.$eval('a.brand-logo', el => el.innerHTML)
    expect(text).toEqual('Blogster');
});

test('clicking login', async () => {
    await page.click('.right a');
    const url = await page.url()
    expect(url).toMatch(/accounts\.google\.com/);
})

test.only('when signed in, shows logout button', async () => {
    const user = await userFactory()
    const { session, sig } = sessionFactory(user)

    await page.setCookie({ name: 'session', value: session})
    await page.setCookie({ name: 'session.sig', value: sig})
    await page.goto('localhost:3000')
    await page.waitFor('a[href="/auth/logout"]');

    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
    expect(text).toEqual('Logout');
})