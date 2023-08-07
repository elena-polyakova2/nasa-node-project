//set up express
const express = require('express');

//import
const planetsRouter = require('./routes/planets/planets.router');

const app = express();

//check coming data for json content
app.use(express.json());
app.use(planetsRouter);

module.exports = app;