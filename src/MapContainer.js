import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import Map from './Map';
import Marker from './Marker';
import InfoWindow from './InfoWindow';

import GoogleApiComponent from 'google-maps-react/dist/GoogleApiComponent';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export class Container extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {}
        }

        this.onMarkerClick = this.onMarkerClick.bind(this);
    }

    getInitialState() {
        return {
          showingInfoWindow: false,
          activeMarker: {},
          selectedPlace: {}
        }
    }

    onMarkerClick(props, marker, e) { 
       this.setState({
          selectedPlace: props,
          activeMarker: marker,
          showingInfoWindow: true
        });
    }

    render() {
        const style = {
            width: '65%',
            height: '100vh',
            position: 'absolute',
            display: 'inline-block'
        }
        const pos = {lat: 47.7204208, lng: -122.2885376} // where location marker goes

        return (
            <MuiThemeProvider>
                <div className="container">
                    <div className="map-info">hi</div>
                    <div style={style}>
                        <Map google={this.props.google}>
                            <Marker onClick={this.onMarkerClick}
                                    name={'Current Location'}/>
                            <Marker onClick={this.onMarkerClick}
                                    name={'Dolores park'}
                                    position={pos}/>
                            <InfoWindow
                                marker={this.state.activeMarker}
                                visible={this.state.showingInfoWindow}>
                                <div>
                                    <h1>{this.state.selectedPlace.name}</h1>
                                </div>
                            </InfoWindow>
                        </Map>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default GoogleApiComponent({
  apiKey: 'AIzaSyBLkew0nfQHAXvEc4H9rVgGCT5wYVw19uE'
})(Container)
