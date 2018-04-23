import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Location from 'material-ui/svg-icons/communication/location-on';
import { redA200 } from 'material-ui/styles/colors';
import { withRouter } from "react-router-dom";

/* A single listing. */
class FoodBankCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    //this.viewPickups = this.viewPickups.bind(this);
    this.chooseDeliveryLocation = this.chooseDeliveryLocation.bind(this);
  }

  componentWillMount() {
    this.setState({title: this.props.title});
    this.setState({distance: this.props.distance});
  }

  //handle delivery button
  chooseDeliveryLocation() {
    //this.setState({bgColor: '#244B65'})

    $("button").removeClass("selected-location");
    let idName = this.state.title.replace(new RegExp(" ", "g"), "-");

    console.log("#" + idName + " div span")
    $(".food-bank div span").text("CHOOSE LOCATION")
    $("#" + idName).addClass("selected-location");
    $("#" + idName + " div span").html("LOCATION SELECTED")

    this.props.deliveryLocationCallback(this.state.title);
  }

  render() {
    return (
      <div className="card-column" role="article">
        <div className="item" role="region">
          <Card>
            <Location color={redA200} style={{ width: '40px' }} /><CardTitle title={this.state.title} subtitle={this.state.distance} />
            <CardText>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
              Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
              Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.</p>

            </CardText>
            <CardActions>
              <FlatButton className="food-bank" id={this.state.title.replace(new RegExp(" ", "g"), "-")} label="Choose Location" onClick={this.chooseDeliveryLocation} />
            </CardActions>
          </Card>
        </div>
      </div>
    );
  }
}


export default FoodBankCards;
