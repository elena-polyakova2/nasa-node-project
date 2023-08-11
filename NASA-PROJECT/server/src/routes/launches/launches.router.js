const express = require('express');

const { getAllLaunches } = require('./launches.controller');
const launchesRouter = express.Router();

//define routes
launchesRouter.get('/launches', getAllLaunches);

module.exports = launchesRouter;
