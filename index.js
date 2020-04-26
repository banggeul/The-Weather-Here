const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

//console.log(process.env);

const app = express();
//do this before deploying since servers will decide the port number
const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log(`Starting server at ${port}`));
app.use(express.static('public/'));
app.use(express.json({limit:'1mb'}));
const database = new Datastore('database.db');
database.loadDatabase();
app.get('/api', (req, res)=>{
  database.find({}, function(err, docs){
    if(err){
      res.end();
      return;
    }
    res.json(docs);
  });
});

app.get('/weather/:latlong',async (req, res)=>{
  const latlong = req.params.latlong.split(',');
  // console.log(latlong);
  const [lat, long] = latlong;
  const api_key = process.env.API_KEY;
  // console.log(lat, long);
  const api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api_key}`;
  const weatherResponse = await fetch(api_url);
  const weather = await weatherResponse.json();

  const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${long}`;
  const aqResponse = await fetch(aq_url);
  const airQuality = await aqResponse.json();
  const data = { weather, airQuality };
  res.json(data);
})


app.post('/api', (request, response)=>{
  // console.log(request.body);
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  console.log(data.timestamp);
  database.insert(data);
  response.json({
    status:'success',
    latitude: data.latitude,
    longitude: data.longitude,
    timestamp: data.timestamp
  })
})
