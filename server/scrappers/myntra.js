const cheerio = require('cheerio');
const rp = require('request-promise');
const fs = require('fs');
const headers = require('../utils/headerObj')
const Sort = require('../utils/sort')

const options = ({ query, prange, sort}) => {
    var uri;
    if(!!prange) {
        if(sort=='asc'){
            uri =`https://www.myntra.com/${query}?plaEnabled=false&rf=Price:${prange[0]}_${prange[1]}_${prange[0]}%20TO$%20${prange[1]}&sort=price_asc`;
        }else if(sort=='desc'){
            uri =`https://www.myntra.com/${query}?plaEnabled=false&rf=Price:${prange[0]}_${prange[1]}_${prange[0]}%20TO$%20${prange[1]}&sort=price_desc`;
        }else{
            uri =`https://www.myntra.com/${query}?plaEnabled=false&rf=Price:${prange[0]}_${prange[1]}_${prange[0]}%20TO${prange[1]}`;
        }
    }else{
        if(sort=='asc'){
            uri =`https://www.myntra.com/${query}?plaEnabled=false&sort=price_asc`;
        }else if(sort=='desc'){
            uri =`https://www.myntra.com/${query}?plaEnabled=false&sort=price_desc`;
        }else{
            uri =`https://www.myntra.com/${query}`;
        }
    }
    console.log(uri);
    return ({
        url: uri,
        headers: headers,
        gzip: true
    })
};

function callback(response) {
    const products = []
    $ = cheerio.load(response);

    const split = $($('body > script')[2]).html().split('=');
    const newScript = split.slice(1).join('=').toString()
    const data = JSON.parse(newScript);
    const mproducts = data.searchData.results.products
    // fs.writeFileSync('myntra.json', JSON.stringify(mproducts))
    for (var i = 0; i < mproducts.length; i++) {
        const product = {
            id:mproducts[i].productId,
            url: `https://www.myntra.com/${mproducts[i].landingPageUrl}`,
            images: mproducts[i].images.map(image =>image.src),
            name: mproducts[i].productName,
            price: mproducts[i].price,
            cutPrice: mproducts[i].mrp,
            rating: mproducts[i].rating,
            noofreviews: mproducts[i].ratingCount,
            store:'myntra'
        }
        products.push(product);
    }
    // fs.writeFileSync('myntra.json', JSON.stringify(products))
    return products;
}


const Myntra = async ({ query, prange, sort }) => {
    return await rp(options({ query: query, prange: prange, sort: sort})).then((response) => {
        try {
            const data = callback(response);
            const finalData = sort=='asc'?Sort.SortAsc(data):sort=='desc'?Sort.SortDesc(data):data;
            return !!finalData?finalData:''
        } catch (error) {
            console.log(`myntra error${error.message}`);
            return ''
        }

    }).timeout(2000,'timeout').catch((error) => {
        console.log(`myntra ${error.message}`);
        return ''
    })
}
// Myntra({query:'jeans'})
module.exports = Myntra;