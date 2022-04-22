const cheerio = require('cheerio');
const fs = require('fs');
const headers = require('../utils/headerObj')
var rp = require('request-promise');
const Sort = require('../utils/sort');

const options = ({ query, prange, sort }) => {
    var uri;
    if(!!prange) {
        if(sort=='asc'){
            uri =`https://www.amazon.in/s?k=${query}&rh=p_36:${prange[0]*100}-${prange[1]*100}&s=price-asc-rank`;
        }else if(sort=='desc'){
            uri =`https://www.amazon.in/s?k=${query}&rh=p_36:${prange[0]*100}-${prange[1]*100}&s=price-desc-rank`;
        }else{
            uri =`https://www.amazon.in/s?k=${query}&rh=p_36:${prange[0]*100}-${prange[1]*100}`;
        }
    }else{
        if(sort=='asc'){
            uri =`https://www.amazon.in/s?k=${query}&s=price-asc-rank`;
        }else if(sort=='desc'){
            uri =`https://www.amazon.in/s?k=${query}&s=price-desc-rank`;
        }else{
            uri =`https://www.amazon.in/s?k=${query}`;
        }
    }
    console.log(uri);
    return ({
        uri: uri,
        headers: headers,
        gzip: true
    })
};

function callback(response) {
    const products = []
    $ = cheerio.load(response);
    const product = $('.s-result-item').each((index, element) => {
        if ($(element).attr('data-asin') != undefined && $(element).attr('data-asin') != '') {
            const uuid = $(element).attr('data-uuid');

            const item = $(element).html();
            $ = cheerio.load(item);

            var url;
            $('span').each((index, element) => {
                if ($(element).attr('data-component-type') == 's-product-image') {
                    url = $($(element).find('a')).attr('href');
                }
            })

            const checkRating = () => {
                try {
                    return $($($($($('.sg-row')[1]).children('div')[1]).find('.a-section')[2]).find('span')[0]).attr('aria-label').split(' ')[0];
                } catch (e) {
                    return '';
                }
            }

            const checkNo = () => {
                try {
                    return $($($($($('.sg-row')[1]).children('div')[1]).find('.a-section')[2]).find('span')[3]).attr('aria-label');
                } catch (e) {
                    return '';
                }
            }
            const product = {
                id:uuid,
                url: `https://www.amazon.in${url}`,
                images: [$('.s-image').attr('src')],
                name: $('span.a-size-medium').text(),
                price: $('span.a-price-whole').text(),
                cutPrice: $($($('span.a-price')[1]).find('span')[0]).text().replace('₹', ''),
                rating: checkRating(),
                noofreviews: checkNo(),
                store:'amazon'
            }
            products.push(product);
        } else { }


    });
    // fs.writeFileSync('amazon.json', JSON.stringify(products))
    return products;
}

const Amazon = async ({ query,sort, prange }) => {
    return await rp(options({ query: query,sort:sort, prange: prange })).then((response) => {
        try {
            const data = callback(response);
            const finalData = sort=='asc'?Sort.SortAsc(data):sort=='desc'?Sort.SortDesc(data):data;
            return !!finalData?finalData:''
        } catch (error) {
            console.log(`amazon error${error}`);
            return ''
        }

    }).catch((error) => {
        console.log(`amzon error${error}`);
        return ''
    })
}
// Amazon({query:'jeans'})

module.exports = Amazon;