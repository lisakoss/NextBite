import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types'; 

export class Marker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            map: []
        }
    }

    componentDidUpdate(prevProps) {
        if ((this.props.map !== prevProps.map) || (this.props.position !== prevProps.position)) {
          // The relevant props have changed
          this.renderMarker();
      }
    }

    componentWillUnmount() {
        if (this.marker) {
          this.marker.setMap(null);
        }
    }

    renderMarker() {
        if (this.props && this.props.google) {
            let {map, google, position, mapCenter} = this.props;
        
            let pos = position || mapCenter;
            position = new google.maps.LatLng(pos.lat, pos.lng);

            const pref = {
                map: map,
                position: position
            };
            this.marker = new google.maps.Marker(pref);

            const evtNames = ['click', 'mouseover'];
            evtNames.forEach(e => {
                this.marker.addListener(e, this.handleEvent(e));
            })
        }
    }

    handleEvent(evtName) {
        const camelize = function(str) {
            return str.split(' ').map(function(word){
              return word.charAt(0).toUpperCase() + word.slice(1);
            }).join('');
        }

        return (e) => {
            const handlerName = `on${camelize(evtName)}`
            if (this.props[handlerName]) {
              this.props[handlerName](this.props, this.marker, e);
            }

            console.log(e);
            console.log(handlerName);
            console.log(this.marker)
        }
    }

    render() {
      return null;
    }
}

Marker.propTypes = {
    position: PropTypes.object,
    map: PropTypes.object
}

export default Marker