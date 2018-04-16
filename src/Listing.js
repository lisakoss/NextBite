import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import Snackbar from 'material-ui/Snackbar';
import CircularProgress from 'material-ui/CircularProgress';

import ListingsForm from './ListingsForm';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const styles = {
  snack: {
    textAlign: 'center',
  },
  progress: {
    marginTop: '10px'
  }
}

class Listing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      isSnackBarActive: false,
      spinnerDisplay: false
    };

    this.submit = this.submit.bind(this);
    this.loadApp = this.loadApp.bind(this);
    this.handleTimeoutSnackbar = this.handleTimeoutSnackbar.bind(this);
  }

  // redirect
  loadApp() {
    this.props.history.push('/home');
  }

  //Lifecycle callback executed when the component appears on the screen.
  componentDidMount() {
    // Add a listener and callback for authentication events
    this.unregister = firebase.auth().onAuthStateChanged(user => {
      /*if(user) { //redirect to board once user is signed up
          this.setState({userId:user.uid});
          this.loadApp();
      }
      else{
          this.setState({userId: null}); //null out the saved state
      }*/
    });
  }

  //when the component is unmounted, unregister using the saved function
  componentWillUnmount() {
    if (this.unregister) { //if have a function to unregister with
      this.unregister(); //call that function!
    }
  }

  submit(location, boxes, expirationDate, weight, tags, claimed) {
    let thisComponent = this;
    thisComponent.setState({ spinnerDisplay: true }); //show loading spinner while user is being signed up
    thisComponent.setState({ isSnackbarActive: true }); //show snackbar, where spinner is located, while user is being signed up

    let listingsRef = firebase.database().ref('listings');
    let newListing = {
      location: location,
      boxes: boxes,
      expirationDate: String(expirationDate),
      weight: weight,
      tags: tags,
      time: firebase.database.ServerValue.TIMESTAMP,
      userId: firebase.auth().currentUser.uid,
      claimed: claimed
    }

    let listing = listingsRef.push(newListing); // upload msg to database
    let listingId = listing.key;

    /* Add listing to user's id */
    let currUser = firebase.auth().currentUser.uid;
    let usersRef = firebase.database().ref('users/' + currUser + '/listings');
    let newUserListing = {
      listingId: listingId,
    }
    usersRef.push(newUserListing);

    /* Add listing to appropriate farmer's market */
    let marketsRef = firebase.database().ref(`markets/${location.split(",")[0]}`);
    let newMarketListing = {
      listingId: listingId,
    }
    marketsRef.push(newMarketListing);
  }

  //when an error snackbar appears, it will eventually time out and disppear
  handleTimeoutSnackbar() {
    this.setState({ isSnackbarActive: false });
  }

  render() {
    let content = <div><ListingsForm submitCallback={this.submit} /></div>; //what main content to show
    let snackbarContent = null; //what snackbar content to show

    if (this.state.userId) { //if logged in
      content = (<div><ListingsForm submitCallback={this.submit} /></div>);
    }

    if (this.state.spinnerDisplay) { //show spinner when loading
      snackbarContent = <CircularProgress style={styles.progress} />;
    } else if (this.state.error !== undefined) { //otherwise show error message
      snackbarContent = this.state.error;
    }

    return (
      <div>
        <main role="article">
          {content}
        </main>
        <div role="region">

        </div>
      </div>
    );
  }
}

export default Listing;
