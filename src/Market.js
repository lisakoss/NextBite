import React from 'react';
import './index.css';
import firebase from 'firebase';

import MapCards from './MapCards';

class Market extends React.Component {
    constructor(props) {
        super(props)
        this.state = {};

    }

    //Lifecycle callback executed when the component appears on the screen.
    componentDidMount() {
        // Add a listener and callback for authentication events
        this.unregister = firebase.auth().onAuthStateChanged(user => {
            if(user) { 
                this.setState({userId:user.uid});
                //this.props.history.push('/');
            }
            else{
                this.setState({userId: null}); //null out the saved state
            }
        });
    }

    //when the component is unmounted, unregister using the saved function
    componentWillUnmount() {
        /*if(this.unregister){ //if have a function to unregister with
            this.unregister(); //call that function!
            firebase.database().ref('users/'+this.state.userId);
        }*/
    }

    

    render() {
        let content = null; //what main content to show
        let snackbarContent = null; //what snackbar content to show

        /*if(!this.state.userId) { //if logged out, show signup form
            content = (<div><SignUpForm signUpCallback={this.signUp}/></div>);
        }*/

        content = "hi";

        return(
            <div>
                <main role="article" className="container-content">
                    {content}
                </main>
            </div>
        );
    }
}

export default Market;
