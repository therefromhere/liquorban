
$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

var AUCKLAND_LATLNG = L.latLng([-36.87, 174.77]);

var mymap = L.map('mapid').setView(AUCKLAND_LATLNG, 12);

function onLocationFound(e) {
    var distance = e.latlng.distanceTo(AUCKLAND_LATLNG);

    if (distance < 150 * 1000) {
      mymap.setView(e.latlng, 12);
    } else {
      /* todo - popup a warning here */
      console.log("distance: " + distance + " from Auckland, not using geolocation");
    }

    L.marker(e.latlng).addTo(mymap);
}

/*
function onLocationError(e) {
}
*/

mymap
  .on('locationfound', onLocationFound)
  //.on('locationerror', onLocationError)
  .locate({});

var CartoDB_Positron = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
});

CartoDB_Positron.addTo(mymap);

function popUp(f,l) {
    var out = [];
    var name = f.properties.BYLAWTITLE;
    var hours = f.properties.HOURSOFOPERATION;
    var board = f.properties.BYLAWAREANAME;
    var council_ref = f.properties.COUNCILDECISIONREF;

    /*var label = "<b>" + name + "</b><br />" + hours + "<br />" + "<i>(" + council_ref + ", " + board + ")</i>";*/
    var label = "<b>" + name + "</b><br />" + hours;

    l.bindPopup(label, {
        maxWidth: 250
    });
}

var liquorban = L.geoJson.ajax("https://opendata.arcgis.com/api/v3/datasets/c755b727882e4d489882e55df0a584e5_0/downloads/data?format=geojson&spatialRefId=4326", {
    onEachFeature: popUp,
    style: function(f) {
        var ALL_TIME = "#ff2a23";
        var EVENING = "#ff8f1c";
        var NIGHT = "#7c2d9a";
        var SPECIAL = "#6ad5ff";

        /* set colours for opening hours */
        var colorMap = {
            '24 hours, 7 days a week': ALL_TIME,

            '3pm to 7am daily': EVENING,

            '7pm to 7am daily': EVENING,
            '7pm to 7am daily, daylight savings only': EVENING,
            'Holiday (7pm to 7am daily from Friday of Labour weekend to Tuesday of Easter)': EVENING,

            '9pm to 7am during daylight savings and 7pm to 7am outside daylight savings': NIGHT,
            '9pm to 7am during daylight saving and 7pm to 7am outside daylight saving': NIGHT,
            '9pm to 7am daily, daylight saving only': NIGHT,

            '10pm to 7am during daylight saving and 7pm to 7am outside daylight saving': NIGHT,

            'At all hours of the day on the Market Days of the annual Kowhai Festival each year': SPECIAL,
            'Major Event: 12 hours before & after a major event.': SPECIAL,
            'Second weekend of each December from 4pm of the Friday before the event (Christmas in the Park) to 8am on the following Monday': SPECIAL
        };

        var hours = f.properties.HOURSOFOPERATION;

        if (colorMap[hours]) {
            return {
                color: colorMap[hours],
                opacity: 0.5,
                weight: 1
            };
        }
    }
}).addTo(mymap);
