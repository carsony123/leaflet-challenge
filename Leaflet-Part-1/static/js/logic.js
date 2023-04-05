// Create the map
var map = L.map('map').setView([0, 0], 2);

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18
}).addTo(map);

// Load the earthquake data
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        // Loop through the earthquakes
        data.features.forEach(function(feature) {
            // Get the magnitude, depth, and location
            var magnitude = feature.properties.mag;
            var depth = feature.geometry.coordinates[2];
            var location = feature.properties.place;

            // Create a circle marker for the earthquake
            var marker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                radius: magnitude * 5,
                color: 'black',
                weight: 1,
                fillColor: depthColor(depth),
                fillOpacity: 0.7
            }).addTo(map);

            // Add a popup with information about the earthquake
            marker.bindPopup('Magnitude: ' + magnitude + '<br>Depth: ' + depth + ' km<br>Location: ' + location);
        });

        // Add a legend
        var legend = L.control({ position: 'bottomright' });
        legend.onAdd = function() {
            var div = L.DomUtil.create('div', 'info legend');
            var depths = [0, 10, 30, 50, 70, 100];
            var labels = ["0-10", "10-30", "30-50", "50-70", "70-100", "100+"];
            for (var i = 0; i < depths.length; i++) {
                div.innerHTML +=
                    '<i style="background:' +
                    depthColor(depths[i]) +
                    '"></i> ' +
                    labels[i] +
                    " km<br>";
            }
            return div;
        };
        legend.addTo(map);
    });

// Function to determine the fill color based on depth
function depthColor(depth) {
    if (depth < 10) {
        return '#fee5d9';
    } else if (depth < 30) {
        return '#fcbba1';
    } else if (depth < 50) {
        return '#fc9272';
    } else if (depth < 70) {
        return '#fb6a4a';
    } else if (depth < 100) {
        return '#de2d26';
    } else {
        return '#a50f15';
    }
}
