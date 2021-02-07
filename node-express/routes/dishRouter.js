const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// declaring the end point at a single location to get all the method
dishRouter.route('/')
    // I removed '/dishes' because I get the path from the router in index

    //rest api support for /dishes endpoint
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next(); // look for additional /dishes
    })

    .get((req, res, next) => {
        res.end('Will send all the dishes to you!');
        // res.end end the handling of the get request and trigger the respond to be sent back to the client
    })

    // post will carry information in the body of the message in the form of json data
    .post((req, res, next) => {
        res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
    })

    // doesn't make sense to update all the dishes
    .put((req, res, next) => {
        res.statusCode = 403; // 403 opperation not supported
        res.end('PUT operation not supported on /dishes');
    })

    .delete((req, res, next) => {
        res.end('Deleting all the dishes!');
    });


dishRouter.route('/:dishId')
    // I removed '/dishes/:dishId' because I get the path from the router in index and I get /dishId from dishRouter.route('dishId)

    .get((req, res, next) => {
        res.end('Will send you the details of the dish: ' + req.params.dishId);
        // parameter retreive with req.params.dishId the name match in the end and the parameter to retreive the information correctly
    })

    // doesn't make sense to do a post on a specific dishId
    .post((req, res, next) => {
        res.statusCode = 403; // 403 opperation not supported
        res.end('POST operation not supported on /dishes/' + req.params.dishId);
    })

    .put((req, res, next) => {
        // wirte to add a line to the reply message
        res.write('Updating the dish: ' + req.params.dishId + '\n');
        res.end('Will update the dish: ' + req.body.name +
            ' with details: ' + req.body.description);
    })

    .delete((req, res, next) => {
        res.end('Deleting dishe: ' + req.params.dishId);
    });

module.exports = dishRouter; // export dishRouter to use in index


