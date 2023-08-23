//import mongoose
const mongoose = require('mongoose');

//store schema defining tha launches
const planetsSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: true,
  }
});

//create model to connect planetsSchema with the "planets" collection to create and read data
module.exports = mongoose.model('Planet', planetsSchema);