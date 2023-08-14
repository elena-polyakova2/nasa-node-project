const express = require('express');

const { 
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
} = require('./launches.controller');
const launchesRouter = express.Router();

//define routes
launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpAddNewLaunch);
launchesRouter.delete('/:id', httpAbortLaunch); //passing id parameter

module.exports = launchesRouter;
