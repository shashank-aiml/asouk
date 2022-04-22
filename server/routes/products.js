const productRouter = require('express').Router();

const mongoose = require('mongoose');
const Search = mongoose.model('Search');

const Amazon = require('../scrappers/amazon');
const Ajio = require('../scrappers/ajio');
const Flipkart = require('../scrappers/flipkart');
const Myntra = require('../scrappers/myntra');
const Snapdeal = require('../scrappers/snapdeal');
const TataCliq = require('../scrappers/tataCLiq');

const getSearch = async ({ query, sort, prange }) => {
    var startTime = new Date().getTime();
    console.log(startTime)
    const productList = [];
    productList.push({ Amazon: await Amazon({ query: query, sort: sort, prange: prange }) });
    productList.push({ Flipkart: await Flipkart({ query: query, sort: sort, prange: prange }) });
    productList.push({ Myntra: await Myntra({ query: query, sort: sort, prange: prange }) });
    productList.push({ Snapdeal: await Snapdeal({ query: query, sort: sort, prange: prange }) });
    productList.push({ Ajio: await Ajio({ query: query, sort: sort, prange: prange }) });
    productList.push({ TataCliq: await TataCliq({ query: query, sort: sort, prange: prange }) });
    var endTime = new Date().getTime();
    console.log(endTime)
    var difftime = endTime - startTime;
    console.log(new Date(difftime));
    // fs.writeFileSync('products.json', JSON.stringify(productList))
    const searchString = `query=${query}&sort=${sort}&prange1=${!!prange ? prange[0] : null}&prange2=${!!prange ? prange[1] : null}`;
    const newSearch = new Search({
        _id: searchString,
        query: query,
        sort: sort,
        prange1: !!prange ? prange[0] : null,
        prange2: !!prange ? prange[1] : null,
        start: startTime,
        data: productList,
    });
    await newSearch.save();
    return productList;
}


productRouter.get('/search', async function (req, res) {
    const sort = req.query.sort;
    const prange1 = req.query.prange1;
    const prange2 = req.query.prange2;
    const queryString = req.query.query;
    const searchString = `query=${queryString}&sort=${sort}&prange1=${prange1}&prange2=${prange2}`;
    await Search.findById(searchString).then(async(search) => {
        if (!search) {
            const productList = await getSearch({ query: queryString, sort: sort, prange: ((prange1 != 'null' && prange1 != 'undefined') && (prange2 != 'null' && prange2 != 'undefined')) ? [prange1, prange2] : null });
            res.send(productList);
        } else {
            res.send(search.data)
        }
    })

})

productRouter.get('/', function(req, res) {
    console.log(req.headers['x-forwarded-for']);
})

module.exports = productRouter;