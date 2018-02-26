import React from 'react';
import firebase from 'firebase';
import './index.css';
import { Redirect } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

//A component that will sign the user out of the website
class Logout extends React.Component {
	constructor(props){
		super(props);
		this.state = {};
	}

	//Lifecycle callback executed when the component appears on the screen.
	componentDidMount() {
		// Add a listener and callback for authentication events 
		this.unregister = firebase.auth().onAuthStateChanged(user => {
			if(user) {
				this.setState({userId:user.uid}); //grabs user id
			} else { //redirects to home page once logged out
				this.setState({userId: null}); //null out the saved state
                this.props.history.push('/home');

			}
		});
  }

	//when component will be removed
  componentWillUnmount() {
    if(this.unregister){ //if have a function to unregister with
      this.unregister(); //call that function!
    }
  }
  
  //A callback function for logging out the current user
  signOut(){
    // Sign out the user
    firebase.auth().signOut();
  }

  render() {
  	return(
        <MuiThemeProvider>
            <div>
				{this.state.userId &&  /*inline conditional rendering*/
            <div className="container-drawer">
                <RaisedButton id="submit-button" label="sign out" primary={true} onClick={(event) => this.signOut()} />
            </div>
        }
			    </div>
        </MuiThemeProvider>
    );
  }
}

export default Logout;