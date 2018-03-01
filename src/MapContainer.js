import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import Map from './Map';
import Marker from './Marker';
import InfoWindow from './InfoWindow';
import $ from 'jquery';

import GoogleApiComponent from 'google-maps-react/dist/GoogleApiComponent';

export class Container extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            listings: []
        }

        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMapClick = this.onMapClick.bind(this);
        this.onInfoWindowClose = this.onInfoWindowClose.bind(this);
    }
        
    //Lifecycle callback executed when the component appears on the screen.
    componentDidMount() {
        /* Add a listener for changes to the listings object, and save in the state. */
        var listingsRef = firebase.database().ref('listings');
        listingsRef.on('value', (snapshot) => {
            var listingArray = []; 
            snapshot.forEach(function(child){
            var listing = child.val();
                    listing.key = child.key; 
                    listingArray.push(listing); 
            });
            //listingArray.sort((a,b) => b.time - a.time); //reverse order
            this.setState({listings: listingArray});
        });
    }

    /* When component will be removed. */
    componentWillUnmount() {
        //unregister listeners
        firebase.database().ref('listings').off();
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

    onMapClick() {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    }

    onInfoWindowClose() {
        this.setState({
          showingInfoWindow: false,
          activeMarker: null
        })
    }



    getData(location) {
        return $.getJSON(`https://maps.googleapis.com/maps/api/geocode/json?address=${location},+Seattle,+WA&key=AIzaSyBLkew0nfQHAXvEc4H9rVgGCT5wYVw19uE`).then(function(data) {
            //data is the JSON string
            console.log(data.results[0].geometry.location);
            return data.results[0].geometry.location;
        });
    }

    render() {

        /*// don't show if don't have user data yet
        if(!this.state.users){
            return null;
        }*/


        /* Create a list of <Marker /> objects. */
        var markers = this.state.listings.map((listing) => {
            let name = listing.location.split(",")
            let pos = {lat: parseFloat(name[1]), lng: parseFloat(name[2])}
            return (
                <Marker onClick={this.onMarkerClick}
                name={name[0]}
                position={pos}/>
            );
        })

        const style = {
            width: '65%',
            height: '100vh',
            position: 'absolute',
            display: 'inline-block'
        }
        const pos = {lat: 47.7204208, lng: -122.2885376} // where location marker goes
        //console.log(markers)
        return (
            <div className="container">
                <div className="map-info">
                    <p>hi</p>
                </div>
                <div style={style}>
                    <Map google={this.props.google}
                            onClick={this.onMapClick}>
                        <Marker onClick={this.onMarkerClick}
                                name={'Current Location'}/>
                        <Marker onClick={this.onMarkerClick}
                                name={'Dolores park'}
                                position={pos}/>
                        {markers}
                        <InfoWindow
                            marker={this.state.activeMarker}
                            visible={this.state.showingInfoWindow}
                            onClose={this.onInfoWindowClose}>
                            <div>
                                <h1>{this.state.selectedPlace.name}</h1>
                            </div>
                        </InfoWindow>
                    </Map>
                </div>
            </div>
        );
    }
}

export default GoogleApiComponent({
  apiKey: 'AIzaSyBLkew0nfQHAXvEc4H9rVgGCT5wYVw19uE'
})(Container)
