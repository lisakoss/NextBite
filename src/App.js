import React from 'react';
import './index.css';
import firebase from 'firebase';
import { Route, Switch, Link } from 'react-router-dom';

import Home from './Home';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Logout from './Logout';
import MapContainer from './MapContainer';
import Listing from './Listing';
import Market from './Market';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

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
            this.setState({personType: snapshot.child("personType").val()});
          });
      } else { //null out the saved state
        this.setState({userId: null});
        this.setState({firstName: null});
        this.setState({lastName: null}); 
        this.setState({avatar: null}); 
        this.setState({personType: null}); 
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
    let profileImgDrawer = null;
    let profileImgNav = null;
		let drawerContent = null;
    let drawerTitle = null;
    let drawerWidth = null;
    let userTypeDrawer = null;
    let userTypeNav = null;
		if(this.state.userId !== null) {

      if(this.state.avatar !== '') {
        profileImgDrawer = <Avatar style={{width: '150px', height: '150px', fontSize: '56px'}} src={this.state.avatar} />
      } else {
        profileImgDrawer = <Avatar style={{width: '150px', height: '150px', fontSize: '56px'}}>{this.state.firstName.charAt(0).toUpperCase()}</Avatar>
      } 

      if(this.state.avatar !== '') {
        profileImgNav = <Avatar style={{width: '30px', height: '30px'}} src={this.state.avatar} />
      } else {
        profileImgNav = <Avatar style={{width: '30px', height: '30px', fontSize: '14px'}}>{this.state.firstName.charAt(0).toUpperCase()}</Avatar>
      } 

      if(this.state.personType === 'volunteer') {
        userTypeDrawer = ( 
          <div>
            <MenuItem onClick={this.handleClose} className="menu-items"><Link to="">Rescue History</Link></MenuItem>
          </div>
        );
        userTypeNav = (
          <div className="appbar">
            <ul className="inline-list">
              <li><Link to="/map">Rescue Food</Link></li>
              <li><Link to="">Pending Rescues</Link></li>
              <li style={{marginTop: '10px'}}><Link to={this.state.userId !== null ? "/profile/" + this.state.userId : "/signin"}>{this.state.userId !== null ? this.state.firstName : 'Login'} <span className="profile-nav">{profileImgNav}</span></Link></li>
            </ul>
          </div>
        );
      } else if(this.state.personType === 'vendor') {
        userTypeDrawer = (
          <div>
            <MenuItem onClick={this.handleClose} className="menu-items"><Link to="">Donation History</Link></MenuItem>
          </div>
        );
        userTypeNav = (
          <div className="appbar">
            <ul className="inline-list">
              <li><Link to="/list-donation">Donate Food</Link></li>
              <li><Link to="">Pending Donations</Link></li>
              <li style={{marginTop: '10px'}}><Link to={this.state.userId !== null ? "/profile/" + this.state.userId : "/signin"}>{this.state.userId !== null ? this.state.firstName : 'Login'} <span className="profile-nav">{profileImgNav}</span></Link></li>
            </ul>
          </div>
        );
      }

			drawerContent = (
        <div>
          <div className="nav-container">
            <span className="profile-drawer">
              {profileImgDrawer}
            </span>
            <h2 className="links-title">Quick Links</h2>
          </div>
          <div className="drawer-links">
            {userTypeDrawer}
            <MenuItem onClick={this.handleClose} className="menu-items"><Link to="">Manage Account</Link></MenuItem>
            <div className="nav-container">
              <br/>
              <Logout />
            </div>
          </div>
        </div>
      );
			drawerTitle = (
        <div className="drawer-title">
          <span className="drawer-displayname">{this.state.firstName} {this.state.lastName}</span>
          <Link style={{display: 'inline-flex', verticalAlign: 'middle'}} to={"/profile/" + this.state.userId}>
            <IconButton tooltip="go to profile">
              <FontIcon className="material-icons" color={'#6E98A7'}>arrow_forward</FontIcon>
            </IconButton>
          </Link>
        </div>);
		} else {
			drawerContent = (<div role="navigation" className="nav-container loggedout"><span>You must <Link to="/signin">sign in</Link> or <Link to="/signup">sign up</Link> to view this content.</span></div>);
    }

    if(window.innerWidth  <= 640) {
      drawerWidth = window.innerWidth;
    } else {
      drawerWidth = 250;
    }

    return (
      <MuiThemeProvider>
        <div style={{height: '100%'}} role="main">
          <AppBar style={{backgroundColor: '#6E98A7'}} title={<span><Link to="/" className="appname-link">NEXTBITE</Link></span>} onLeftIconButtonClick={this.handleToggle} children={userTypeNav}/>

          <Drawer
          docked={false}
          width={drawerWidth}
          open={this.state.isDrawerOpen}
          onRequestChange={(isDrawerOpen) => this.setState({isDrawerOpen})}
          >
            {drawerTitle}
            {drawerContent}
          </Drawer> 
        
					<div role="main">
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route path="/signup" component={SignUp}/>
              <Route path="/signin" component={SignIn}/>
              <Route path="/map" component={MapContainer}/>
              <Route path="/list-donation" component={Listing}/>
              <Route path="/market" component={Market}/>
            </Switch>
					</div>
        </div>
			</MuiThemeProvider>
    );
  }
}

export default App;
