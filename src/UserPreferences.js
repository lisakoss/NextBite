import React from 'react';
import './index.css';
import firebase from 'firebase';

import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';

class Preferences extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cancelAlert: false,
      confirmAlert: false,
      firstNameError: false,
      hidden: 'hidden',
      disable: false
    };
    this.confirmProfile = this.confirmProfile.bind(this);
    this.discardProfile = this.discardProfile.bind(this);
  }

  //Lifecycle callback executed when the component appears on the screen.
  //Sets the initial state of the logged in user so they can edit their profile information
  componentDidMount() {
    // Add a listener and callback for authentication events
    this.unregister = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ userId: user.uid });
        this.setState({ firstName: firebase.auth().currentUser.firstName });
        var profileRef = firebase.database().ref('users/' + this.state.userId);
        profileRef.once("value")
          .then(snapshot => {
            this.setState({ lastName: firebase.auth().currentUser.lastName });
            this.setState({ vendorName: firebase.auth().currentUser.vendorName });
            this.setState({ avatar: snapshot.child("avatar").val() });
            this.setState({ email: snapshot.child("email").val() });
            this.setState({ personType: snapshot.child("personType").val() });
          });
      } else {
        const path = '/signin'; //redirect to signin page if user is not logged in
        this.props.history.push(path);
        this.setState({ userId: null }); //null out the saved state
        this.setState({ firstName: null }); //null out the saved state
        this.setState({ lastName: null }); //null out the saved state
        this.setState({ vendorName: null }); //null out the saved state
        this.setState({ avatar: null }); //null out the saved state
        this.setState({ email: null }); //null out the saved state
        this.setState({ personType: null }); //null out the saved state
      }
    });
  }

  //when component will be removed
  componentWillUnmount() {
    //unregister listeners
    firebase.database().ref('users/' + this.state.userId).off();
    if (this.unregister) { //if have a function to unregister with
      this.unregister(); //call that function!
    }
  }

  //when you click update profile, a dialog box is opened
  updateProfile(event) {
    event.preventDefault();
    this.setState({
      openDialog: true,
    });
  }

  //you can discard profile changes by clicking cancel
  discardProfile() {
    this.setState({
      openDialog: false,
      cancelAlert: true,
      confirmAlert: false,
      hidden: 'manage-alert red-discard'
    });
  }

  // you can confirm profile changes by clicking confirm, which will reset the state and redirect you back to your profile
  confirmProfile() {
    this.setState({
      openDialog: false,
      cancelAlert: false,
      confirmAlert: true,
      hidden: 'manage-alert green-confirm'
    });

    var user = firebase.auth().currentUser; //grabs the logged in user's' info

    var userRef = firebase.database().ref('users/' + user.uid); //finds the logged in user in the database
    userRef.child('firstName').set(this.state.firstName); //sets their first name
    userRef.child('lastName').set(this.state.lastName); //sets their last name
    userRef.child('vendorName').set(this.state.vendorName); //sets their vendor name 
    userRef.child('avatar').set(this.state.avatar); //sets their avatar
    userRef.child('email').set(this.state.email); //sets their email


    user.updateProfile({
      firstName: this.state.firstName, //sets display name
    });

    //removes the editing controls when you click submit so you can read the confirmation alert
    var profile = document.getElementById("profile-edit");
    profile.style.display = "none";

    //redirects after 2 seconds back to manage account so you have time to read the confirmation alert
    setTimeout(function () {
      const path = '/manage';
      this.props.history.push(path);
      window.location.reload();
    }, 2000);
  }

  //when the text in the display name field changes, updates state
  updateFirstName(event) {
    if (event.target.value.length === 0) {
      this.setState({
        disable: true,
        firstNAmeError: true,
        hidden: 'manage-alert red-discard'
      });
    } else {
      this.setState({
        disable: false,
        firstNameError: false,
        hidden: 'hidden'
      });
    }
    this.setState({ firstName: event.target.value });
  }

  render() {
    var disableEnabled = this.state.disable;
    var alert = null;

    if (this.state.cancelAlert === true) {
      alert = (<div><p>You did not submit your changes.</p></div>);
    } else if (this.state.confirmAlert === true) {
      alert = (<div><p>You have submitted your changes. Redirecting...</p>
        <CircularProgress />
      </div>);
    } else if (this.state.firstNameError === true) {
      alert = (<div><p>First name must be at least one character long.</p></div>);
    }

    return (
      <div className="content-container" role="article">
        <h1>manage account</h1>
        <div role="region" id="alert" className={this.state.hidden}>
          {alert}
        </div>
        <form role="region" id="profile-edit" className="profile-content">

          <TextField
            onChange={(e) => this.updateFirstName(e)}
            value={this.state.firstNAme || ''}
            floatingLabelText="First Name"
          />

          <div className="profile-submit">
            <Button disabled={disableEnabled} raised accent ripple onClick={(e) => this.updateProfile(e)}>Update Settings</Button>
          </div>
          <Dialog role="region" open={this.state.openDialog}>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogContent>
              <p>Click <strong>confirm</strong> to submit all changes to your profile. If you want to cancel any changes you've made, click <strong>cancel</strong>.</p>
            </DialogContent>
            <DialogActions>
              <Button type='button' onClick={() => this.confirmProfile()}>Confirm</Button>
              <Button type='button' onClick={() => this.discardProfile()}>Cancel</Button>
            </DialogActions>
          </Dialog>
        </form>
      </div>
    );
  }
}

export default Preferences;
