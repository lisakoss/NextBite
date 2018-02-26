import React from 'react';
import './index.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

/**
 * A form for logging into a website.
 * Specifies email and password.
 * Expects `signUpCallback` and `signInCallback` props
 */
class SignInForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        'email': undefined,
        'password': undefined
    };

        //function binding
        this.handleChange = this.handleChange.bind(this);
    }
  
    //update state for specific field
    handleChange(event) {
        let field = event.target.name;
        let value = event.target.value;

        let changes = {}; //object to hold changes
        changes[field] = value; //change this field
        this.setState(changes); //update state
    }
  
  
    //handle signIn button
    signIn(event) {
        event.preventDefault(); //don't submit
        this.props.signInCallback(this.state.email, this.state.password);
        this.props.history.push('/');
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
            if(validations.required && value === '') {
                errors.required = true;
                errors.isValid = false;
            }

            if(validations.minLength && value.length < validations.minLength) {
                errors.minLength = validations.minLength;
                errors.isValid = false;
            }

            //handle email type
            if(validations.email) {
                //pattern comparison from w3c
                //https://www.w3.org/TR/html-markup/input.email.html#input.email.attrs.value.single
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
        //errors.style = 'has-success' //show success coloring
        } else { //valid and no input
            errors.isValid = false; //make false anyway
        }
        return errors; //return data object
    }
  
    render() {
        //field validation
        let emailErrors = this.validate(this.state.email, {required:true, email:true});
        let passwordErrors = this.validate(this.state.password, {required:true, minLength:8});

        //button validation
        let signInEnabled = (emailErrors.isValid && passwordErrors.isValid);
  
        return (
            <div role="article">
                <h1>sign in</h1>
        
                <form>
                    <ValidatedInput field="email" type="email" floatingLabelText="your email address" changeCallback={this.handleChange} errors={emailErrors} />
                    <ValidatedInput field="password" type="password" floatingLabelText="your password" changeCallback={this.handleChange} errors={passwordErrors} />
                    <div>
                        <RaisedButton id="submit-button" label="sign in" primary={true} disabled={!signInEnabled} onClick={(event) => this.signIn(event)} />
                        <p>Don't have an account yet? <Link to="/signup">Sign Up!</Link></p>
                    </div>

                </form>
            </div>
        );
    }
}

//to enforce proptype declaration
SignInForm.propTypes = {
    signInCallback: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
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
                <ValidationErrors errors={this.props.errors} />
            </div>
        );
    }
}
  
//a component to represent and display validation errors
class ValidationErrors extends React.Component {
    render() {
        return (
            <div role="region">
                {this.props.errors.required &&
                <span>Required! </span>
                }
                {this.props.errors.email &&
                <span>Not an email address!</span>
                }
                {this.props.errors.minLength &&
                <span>Must be at least {this.props.errors.minLength} character(s).</span>
                }
            </div>
        );
    }
}
  
export default SignInForm;