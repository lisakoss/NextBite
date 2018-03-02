import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

/* A single listing. */
class MapCards extends React.Component {
    constructor(props){
      super(props);

      this.callback = this.callback.bind(this);
    }

    componentWillMount() {
        this.setState({currentLocation: this.props.location})
        this.setState({title: this.props.title.split(',')[0]})
    }

    componentDidMount() {
            var distance = 0;
            var time = '';
            var google = this.props.google;
            var origin1 = new google.maps.LatLng(this.props.location.lat, this.props.location.lng)
            //console.log(this.props.title.split(",")[0]);
            console.log(this.props.title)
            console.log(this.state.title)
            //var destinationA = String(this.props.title.split(',')[0])
            var destinationA = String(this.props.title.split(",")[0]);
            console.log(destinationA)

              var service = new google.maps.DistanceMatrixService();
              service.getDistanceMatrix(
                {
                  origins: [origin1],
                  destinations: [destinationA],
                  travelMode: 'DRIVING',
                }, this.callback);
      }

                    
      callback(response, status) {
       this.setState({distance: response.rows[0].elements[0].distance.text});
       this.setState({time: response.rows[0].elements[0].duration.text});
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

        return (
            <div className="card-column" role="article">
            <div className="item" role="region">
                <Card>
                    <CardTitle title={this.state.title} subtitle={this.state.distance} />
                    <CardText>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                    Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                    Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                    </CardText>
                    <CardActions>
                    <FlatButton label="Action1" />
                    <FlatButton label="Action2" />
                    </CardActions>
                </Card>
                </div>
            </div> 
        );
    }
}
  
export default MapCards;
