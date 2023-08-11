const { launches } = require('../../models/launches.model');

function getAllLaunches(req, res) {
  //return status code 200 and json to correspond to the launches map that in the form of array
  return res.status(200).json(Array.from(launches.values())); 
};

module.exports = {
  getAllLaunches,
};