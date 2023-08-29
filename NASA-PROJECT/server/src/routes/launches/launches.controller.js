//uses functions to work with data model and put it together into useful response for front end 

const { 
  getAllLaunches,
  scheduleNewLaunch, 
  existsLaunchWithId,
  abortLaunchById,
} = require('../../models/launches.model');

async function httpGetAllLaunches(req, res) {
  //return status code 200 and json to correspond to the launches map that in the form of array
  return res.status(200).json(await getAllLaunches()); 
};

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (!launch.mission || !launch.rocket || !launch.launchDate
    || !launch.target) {
      return res.status(400).json({
        error: 'Missing required launch property',
      });
    }

  launch.launchDate = new Date(launch.launchDate);
  
  //if launch.launchDate can't be converted to valid date
  if (isNaN(launch.launchDate)) { //check if launch.launchDate is a number
    return res.status(400).json({
      error: 'Invalid launch date',
    });
  }

  await scheduleNewLaunch(launch); //call addNewLaunch passing in new launch data
  return res.status(201).json(launch);
};

function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id); //get id parameter

  if (!existsLaunchWithId(launchId)) {
    return res.status(404).json({
      error: 'Launch not found',
    });
  }

  const aborted = abortLaunchById(launchId);
  return res.status(200).json(aborted);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};