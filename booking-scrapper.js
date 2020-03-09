const puppeteer = require('puppeteer');
const fs = require('fs');

let bookingUrl = 'https://www.booking.com/searchresults.en.html?label=gen173nr-1FCAEoggI46AdIM1gEaCeIAQGYAQ24AQfIAQzYAQHoAQH4AQuIAgGoAgO4AuPBlvMFwAIB&sid=80975b25acbb3b3dc4ad83aa9651de28&sb=1&sb_lp=1&src=index&src_elem=sb&error_url=https%3A%2F%2Fwww.booking.com%2Findex.fr.html%3Flabel%3Dgen173nr-1FCAEoggI46AdIM1gEaCeIAQGYAQ24AQfIAQzYAQHoAQH4AQuIAgGoAgO4AuPBlvMFwAIB%3Bsid%3D80975b25acbb3b3dc4ad83aa9651de28%3Bsb_price_type%3Dtotal%26%3B&ss=Espagne&is_ski_area=&checkin_year=2020&checkin_month=4&checkin_monthday=1&checkout_year=2020&checkout_month=4&checkout_monthday=30&group_adults=2&group_children=0&no_rooms=1&b_h4u_keep_filters=&from_sf=1&ss_raw=espagne&ac_position=0&ac_langcode=fr&ac_click_type=b&dest_id=197&dest_type=country&place_id_lat=39.9878&place_id_lon=-3.69817&search_pageview_id=b2a00cf291c800b1&search_selected=true&search_pageview_id=b2a00cf291c800b1&ac_suggestion_list_length=5&ac_suggestion_theme_list_length=0';
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
                hotelJson.price = hotelelement.querySelector('div.bui-price-display__value prco-inline-block-maker-helper').innerText;
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

})();