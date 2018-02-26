import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import Snackbar from 'material-ui/Snackbar';
import CircularProgress from 'material-ui/CircularProgress';

import SignUpForm from './SignUpForm';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const styles = {
    snack: {
        textAlign: 'center',
    },
    progress: {
        marginTop: '10px'
    }
}

class SignUp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {error: null, isSnackBarActive: false, spinnerDisplay: false};

        this.signUp = this.signUp.bind(this);
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
            if(user) { //redirect to board once user is signed up
                this.setState({userId:user.uid});
                this.loadApp();
            }
            else{
                this.setState({userId: null}); //null out the saved state
            }
        });
    }

    //when the component is unmounted, unregister using the saved function
    componentWillUnmount() {
        if(this.unregister){ //if have a function to unregister with
        this.unregister(); //call that function!
        }
    }

    signUp(email, password, firstName, lastName, mobile, personType, avatar) {
        let thisComponent = this;
        thisComponent.setState({spinnerDisplay: true}); //show loading spinner while user is being signed up
        thisComponent.setState({isSnackbarActive: true}); //show snackbar, where spinner is located, while user is being signed up
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((firebaseUser) => {
            thisComponent.setState({spinnerDisplay: 'hidden'}) //do not show spinner once this is completed
            firebaseUser.updateProfile({
                email: email,
                firstName: firstName,
                lastName: lastName,
                mobile: mobile,
                personType: personType,
                photoURL: avatar
            });

            //create new entry in the Cloud DB (for others to reference)
            let userRef = firebase.database().ref('users/'+firebaseUser.uid);
            let userData = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                mobile: mobile,
                personType: personType,
                avatar: avatar
            }

            userRef.set(userData); //update entry in JOITC, return promise for chaining
        })
        .catch((error) => { //report any errors
            let errorCode = error.code;
            let errorMessage = error.message;
            if (errorCode === 'auth/email-already-in-use') {
                thisComponent.setState({error: 'The email address is already in use.'});
                thisComponent.setState({ isSnackbarActive: true });
                thisComponent.setState({spinnerDisplay: false})
            } else if (errorCode === 'auth/invalid-email') {
                thisComponent.setState({error: 'The email address is invalid'});
                thisComponent.setState({ isSnackbarActive: true });
                thisComponent.setState({spinnerDisplay: false})
            } else if (errorCode === 'auth/operation-not-allowed') {
                thisComponent.setState({error: 'Unable to create an account at this time, try again later.'});
                thisComponent.setState({ isSnackbarActive: true });
                thisComponent.setState({spinnerDisplay: false})
            } else if(errorCode === 'auth/weak-password') {
                thisComponent.setState({error: 'Password is not long enough'});
                thisComponent.setState({ isSnackbarActive: true });
                thisComponent.setState({spinnerDisplay: false})
            } else {
                thisComponent.setState({error: errorMessage});
                thisComponent.setState({ isSnackbarActive: true });
                thisComponent.setState({spinnerDisplay: false})
            }
        });
    }

    //when an error snackbar appears, it will eventually time out and disppear
    handleTimeoutSnackbar() {
        this.setState({ isSnackbarActive: false });
    }

    render() {
        let content = null; //what main content to show
        let snackbarContent = null; //what snackbar content to show

        if(!this.state.userId) { //if logged out, show signup form
            content = (<div><SignUpForm signUpCallback={this.signUp} /></div>);
        }

        if(this.state.spinnerDisplay) { //show spinner when loading
            snackbarContent = <CircularProgress style={styles.progress}/>;
          } else if(this.state.error !== undefined) { //otherwise show error message
            snackbarContent = this.state.error;
        }

        return(
            <MuiThemeProvider>
            <div>
                <main role="article">
                    {content}
                </main>
                <div role="region">
                    <Snackbar
                        open={this.state.isSnackbarActive}
                        message={snackbarContent}
                        autoHideDuration={10000}
                        style={styles.snack}
                        onRequestClose={this.handleTimeoutSnackbar}/>
                </div>
            </div>
            </MuiThemeProvider>
        );
    }
}

export default SignUp;
