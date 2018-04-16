import React from 'react';
import './index.css';
import firebase from 'firebase';
import Pickup from './Pickup';

import GoogleApiComponent from 'google-maps-react/dist/GoogleApiComponent';

class PickupContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentLocation: {
        lat: 0,
        lng: 0
      }
    };
  }


  render() {
    let content = null; //what main content to show
    content = "hi";

    return (
      <div>
        <main role="article" className="container-content">
            <Pickup 
            google={this.props.google}
            listingId={this.props.match.params.listingId} />
        </main>
      </div >
    );
  }
}

export default GoogleApiComponent({
  apiKey: 'AIzaSyBLkew0nfQHAXvEc4H9rVgGCT5wYVw19uE'
})(PickupContainer)
