const fs = require('fs');
module.exports.SortAsc = function SortAsc(productList){
    productList.sort((a, b) => (parseInt(a.price.toString().replace(',','')) > parseInt(b.price.toString().replace(',',''))) ? 1 : (parseInt(a.price.toString().replace(',','')) === parseInt(b.price.toString().replace(',',''))) ? ((a.rating > b.rating) ? 1 : -1) : -1 );
    return productList;
};

module.exports.SortDesc = function SortDesc(productList){
    productList.sort((a, b) => (parseInt(a.price.toString().replace(',','')) < parseInt(b.price.toString().replace(',',''))) ? 1 : (parseInt(a.price.toString().replace(',','')) === parseInt(b.price.toString().replace(',',''))) ? ((a.rating > b.rating) ? 1 : -1) : -1 );
    return productList;
};