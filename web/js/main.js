var mymap = L.map('mapid').setView([-36.87, 174.77], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

function popUp(f,l) {
    var out = [];
    var name = f.properties.BYLAWTITLE;
    var hours = f.properties.HOURSOFOPE;
    var board = f.properties.BYLAWAREAN;
    var council_ref = f.properties.COUNCILDEC;

    /*var label = "<b>" + name + "</b><br />" + hours + "<br />" + "<i>(" + council_ref + ", " + board + ")</i>";*/
    var label = "<b>" + name + "</b><br />" + hours;

    l.bindPopup(label);
}

var liquorban = L.geoJson.ajax("geojson/auckland_liquor_ban.geojson", {
    onEachFeature: popUp,
    style: function(f) {
        /* enumeration values for opening ours that were added during preprocessing */
        /* colours from http://colorbrewer2.org/#type=diverging&scheme=RdYlBu&n=9 */
        var colorMap = {
            '24x7': "#d73027",

            '3pm_to_7am': "#f46d43",

            '7pm_to_7am': "#fdae61",
            '7pm_to_7am_dst': "#fdae61",
            '7pm_to_7am_summer': "#fdae61", 

            '9pm_to_7am_dst_7pm_to_7am_nodst': "#74add1", 
            '9pm_to_7am_dst_7pm': "#74add1", 

            '10pm_to_7am_dst_7pm_to_7am_nodst': "#4575b4",

            'special_warkworth_kowhai': "#1a9850",
            'special_eden_park': "#1a9850",
            'special_xmas_in_the_park': "#1a9850"
        };

        var hours = f.properties.HOURSOFOPE_ENUM;

        if (colorMap[hours]) {
            return { color: colorMap[hours] }; 
        }
    }
}).addTo(mymap);
