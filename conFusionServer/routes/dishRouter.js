const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

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
    .post(authenticate.verifyUser, (req, res, next) => {
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
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403; // 403 opperation not supported
        res.end('PUT operation not supported on /dishes');
    })

    .delete(authenticate.verifyUser, (req, res, next) => {
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
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403; // 403 opperation not supported
        res.end('POST operation not supported on /dishes/' + req.params.dishId);
    })

    .put(authenticate.verifyUser, (req, res, next) => {
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

    .delete(authenticate.verifyUser, (req, res, next) => {
        //res.end('Deleting dishe: ' + req.params.dishId);
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

// handle comments
dishRouter.route('/:dishId/comments')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments);
                }
                else {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    dish.comments.push(req.body);
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err));

                }
                else {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes/'
            + req.params.dishId + '/comments');
    })

    .delete(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    for (var i = (dish.comments.length - 1); i >= 0; i--) {
                        dish.comments.id(dish.comments[i]._id).remove();
                    }
                    // after modifying the dish save it
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });


dishRouter.route('/:dishId/comments/:commentId')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments.id(req.params.commentId));
                }
                // dish doesn't exist
                else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                // comment doesn't exist
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/' + req.params.dishId
            + '/comments/' + req.params.commentId);
    })

    .put(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    if (req.body.rating) {
                        dish.comments.id(req.params.commentId).rating = req.body.rating;
                    }
                    if (req.body.comment) {
                        dish.comments.id(req.params.commentId).comment = req.body.comment;
                    }
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err));
                }
                // dish doesn't exist
                else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                // comment doesn't exist
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    dish.comments.id(req.params.commentId).remove();
                    // after modifying the dish save it
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err));
                }
                else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = dishRouter; // export dishRouter to use in index


