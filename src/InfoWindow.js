import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types'; 
import ReactDOMServer from 'react-dom/server';

class InfoWindow extends React.Component {
    componentDidUpdate(prevProps, prevState) {
        if (this.props.map !== prevProps.map) {
          this.renderInfoWindow();
        }

        if (this.props.children !== prevProps.children) {
            
        }

        if ((this.props.visible !== prevProps.visible) || (this.props.marker !== prevProps.marker)) {
            this.updateContent();
            this.props.visible ?
            this.openWindow() :
            this.closeWindow();
        }
    }

    renderChildren() {
        const {children} = this.props;
        return ReactDOMServer.renderToString(children);
    }

    renderInfoWindow() {
        let {map, google, mapCenter} = this.props;

        const iw = this.infowindow = new google.maps.InfoWindow({
            content: ''
        });

        google.maps.event
            .addListener(iw, 'closeclick', this.onClose.bind(this))
        google.maps.event
            .addListener(iw, 'domready', this.onOpen.bind(this));
    }

    onOpen() {
        if (this.props.onOpen) this.props.onOpen();
    }
    
      onClose() {
        if (this.props.onClose) this.props.onClose();
    }

    openWindow() {
        this.infowindow
            .open(this.props.map, this.props.marker);
    }

    closeWindow() {
        this.infowindow.close();
    }

    updateContent() {
        const content = this.renderChildren();
        this.infowindow
         .setContent(content);
      }

    render() {
      return null;
    }
}

export default InfoWindow;