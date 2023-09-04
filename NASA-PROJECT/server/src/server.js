//create built in node http server
const http = require('http');
const { mongoConnect } = require('./services/mongo');

//import app 
const app = require('./app');

const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model');

// app.listen();

/*
- Set port different to the port that the front-end runs on;
- Make it environmental variable;
- Check first if there is a port specified in the environment, if it is not, go to the default 8000.
*/
const PORT = process.env.PORT || 8000; 

const server = http.createServer(app);

async function startServer() {
  //connect to the MongoDB using latest features
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData(); //data from SpaceX

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT} ...`);
  });
}

startServer();



