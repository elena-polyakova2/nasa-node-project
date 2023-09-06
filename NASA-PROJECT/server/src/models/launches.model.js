//model works with data based on however that stored

const axios = require('axios');

const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

//launches collection
const launches = new Map();

//store launch in object
const launch = {
  flightNumber: 100, //flight_number
  mission: 'Kepler Exploration X', //name
  rocket: 'Explorer IS1', //rocket.name in api request
  launchDate: new Date('December 27, 2030'), //javascript date object, date_local in api request
  target: 'Kepler-442 b', //not applicable
  customers: ['ZTM', 'NASA'], //payload.customers for each payload
  upcoming: true, //upcoming
  success: true, //success
};

//add launches by key, value
saveLaunch(launch);

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';
async function loadLaunchData() {
  console.log('Downloading the launch data');

  //post request using axios
  const response = await axios.post(SPACEX_API_URL, {
    
    query: {},
    options: {
      populate: [
        {
          path: 'rocket',
          select: { //value to select
              name: 1
          }
        },
        {
          path: 'payloads',
          select: {
            customers: 1
          }
        }
      ]
    } 
  });

  //get data from the body of the SpaceX json response 
  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];

    //flatten array into a single list for a launch to get customers 
    const customers = payloads.flatMap((payload) => {
      return payload['customers'];
    });

    //convert doc from response in a launch object to save in the database
    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers,
    };
     console.log(`${launch.flightNumber} ${launch.mission}`);
  }
}

async function existsLaunchWithId(launchId) {
  return await launchesDatabase.findOne({
    flightNumber: launchId,
  });
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

  //update one at a time, return only properties that were set in update
  await launchesDatabase.findOneAndUpdate({
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

async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne({
    flightNumber: launchId,
  }, { //properties to be updated
    upcoming: false,
    success: false,
  });

  return aborted.modifiedCount === 1; //amount of documents to be update equals to 1
  // const aborted = launches.get(launchId); //get data
  // aborted.upcoming = false; //data will be send to history list
  // aborted.success = false;
  // return aborted;
}

module.exports = {
  loadLaunchData,
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
  saveLaunch,
}