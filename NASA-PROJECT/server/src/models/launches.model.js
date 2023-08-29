//model works with data based on however that stored

const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

//launches collection
const launches = new Map();

//store launch in object
const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'), //javascript date object
  target: 'Kepler-442 b',
  customers: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

//add launches by key, value
saveLaunch(launch);

function existsLaunchWithId(launchId) {
  return launches.has(launchId);
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase
    .findOne() //return one first document, if more than one found
    .sort('-flightNumber'); //sort data by flight number in descending order

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return await launchesDatabase
  .find({}, {
    '_id': 0, '__v': 0,
  }); //find all launches in mongo collection and display them excluding mongoose's id and version key
}

//save launch object in launches collection, update values if a launch already exists
async function saveLaunch(launch) {
  //make sure target planet exists in the database
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if(!planet) {
    //built-in Nodejs Error object
    throw new Error('No matching planet was found.');
  };

  //update one at a time
  await launchesDatabase.updateOne({
    flightNumber: launch.flightNumber, //check if flightNumber already exists, if not, create it, overwise insert launch object
  }, launch, { //if launch does not exist, insert launch object
    upsert: true,
  })
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = await getLatestFlightNumber() + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['Zero to Mastery', 'NASA'],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId); //get data
  aborted.upcoming = false; //data will be send to history list
  aborted.success = false;
  return aborted;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
  saveLaunch,
}