'use strict';

const AmazonProducts = require('crawl-amazon-products');
const fs = require('fs');

const productUrls= require('./startUrls');

const outFileName= 'index.html';

const limit= undefined;

// fetch products (https://www.npmjs.com/package/crawl-amazon-products)
const getProducts= url => new Promise((resolve, reject) => { AmazonProducts.getProducts({ url, limit }, (err, products) => err ? reject(err) : resolve(products)); });

// write products to index.html
const outProds= allProds => {
    let body= '';
    for ( let asin in allProds ) {
        let prod= allProds[asin];
        body+= '<div class="prod"><a href="' + prod.url + '" target="_new"><img src="' + prod.image + '">' + prod.title + '</a></div>';
    }

    const html= '<html><head><meta charset="UTF-8"><style>'
        + '.prod { width: 24%; float: left; padding: .5% }'
        + 'img { height: 100px; vertical-align: middle; float: left;}'
        + '</style></head><body>'
        + body
        + '</body></html>'
    ;

    return new Promise((resolve, reject) => {
        fs.writeFile(outFileName, html, err => err ? reject(err) : resolve(allProds));
    });
};

const fetchFns= productUrls.map(
    url =>
        allProds =>
            getProducts(url)
                .then(prods => {
                    prods
                        .filter(prod => prod.price.match(/EUR 0,00$/))
                        .forEach(prod => { allProds[prod.asin]= prod; });
                    return allProds;
                })
);


let promise= Promise.resolve({});

fetchFns.forEach(fn => { promise= promise.then(fn); });

promise
    .then(allProds => {
        for ( let asin in allProds ) {
            allProds[asin].url= 'https://www.amazon.de/exec/obidos/ASIN/' + asin;
        }
        return allProds;
    })
    .then(outProds)
    .then(allProds => console.log('allProds', allProds))
    .then(process.exit, process.exit);

