const { getAllPlanets } = require('../../models/planets.model');    

//response with status code 200 and list planets in json format
async function httpGetAllPlanets (req, res) {
  return res.status(200).json(await getAllPlanets());
};

//return an object as there might be multiple functions
module.exports = {
  httpGetAllPlanets,
};