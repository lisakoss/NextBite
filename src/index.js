import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebase from 'firebase';
import { BrowserRouter, Route, Link} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import SignUp from './SignUp';
import SignIn from './SignIn';

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
    <BrowserRouter>
        <Route exact path='/home' component={App} />
        <Route exact path='/signup' component={SignUp} />
        <Route exact path='/signin' component={SignIn} />
    </BrowserRouter>, 
    
    document.getElementById('root')
);
registerServiceWorker();
