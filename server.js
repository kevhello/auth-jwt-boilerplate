const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

// DB Setup
mongoose.connect('mongodb://localhost:27017/auth');

// App setup - Getting express to working
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({type: '*/*'}));
router(app); // set up routes in app

// Server setup - Getting express to communicate w/ outside world
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});