//////////////////////////////////////////
//SERVER
const http = require('http');
const url = require('url');
const fs = require('fs');

//CUSTOM MODULE
const replaceTemplate = require('./modules.js/replaceTemplate');

//third party modules
const slugify= require('slugify'); // leer readme e instalar dependencias

//slugify example
console.log(slugify('Fresh Avocados', {lowercase:true}));


//DATA
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj= JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, {lowercase:true}));
console.log(slugs);

//TEMPLATES --
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const server = http.createServer((req,res)=>{
    //console.log(req.url);
    //console.log(url.parse(req.url,true));
    const {query, pathname} = url.parse(req.url,true);
 
    //OVERVIEW PAGE
    if(pathname === '/' ||pathname === '/overview'){
        res.writeHead(200,{'Content-type' : 'text/html'});

        const cardsHtml = dataObj.map(el=> replaceTemplate(tempCard, el)).join('');
        console.log(cardsHtml);
        const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
        
        res.end(output);
    }
    //PRODUCT PAGE
    else if( pathname ==='/product'){
        //console.log(query);
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        
        res.end(output);
    }
    //API
    else if(pathname === '/api'){
      res.writeHead(200,{
      'Content-type' : 'application/json'
      });
      res.end(data);
       
    }
    //NOT FOUND
    else{

        res.writeHead(404,{
            'Content-type' : 'text/html',
            'my-own-header':'hello-world'
        });
        res.end('<h1>Page not found</h1>');
    }
  //  res.end('Hello from the server!');
});

server.listen(8000,'127.0.0.1', ()=>{
    console.log('Listening to requests on port 8000');
})









//////////////////////////////////////////
//Files
//const fs = require('fs');

//Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}. \nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');

//Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8',(err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8',(err, data2) => {
//         console.log(data2);
       
//         fs.readFile(`./txt/append.txt`, 'utf-8',(err, data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,'utf-8', err =>{
//                 console.log('Your file has been written 😊');
//             });
//         });
//     });
    
// });

// console.log('Will read file!');
