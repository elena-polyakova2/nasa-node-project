//model works with data based on however that stored

const launchesDatabase = require('./launches.mongo');

//launches collection
const launches = new Map();

let latestFlightNumber = 100;

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

async function getAllLaunches() {
  return await launchesDatabase
  .find({}, {
    '_id': 0, '__v': 0,
  }); //find all launches in mongo collection and display them excluding mongoose's id and version key
};

//save launch object in launches collection, update values if a launch already exists
async function saveLaunch(launch) {
  //update one at a time
  await launchesDatabase.updateOne({
    flightNumber: launch.flightNumber, //check if flightNumber already exists, if not, create it, overwise insert launch object
  }, launch, { //if launch does not exist, insert launch object
    upsert: true,
  })
};

//set launches in thelaunches map
function addNewLaunch(launch) {
  latestFlightNumber++;
  
  launchesDatabase.set(
    latestFlightNumber, //assign additional property to the launch object
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ['Zero To Mastery', 'NASA'],
      flightNumber: latestFlightNumber,
    })
    ); 
};

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId); //get data
  aborted.upcoming = false; //data will be send to history list
  aborted.success = false;
  return aborted;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
  saveLaunch,
}