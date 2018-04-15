import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

/* A single listing. */
class MarketCards extends React.Component {
  constructor(props) {
    super(props);

    this.claimDonation = this.claimDonation.bind(this);
  }

  componentWillMount() {
    this.setState({ boxes: this.props.boxes });
    this.setState({ vendor: this.props.vendor });
    this.setState({ expiration: this.props.expiration });
    this.setState({ weight: this.props.weight });
    this.setState({ tags: this.props.tags });
    this.setState({ pickupId: this.props.pickupId})
  }

  //handle claim donation button
  claimDonation() {
    this.props.claimDonationCallback(this.state.pickupId);
  }

  render() {
    return (
      <div className="card-column" role="article">
        <div className="item" role="region">
          <Card>
            <CardTitle title={this.state.vendor} subtitle={this.state.expiration} />
            <CardText>
              <p>Boxes: {this.state.boxes}</p>
              <p>Weight: {this.state.weight}</p>
              <p>Tags: {this.state.tags}</p>
            </CardText>
            <CardActions>
              <FlatButton label="Claim Donation" onClick={this.claimDonation} />
            </CardActions>
          </Card>
        </div>
      </div>
    );
  }
}


export default MarketCards;

