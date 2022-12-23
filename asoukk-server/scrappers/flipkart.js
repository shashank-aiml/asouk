const cheerio = require('cheerio');
const rp = require('request-promise');
const fs = require('fs');
const headers = require('../utils/headerObj')
const Sort = require('../utils/sort')

const options = ({ query, prange, sort}) => {
    
    var uri;
    if(!!prange) {
        if(sort=='asc'){
            uri =`https://www.flipkart.com/search?q=${query}&p[]=facets.price_range.from=${prange[0]}&p[]=facets.price_range.to=${prange[1]}&sort=price_asc`;
        }else if(sort=='desc'){
            uri =`https://www.flipkart.com/search?q=${query}&p[]=facets.price_range.from=${prange[0]}&p[]=facets.price_range.to=${prange[1]}&sort=price_desc`;
        }else{
            uri =`https://www.flipkart.com/search?q=${query}&p[]=facets.price_range.from=${prange[0]}&p[]=facets.price_range.to=${prange[1]}`;
        }
    }else{
        if(sort=='asc'){
            uri =`https://www.flipkart.com/search?q=${query}&sort=price_asc`;
        }else if(sort=='desc'){
            uri =`https://www.flipkart.com/search?q=${query}&sort=price_desc`;
        }else{
            uri =`https://www.flipkart.com/search?q=${query}`;
        }
    }
    console.log(uri);
    return ({
        url: uri,
        headers: headers,
        gzip: true
    })
};


function callback(response, sort) {
    const products = []
    $ = cheerio.load(response);
    const split = $($('script')[11]).html().split('=');
    const newScript = split.slice(1).join('=').trim().slice(0, -1).toString()
    const data = JSON.parse(newScript);
    if(sort=='asc'){

    }else if(sort=='desc'){

    }else{

    }
    const rawData = data.pageDataV4.page.data['10003'];
    // fs.writeFileSync('flipkart.json', JSON.stringify(rawData))
    for (var i = 0; i < rawData.length; i++) {
        if (rawData[i].slotType === 'WIDGET' && rawData[i].widget.type === 'PRODUCT_SUMMARY') {
            rawProducts = rawData[i].widget.data.products;
            for (var j = 0; j < rawProducts.length; j++) {
                const product = {
                    id: rawProducts[j].productInfo.action.params.productId,
                    url: rawProducts[j].productInfo.value.smartUrl,
                    images: rawProducts[j].productInfo.value.media.images.map(image =>image.url.replace('{@width}', '495').replace('{@quality}', '50').replace('{@height}', '495')),
                    name:rawProducts[j].productInfo.value.titles.title,
                    price:rawProducts[j].productInfo.value.pricing.finalPrice.value,
                    cutPrice: rawProducts[j].productInfo.value.pricing.mrp.value,
                    rating: rawProducts[j].productInfo.value.rating.average,
                    noofreviews: rawProducts[j].productInfo.value.rating.count,
                    store:'flipkart',
                }
                products.push(product);
            }

        }
    }
    // fs.writeFileSync('flipkart.json', JSON.stringify(products))
    return products;
}


const Flipkart = async ({ query, prange, sort}) => {
    return await rp(options({ query: query, prange: prange, sort: sort})).then((response) => {
        try {
            const data = callback(response);
            const finalData = sort=='asc'?Sort.SortAsc(data):sort=='desc'?Sort.SortDesc(data):data;
            return !!finalData?finalData:''
        } catch (error) {
            console.log(`flipkart error${error}`);
            return ''
        }

    }).timeout(2000,'Timeout' ).catch((error) => {
        console.log(`flipkart error${error}`);
        return ''
    })
}
// Flipkart({query:'jeans'})
module.exports = Flipkart;