const puppeteer = require('puppeteer');
const fs = require('fs');

let bookingUrl = 'https://www.booking.com/searchresults.html?label=gen173nr-1DCAEoggI46AdIM1gEaCeIAQGYATG4AQfIAQzYAQPoAQH4AQKIAgGoAgO4Aum9mvMFwAIB&sid=9938cb56fb5220fde06cd845ac8b3d0d&sb=1&sb_lp=1&src=index&src_elem=sb&error_url=https%3A%2F%2Fwww.booking.com%2Findex.html%3Flabel%3Dgen173nr-1DCAEoggI46AdIM1gEaCeIAQGYATG4AQfIAQzYAQPoAQH4AQKIAgGoAgO4Aum9mvMFwAIB%3Bsid%3D9938cb56fb5220fde06cd845ac8b3d0d%3Bsb_price_type%3Dtotal%26%3B&ss=Mexico+City%2C+Mexico+DF%2C+Mexico&is_ski_area=0&checkin_year=2020&checkin_month=5&checkin_monthday=2&checkout_year=2020&checkout_month=5&checkout_monthday=9&group_adults=2&group_children=0&no_rooms=1&b_h4u_keep_filters=&from_sf=1&ac_position=0&ac_langcode=en&ac_click_type=b&dest_id=-1658079&dest_type=city&iata=MEX&place_id_lat=19.432863&place_id_lon=-99.133301&search_pageview_id=17f58bf4d9ad007b&search_selected=true&ss_raw=mexico';
(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
    await page.goto(bookingUrl);

    // get hotel details
    let hotelData = await page.evaluate(() => {
        let hotels = [];
        // get the hotel elements
        let hotelsElms = document.querySelectorAll('div.sr_property_block[data-hotelid]');
        // get the hotel data
        hotelsElms.forEach((hotelelement) => {
            let hotelJson = {};
            try {
                hotelJson.name = hotelelement.querySelector('span.sr-hotel__name').innerText;
                hotelJson.stars = hotelelement.querySelector('i.bk-icon-wrapper.bk-icon-stars.star_track').innerText;
                hotelJson.reviews = hotelelement.querySelector('div.bui-review-score__title').innerText;
                hotelJson.rating = hotelelement.querySelector('span.review-score-badge').innerText;
                hotelJson.price = hotelelement.querySelector('div.bui-price-display__value').innerText;
                if(hotelelement.querySelector('strong.price')){
                    hotelJson.price = hotelelement.querySelector('strong.price').innerText;
                }
            }
            catch (exception){

            }
            hotels.push(hotelJson);
        });
        return hotels;
    });

    console.dir(hotelData);
    try {
        fs.writeFile('json/hotels.json',JSON.stringify(hotelData, null, 4),error => {
            console.log("this is the error : ",error);
        });
    }
    catch(e) {

    }
    browser.close();
})();
