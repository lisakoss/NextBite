import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

/* A single listing. */
class ListingItem extends React.Component {
    constructor(props){
      super(props);
      this.state = {
          'post':'',
      };
    }
      
    render() {
      var id = "/posts/" + this.props.id;

    return (
    <div className="card-column" role="article">
        <div className="item" role="region">
        <Card>
            <CardHeader
            title="URL Avatar"
            subtitle="Subtitle"
            avatar="images/jsa-128.jpg"
            />
            <CardTitle title="Card title" subtitle="Card subtitle" />
            <CardText>
                {this.props.location}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
            Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
            Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
            </CardText>
            <CardActions>
            <FlatButton label="Action1" />
            <FlatButton label="Action2" />
            </CardActions>
        </Card>
        </div>
    </div>      
    );
    }
}
  
ListingItem.propTypes = {
    message: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
};
  
export default ListingItem;