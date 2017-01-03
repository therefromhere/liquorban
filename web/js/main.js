
$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

var mymap = L.map('mapid').setView([-36.87, 174.77], 12);

function onLocationFound(e) {
    L.marker(e.latlng).addTo(mymap);
}

/*
function onLocationError(e) {
}
*/

mymap
  .on('locationfound', onLocationFound)
  //.on('locationerror', onLocationError)
  .locate({setView: true, maxZoom: 16});

var CartoDB_Positron = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
});

CartoDB_Positron.addTo(mymap);

function popUp(f,l) {
    var out = [];
    var name = f.properties.BYLAWTITLE;
    var hours = f.properties.HOURSOFOPE;
    var board = f.properties.BYLAWAREAN;
    var council_ref = f.properties.COUNCILDEC;

    /*var label = "<b>" + name + "</b><br />" + hours + "<br />" + "<i>(" + council_ref + ", " + board + ")</i>";*/
    var label = "<b>" + name + "</b><br />" + hours;

    l.bindPopup(label, {
        maxWidth: 250
    });
}

var liquorban = L.geoJson.ajax("geojson/auckland_liquor_ban.geojson", {
    onEachFeature: popUp,
    style: function(f) {
        var ALL_TIME = "#ff2a23";
        var EVENING = "#ff8f1c";
        var NIGHT = "#7c2d9a";
        var SPECIAL = "#6ad5ff";

        /* enumeration values for opening hours that were added during preprocessing */
        var colorMap = {
            '24x7': ALL_TIME, 

            '3pm_to_7am': EVENING,

            '7pm_to_7am': EVENING,
            '7pm_to_7am_dst': EVENING,
            '7pm_to_7am_summer': EVENING,

            '9pm_to_7am_dst_7pm_to_7am_nodst': NIGHT,
            '9pm_to_7am_dst': NIGHT,

            '10pm_to_7am_dst_7pm_to_7am_nodst': NIGHT,

            'special_warkworth_kowhai': SPECIAL,
            'special_eden_park': SPECIAL,
            'special_xmas_in_the_park': SPECIAL
        };

        var hours = f.properties.HOURSOFOPE_ENUM;

        if (colorMap[hours]) {
            return {
                color: colorMap[hours],
                opacity: 0.5,
                weight: 1
            };
        }
    }
}).addTo(mymap);
