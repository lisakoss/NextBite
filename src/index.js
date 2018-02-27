import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebase from 'firebase';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

import SignIn from './SignIn';
import SignUp from './SignUp';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAS-lGtWLQDefNPadgIrUqM4weNwCFrsSo",
    authDomain: "nextbite-f8314.firebaseapp.com",
    databaseURL: "https://nextbite-f8314.firebaseio.com",
    projectId: "nextbite-f8314",
    storageBucket: "nextbite-f8314.appspot.com",
    messagingSenderId: "956642372530"
};
firebase.initializeApp(config);

// Render the application view
ReactDOM.render(
    <Router>
      <div>
          <Switch>
              <Route path="/" component={App}/>
              <Route path="/signup" component={SignUp}/>
              <Route path="/signin" component={SignIn}/>
          </Switch>
      </div>
    </Router>, 
    document.getElementById('root')
);
registerServiceWorker();
