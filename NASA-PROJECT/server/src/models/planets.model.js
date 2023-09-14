//built-in imports
const fs = require('fs');
const path = require('path');

//3rd party library
const { parse } = require('csv-parse');

const planets = require('./planets.mongo');

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

//promise to load tha planets' data
function loadPlanetsData() {
  //read and pass data as a stream
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
    .pipe(parse({
      comment: '#',
      columns: true,
    }))
    .on('data', async (data) => {
      if (isHabitablePlanet(data)) {
        //save found planets from csv file to the database, 
        savePlanet(data);
      }
    })
    .on('error', (err) => {
      console.log(err);
      reject(err);
    })
    .on('end', async () => {
      const countPlanetsFound = (await getAllPlanets()).length;
      console.log(`${countPlanetsFound} habitable planets found!`);
      resolve();
    });
  });
}

async function getAllPlanets() {
  //find all planets
  return  await planets.find({}, {
    //exclude these field when showing results
    '_id': 0, 
    '__v': 0,
  });
}

async function savePlanet(planet) {
  //insert + update = upsert (insert only when project doesn't exist in the database)
  try {
    await planets.updateOne({
      keplerName: planet.kepler_name,
    }, {
      keplerName: planet.kepler_name,
    }, {
      upsert: true,
    });
  } catch(err) {
    console.error(`Could not save planet, ${err}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};    