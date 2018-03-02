import React from 'react';
import './index.css';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import AppBar from 'material-ui/AppBar';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TimePicker from 'material-ui/TimePicker';

const styles = {
    customWidth: {
      width: 300,
    }
};

export class ListingsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: undefined,
            boxes: undefined,
            expirationDate: undefined,
            weight: undefined, 
            tags: undefined
        };

        // function binding
        this.handleChange = this.handleChange.bind(this);
    }

    handleLocationDropDown = (event, index, location) => {
        this.setState({location});
    }

    handleWeightDropDown = (event, index, weight) => {
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

        //handle email type
        if(validations.tags) {
            let valid = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)
            if(!valid) {
            errors.email = true;
            errors.isValid = false;
         }
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
        let boxesErrors = this.validate(this.state.boxes, {required: true, minLength: 1});
        let tagErrors = this.validate(this.state.tags, {required: true, tags: true, minLength: 1});
        let submitEnabled = (boxesErrors && tagErrors)
        return (
            <div role="article">
                <div className="container-content">
                    <h1>list a donation</h1>

                    <form>
                        <SelectField name="location" floatingLabelText="Your market location" value={this.state.location} onChange={this.handleLocationDropDown} autoWidth={true} maxHeight={210}>
                            <MenuItem value={null} primaryText="" />
                            <MenuItem value={"Ballard Farmers Market, 47.6450099, -122.3486234"} primaryText="Ballard Farmers Market" />
                            <MenuItem value={"Capitol Hill Farmers Market, 47.6163942, -122.3231928"} primaryText="Capitol Hill Farmers Market" />
                            <MenuItem value={"City Hall Farmers Market, 47.6097185, -122.3597025"} primaryText="City Hall Farmers Market" />
                            <MenuItem value={"Columbia City Farmers Market, 47.5663073, -122.3465634"} primaryText="Columbia City Farmers Market" />
                            <MenuItem value={"Denny Regrade Farmers Market, 47.6097158, -122.3597025"} primaryText="Denny Regrade Farmers Market" />
                            <MenuItem value={"Fremont Farmers Market, 47.6463977, -122.3474217,13"} primaryText="Fremont Farmers Market" />
                            <MenuItem value={"Lake City Farmers Market, 47.71992, -122.3003247"} primaryText="Lake City Farmers Market" />
                            <MenuItem value={"Madrona Farmers Market, 47.612343, -122.2977045"} primaryText="Madrona Farmers Market" />
                            <MenuItem value={"Magnolia Farmers Market, 47.646629, -122.3635579"} primaryText="Magnolia Farmers Market" />
                            <MenuItem value={"Phinney Farmers Market, 47.67763, -122.3562657"} primaryText="Phinney Farmers Market" />
                            <MenuItem value={"Pike Place Market, 47.6097199, -122.3465703"} primaryText="Pike Place Market" />
                            <MenuItem value={"Queen Anne Farmers Market, 47.637149, -122.3592802"} primaryText="Queen Anne Farmers Market" />
                            <MenuItem value={"Rainier Farmers Market, 47.5663073,-122.3465634"} primaryText="Rainier Farmers Market" />
                            <MenuItem value={"South Lake Union Farmers Market, 47.6040411, -122.3366638"} primaryText="South Lake Union Farmers Market" />
                            <MenuItem value={"University District Farmers Market, 47.6656392, -122.3152575"} primaryText="University District Farmers Market" />
                            <MenuItem value={"Wallingford Farmers Market, 47.6623941, -122.3407796"} primaryText="Wallingford Farmers Market" />
                            <MenuItem value={"West Seattle Farmers Market, 47.5612161, -122.3887488"} primaryText="West Seattle Farmers Market" />
                        </SelectField>
                        
                        <ValidatedInput field="boxes" type="text" floatingLabelText="Number of boxes" changeCallback={this.handleChange} errors={boxesErrors} />

                        <SelectField name="weight" floatingLabelText="Appoximate weight of boxes" value={this.state.weight} onChange={this.handleWeightDropDown} autoWidth={true}>
                            <MenuItem value={null} primaryText="" />
                            <MenuItem value={"< 1 lbs"} primaryText="< 1 lbs" />
                            <MenuItem value={"1-3 lbs"} primaryText="1-3 lbs" />
                            <MenuItem value={"5-7 lbs"} primaryText="5-7 lbs" />
                            <MenuItem value={"7-10 lbs"} primaryText="7-10 lbs" />
                            <MenuItem value={"> 10 lbs"} primaryText="> 10 lbs" />
                        </SelectField>
                        
                        <TimePicker className="field-margin" format="ampm" hintText="Expiration of donation" value={this.state.expirationDate} onChange={this.handleChangeTimePicker12}/>
                        
                        <TextField className="field-margin" field="tags" type="text" hintText="For ex: fruits, apples, celery" floatingLabelText="Types of food you are donating?" floatingLabelFixed={true} changeCallback={this.handleChange} errors={tagErrors}/>

                        <div>
                            <RaisedButton id="submit-button" label="list donation" primary={true} disabled={!submitEnabled} onClick={(event) => this.submit(event)} />
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