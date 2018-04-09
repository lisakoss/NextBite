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
    console.log(this.props.match.params.marketName);
    var marketPickups = [];
    var currentMarketCards = [];
    let thisComponent = this;

    var marketRef = firebase.database().ref(`markets/${this.props.match.params.marketName}`);

    marketRef.on('value', (snapshot) => {
      snapshot.forEach(function (child) {
        //console.log(child.key)
        //console.log(child.val())
        var pickupObj = child.val();
        console.log(pickupObj.listingId);
        marketPickups.push(pickupObj.listingId);
      })
      this.setState({ pickups: marketPickups });

      console.log(marketPickups)
      console.log(this.state.pickups);
  
      var pickups = marketPickups.map((pickup) => {
        console.log(pickup);
        var listingsRef = firebase.database().ref(`listings/${pickup}`);
        listingsRef.on('value', (snapshot) => {
          var pickupsObj = {};
          snapshot.forEach(function (child) {
            console.log(child.key)
            console.log(child.val())
            pickupsObj[child.key] = child.val();
          });
  
          console.log(pickupsObj)
          currentMarketCards.push(<MarketCards 
            boxes={pickupsObj.boxes}
            userName={pickupsObj.userId}/>);
  
            console.log(currentMarketCards)
            this.setState({marketCards: currentMarketCards})
            console.log(currentMarketCards)
        })
      })
    })


      /*let currentMarketCards = [];
      var pickups = this.props.location.state.pickups.map((listing) => {
        var listingsRef = firebase.database().ref(`listings/${listing}`);
        listingsRef.on('value', (snapshot) => {
          console.log(snapshot);
          var pickupsObj = {};
          snapshot.forEach(function (child) {
            console.log(child.key)
            console.log(child.val())
            pickupsObj[child.key] = child.val();
          });
  
  
        
          currentMarketCards.push(<MarketCards 
          boxes={pickupsObj.boxes}
          userName={pickupsObj.userId}/>);
        
      })
    })
  
    this.setState({marketCards: currentMarketCards})*/
    }



  render() {
        let content = null; //what main content to show

        /*if(!this.state.userId) { //if logged out, show signup form
            content = (<div><SignUpForm signUpCallback={this.signUp}/></div>);
        }*/

        /* Create a list of <Marker /> objects. */

        console.log(this.state.pickups)
        console.log(this.state.marketCards)


        content = "hi";

        return(
      <div>
      <main role="article" className="container-content">
          {this.state.marketCards}
      </main>
      </div >
    );
  }
}

export default Market;
