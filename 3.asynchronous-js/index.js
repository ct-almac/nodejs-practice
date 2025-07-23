const fs = require('fs');
const superagent = require('superagent');

//callback hell
/*
fs.readFile(`${__dirname}/dog.txt`,(err, data) =>{
   if(err) return console.log(err.message);
    console.log(`Breed: ${data}`);
    superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
    .end((err,res)=>{
        if(err) return console.log(err.message);
        console.log(res.body);
        fs.writeFile('dog-img.txt', res.body.message, err =>{
            console.log('Random dog image saved to file');
        });
    });
});
*/

//using promises
/*fs.readFile(`${__dirname}/dog.txt`,(err, data) =>{
   if(err) return console.log(err.message);
    console.log(`Breed: ${data}`);
    
    superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
    .then(res=>{
        fs.writeFile('dog-img.txt', res.body.message, err =>{
            console.log('Random dog image saved to file');
        });
    })
    .catch(err=>{
        console.log(err.message);
    });
});*/

//building promises
const readFilePro = file => {
    return new Promise((resolve, reject) =>{
        fs.readFile(file, (err, data) => {
            if(err) reject('I could not find that file ');
            
            resolve(data);
        });
    });
};

const writeFilePro = (file, data) => {
    return new Promise((resolve, reject) =>{
        fs.writeFile(file, data ,(err, data) => {
            if(err) reject('I could not write the file ');
            resolve('success');
        });
    });
};


/*
readFilePro(`${__dirname}/dog.txt`).then(data =>{
  return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
})
.then( res=>{
  return writeFilePro('dog-img.txt', res.body.message);
})
.then( () => console.log('Random dog image saved to file'))
.catch(err=>{
    console.error('hubo un error', err);
});
*/
;
//consuming promises async/await

const getDogPic = async () =>{
    try {
        const data = await readFilePro(`${__dirname}/dog.txt`);
        console.log(`Breed: ${data}`);
        const image = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        console.log(`image: ${image}`);  
        await writeFilePro('dog-img.txt', image.body.message);
        console.log('Random dog image saved to file');
        
    } catch (error) {
        console.log('erro:',error);
    } 
};

getDogPic();


// (async () =>{

// })();

//múltiples promesas
/* const getDogPic = async () =>{
    try {
        const data = await readFilePro(`${__dirname}/dog.txt`);
        const res1Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);

        const res2Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);

        const res3Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);

        const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
        
        const imgs = all.map(el=> el.body.message);
        await writeFilePro('dog-img.txt', imgs.join('\n'));

    } catch (error) {
        console.log('erro:',error);
    } 
};

getDogPic();*/

