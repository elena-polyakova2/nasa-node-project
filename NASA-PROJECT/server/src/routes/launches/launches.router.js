const express = require('express');

const { httpGetAllLaunches } = require('./launches.controller');
const launchesRouter = express.Router();

//define routes
launchesRouter.get('/launches', httpGetAllLaunches);

module.exports = launchesRouter;
