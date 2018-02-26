import React from 'react';
import './index.css';
import firebase from 'firebase';
import { Route, Switch, Link } from 'react-router-dom';

import Home from './Home';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Logout from './Logout';
import Map from './Map';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {isDrawerOpen: false};
  }

  handleToggle = () => this.setState({isDrawerOpen: !this.state.isDrawerOpen});

  handleClose = () => this.setState({isDrawerOpen: false});

  //Lifecycle callback executed when the component appears on the screen.
  //It is cleaner to use this than the constructor for fetching data
  componentDidMount() {
    /* Add a listener and callback for authentication events */
    this.unregister = firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.setState({userId: user.uid});
        var profileRef = firebase.database().ref('users/' + this.state.userId);
        profileRef.once("value")
          .then(snapshot => {
            this.setState({firstName: snapshot.child("firstName").val()});
            this.setState({lastName: snapshot.child("lastName").val()});
            this.setState({avatar: snapshot.child("avatar").val()});
          });
      }
      else{
        this.setState({userId: null}); //null out the saved state
        this.setState({firstName: null}); //null out the saved state
        this.setState({lastName: null}); //null out the saved state
        this.setState({avatar: null}); //null out the saved state
      }
    })
  }

  //when the component is unmounted, unregister using the saved function
  componentWillUnmount() {
    if(this.unregister){ //if have a function to unregister with
      this.unregister(); //call that function!
    }
  }

  render() {
    var profileImg = null;
		var drawerContent = null;
		var drawerTitle = null;
		if(this.state.userId !== null) {

      if(this.state.avatar !== '') {
        profileImg = <Avatar className="avatar" src={this.state.avatar} />
      } else {
        profileImg = <Avatar>{this.state.firstName.charAt(0).toUpperCase()}</Avatar>
      } 

			drawerContent = (
        <div>
          <div className="nav-container">
            <p className="profile-drawer">
              {profileImg}
            </p>
            <p className="links">Quick Links</p>
          </div>
          <div>
            <a href="/profileedit">Edit profile</a>
            <a href="/createpost">Create a listing</a>
            <a href="/recentlistings">Recent listings</a>
            <div className="nav-container">
              <Logout/>
            </div>
          </div>
        </div>
      );
			drawerTitle = (
        <div className="drawer-title">
          {this.state.displayName}
            <a href={"/profile/" + this.state.userId}></a>
        </div>)
      ;
		} else {
			drawerContent = (<div role="navigation"><span>You must <Link to="/sign in">sign in</Link> or <Link to="/signup">sign up</Link> to view this content.</span></div>);
}
    return (
      <MuiThemeProvider>
        <div style={{height: '100%'}} role="main">
          <AppBar title={<span><Link to="/" className="header-link">NextBite</Link></span>}/>
            <div role="navigation">
							<Link to="/link">link</Link>
							<Link to="/link">link</Link>
							<Link to={this.state.userId !== null ? "/profile/" + this.state.userId : "/signin"}>{this.state.userId !== null ? this.state.firstName : 'Login'} <span className="profile-nav">{profileImg}</span></Link>
						</div>

          <Drawer
          docked={false}
          width={200}
          open={this.state.isDrawerOpen}
          onRequestChange={(isDrawerOpen) => this.setState({isDrawerOpen})}
          >
          <MenuItem onClick={this.handleClose}>Menu Item</MenuItem>
          <MenuItem onClick={this.handleClose}>Menu Item 2</MenuItem>
          </Drawer> 
          
					<div role="main">
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route path="/signup" component={SignUp}/>
              <Route path="/signin" component={SignIn}/>
              <Route path="/map" component={Map}/>
            </Switch>
					</div>
        </div>
			</MuiThemeProvider>
    );
  }
}

export default App;
