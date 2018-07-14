import React from 'react';
// import 'http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.css';
// import 'http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.js';
// import 'https://api.mapbox.com/mapbox.js/v2.2.3/mapbox.js';
// import '../../../../../../scripts/leaflet-search';
// import 'http://labs.easyblog.it/maps/leaflet-search/src/leaflet-search.css';
// import 'https://maps.googleapis.com/maps/api/js?v=3&sensor=false';
// import '../../../../../../scripts/leaflet-map';

import { Map, TileLayer, Marker, Popup, Icon } from 'react-leaflet';
import Leaflet from 'leaflet';
//import Leaflet from 'leaflet';
/*$(function () {
    $("#organisations").multiselect();
});*/
import $ from 'jquery';
import leafletMap from './../../../scripts/leaflet-map';
import ReactDOM from 'react-dom';
//import './../../../../../../target/www/content/images/'

function ShowNearby(radius, e) {
  $('#lat').val(e.latlng.lat);
  $('#lon').val(e.latlng.lng);

  let request = { lat: e.latlng.lat, lon: e.latlng.lng, radius: radius };
  $.getJSON('/api/avalanche-tests', request, data => {
    updateMap(data);
  });
}

function updateMap(data) {
  let position = {
    Latitude: $('#lat').val(),
    Longitude: $('#lon').val()
  };

  data.push(position);
  leafletMap.onData(data);
}

const MyPopupMarker = ({ children, ...props }) => (
  <Marker {...props}>
    <Popup>{children}</Popup>
  </Marker>
);

const MyMarkersList = ({ markers }) => {
  const items = markers.map(({ key, ...props }) => {
    return <MyPopupMarker key={key} {...props} />;
  });
  return <div style={{ display: 'none' }}>{items}</div>;
};

const markerIcons = [];
const iconDir = './../../../../../../target/www/content/images/';
for (let i = 0; i < 5; i++) {
  markerIcons.push(
    new Leaflet.Icon({
      iconUrl: require(`./../../../../../../target/www/content/images/${i + 1}.png`)
    })
  );
}
export default class TestsMap extends React.Component {
  state = {
    lat: 0,
    lng: 0,
    zoom: 13,
    markers: []
  };

  constructor(props) {
    super(props);

    this.onData = this.onData.bind(this);
  }
  //map = null;

  onData(data) {
    const markers = data.map(marker => {
      return {
        key: marker.id,
        position: [marker.lon, marker.lat],
        children: marker.content,
        icon: markerIcons[marker.dangerLevel - 1]
      };
    });

    // TODO: unswitch lat and lon
    this.setState({ markers, lat: data[0].lon, lng: data[0].lat });
  }
  componentDidMount() {
    $.getJSON('/api/avalanche-tests', null, this.onData);
  }

  // componentWillUnmount() {
  //     this.map = null;
  // }

  render() {
    const center = [this.state.lat, this.state.lng];

    return (
      <Map center={center} zoom={this.state.zoom}>
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MyMarkersList markers={this.state.markers} />
      </Map>
    );
  }
}
