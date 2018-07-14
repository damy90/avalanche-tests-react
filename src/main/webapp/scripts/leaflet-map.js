function leafletMap() {
    var LeafIcon = L.Icon.extend({
        options: {
            //shadowUrl: 'leaf-shadow.png',
            iconSize: [50, 36],
            //shadowSize: [50, 64],
            iconAnchor: [14, 25],
            //shadowAnchor: [4, 62],
            popupAnchor: [-3, -25]
        }
    });

    var dangerLevelIcons = [
        new LeafIcon({ iconUrl: 'http://localhost:9080/resources/images/images/1.png' }),
        new LeafIcon({ iconUrl: 'http://localhost:9080/resources/images/images/2.png' }),
        new LeafIcon({ iconUrl: 'http://localhost:9080/resources/images/images/3.png' }),
        new LeafIcon({ iconUrl: 'http://localhost:9080/resources/images/images/4.png' }),
        new LeafIcon({ iconUrl: 'http://localhost:9080/resources/images/images/5.png' })
    ];

    var dataMarkers = [];

    return {
        initMap: function (elementId) {
            //L.mapbox.accessToken = 'pk.eyJ1IjoiZGFueTkwdG0iLCJhIjoiY2lpMGE3eW8xMDBjYXcxa3N1NjdvdHd3NiJ9.h83bG5gr14GXwhGrODE-Mw';
            var map = L.map(elementId);
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox.streets',
                accessToken: 'pk.eyJ1IjoiZGFueTkwdG0iLCJhIjoiY2lpMGE3eW8xMDBjYXcxa3N1NjdvdHd3NiJ9.h83bG5gr14GXwhGrODE-Mw'
            }).addTo(map);

            return map;
        },
        initSearch: function (map) {
            var controlSearch = new L.Control.Search({
                url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
                jsonpParam: 'json_callback',
                propertyName: 'display_name',
                propertyLoc: ['lat', 'lon'],
                circleLocation: false,
                markerLocation: true,
                autoType: true,
                autoCollapse: true,
                minLength: 3,
                zoom: 10
            });

            map.addControl(controlSearch);

            return controlSearch;
        },
        onData: function (markers) {
            var markerPlaceIDs = {};

            for (var i = 0; i < markers.length; i++)
                markerPlaceIDs[markers[i].Id] = markers[i];

            //remove all markers
            dataMarkers.filter(function (element) {
                map.removeLayer(element); //delete from the map the markers that are not longer needed
                return false;
            });

            dataMarkers = [];

            //add the new markers (only new markers are left in markerPlaceIDs)
            for (var pid in markerPlaceIDs) {
                var marker = markerPlaceIDs[pid];
                var markerproperties = null;
                if (marker.DangerLevel) {
                    markerproperties = { icon: dangerLevelIcons[marker.DangerLevel - 1] }
                }

                var m = L.marker([marker.Latitude, marker.Longitude], markerproperties).addTo(map);
                dataMarkers.push(m);
                if (marker.DangerLevel) {
                    m.bindPopup(marker.Place + '<br/><a href="Tests/Details/' + marker.Id + '">Details</a>');
                }
            }

            var group = new L.featureGroup(dataMarkers);

            map.fitBounds(group.getBounds());
        }
    }
}

export default leafletMap();