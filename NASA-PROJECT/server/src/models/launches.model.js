//model works with data based on however that stored

//launches collection
const launches = new Map();

//store launch in object
const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'), //javascript date object
  destination: 'Kepler-442 b',
  customer: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

//add launches by key, value
launches.set(launch.flightNumber, launch);


function getAllLaunches() {
  return Array.from(getAllLaunches.values()); //return launches converted to an array
};

module.exports = {
  getAllLaunches,
}