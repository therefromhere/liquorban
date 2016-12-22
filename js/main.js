var mymap = L.map('mapid').setView([-36.87, 174.77], 12);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

function popUp(f,l) {
    var out = [];
    var name = f.properties.BYLAWTITLE;
    var hours = f.properties.HOURSOFOPE;
    var label = "<b>" + name + "</b><br />" + hours;

    l.bindPopup(label);
}

var liquorban = L.geoJson.ajax("geojson/auckland_liquor_ban.geojson", {
    onEachFeature: popUp
}).addTo(mymap);
