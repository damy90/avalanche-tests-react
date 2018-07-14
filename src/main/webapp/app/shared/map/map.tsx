import React from 'react';

import { Map, TileLayer, Marker, Popup, Icon } from 'react-leaflet';
import Leaflet from 'leaflet';

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
    zoom: 12,
    markers: [],
    bounds: null,
    hasLocation: false,
    showLocation: true
  };

  mapRef = React.createRef();
  lastMarkerId = 0;

  constructor(props) {
    super(props);

    this.onData = this.onData.bind(this);
  }

  map = null;
  refmarker = React.createRef();
  markers = [];

  handleLocationFound = e => {
    if (this.state.bounds) {
      this.state.bounds.extend(e.latlng);
    }
    this.setState({
      hasLocation: true,
      lat: e.latlng.lat,
      lng: e.latlng.lng
    });

    this.showLocation([e.latlng.lat, e.latlng.lng]);
  };

  updatePosition = () => {
    const { lat, lng } = this.refmarker.current.leafletElement.getLatLng();
    this.setState({ lat, lng });
  };

  showLocation(position) {
    this.markers.push({
      key: this.lastMarkerId + 1,
      position,
      children: `lat: ${position[0]} lng: ${position[1]}`,
      dragable: true,
      onDragend: this.updatePosition
      //ref: this.refmarker
    });

    this.setState({ markers: this.markers });
  }
  onData(data) {
    let bounds;
    if (data.length > 0) {
      let pos = [data[0].lon, data[0].lat];
      bounds = Leaflet.latLngBounds(pos, pos);
    }
    let position;
    if (this.state.hasLocation) {
      position = [this.state.lng, this.state.lat];
      bounds.extend(position);
    }
    let lastId = 0;
    const markers = data.map(marker => {
      const position = [marker.lon, marker.lat];
      if (bounds) {
        bounds.extend(position);
      }

      lastId = marker.id;
      return {
        key: marker.id,
        position,
        children: marker.content,
        icon: markerIcons[marker.dangerLevel - 1]
      };

      this.setState({ bounds });
    });

    this.markers = this.markers.concat(markers);
    this.lastMarkerId = lastId;
    if (this.state.showLocation && position) {
      this.showLocation(position);
    }

    position = position || [data[0].lat, data[0].lon];
    // TODO: unswitch lat and lon
    this.setState({ markers: this.markers, lat: position[1], lng: position[0] });
  }
  componentDidMount() {
    this.mapRef.current.leafletElement.locate();
  }

  render() {
    const center = [this.state.lat, this.state.lng];

    return (
      <Map center={center} zoom={this.state.zoom} bounds={this.state.bounds} ref={this.mapRef} onLocationfound={this.handleLocationFound}>
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MyMarkersList markers={this.state.markers} />
      </Map>
    );
  }
}
