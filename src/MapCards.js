import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';

/* A single listing. */
class MapCards extends React.Component {
    constructor(props){
      super(props);

        currentLocation: {}
      
    }

    componentWillMount() {
        this.setState({currentLocation: this.props})
    }


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
      //var id = "/listings/" + this.props.id;
      //console.log(this.state.currentLocation);
      console.log(this.props)
      console.log("state??")
      console.log(this.state.currentLocation)

      console.log("prps")
      console.log(this.props.location)
    return (
    <div role="article">
        <p>{this.props.location.lat}</p>
    </div>      
    );
    }
}
  
export default MapCards;
