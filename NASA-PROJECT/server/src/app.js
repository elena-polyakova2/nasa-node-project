//set up express
const express = require('express');
//import cors (allow-cross-origin)
const cors = require('cors');

//import
const planetsRouter = require('./routes/planets/planets.router');

const app = express();

app.use(cors({
  //except requests only frpm local host
  origin: 'http://localhost:3000',
})); 
//check coming data for json content
app.use(express.json());
app.use(planetsRouter);

module.exports = app;