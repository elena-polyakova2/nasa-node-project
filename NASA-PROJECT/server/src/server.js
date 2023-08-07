//create built in node http server
const http = require('http');

//import app 
const app = require('./app');


app.listen();

/*
- Set port different to the port that the front-end runs on;
- Make it environmental variable;
- Check first if there is a port specified in the environment, if it is not, go to the default 8000.
*/
const PORT = process.env.PORT || 8000; 
const server = http.createServer(PORT);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT} ...`);
});




