//set up express
const express = require('express');

//import destructured function
const {
  httpGetAllPlanets,
} = require('./planets.controller');

const planetsRouter = express.Router();

//get request
planetsRouter.get('/', httpGetAllPlanets);

module.exports = planetsRouter;