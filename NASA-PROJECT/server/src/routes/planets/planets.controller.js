const planets = require('../../models/planets.model');    

//response with status code 200 and list planets in json format
function getAllPlanets (req, res) {
  return res.status(200).json(planets);
};

//return an object as there might be multiple functions
module.exports = {
  getAllPlanets,
};