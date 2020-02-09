const Page = require('./helpers/page')

let page;

// antes de cada prueba
beforeEach( async () => {
    page = await Page.build()
    await page.goto('http://localhost:3000')
})

// despues de cada prueba
/* afterEach(async () => {
    await page.close();
}) */

test('We can launch a browser', async () => {
    // Logo de la pagina 
    const text = await page.getContentsOf('a.brand-logo')
    // const text = await page.$eval('a.brand-logo', el => el.innerHTML)
    expect(text).toEqual('Blogster');
});

test('clicking login', async () => {
    await page.click('.right a');
    const url = await page.url()
    expect(url).toMatch(/accounts\.google\.com/);
})

test('when signed in, shows logout button', async () => {
    try {
        await page.login();
        const text = await page.getContentsOf('a[href="/auth/logout"]');
        expect(text).toEqual('Logout');
    }catch (e) {
        console.log(e)
    }
})

