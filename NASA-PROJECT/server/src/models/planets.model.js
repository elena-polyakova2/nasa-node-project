//built-in imports
const fs = require('fs');
const path = require('path');

//3rd party library
const { parse } = require('csv-parse');

const planets = require('./planets.mongo');

const habitablePlanets = [];

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
        //habitablePlanets.push(data);

        //save found planets to the database, 
        //insert + update = upsert (insert only when project doesn't exist in the database)
        //TODO: Replace below create with upsert
        // await planets.create({
        //   keplerName: data.kepler_name,
        // });
      }
    })
    .on('error', (err) => {
      console.log(err);
      reject(err);
    })
    .on('end', () => {
      console.log(`${habitablePlanets.length} habitable planets found!`);
      resolve();
    });
  });
}

function getAllPlanets() {
 return habitablePlanets;
};

module.exports = {
  loadPlanetsData,
  getAllPlanets,
}     