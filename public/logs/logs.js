const mymap = L.map('checkinMap').setView([0,0],1);
const attribution = '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl,{attribution});
tiles.addTo(mymap);
getData();

async function getData() {
  const response = await fetch('/api');
  console.log("dump all data here")
  const data = await response.json();
  // console.log(data);
  data.forEach(d=>{
    let airQualityText = 'There is no air quality reading at this location.';
    const airQualityData = d.airQuality;
    if(airQualityData.results.length > 0) {
      airQualityText = `The air quality is ${airQualityData.results[0].measurements[0].value} ${airQualityData.results[0].measurements[0].parameter}.`
    }
    const marker = L.marker([d.latitude, d.longitude]).addTo(mymap);
    let text = `The weather here at ${d.latitude.toFixed(2)}°, ${d.longitude.toFixed(2)}° is ${d.weather.summary}. It's ${d.weather.temp.toFixed(0)}° but feels like ${d.weather.feels_like.toFixed(0)}° Fahrenheit. `;
    text += airQualityText;
    console.log(text);
    marker.bindPopup(text);
  })
}
