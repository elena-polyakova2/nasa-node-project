//import mongoose
const mongoose = require('mongoose');

//store schema defining tha launches
const planetsSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: true,
  }
});