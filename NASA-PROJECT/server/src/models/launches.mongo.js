//import mongoose
const mongoose = require('mongoose');

//store schema defining tha launches
const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
    default: 100, //first launch number
  },
  launcheDate: {
    type: Date,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  target: {
    type: String,       
  },
  customers: [String],
  upcoming: {
    type: Boolean,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
    default: true,
  },
});

//create model to connect launchesSchema with the "launches" collection to create and read data
module.exports = mongoose.model('Launch', launchesSchema);