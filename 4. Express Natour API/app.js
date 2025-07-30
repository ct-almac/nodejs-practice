const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARE
app.use(morgan('dev'));
app.use(express.json()); //Este es un middleware, necesario para obtener el body de la petición
app.use(express.static(`${__dirname}/public`)); //acceso a archivos estáticos públicos desde


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


app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

module.exports = app;