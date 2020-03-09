const puppeteer = require('puppeteer');
const fs = require('fs');

const preparePageForTest = async (page) => {
    const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
    await page.setUserAgent(userAgent);
};

( async() => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await preparePageForTest(page);

        await page.goto('https://www.facebook.com/');
        await page.screenshot({path: './screenshots/screenshot.png'});

        const docContent = await page.content();

        await page.waitForSelector(".news_unit-text");

        const allElements = await page.evaluate( () => {
            let elements = document.querySelectorAll("div").textContent;
            console.log("this is the elements ",elements);
            return elements;
        });

        console.log(allElements);
        fs.writeFile('captured.html',docContent,error => {
            console.log("this is the error : ",error);
        });
        //news_unit-text

        await browser.close();
    }
    catch(error) {
        console.log(error);
    }

})();
