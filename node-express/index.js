const express = require('express');
const http = require('http');
const morgan = require('morgan'); // give better log
const bodyParser = require('body-parser'); // to parse the body of the request message in json format in req.body

const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

const hostname = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

// any request comming to /dishes endpoint will be handled by dishRouter
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter)
app.use('/leaders', leaderRouter)


app.use(express.static(__dirname + '/public')); // location of the static files, dirname: root of the project

app.use((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is an Express Server</h1></body></html>');
});

const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`Server running on http://${hostname}:${port}`);
})