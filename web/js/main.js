var mymap = L.map('mapid').setView([-36.87, 174.77], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
    onEachFeature: popUp,
    style: function(f) {
        /* todo, use enum instead */
        /* colours from http://colorbrewer2.org/#type=diverging&scheme=RdYlBu&n=9 */
        var colorMap = {
            '24 hours, 7 days a week': "#d73027",

            '3pm to 7am daily': "#f46d43",

            '7pm to 7am daily': "#fdae61",
            '7pm to 7am daily, daylight savings only': "#fdae61",
            'Holiday (7pm to 7am daily from Friday of Labour weekend to Tuesday of Easter)': "#fdae61", 

            '9pm to 7am during daylight savings and 7pm to 7am outside daylight savings': "#74add1", 
            '9pm to 7am during daylight saving and 7pm to 7am outside daylight saving': "#74add1", 
            '9pm to 7am daily, daylight saving only': "#74add1",

            '10pm to 7am during daylight saving and 7pm to 7am outside daylight saving': "#4575b4",

            'At all hours of the day on the Market Days of the annual Kowhai Festival each year': "#1a9850",
            'Major Event: 12 hours before & after a major event.': "#1a9850",
            'Second weekend of each December from 4pm of the Friday before the event (Christmas in the Park) to 8am on the following Monday': "#1a9850"
        };

        var hours = f.properties.HOURSOFOPE;
        if (colorMap[hours]) {
            return { color: colorMap[hours] }; 
        }
    }
}).addTo(mymap);
