'use strict';

const AmazonProducts = require('crawl-amazon-products');
const fs = require('fs');

const productUrls= require('./startUrls');

const outFileName= 'amazonResult.js';

const options= {
    limit: undefined,
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:55.0) Gecko/20100101 Firefox/55.0',
    },
};

const rePrice= /EUR 0,00$/;

// fetch products (https://www.npmjs.com/package/crawl-amazon-products)
const getProducts= url => new Promise((resolve, reject) => { AmazonProducts.getProducts({ ...options, url }, (err, products) => err ? reject(err) : resolve(products)); });

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
                    .filter(prod => prod.price.match(rePrice))
                    .map(prod => ({ [prod.asin]: prod }))
            )
        )
//        .then(prods => console.log(prods) || prods)
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

