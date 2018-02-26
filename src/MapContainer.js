import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import Map from './Map';

import GoogleApiComponent from 'google-maps-react/dist/GoogleApiComponent';

export class Container extends React.Component {
  render() {
    const style = {
        width: '100%',
        height: '100%',
        position: 'absolute'
    }
    
    return (
        <div style={style}>
            <Map google={this.props.google}/>
        </div>
    );
  }
}

export default GoogleApiComponent({
  apiKey: 'AIzaSyBLkew0nfQHAXvEc4H9rVgGCT5wYVw19uE'
})(Container)
