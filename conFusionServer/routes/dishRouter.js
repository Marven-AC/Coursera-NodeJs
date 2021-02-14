const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// declaring the end point at a single location to get all the method
dishRouter.route('/')
    // I removed '/dishes' because I get the path from the router in index

    //rest api support for /dishes endpoint
    // .all((req, res, next) => {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'text/plain');
    //     next(); // look for additional /dishes
    // })

    .get((req, res, next) => {
        //res.end('Will send all the dishes to you!');
        // res.end end the handling of the get request and trigger the respond to be sent back to the client
        Dishes.find({})
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                // res.json() takes as an input a json string and send it back over to the client
                res.json(dishes);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    // post will carry information in the body of the message in the form of json data
    .post((req, res, next) => {
        //res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
        Dishes.create(req.body)
            .then((dish) => {
                console.log('Dish created', dish);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    // doesn't make sense to update all the dishes
    .put((req, res, next) => {
        res.statusCode = 403; // 403 opperation not supported
        res.end('PUT operation not supported on /dishes');
    })

    .delete((req, res, next) => {
        //res.end('Deleting all the dishes!');
        Dishes.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


dishRouter.route('/:dishId')
    // I removed '/dishes/:dishId' because I get the path from the router in index and I get /dishId from dishRouter.route('dishId)

    .get((req, res, next) => {
        //res.end('Will send you the details of the dish: ' + req.params.dishId);
        // parameter retreive with req.params.dishId the name match in the end and the parameter to retreive the information correctly
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    // doesn't make sense to do a post on a specific dishId
    .post((req, res, next) => {
        res.statusCode = 403; // 403 opperation not supported
        res.end('POST operation not supported on /dishes/' + req.params.dishId);
    })

    .put((req, res, next) => {
        // wirte to add a line to the reply message
        // res.write('Updating the dish: ' + req.params.dishId + '\n');
        // res.end('Will update the dish: ' + req.body.name +
        //     ' with details: ' + req.body.description);
        Dishes.findByIdAndUpdate(req.params.dishId, {
            $set: req.body
        }, { new: true }) // new : true will return the updated dish
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete((req, res, next) => {
        //res.end('Deleting dishe: ' + req.params.dishId);
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = dishRouter; // export dishRouter to use in index


