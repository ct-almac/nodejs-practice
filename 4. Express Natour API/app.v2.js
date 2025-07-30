const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const app = express();

// 1) MIDDLEWARE
app.use(morgan('tiny'));

app.use(express.json()); //Este es un middleware, necesario para obtener el body de la petición

//creando middleware
app.use((req, res, next) => {
    console.log('hello from the middleware 😁');
    //console.log('req data',req);
    next();
})

app.use((req, res, next) => {
    console.log('hello from the middleware2 👌');
    //console.log('req data',req);
    req.requestTime = new Date().toISOString;
    next();
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// -------------------------------------------------------------------------------------------------
//       Refactorización de rutas: 
// -------------------------------------------------------------------------------------------------


// 2) ROUTE HANDLER

const getAllUsers = (req, res) => {
    res.status(500)
    .json( {
        status:'error',
        message:'This route is not yet defined',
        data: null
    });
};

const createUser = (req, res) => {
    res.status(500)
    .json( {
        status:'error',
        message:'This route is not yet defined',
        data: null
    });
};

const updateUser = (req, res) => {
     res.status(500)
    .json( {
        status:'error',
        message:'This route is not yet defined',
        data: null
    });
};

const getUser = (req, res) => {
    res.status(500)
    .json( {
        status:'error',
        message:'This route is not yet defined',
        data: null
    });
};

const deleteUser = (req, res) => {
    res.status(500)
    .json( {
        status:'error',
        message:'This route is not yet defined',
        data: null
    });
};

//----------- tours
const getAllTours = (req, res) => {
    console.log('req time getAllTours', req.requestTime);
    res.status(200)
    .json( {
        status:'success',
        requestTime: req.requestTime,
        data:{
            tours: tours
        } 
    });
};

const createTour = (req, res) => {
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
};

const updateTour = (req, res) => {
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
};

const getTour = (req, res) => {
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
};

const deleteTour = (req, res) => {
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
};


// app.get('/api/v1/tours', getAllTours);

// app.get('/api/v1/tours/:id', getTour);

// app.post('/api/v1/tours', createTour);

// app.patch('/api/v1/tours/:id', updateTour );

// app.delete('/api/v1/tours/:id', deleteTour);

// 3) ROUTES

// ---- Tours
const tourRouter = express.Router(); // reemplazamos app con la instancia de express.Router() en tourRouter

tourRouter.route('/') // api/v1/tours <-- la base estará indicada en app.use('api/v1/tours', tourRouter)
    .get(getAllTours)
    .post(createTour);

tourRouter.route('/:id') //api/v1/tours/:id
    .get(getTour)
    .post(updateTour)
    .delete(deleteTour);


// ---- Users
const usersRouter = express.Router(); // reemplazamos app con la instancia de express.Router() en usersRouter

usersRouter.route('/')
    .get(getAllUsers)
    .post(createUser);

usersRouter.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', usersRouter);


// 4) SERVER
const port = 3000;

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});



