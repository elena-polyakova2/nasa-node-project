const path = require('path');
//set up express
const express = require('express');
//import cors (allow-cross-origin)
const cors = require('cors');

//import
const planetsRouter = require('./routes/planets/planets.router');
const e = require('express');

const app = express();

app.use(cors({
  //except requests only frpm local host
  origin: 'http://localhost:3000',
})); 

//express middleware
app.use(express.json());//check coming data for json content  
app.use(express.static(path.join(__dirname, '..', 'public'))); //get path to public files

app.use(planetsRouter);
app.get('/', (req, res) => {
  //send index.html inresponse
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
})

module.exports = app;