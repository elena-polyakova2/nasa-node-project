//model works with data based on however that stored

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
  customer: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

//add launches by key, value
launches.set(launch.flightNumber, launch);

function existsLaunchWithId(launchId) {
  return launches.has(launchId);
}

function getAllLaunches() {
  return Array.from(launches.values()); //return launches converted to an array
};

//set launches in thelaunches map
function addNewLaunch(launch) {
  latestFlightNumber++;
  
  launches.set(
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
}