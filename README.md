# amazon-zero-price-crawler
Crawls amazon for free products.
I wrote it to find free e-books. And since Amazon's "Order by price ascending" is not working if you add a keyword I created my own crawler (using https://github.com/xissy/node-amazon-products).

It creates a web page showing found products with a css, that shows which links have already been visited.

    npm install

copy ```startUrls.js.sample``` to ```startUrls.js``` and modify it.

    node index.js

open ```index.html``` in a browser.

...work in progress
