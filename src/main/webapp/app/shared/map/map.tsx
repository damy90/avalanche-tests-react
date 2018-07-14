import React from 'react';

import { Map, TileLayer, Marker, Popup, Icon } from 'react-leaflet';
import Leaflet from 'leaflet';

const MyPopupMarker = ({ children, ...props }) => (
  <Marker {...props}>
    <Popup>{children}</Popup>
  </Marker>
);

// const MyLocation = ({marker, refmarker}) => (
//     <Marker {...marker} ref={refmarker}>
//       <Popup>{marker.children}</Popup>
//     </Marker>
//   );

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
    showLocation: true,
    locationMarker: {}
  };

  mapRef = React.createRef();
  lastMarkerId = 0;
  locationMarker = {};

  constructor(props) {
    super(props);

    this.onData = this.onData.bind(this);
  }

  map = null;
  refmarker = React.createRef();

  MyLocation = ({ marker, refmarker, showLocation, hasLocation }) => {
    if (showLocation && hasLocation && marker.position) {
      return (
        <Marker {...marker} ref={refmarker}>
          <Popup>{marker.children}</Popup>
        </Marker>
      );
    }

    return null;
  };
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
    if (this.props.handleUpdatePosition) {
      this.props.handleUpdatePosition(e.latlng.lat, e.latlng.lng);
    }
  };

  updatePosition = () => {
    const { lat, lng } = this.refmarker.current.leafletElement.getLatLng();
    this.setState({ lat, lng });
    if (this.props.handleUpdatePosition) {
      this.props.handleUpdatePosition(lat, lng);
    }
  };

  showLocation(position) {
    this.locationMarker = {
      key: this.lastMarkerId + 1,
      position,
      children: `lat: ${position[0]} lng: ${position[1]}`,
      draggable: true,
      onDragend: this.updatePosition
      //ref: this.refmarker
    };
    this.setState({ locationMarker: this.locationMarker });
  }
  onData(data) {
    let bounds;
    if (data.length > 0) {
      let pos = [data[0].lon, data[0].lat];
      bounds = Leaflet.latLngBounds(pos, pos);
    }
    let position;
    if (this.state.hasLocation) {
      position = [this.state.lat, this.state.lng];
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

    this.lastMarkerId = lastId;
    if (this.state.showLocation && position) {
      this.showLocation(position);
    }

    position = position || [data[0].lat, data[0].lon];
    // TODO: unswitch lat and lon
    this.setState({ markers, lat: position[1], lng: position[0] });
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

        <this.MyLocation
          marker={this.locationMarker}
          refmarker={this.refmarker}
          showLocation={this.state.showLocation}
          hasLocation={this.state.hasLocation}
        />
      </Map>
    );
  }
}
