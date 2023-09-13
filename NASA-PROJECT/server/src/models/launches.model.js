//model works with data based on however that stored

const axios = require('axios');

const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

//launches collection
// const launches = new Map();

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {
  console.log('Downloading the launch data');

  //post request using axios
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false, //get all SpaceX launches on one page with one request
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

  //validate response tatus code
  if(response.status !== 200) {
    console.log('There is a problem in downloading the data.');
    throw new Error('Launch data download failed.');
  }

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

     //populate launches collection
     await saveLaunch(launch);

  }
}

async function loadLaunchData() {
  //check if a launch already exists using data from SpaceX API
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });

  if (firstLaunch) {
    console.log('Launch data already loaded!');
  } else {
    await populateLaunches();
  }
}

//check if a launch already exists using a criteria
async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}

async function existsLaunchWithId(launchId) {
  return await findLaunch({
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

async function getAllLaunches(skip, limit) {
  return await launchesDatabase
  .find({}, { '_id': 0, '__v': 0 }) //find all launches in mongo collection and display them excluding mongoose's id and version key
  .sort({ flightNumber: 1 }) //sort by flight number
  .skip(skip) //skip over first 20 documents
  .limit(limit); //limit documents to come back from mongo
}

//save launch object in launches collection, update values if a launch already exists
async function saveLaunch(launch) {
  //update one at a time, return only properties that were set in update
  await launchesDatabase.findOneAndUpdate({
    flightNumber: launch.flightNumber, //check if flightNumber already exists, if not, create it, overwise insert launch object
  }, launch, { //if launch does not exist, insert launch object
    upsert: true,
  })
}

async function scheduleNewLaunch(launch) {
  //make sure target planet exists in the database
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if(!planet) {
    //built-in Nodejs Error object
    throw new Error('No matching planet was found.');
  };

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