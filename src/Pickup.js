import React from 'react';
import './index.css';
import firebase from 'firebase';

import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import $ from 'jquery';
import FoodBankCards from './FoodBankCards';

import GoogleApiComponent from 'google-maps-react/dist/GoogleApiComponent';

class Pickup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {};
  }

  componentDidMount() {
    this.setState({ listingId: this.props.listingId });

    let listingRef = firebase.database().ref(`listings/${this.props.listingId}`);
    listingRef.once("value").then(snapshot => {
      this.setState({ boxes: snapshot.child("boxes").val() });
      this.setState({ expirationDate: snapshot.child("expirationDate").val() });
      this.setState({ location: snapshot.child("location").val() });
      this.setState({ tags: snapshot.child("tags").val() });
      this.setState({ weight: snapshot.child("weight").val() });

      let vendorRef = firebase.database().ref(`users/${snapshot.child("userId").val()}`);
      vendorRef.once("value").then(snapshot => {
        this.setState({ vendorName: snapshot.child("vendorName").val() });

        this.setState({
          stepper: <HorizontalLinearStepper
            boxes={this.state.boxes}
            expirationDate={this.state.expirationDate}
            location={this.state.location}
            tags={this.state.tags}
            weight={this.state.weight}
            vendorName={this.state.vendorName}
            listingId={this.props.listingId}
            google={this.props.google}
          />
        })
      });
    });
  }

  render() {
    let content = null; //what main content to show
    content = "hi";

    return (
      <div>
        <main role="article" className="container-content">
          {this.state.stepper}
        </main>
      </div >
    );
  }
}

export default Pickup;

class HorizontalLinearStepper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      finished: false,
      stepIndex: 0,
    };
  }

  calculateDistance() {
    const google = this.props.google;
    const maps = google.maps;
    var banksData = {}
    let currentFoodBankCards = [];

    for (let key in Object.keys(this.state.foodBanks)) {

      var origin1 = { lat: parseFloat(this.props.location.split(",")[1]), lng: parseFloat(this.props.location.split(",")[2]) };
      var destinationA = { lat: parseFloat(this.state.foodBanks[key].latitude), lng: parseFloat(this.state.foodBanks[key].longitude) };

      var service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origin1],
          destinations: [destinationA],
          travelMode: 'DRIVING',
        }, function (response, status) {
          currentFoodBankCards.push(
            <FoodBankCards
              title={this.state.foodBanks[key].name}
              distance={response.rows[0].elements[0].distance.text}
            />
          );

          this.setState({ foodBankCards: currentFoodBankCards });
        }.bind(this)
      );
    }
  }

  handleNext = () => {
    const { stepIndex } = this.state;
    if (stepIndex === 0) {
      //NOTE THIS URL MUST BE CHANGED TO MASTER TO ENSURE CONSISTENCY IN FUTURE ONCE MERGED
      $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/lisakoss/NextBite/claim-donation/FoodBanks.json",
        dataType: "json",
        success: function (foodBankData) {
          this.setState({ foodBanks: foodBankData });
          this.calculateDistance();

        }.bind(this)
      });
    } else if (stepIndex === 1) {
      firebase.database().ref().child('/listings/' + this.props.listingId)
        .update({ claimed: "yes" });

      firebase.auth().onAuthStateChanged(user => {
        let pendingRef = firebase.database().ref('/users/' + user.uid + '/pendingRescues')
        let pendingListing = {
          listingId: this.props.listingId,
        }

        pendingRef.push(pendingListing);
      })
    }

    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    });
  };

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex === 2) {
      firebase.database().ref().child('/listings/' + this.props.listingId)
        .update({ claimed: "no" });
    }
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  };

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <div>
            <p>Claim the following donation request?</p>
            <p>Boxes: {this.props.boxes}</p>
            <p>Pickup Expiration: {this.props.expirationDate}</p>
            <p>Location: {this.props.location}</p>
            <p>Tags: {this.props.tags}</p>
            <p>Weight: {this.props.weight}</p>
            <p>Vendor Name: {this.props.vendorName}</p>
          </div>
        );
      case 1:
        return (
          <div>
            {this.state.foodBankCards}
          </div>
        );
      case 2:
        return (
          <div>
            <p>Success! You have claimed this donation.</p>
          </div>
        );
      default:
        return 'You\'re a long way from home sonny jim!';
    }
  }

  render() {
    const { finished, stepIndex } = this.state;
    const contentStyle = { margin: '0 16px' };

    console.log(this.state.foodBankCards)

    return (
      <div style={{ width: '100%', maxWidth: 700, margin: 'auto' }}>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Confirm Donation Pickup</StepLabel>
          </Step>
          <Step>
            <StepLabel>Nearby Delivery Locations</StepLabel>
          </Step>
          <Step>
            <StepLabel>Successful Pickup Claim</StepLabel>
          </Step>
        </Stepper>
        <div style={contentStyle}>
          {finished ? (
            <p>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  this.setState({ stepIndex: 0, finished: false });
                }}
              >
                Click here
                </a> to reset the example.
              </p>
          ) : (
              <div>
                {this.getStepContent(stepIndex)}
                <div style={{ marginTop: 12 }}>
                  <FlatButton
                    label={stepIndex === 2 ? "" : "Back"}
                    disabled={stepIndex === 0}
                    onClick={this.handlePrev}
                    style={{ marginRight: 12 }}
                  />
                  <RaisedButton
                    label={stepIndex === 2 ? 'View Pending Rescues' : 'Confirm'}
                    primary={true}
                    onClick={this.handleNext}
                  />
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }
}
