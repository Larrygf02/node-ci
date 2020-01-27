const puppeteer = require('puppeteer');

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
    await browser.close()
})

test('We can launch a browser', async () => {
    // Logo de la pagina 
    const text = await page.$eval('a.brand-logo', el => el.innerHTML)
    expect(text).toEqual('Blogster');
});

test('clicking login', async () => {
    await page.click('.right a');
    const url = await page.url()
    console.log(url);
})