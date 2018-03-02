import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';

/* A single listing. */
class MapCards extends React.Component {
    constructor(props){
      super(props);
    }

    componentWillMount() {
        this.setState({currentLocation: this.props.location})
    }

    componentDidMount() {
            var google = this.props.google;
            var origin1 = new google.maps.LatLng(this.props.location.lat, this.props.location.lng)
            var destinationA = 'Washington, DC, USA';

              var service = new google.maps.DistanceMatrixService();
              service.getDistanceMatrix(
                {
                  origins: [origin1],
                  destinations: [destinationA],
                  travelMode: 'DRIVING',
                }, callback);
              
                function callback(response, status) {
                   console.log(response.rows[0].elements[0].distance.value * 0.621371);
                   console.log(response.rows[0].elements[0].duration.text);
                  }

        
      }

    /*componentDidMount() {
        let addr = ''
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.props.location.lat},${this.props.location.lng}&key=AIzaSyBLkew0nfQHAXvEc4H9rVgGCT5wYVw19uE`)
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            console.log("fetchhh")
            console.log(String(myJson.results[0].formatted_address));
            addr = String(myJson.results[0].formatted_address)
            this.setState({formattedAddress: addr})
            //this.setState({formattedAddress: String(myJson.results[0].formatted_address)})
        });
    }*/


    /*shouldComponentUpdate() {
        console.log(this.state.currentLocation.lat)
        if(this.state.currentLocation.lat == 0 &&  this.state.currentLocation.lat == 0) {
            console.log("true!")
            return true;
        }
        console.log("false")
        return false;
    }*/
      
    render() {
      console.log("state")
      console.log(this.state.currentLocation)
      console.log("form add")
      console.log(this.state.formattedAddress)

      //https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=Washington,DC&destinations=New+York+City,NY&key=AIzaSyBLkew0nfQHAXvEc4H9rVgGCT5wYVw19uE
    return (
    <div role="article">
        <p>{this.state.currentLocation.lat}</p>
        <p>{this.state.formattedAddress}</p>
    </div>      
    );
    }
}
  
export default MapCards;
