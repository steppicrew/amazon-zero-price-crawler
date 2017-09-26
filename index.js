'use strict';

const AmazonProducts = require('crawl-amazon-products');
const fs = require('fs');

const productUrls= require('./startUrls');

const outFileName= 'amazonResult.js';

const limit= undefined;

// fetch products (https://www.npmjs.com/package/crawl-amazon-products)
const getProducts= url => new Promise((resolve, reject) => { AmazonProducts.getProducts({ url, limit }, (err, products) => err ? reject(err) : resolve(products)); });

// write products to index.html
const outProds= allProds => new Promise((resolve, reject) => {
        fs.writeFile(outFileName, '\'use strict\';\nwindow.amazonResult= ' + JSON.stringify(allProds) + ';\n', err => err ? reject(err) : resolve(allProds));
    })
;

Promise.all(productUrls.map(
    url => getProducts(url)
        .then(prods => Object.assign(
                {},
                ...prods
                    .filter(prod => prod.price.match(/EUR 0,00$/))
                    .map(prod => ({ [prod.asin]: prod }))
            )
        )
))
    .then(prodLists => Object.assign({}, ...prodLists))
    .then(allProds => {
        for ( let asin in allProds ) {
            allProds[asin].url= 'https://www.amazon.de/exec/obidos/ASIN/' + asin;
        }
        return allProds;
    })
    .then(outProds)
//    .then(allProds => console.log('allProds', allProds))
    .then(() => console.log('SUCCESS'), err => console.log('ERROR', err))
    .then(process.exit)
;

