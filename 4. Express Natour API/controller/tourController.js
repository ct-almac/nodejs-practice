const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkID = (req, res, next, val) =>{
    const id = req.params.id * 1;
    
    if(id > tours.length){
        return res.status(404).json({
            status:'fail',
            message:'Invalid ID'
        });
    }
    next();
};

exports.checkBody = (req, res, next) =>{

    console.log('checkBody req ', req.body);

    if(!req.body.name || !req.body.price ){
        return res.status(404).json({
            status:'error',
            message: 'invalid tour.'
        })
    }

    next();
};

exports.getAllTours = (req, res) => {
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

exports.createTour = (req, res) => {
    const newId = tours[tours.length -1].id + 1;
    const newTour = Object.assign({id:newId}, req.body);
    
    tours.push(newTour);
    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), err =>{
        res.status(201)
        .json({
            status:'success',
            data:{
                tour:newTour
            }
        })
    });
};

exports.updateTour = (req, res) => {
 
    res.status(200).json({
        status:'success',
        data:{
            tour:`< updated tour ${id}>`
        }
    });
};

exports.getTour = (req, res) => {
    res.status(200)
    .json( {
        status:'success',
        data:{
            tours: tour
        } 
    });
};

exports.deleteTour = (req, res) => {
 
    res.status(204).json({
        status:'success',
        message:`< deleted tour ${id}>`,
        data:null
    });
};
