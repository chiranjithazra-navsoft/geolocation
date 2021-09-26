var L = window.L;
var copy = '© <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
var url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
var osm = new L.TileLayer(url, { attribution: copy })
var map = new L.Map('map', { layers: [osm], minZoom: 5})

map.locate()
  .on('locationfound', e => map.setView(e.latlng, 8))
  .on('locationerror', () => map.setView([0, 0], 5))

async function load_markers() {
const markers_url = `/api/markers/?in_bbox=${map.getBounds().toBBoxString()}`
const response = await fetch(markers_url)
const geojson = await response.json()
const frameCount = geojson.features.length
console.log(frameCount)
const frames = []
for (var i = 0; i < frameCount;) {
    console.log("enter")
    var lat = geojson.features[i].geometry.coordinates[1]
    var long = geojson.features[i].geometry.coordinates[0]
    console.log(lat)
    console.log(long)
    var weather_url = "https://api.weather.gov/points/"+lat+","+long
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(this.responseText)
        var forcast_url = res.properties.forecast
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                var forcast_res = JSON.parse(this.responseText)
                geojson.features[i].properties.detailedForecast = forcast_res.properties.periods[0].detailedForecast
                geojson.features[i].properties.temperature = forcast_res.properties.periods[0].temperature
                geojson.features[i].properties.temperatureUnit = forcast_res.properties.periods[0].temperatureUnit
                }
            };
            xhttp.open("GET", forcast_url, false);
            xhttp.send();
        }
    };
    xhttp.open("GET", weather_url, false);
    xhttp.send();
    i+=1
}
console.log(geojson)
return geojson
}
async function render_markers() {
const markers = await load_markers()
L.geoJSON(markers).bindPopup(layer => "<b>"+layer.feature.properties.name+"</b><br><p>"+layer.feature.properties.detailedForecast+"</p><br><b>Temprature:</b>"+layer.feature.properties.temperature+" "+layer.feature.properties.temperatureUnit).addTo(map)
}
map.on('moveend', render_markers)
