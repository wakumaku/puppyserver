const puppeteer = require('puppeteer');
const http = require('http');
const qs = require('querystring');

//(async () => {
    // const browser = await puppeteer.launch();
    
    // {args: ['--no-sandbox', '--disable-setuid-sandbox']}
puppeteer.launch()
.then((browser) => {

    http.createServer(function (req, res) {

        console.log("Request received ...");

        var start = new Date().getTime();        
        
        if (req.method == 'GET') {
            res.statusCode = 200;
            res.end('ok');
            console.log(' - Err: GET -  -> ' +  secsLapse(start) + ' secs.');
            return;
        }

        var body = '';
        req.on('data', function(chunk) {
          body += chunk;
        });
        req.on('end', function() {
            var data = qs.parse(body);

            const inputHTML = data.html;
            if (inputHTML === undefined) {
                res.statusCode = 200;
                res.end('ok');
                console.log(' - Err: no data -  -> ' +  secsLapse(start) + ' secs.');
                return;      
            }

            (async () => {
            // puppeteer.launch()
            // .then((browser) => {
            //     return browser.newPage();
            // })
            // .catch((err) => {
            //     console.log("Err launching: " + err);                
            // })
            browser.newPage()
            .then((page) => {
                return new Promise((resolve, reject) => {
                    page.setContent(inputHTML)
                    .then(() => { resolve(page)})
                    .catch((err) => { reject(err)});
                });
            })
            .catch((err) => {
                console.log("Err setting content: " + err);
            })
            .then((page) => {
                return new Promise((resolve, reject) => {
                    page.setViewport({width: 644, height: 1})
                    .then(() => { resolve(page)})
                    .catch((err) => { reject(err)});
                });
            })
            .catch((err) => {
                console.log("Err setting viewport: " + err);
            })
            .then((page) => {
                return new Promise((resolve, reject) => {
                    page.evaluate(_ => {
                        window.scrollBy(0, window.innerHeight);
                    })
                    .then(() => { resolve(page)})
                    .catch((err) => { reject(err)});
                });
            })
            .catch((err) => {
                console.log("Err scrolling down: " + err);
            })
            .then((page) => {
                return new Promise((resolve, reject) => {
                    page.waitForNavigation({
                        timeout: 10000,
                        waitUntil: 'networkidle',
                        networkIdleTimeout: 1000
                    })
                    .then(() => { resolve(page)})
                    .catch((err) => { reject(err)});
                });
            })
            .catch((err) => {
                console.log("Err waiting: " + err);
            })
            .then((page)=> {
                return new Promise((resolve, reject) => {
                    page.screenshot({
                        type: 'jpeg',
                        quality: 100,
                        fullPage: true,
                        // clip: {
                        //     x: 0,
                        //     y: 0,
                        //     width: 644,
                        //     height: 1000
                        // }
                    })
                    .then((imageData) => {

                        res.writeHead(200, {'Content-Type': 'image/jpeg'});
                        res.end(imageData);   
                        console.log(' - Ok -  -> ' +  secsLapse(start) + ' secs.');

                        resolve(page)
                    })
                    .catch((err) => { reject(err)});
                });
            })
            .catch((err) => {
                console.log("Err Screenshoot: " + err);
            })
            .then((page) => {
                return page.close();
            })
            .catch((err) => {
                console.log(' - Other error: ' +  err);
                res.statusCode = 500;
                res.end('err');
                return;
            })
            .then(() => {
               console.log("Ok");
            })
            .catch(() => {
                res.statusCode = 500;
                res.end('err');
                console.log(' - Err: page-  -> ' +  secsLapse(start) + ' secs.');
                return;
            });
        
            })(); // async


        });

    }).listen(9090);
    console.log('Server running!');
})
.catch((err) => {
    console.log("Cannot initialize pupeeteer: " + err);
});
    
// })();

function secsLapse(startTime) {
    return (((new Date().getTime()) - startTime)/1000);
}