const cheerio = require('cheerio');
const rp = require('request-promise');
const fs = require('fs');
const headers = require('../utils/headerObj')
const Sort = require('../utils/sort')

// Image object = {
//     altText,
//     format,
//     imageType,
//     url
// }

const options = ({ query, prange, sort }) => {
    var uri;
    if(!!prange) {
        if(sort=='asc'){
            uri =`https://www.ajio.com/search/?text=${query}&query=:prce-asc:price:${prange[0]},${prange[1]}`;
        }else if(sort=='desc'){
            uri =`https://www.ajio.com/search/?text=${query}&query=:prce-desc:price:${prange[0]},${prange[1]}`;
        }else{
            uri =`https://www.ajio.com/search/?text=${query}&query=:relevance:price:${prange[0]},${prange[1]}`;
        }
    }else{
        if(sort=='asc'){
            uri =`https://www.ajio.com/search/?text=${query}&query=:prce-asc`;
        }else if(sort=='desc'){
            uri =`https://www.ajio.com/search/?text=${query}&query=:prce-desc`;
        }else{
            uri =`https://www.ajio.com/search/?text=${query}`;
        }
    }
    console.log(uri);
    return ({url: uri,
    headers: headers,
    gzip: true})
};

function callback(response) {
    const products = []
        $ = cheerio.load(response);
        const newScript = $($('body > script')[2]).html().split('window.__PRELOADED_STATE__ =' )[1];
        const data = JSON.parse(newScript.trim().slice(0,-1));
        // fs.writeFileSync('incomin/ajio.json', newScript.trim().slice(0,-1));
        const aproducts = data.grid.entities
        for(aproduct in aproducts) {
            const product = {
                id: aproducts[aproduct].code,
                url: `https://www.ajio.com${aproducts[aproduct].url}`,
                images: aproducts[aproduct].images.map((image)=>
                    image.url),
                name: aproducts[aproduct].name,
                price: aproducts[aproduct].price.value,
                cutPrice: aproducts[aproduct].wasPriceData.value,
                store:'ajio'
            }
            products.push(product);
        }
        // fs.writeFileSync('ajio.json', JSON.stringify(products))
    return products;
}
const Ajio = async ({ query,prange, sort }) => {
    return await rp(options({ query: query, prange:prange, sort: sort})).then((response) => {
        try {
            const data = callback(response);
            const finalData = sort=='asc'?Sort.SortAsc(data):sort=='desc'?Sort.SortDesc(data):data;
            return !!finalData?finalData:''
        } catch (error) {
            console.log(`ajio error ${error.message}`);
            return ''
        }

    }).timeout(2000,'timeout').catch((error) => {
        console.log(`ajio ${error.message}`);
        return ''
    })
}
// Ajio({query:'jeans'})
module.exports = Ajio;