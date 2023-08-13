//uses functions to work with data model and put it together into useful response for front end 

const { 
  getAllLaunches,
  addNewLaunch, 
} = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
  //return status code 200 and json to correspond to the launches map that in the form of array
  return res.status(200).json(getAllLaunches()); 
};

function httpAddNewLaunch(req, res) {
  const launch = req.body;

  launch.launchDate = new Date(launch.launchDate);

  addNewLaunch(launch); //call addNewLaunch passing in new launch data
  return res.status(201).json(launch);
};

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
};