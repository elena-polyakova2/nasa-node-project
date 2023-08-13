//uses functions to work with data model and put it together into useful response for front end 

const { getAllLaunches } = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
  //return status code 200 and json to correspond to the launches map that in the form of array
  return res.status(200).json(Array.from(getAllLaunches.values())); 
};

module.exports = {
  httpGetAllLaunches,
};