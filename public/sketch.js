const status = document.querySelector('#status');
const mapLink = document.querySelector('#map-link');
const $weather = document.querySelector('#weather');
const button = document.querySelector('#submit');
const api_key = "aef61d55622575e078fe2d2a01788508";

if(!navigator.geolocation){
  status.textContent = 'Geolocation not available.'
}else{
  status.textContent = 'Locating...';
  navigator.geolocation.getCurrentPosition(success, error);
}

async function success(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  status.textContent = ''
  //request the weather info
  const api_url = `/weather/${latitude},${longitude}`;
  const apiResponse = await fetch(api_url);
  const apiData = await apiResponse.json();
  //conver the temp from kelvin to fahrenheit
  const temp = (apiData.weather.main.temp-273.15)*9/5+32;
  const feels_like = (apiData.weather.main.feels_like-273.15)*9/5+32;
  const summary = apiData.weather.weather[0].main;
  let airQualityText = 'There is no air quality reading at this location.';
  let airQuality = apiData.airQuality;
  if(airQuality.results.length > 0) {
    airQualityText = `The air quality is ${airQuality.results[0].measurements[0].value} ${airQuality.results[0].measurements[0].parameter}.`
  }
  mapLink.textContent = `The weather here at ${latitude.toFixed(2)}°, ${longitude.toFixed(2)}° is ${apiData.weather.weather[0].main}. It's ${temp.toFixed(0)}° but feels like ${feels_like.toFixed(0)}° Fahrenheit. `;
  mapLink.textContent+=airQualityText;
  // console.log(temp, feels_like);
  const data = {latitude, longitude, weather:{temp, feels_like, summary}, airQuality};
  const options = {
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body: JSON.stringify(data)
  }
  const response = await fetch('/api', options);
  const fromDB = await response.json();
  // console.log(fromDB);
}

function error() {
  status.textContent = 'Unable to retrieve your location.';
}
