import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import Map from './Map';
import Marker from './Marker';
import InfoWindow from './InfoWindow';
import $ from 'jquery';
import ListingItem from './ListingItem';
import MapCards from './MapCards';

import GoogleApiComponent from 'google-maps-react/dist/GoogleApiComponent';

export class Container extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            markers: [],
            listings: [],
            distances: [],
            currentLocation: {
                lat: 0,
                lng: 0
            },
            mapCards: []
        }

        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMapClick = this.onMapClick.bind(this);
        this.onInfoWindowClose = this.onInfoWindowClose.bind(this);
        this.handleLanguage = this.handleLanguage.bind(this);
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
            //fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=Washington,DC&destinations=New+York+City,NY&key=AIzaSyBLkew0nfQHAXvEc4H9rVgGCT5wYVw19uE`)
        });
    }
    
    /* When component will be removed. */
    componentWillUnmount() {
        //unregister listeners
        firebase.database().ref('listings').off();
    }

    handleLanguage = (langValue) => {
        console.log("new LOC!")

        /* Create a list of <ListingItem /> objects. */
        var mapCards = this.state.listings.map((listing) => {
            return (
                <MapCards 
                    location={langValue}
                    title = {listing.location}
                    google = {this.props.google}
                />
            );
        })

        this.setState({mapCards: mapCards})
        //this.setState({location: langValue});
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

        /* Create a list of <ListingItem /> objects. */
        var listingItems = this.state.listings.map((listing) => {
            return (
                <ListingItem 
                        location={listing.location}
                        userId={listing.userId}
                        key={listing.key}
                        id={listing.key}
                        />
            );
        })

        const style = {
            width: '65%',
            height: '100vh',
            position: 'absolute',
            display: 'inline-block'
        }
        const pos = {lat: 47.7204208, lng: -122.2885376} // where location marker goes
        console.log(this.state.currentLocation);
        return (
            <div className="container">
                <div className="map-info">
                    {this.state.mapCards}
                </div>
                <div style={style}>
                    <Map google={this.props.google}
                            onClick={this.onMapClick}
                            onLocationChange={this.handleLanguage}>
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
