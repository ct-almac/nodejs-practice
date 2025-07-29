const fs = require('fs');
const express = require('express');
const { create } = require('domain');

const app = express();

app.use(express.json()); //Este es un middleware, necesario para obtener el body de la petición

// app.get('/', (req, res) => {
//     res.status(200)
//     .json({message:'hello from the server side', app:'Natours'});
// });

// app.post('/',(req,res) => {
//     res.send('You can post to this endpoint');
// })
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


app.get('/api/v1/tours', (req, res) => {
    res.status(200)
    .json( {
        status:'success',
        data:{
            tours: tours
        } 
    });
});

//obtener registro único, la variable :id puede tener cualquier nombre
//se puede tener tantos como se necesiten, ejemplo: 
// /api/v1/tours/:id/:x/:y/:z
//si no se incluyen todos los parámetros en la petición puede provocar un error, para evitarlom agregar ?:
///api/v1/tours/:id/:x/:y/:z? <-- para parámetros opcionales
app.get('/api/v1/tours/:id', (req, res) => {
    console.log(req.params); //parámetros (las variables) de la url
    
    const id = req.params.id * 1 //truco para convertir string similar a número a un valor numérico
    // if(id > tours.length){
    //     return res.status(404).json({
    //         status:'fail',
    //         message:'Invalid ID'
    //     });
    // }

    const tour = tours.find( el => el.id == id );
    if(!tour){
            return res.status(404).json({
                status:'fail',
                message:'Invalid ID'
            });
        }

    res.status(200)
    .json( {
        status:'success',
        data:{
            tours: tour
        } 
    });
});

app.post('/api/v1/tours', (req, res) => {
   // console.log('post tour', req.body);
    const newId = tours[tours.length -1].id + 1;
    const newTour = Object.assign({id:newId}, req.body);
    
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err =>{
        res.status(201)
        .json({
            status:'success',
            data:{
                tour:newTour
            }
        })
    });

    //res.send('done');
});

app.patch('/api/v1/tours/:id', (req, res) => {
   // console.log('post tour', req.body);

    const id = req.params.id * 1;
    const tour = tours.find( el => el.id == id );
    if(!tour){
        return res.status(404).json({
            status:'fail',
            message:'Invalid ID'
        });
    }

    res.status(200).json({
        status:'success',
        data:{
            tour:`< updated tour ${id}>`
        }
    });
});

app.delete('/api/v1/tours/:id', (req, res) => {
   // console.log('post tour', req.body);

    const id = req.params.id * 1;
    if(id > tours.length){
        return res.status(404).json({
            status:'fail',
            message:'Invalid ID'
        });
    }

    res.status(204).json({
        status:'success',
        message:`< deleted tour ${id}>`,
        data:null
    });
});

const port = 3000;

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});


