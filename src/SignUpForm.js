import React from 'react';
import './index.css';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import AppBar from 'material-ui/AppBar';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class SignUpForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: undefined,
            firstName: undefined,
            lastName: undefined,
            password: undefined,
            passwordConfirm: undefined, 
            avatar: '' //optional
        };

        // function binding
        this.handleChange = this.handleChange.bind(this);
    }

    //update state for specific field
    handleChange(event) {
        let field = event.target.name;
        let value = event.target.value;
        console.log(field)

        let changes = {}; //object to hold changes
        changes[field] = value; //change this field
        this.setState(changes); //update state
    }

    //handle signUp button
    signUp(event) {
        event.preventDefault(); //don't submit
        this.props.signUpCallback(this.state.email, this.state.password, this.state.firstName, this.state.lastName, this.state.avatar);
    }

    /**
   * A helper function to validate a value based on a hash of validations
   * second parameter has format e.g.,
   * {required: true, minLength: 5, email: true}
   * (for required field, with min length of 5, and valid email)
   */
    validate(value, validations) {
        var errors = {isValid: true, style:''};

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
            if(validations.email) {
                //pattern comparison from w3c
                //https://www.w3.org/TR/html-markup/input.email.html#input.email.attrs.value.single
                var valid = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)
                if(!valid) {
                    errors.email = true;
                    errors.isValid = false;
                }
            }

            // handle password confirmation
            if(validations.match) {
                if(this.state.password !== this.state.passwordConfirm) {
                    errors.match = true;
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
        let emailErrors = this.validate(this.state.email, {required: true, email: true});
        let passwordErrors = this.validate(this.state.password, {required: true, minLength: 8});
        let firstNameErrors = this.validate(this.state.firstName, {required: true, minLength: 1});
        let lastNameErrors = this.validate(this.state.lastName, {required: true, minLength: 1});
        let passwordConfirmErrors = this.validate(this.state.password, {required: true, match: true})
        let avatar = <Avatar>{"N"}</Avatar> // default

        if(this.state.firstName !== undefined && this.state.avatar === '') {
            avatar = <Avatar>{this.state.firstName.charAt(0).toUpperCase()}</Avatar>
        } else if(this.state.avatar !== '') {
            avatar = <Avatar src={this.state.avatar} />
        }
 
        //button validation
        let signUpEnabled = (emailErrors.isValid && passwordErrors.isValid && firstNameErrors.isValid && lastNameErrors.isValid && passwordConfirmErrors.isValid);
        
        return (
            <MuiThemeProvider>
                <div role="article">
                    <AppBar title="NextBite" />
                    <h1>Sign Up</h1>
                    
                    <form>
                        <ValidatedInput field="email" type="email" floatingLabelText="Email" changeCallback={this.handleChange} errors={emailErrors} /><br />
                        <ValidatedInput field="firstName" type="text" floatingLabelText="First Name" changeCallback={this.handleChange} errors={firstNameErrors} /><br />
                        <ValidatedInput field="lastName" type="text" floatingLabelText="Last Name" changeCallback={this.handleChange} errors={lastNameErrors} /><br />
                        <ValidatedInput field="password" type="password" floatingLabelText="Password" changeCallback={this.handleChange}errors={passwordErrors} /><br />
                        <ValidatedInput field="passwordConfirm" type="password" floatingLabelText="Confirm Password" changeCallback={this.handleChange} errors={passwordConfirmErrors} /><br />

                        <div className="avatar-field">          
                            {avatar}

                            <TextField id="avatar" name="avatar" type="text" hintText="http://www.test.com/picture.jpg" floatingLabelText="Avatar Image URL" floatingLabelFixed={true} onChange={this.handleChange} /><br />
                        </div>
                        
                        <div>
                            <p><RaisedButton id="submit-button" label="submit" primary={true} disabled={!signUpEnabled} onClick={(event) => this.signUp(event)} /></p>
                            <p>Already have an account? <a href="/login">Sign In!</a></p>
                        </div>
                    </form>
                </div>
            </MuiThemeProvider>
        );
    }
}

//to enforce proptype declaration
SignUpForm.propTypes = {
    signUpCallback: PropTypes.func.isRequired,
};

//A component that displays an input form with validation styling
//props are: field, type, label, changeCallback, errors
class ValidatedInput extends React.Component {
    render() {
        return (
            <div>
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
                {this.props.errors.email &&
                <span className="help-block">Not an email address.</span>
                }
                {this.props.errors.minLength &&
                <span className="help-block">Must be at least {this.props.errors.minLength} character(s).</span>
                }
                {this.props.errors.match &&
                <span className="help-block">Your passwords do not match.</span>
                }
            </div>
        );
    }   
}

export default SignUpForm;
