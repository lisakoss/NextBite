import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';

import SignUpForm from './SignUpForm';

class SignUp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {error: null};

        this.signUp = this.signUp.bind(this);
        this.loadApp = this.loadApp.bind(this);
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

    signUp(email, password, firstName, lastName, avatar) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((firebaseUser) => {
            firebaseUser.updateProfile({
                email: email,
                firstName: firstName,
                lastName: lastName,
                photoURL: avatar
            });

            //create new entry in the Cloud DB (for others to reference)
            var userRef = firebase.database().ref('users/'+firebaseUser.uid);
            var userData = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                avatar: avatar
            }

            userRef.set(userData); //update entry in JOITC, return promise for chaining
        })
        .catch((error) => { //report any errors
            console.log(error.message);
        });
    }

    render() {
        var content = null; //what main content to show

        if(!this.state.userId) { //if logged out, show signup form
            content = (<div><SignUpForm signUpCallback={this.signUp} /></div>);
        }

        return(
            <div>
                <main role="article" className="content-container">
                    {content}
                </main>
            </div>
        );
    }
}

export default SignUp;
