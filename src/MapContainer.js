import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import Map from './Map';
import Marker from './Marker';
import InfoWindow from './InfoWindow';
import $ from 'jquery';
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
      markets: [],
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
    this.handleLocation = this.handleLocation.bind(this);
    this.pickup = this.pickup.bind(this);
  }

  //Lifecycle callback executed when the component appears on the screen.
  componentDidMount() {
    /* Add a listener for changes to the listings object, and save in the state. */
    var listingsRef = firebase.database().ref('listings');
    listingsRef.on('value', (snapshot) => {
      var listingArray = [];
      snapshot.forEach(function (child) {
        var listing = child.val();
        listing.key = child.key;
        listingArray.push(listing);
      });
      //listingArray.sort((a,b) => b.time - a.time); //reverse order
      this.setState({ listings: listingArray });
    });
  }

  pickup(key, pickups) {
    this.props.history.push(`/market/${key}`)
  }

  handleLocation = (locationVal) => {
    var marketsRef = firebase.database().ref('markets');
    marketsRef.on('value', (snapshot) => {
      var marketsArray = [];
      snapshot.forEach(function (child) {
        var marketListing = child.val();
        marketListing.key = child.key;
        marketsArray.push(marketListing);
      });

      marketsArray.map((market) => {
        let marketKeys = Object.keys(market);

        // take all keys except "key", which is just the unique id of the db obj
        for (let i = 0; i < marketKeys.length - 1; i++) {
          let currentMarkets = this.state.markets;
          if (!currentMarkets.includes(market.key)) {
            currentMarkets.push(market.key);
          }

          var marketListingsRef = firebase.database().ref(`markets/${market.key}/${marketKeys[i]}`);
          marketListingsRef.on('value', (snapshot) => {
            var marketListingsArray = [];
            snapshot.forEach(function (child) {
              var marketListing = child.val();
              marketListingsArray.push(marketListing);
            });

            if ((i + 2) == marketKeys.length) {
              let currentMapCards = this.state.mapCards;
              this.setState({currentMarket: market.key})
              currentMapCards.push(
                <MapCards
                  location={locationVal}
                  title={market.key}
                  count={marketKeys.length - 1}
                  google={this.props.google}
                  pickupCallback={() => this.pickup(market.key, marketListingsArray)} 
                />
              )
              this.setState({ mapCards: currentMapCards })
            }
          })
        }
      })
    });
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
      let pos = { lat: parseFloat(name[1]), lng: parseFloat(name[2]) }
      return (
        <Marker onClick={this.onMarkerClick}
          name={name[0]}
          position={pos} />
      );
    })

    const style = {
      width: '65%',
      height: '100vh',
      position: 'absolute',
      display: 'inline-block'
    }
    const pos = { lat: 47.7204208, lng: -122.2885376 } // where location marker goes

    return (
      <div className="container">
        <div className="map-info">
          {this.state.mapCards}
        </div>

        <div style={style}>
          <Map google={this.props.google}
            onClick={this.onMapClick}
            onLocationChange={this.handleLocation}>
            <Marker onClick={this.onMarkerClick}
              name={'Current Location'} />
            <Marker onClick={this.onMarkerClick}
              name={'Dolores park'}
              position={pos} />
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
