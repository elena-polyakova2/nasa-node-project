//create built in node http server
const http = require('http');
const mongoose = require('mongoose');

//import app 
const app = require('./app');

const { loadPlanetsData } = require('./models/planets.model');

// app.listen();

/*
- Set port different to the port that the front-end runs on;
- Make it environmental variable;
- Check first if there is a port specified in the environment, if it is not, go to the default 8000.
*/
const PORT = process.env.PORT || 8000; 

const MONGO_URL = 'mongodb+srv://nasa-api:1iQT2FOpYFnF2G5K@nasacluster.nl8wtvg.mongodb.net/nasa?retryWrites=true&w=majority';

const server = http.createServer(app);

//notify that MongoDB is connected
mongoose.connection.once('open', () => {
  console.log('MongoDB connection is ready!');
});

//catch errors
mongoose.connection.on('error', (err) => {
 console.error(err);
});

async function startServer() {
  //connect to the MongoDB using latest features
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT} ...`);
  });
}

startServer();



