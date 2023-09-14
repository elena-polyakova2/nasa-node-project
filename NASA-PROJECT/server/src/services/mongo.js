const mongoose = require('mongoose');

//mongoDB connection string
const MONGO_URL = 'mongodb+srv://nasa-api:1iQT2FOpYFnF2G5K@nasacluster.nl8wtvg.mongodb.net/nasa?retryWrites=true&w=majority';

//notify that MongoDB is connected
mongoose.connection.once('open', () => {
  console.log('MongoDB connection is ready!');
});

//catch errors
mongoose.connection.on('error', (err) => {
 console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
};

async function mongoDisconnect() {
  await mongoose.disconnect();
};

module.exports = {
  mongoConnect,
  mongoDisconnect,
};