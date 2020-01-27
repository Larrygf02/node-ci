const puppeteer = require('puppeteer');

let browser, page;

beforeEach( async () => {
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    await page.goto('localhost:3000')
})

test('We can launch a browser', async () => {
    // Logo de la pagina 
    const text = await page.$eval('a.brand-logo', el => el.innerHTML)
    expect(text).toEqual('Blogster');
});
