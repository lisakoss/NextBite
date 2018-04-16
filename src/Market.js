import React from 'react';
import './index.css';
import firebase from 'firebase';

import MarketCards from './MarketCards';

class Market extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    };
  }

  componentDidMount() {
    var marketPickups = [];
    var currentMarketCards = [];

    var marketRef = firebase.database().ref(`markets/${this.props.match.params.marketName}`);
    marketRef.on('value', (snapshot) => {
      snapshot.forEach(function (child) {
        var pickupObj = child.val();
        marketPickups.push(pickupObj.listingId);
      })
      this.setState({ pickups: marketPickups });

      var pickups = marketPickups.map((pickup) => {
        var listingsRef = firebase.database().ref(`listings/${pickup}`);
        listingsRef.on('value', (snapshot) => {
          var pickupsObj = {};
          snapshot.forEach(function (child) {
            pickupsObj[child.key] = child.val();
          });

          var usersRef = firebase.database().ref(`users/${pickupsObj.userId}`);
          usersRef.on('value', (snapshot) => {
            var vendor = "";
            snapshot.forEach(function (child) {
              if(child.key == "vendorName") {
                vendor = child.val();
              }
            });

          currentMarketCards.push(<MarketCards
            boxes={pickupsObj.boxes}
            vendor={vendor}
            expiration={pickupsObj.expirationDate}
            weight={pickupsObj.weight}
            tags={pickupsObj.tags}
            pickupId={pickup}
            claimDonationCallback={() => this.claimDonation(pickup)} />);

          this.setState({ marketCards: currentMarketCards })
        });
      });
    });
  });
}

claimDonation(key) {
  this.props.history.push(`/listing/${key}`)
}



  render() {
    let content = null; //what main content to show

    /*if(!this.state.userId) { //if logged out, show signup form
        content = (<div><SignUpForm signUpCallback={this.signUp}/></div>);
    }*/

    /* Create a list of <Marker /> objects. */


    content = "hi";

    return (
      <div>
        <main role="article" className="container-content">
          {this.state.marketCards}
        </main>
      </div >
    );
  }
}

export default Market;
