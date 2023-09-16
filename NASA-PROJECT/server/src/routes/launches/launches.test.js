const request = require('supertest');

const app = require('../../app');

const { 
  mongoConnect, 
  mongoDisconnect, 
} = require('../../services/mongo');

describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect(); //connect to the database
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
      //the actual test code
      const response = await request(app)
      .get('/v1/launches')
      .expect('Content-Type', /json/)  //check the header, match content-type as long as it contains json
      .expect(200);
    });
  });
  
  describe('Test POST /launch', () => {
    const completeLaunchData = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-1652 b',
      launchDate: 'January 4, 2040',
    };
  
    const launchDataWithoutDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-1652 b',
    }
  
    const launchDataWithInvalidDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-1652 b',
      launchDate: 'hello',
    };
  
   test('It should respond with 201 created', async () => {
    const response = await request(app)
    .post('/v1/launches')
    .send(completeLaunchData)
    .expect('Content-Type', /json/)  //check the header, match content-type as long as it contains json
    .expect(201);
  
    const requestDate = new Date(completeLaunchData.launchDate).valueOf(); //extract date from requst and get its numerical value
    const responseDate = new Date(response.body.launchDate).valueOf(); //extract date from response
    expect(responseDate).toBe(requestDate); //make sure the dates are the same
  
    //use jest to test the correct data format
    expect(response.body).toMatchObject(launchDataWithoutDate);
   });
  
   test('It should catch missing required property', async () => {
    const response = await request(app)
    .post('/v1/launches')
    .send(launchDataWithoutDate)
    .expect('Content-Type', /json/)  //check the header, match content-type as long as it contains json
    .expect(400);
  
    //make sure the properties of objects match
    expect(response.body).toStrictEqual({
      error: 'Missing required launch property',
    });
   }); 
   
   test('It should catch invalid dates', async () => {
    const response = await request(app)
    .post('/v1/launches')
    .send(launchDataWithInvalidDate)
    .expect('Content-Type', /json/)  //check the header, match content-type as long as it contains json
    .expect(400);
  
    //make sure the properties of objects match
    expect(response.body).toStrictEqual({
      error: 'Invalid launch date',
    });
   });
  });
});

