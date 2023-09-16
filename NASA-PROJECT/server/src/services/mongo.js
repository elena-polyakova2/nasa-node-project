const mongoose = require('mongoose');

//populate values in the environment file
require('dotenv').config();

//mongoDB connection string
const MONGO_URL = process.env.MONGO_URL;

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