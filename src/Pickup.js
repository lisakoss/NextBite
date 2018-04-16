import React from 'react';
import './index.css';
import firebase from 'firebase';

import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import $ from 'jquery';

class Pickup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {};
  }

  componentWillMount() {
    $.ajax({
      type: "GET",
      url: "",
      dataType: "json",
      success: function (data) { console.log(data) }
    });


    function processData(allText) {
      console.log(allText);
      var allTextLines = allText.split(/\r\n|\n/);
      var headers = allTextLines[0].split(',');
      var lines = [];

      for (var i = 1; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

          var tarr = [];
          for (var j = 0; j < headers.length; j++) {
            tarr.push(headers[j] + ":" + data[j]);
          }
          lines.push(tarr);
        }
      }
      //alert(lines);
    }

    this.setState({ listingId: this.props.match.params.listingId });

    let listingRef = firebase.database().ref(`listings/${this.props.match.params.listingId}`);
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
            listingId={this.props.match.params.listingId}
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
  state = {
    finished: false,
    stepIndex: 0,
  };

  handleNext = () => {
    const { stepIndex } = this.state;
    if (stepIndex === 1) {
      firebase.database().ref().child('/listings/' + this.props.listingId)
        .update({ claimed: "yes" });
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
        return 'What is an ad group anyways?';
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

    return (
      <div style={{ width: '100%', maxWidth: 700, margin: 'auto' }}>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Confirm Donation Pickup</StepLabel>
          </Step>
          <Step>
            <StepLabel>Nearby Locations to Deliver</StepLabel>
          </Step>
          <Step>
            <StepLabel>Success</StepLabel>
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
