const path = require('path');
//set up express
const express = require('express');
//import cors (allow-cross-origin request)
const cors = require('cors');
const morgan = require('morgan');

const api = require('./routes/api');

const app = express();

//security related feature
app.use(cors({
  //except requests only frpm local host
  origin: 'http://localhost:3000',
})); 
app.use(morgan('combined'));

//express middleware
app.use(express.json());//check coming data for json content  
app.use(express.static(path.join(__dirname, '..', 'public'))); //get path to public files
app.use('/v1', api); //add version of the api

app.get('/*', (req, res) => {
  //send index.html inresponse
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;