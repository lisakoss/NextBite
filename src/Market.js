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

  //Lifecycle callback executed when the component appears on the screen.
  componentDidMount() {
    // Add a listener and callback for authentication events
    /*this.unregister = firebase.auth().onAuthStateChanged(user => {
        if(user) { 
            this.setState({userId:user.uid});
            //this.props.history.push('/');
        }
        else{
            this.setState({userId: null}); //null out the saved state
        }
    });*/
    //var marketsRef = firebase.database().ref('markets');
    //var marketListingsRef = firebase.database().ref(`markets/${market.key}/${marketKeys[i]}`);
  }

  //when the component is unmounted, unregister using the saved function
  componentWillUnmount() {
    /*if(this.unregister){ //if have a function to unregister with
        this.unregister(); //call that function!
        firebase.database().ref('users/'+this.state.userId);
    }*/

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
  //this.props.history.push(`/market/hello`);
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
