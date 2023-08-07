//set up express
const express = require('express');

//import destructured function
const {
  getAllPlanets,
} = require('./planets.controller');

const planetsRouter = express.Router();

//get request
planetsRouter.get('/planets', getAllPlanets);

module.exports = planetsRouter;