const express = require('express');
const tourController = require('../controller/tourController');
//const {getAllTours, createTour, getTour, updateTour, deleteTour} = require('./../controller/tourController');

const router = express.Router(); // reemplazamos app con la instancia de express.Router() en tourRouter

router.param('id', tourController.checkID); //middleware para validar id


//create a checkbody middleware
// check if body contains the name and price property 
// if not, send back 400
// add it to the post handler stack

router.route('/') // api/v1/tours <-- la base estará indicada en app.use('api/v1/tours', tourRouter)
    .get(tourController.getAllTours)
    .post(tourController.checkBody, tourController.createTour);

router.route('/:id') //api/v1/tours/:id
    .get(tourController.getTour)
    .post(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;