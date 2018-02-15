import React from 'react';
import firebase from 'firebase';

import SignInForm from './SignInForm';

//A form that allows the user to log in to the website
class SignIn extends React.Component {
    constructor(props){
        super(props);
        this.state = {error: null};

        this.signIn = this.signIn.bind(this);
    }

    //Lifecycle callback executed when the component appears on the screen.
    componentDidMount() {
        // Add a listener and callback for authentication events 
        this.unregister = firebase.auth().onAuthStateChanged(user => {
            if(user) { //if logged in, redirects to message board
                this.setState({userId:user.uid});
                this.loadApp();
            } else{
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

    //A callback function for logging in existing users
    signIn(email, password) {
        // Sign in the user 
        firebase.auth().signInWithEmailAndPassword(email, password) //logs in user with email and password
        .catch(function(error) { //displays an error if there is a mistake with logging a user in
            var errorMessage = error.message;
            this.setState({error: errorMessage}); //put error message in state
        });
    }

    render() {
        var content = null; //what main content to show

        if(!this.state.userId) { //if logged out, show signup form
            content = (<div><SignInForm signInCallback={this.signIn} /></div>);
        }

        return (
            <div>      
                <main role="article" className="content-container">   
                    {content}
                </main>
            </div>      
        );
    }
}

export default SignIn;