const cheerio = require('cheerio');
const rp = require('request-promise');
const fs = require('fs');
const headers = require('../utils/headerObj')
const checkDef = require('../utils/checkDef')
const Sort = require('../utils/sort')

const options = ({ query, prange, sort }) => {
    var uri;
    if (!!prange) {
        if (sort == 'asc') {
            uri = `https://prodsearch.tatacliq.com/products/mpl/search/?searchText=${query}:price-asc:inStockFlag:true:price:₹${prange[0]}-₹${prange[1]}&isKeywordRedirect=false&isKeywordRedirectEnabled=true&channel=WEB&isMDE=true&isTextSearch=false&isFilter=false&qc=false&test=minimal.fields&page=0&isPwa=true&pageSize=40&typeID=all`;
        } else if (sort == 'desc') {
            uri = `https://prodsearch.tatacliq.com/products/mpl/search/?searchText=${query}:price-desc:inStockFlag:true:price:₹${prange[0]}-₹${prange[1]}&isKeywordRedirect=false&isKeywordRedirectEnabled=true&channel=WEB&isMDE=true&isTextSearch=false&isFilter=false&qc=false&test=minimal.fields&page=0&isPwa=true&pageSize=40&typeID=all`;
        } else {
            uri = `https://prodsearch.tatacliq.com/products/mpl/search/?searchText=${query}:relevance:inStockFlag:true:price:₹${prange[0]}-₹${prange[1]}&isKeywordRedirect=false&isKeywordRedirectEnabled=true&channel=WEB&isMDE=true&isTextSearch=false&isFilter=false&qc=false&test=minimal.fields&page=0&isPwa=true&pageSize=40&typeID=all`;
        }
    } else {
        if (sort == 'asc') {
            uri = `https://prodsearch.tatacliq.com/products/mpl/search/?searchText=${query}:price-asc:inStockFlag:true&isKeywordRedirect=false&isKeywordRedirectEnabled=true&channel=WEB&isMDE=true&isTextSearch=false&isFilter=false&qc=false&test=minimal.fields&page=0&isPwa=true&pageSize=40&typeID=all`;
        } else if (sort == 'desc') {
            uri = `https://prodsearch.tatacliq.com/products/mpl/search/?searchText=${query}:price-desc:inStockFlag:true&isKeywordRedirect=false&isKeywordRedirectEnabled=true&channel=WEB&isMDE=true&isTextSearch=false&isFilter=false&qc=false&test=minimal.fields&page=0&isPwa=true&pageSize=40&typeID=all`;
        } else {
            uri = `https://prodsearch.tatacliq.com/products/mpl/search/?searchText=${query}:relevance:inStockFlag:true&isKeywordRedirect=false&isKeywordRedirectEnabled=true&channel=WEB&isMDE=true&isTextSearch=false&isFilter=false&qc=false&test=minimal.fields&page=0&isPwa=true&pageSize=40&typeID=all`;
        }
    }
    console.log(uri);
    return (
        {
            url: encodeURI(uri),
            headers: headers,
            gzip: true,
        }
    )
};

async function callback(response) {
    const products = []
    const data = JSON.parse(response);
    const tproducts = data.searchresult
    // fs.writeFileSync('cliq.json', JSON.stringify(tproducts))
    for (var i = 0; i < tproducts.length; i++) {
        const product = {
            id: tproducts[i].productId,
            url: encodeURI(`https://www.tatacliq.com${tproducts[i].webURL}`),
            images: [tproducts[i].imageURL],
            name: tproducts[i].productname,
            price: tproducts[i].price.sellingPrice.doubleValue,
            cutPrice: tproducts[i].price.mrpPrice.doubleValue,
            rating: checkDef(tproducts[i].averageRating),
            noofreviews: tproducts[i].ratingCount,
            store: 'tatacliq'
        }
        products.push(product);
    }

    return products;
}


const TataCliq = async ({ query, sort, prange }) => {
    return await rp(options({ query: query, sort: sort, prange: prange })).then(async(response) => {
        try {

            const data = await callback(response);
            const finalData = sort=='asc'?Sort.SortAsc(data):sort=='desc'?Sort.SortDesc(data):data;
            return !!finalData?finalData:''
        } catch (error) {
            console.log(`tatacliq error`);
            return ''
        }

    }).timeout(2000, 'Timeout')
    .catch((error) => {
        console.log(`tatacliq error${error}`);
        return ''
    })
}
// TataCliq({query:'jeans'})
module.exports = TataCliq;