const cheerio = require('cheerio');
const rp = require('request-promise');
const fs = require('fs');
const headers = require('../utils/headerObj')
const Sort = require('../utils/sort')

const options =({ query, prange, sort}) => {
    
    var uri;
    if(!!prange) {
        if(sort=='asc'){
            uri =`https://www.snapdeal.com/search?keyword=${query}&q=Price:${prange[0]},${prange[1]}|&sort=plth`;
        }else if(sort=='desc'){
            uri =`https://www.snapdeal.com/search?keyword=${query}&q=Price:${prange[0]},${prange[1]}&sort=phtl`;
        }else{
            uri =`https://www.snapdeal.com/search?keyword=${query}&q=Price:${prange[0]},${prange[1]}`;
        }
    }else{
        if(sort=='asc'){
            uri =`https://www.snapdeal.com/search?keyword=${query}&sort=plth`;
        }else if(sort=='desc'){
            uri =`https://www.snapdeal.com/search?keyword=${query}&sort=phtl`;
        }else{
            uri =`https://www.snapdeal.com/search?keyword=${query}`;
        }
    }
    console.log(uri);
    
   return ( {url: `https://www.snapdeal.com/search?keyword=${query}`,
    headers: headers,
    gzip: true})
};

function callback(response) {
    const products = []
        $ = cheerio.load(response);
        const data = $('.product-tuple-listing').each((index, element) => {
            var rating;
            var noofreviews;
            try {
                noofreviews= $(element).find('.product-rating-count').text().substring(1,$(element).find('.product-rating-count').text().length-1 );
                rating= parseInt($(element).find('.filled-stars').attr('style').split(':')[1].split('%')[0])/20;
            } catch (error) {
                console.log(`snapdeal parse error${error}`);
            }
            const product = {
                id: $(element).attr('id'),
                images: [$(element).find('source').attr('srcset')],
                name: $(element).find('.product-title').html(),
                cutPrice: $(element).find('.product-desc-price').html().split(' ')[1],
                price: $(element).find('.product-price').html().split('  ')[1],
                rating:rating,
                noofreviews:noofreviews,
                store:'snapdeal'
            }
            products.push(product);
        })
    // fs.writeFileSync('snapdeal.json', JSON.stringify(products))
    return products;
}
const Snapdeal = async ({ query, sort, prange }) => {
    return await rp(options({ query: query, sort:sort,prange:prange })).then((response) => {
        try {
            const data = callback(response);
            const finalData = sort=='asc'?Sort.SortAsc(data):sort=='desc'?Sort.SortDesc(data):data;
            return !!finalData?finalData:''
        } catch (error) {
            console.log(`snapdeal error${error}`);
            return ''
        }

    }).catch((error) => {
        console.log(`snapdeal error${error}`);
        return ''
    })
}
// Snapdeal({ query: 'jeans', sort:'i', prange:[300, 500]})
module.exports = Snapdeal;