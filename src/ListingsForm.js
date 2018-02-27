import React from 'react';
import './index.css';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import AppBar from 'material-ui/AppBar';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import TimePicker from 'material-ui/TimePicker';

const styles = {
    customWidth: {
      width: 200,
    }
};

export class ListingsForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            location: undefined,
            boxes: undefined,
            expirationDate: undefined,
            weight: 1, 
            tags: undefined
        };

        // function binding
        this.handleChange = this.handleChange.bind(this);
    }

    handleDropDown = (event, index, weight) => {
        this.setState({weight});
    }
    
    handleChangeTimePicker12 = (event, date) => {
        this.setState({expirationDate: date});
    }

    //update state for specific field
    handleChange(event) {
        let field = event.target.name;
        let value = event.target.value;

        let changes = {}; //object to hold changes
        changes[field] = value; //change this field
        this.setState(changes); //update state
    }

    //handle submit button
    submit(event) {
        event.preventDefault(); //don't submit
        this.props.submitCallback(this.state.location, this.state.boxes, this.state.expirationDate, this.state.weight, this.state.tags);
    }

        /**
   * A helper function to validate a value based on a hash of validations
   * second parameter has format e.g.,
   * {required: true, minLength: 5, email: true}
   * (for required field, with min length of 5, and valid email)
   */
  validate(value, validations) {
    let errors = {isValid: true, style:''};

    if(value !== undefined) { //check validations
        //display name required
        if(validations.required && value === '') {
            errors.required = true;
            errors.isValid = false;
        }

        //display name minLength
        if(validations.minLength && value.length < validations.minLength) {
            errors.minLength = validations.minLength;
            errors.isValid = false;
        }
    }

    //display details
    if(!errors.isValid){ //if found errors
        errors.style = 'has-error';
    } else if(value !== undefined){ //valid and has input

    } else { //valid and no input
        errors.isValid = false; //make false anyway
    }
        return errors; //return data object
    }

    render() { 
        //field validation
        let locationErrors = this.validate(this.state.location, {required: true, minLength: 1});
        // ADD CHECKING ERROR FOR NUMBER INPUT ONLY!!!!!
        let boxesErrors = this.validate(this.state.boxes, {required: true, minLength: 1});
        let tagErrors = this.validate(this.state.tags, {required: true, minLength: 1});
        let submitEnabled = (locationErrors.isValid && boxesErrors && tagErrors)
        return (
            <div role="article">
                <div className="container-content">
                    <h1>create listing</h1>

                    <form>
                        <ValidatedInput field="location" type="text" floatingLabelText="Your Location" changeCallback={this.handleChange} errors={locationErrors} />
                        <ValidatedInput field="boxes" type="text" floatingLabelText="Number of Boxes" changeCallback={this.handleChange} errors={boxesErrors} />
                        <p>Total Weight of All Boxes:</p>
                        <DropDownMenu name="weight" value={this.state.weight} onChange={this.handleDropDown} style={styles.customWidth} autoWidth={false}>
                            <MenuItem value={1} primaryText="< 1 lbs" />
                            <MenuItem value={2} primaryText="1-3 lbs" />
                            <MenuItem value={3} primaryText="5-7 lbs" />
                            <MenuItem value={4} primaryText="7-10 lbs" />
                            <MenuItem value={5} primaryText="> 10 lbs" />
                        </DropDownMenu>
                        <TimePicker format="ampm" hintText="12hr Format" value={this.state.expirationDate} onChange={this.handleChangeTimePicker12}/>
                        <ValidatedInput field="tags" type="text" floatingLabelText="What types of items are you donating?" changeCallback={this.handleChange} errors={tagErrors} />
                        <div>
                            <RaisedButton id="submit-button" label="sign up" primary={true} disabled={!submitEnabled} onClick={(event) => this.submit(event)} />
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

//to enforce proptype declaration
ListingsForm.propTypes = {
    submitCallback: PropTypes.func.isRequired,
};

//A component that displays an input form with validation styling
//props are: field, type, label, changeCallback, errors
class ValidatedInput extends React.Component {
    render() {
        return (
            <div className={"form-group "+this.props.errors.style}>
                <TextField
                    onChange={this.props.changeCallback}
                    floatingLabelText={this.props.floatingLabelText}
                    id={this.props.field}
                    type={this.props.type}
                    name={this.props.field}
                />
               <ValidationErrors errors={this.props.errors}/>
            </div>
        );
    }
}

class ValidationErrors extends React.Component {
    render() {
        return (
            <div role="region">
                {this.props.errors.required &&
                <span className="help-block">Required! </span>
                }
            </div>
        );
    }   
}

export default ListingsForm;