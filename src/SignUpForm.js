import React from 'react';
import './index.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import $ from 'jquery';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

const styles = {
  block: {
    maxWidth: 250,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: '20px'
  },
  radioButton: {
    marginBottom: 16,
    display: 'inline-block',
    width: 'auto'
  },
};

class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: undefined,
      firstName: undefined,
      lastName: undefined,
      password: undefined,
      passwordConfirm: undefined,
      mobile: undefined,
      personType: undefined,
      avatar: '', //optional
      vendorName: '' //optional
    };

    // function binding
    this.handleChange = this.handleChange.bind(this);
    this.handlePersonType = this.handlePersonType.bind(this);
  }

  //update state for specific field
  handleChange(event) {
    let field = event.target.name;
    let value = event.target.value;
    let changes = {}; //object to hold changes

    changes[field] = value; //change this field
    this.setState(changes); //update state
  }

  handlePersonType(event) {
    let field = event.target.name;
    let value = event.target.value;
    let changes = {}; //object to hold changes

    changes[field] = value; //change this field
    this.setState(changes); //update state

    if (value === "vendor") {
      $(".vendorDisplay").removeClass("hidden")
    } else {
      $(".vendorDisplay").addClass("hidden");
      $(".vendorDisplay").removeClass("has-error");
      $(".vendorDisplay div:nth-child(2) span").empty();
    }
  }

  //handle signUp button
  signUp(event) {
    event.preventDefault(); //don't submit
    console.log(this.state.vendorName)

    this.props.signUpCallback(this.state.email, this.state.password, this.state.firstName, this.state.lastName, this.state.mobile, this.state.personType, this.state.avatar, this.state.vendorName);
  }

  /**
 * A helper function to validate a value based on a hash of validations
 * second parameter has format e.g.,
 * {required: true, minLength: 5, email: true}
 * (for required field, with min length of 5, and valid email)
 */
  validate(value, validations) {
    let errors = { isValid: true, style: '' };

    if (value !== undefined) { //check validations
      //display name required
      if (validations.required && value === '') {
        errors.required = true;
        errors.isValid = false;
      }

      //display name minLength
      if (validations.minLength && value.length < validations.minLength) {
        errors.minLength = validations.minLength;
        errors.isValid = false;
      }

      //handle email type
      if (validations.email) {
        //pattern comparison from w3c
        //https://www.w3.org/TR/html-markup/input.email.html#input.email.attrs.value.single
        let valid = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value);
        if (!valid) {
          errors.email = true;
          errors.isValid = false;
        }
      }

      // handle password confirmation
      if (validations.match) {
        if (this.state.password !== this.state.passwordConfirm) {
          errors.match = true;
          errors.isValid = false;
        }
      }

      // handle mobile phone number
      if (validations.phone) {
        let valid = /^([\d]{6}|((\([\d]{3}\)|[\d]{3})( [\d]{3} |-[\d]{3}-)))[\d]{4}$/.test(value);
        if (!valid) {
          errors.phone = true;
          errors.isValid = false;
        }
      }
    }

    //display details
    if (!errors.isValid) { //if found errors
      errors.style = 'has-error';
    } else if (value !== undefined) { //valid and has input
      //errors.style = "no-error";
    } else { //valid and no input
      errors.isValid = false; //make false anyway
    }
    return errors; //return data object
  }

  render() {
    //field validation
    let emailErrors = this.validate(this.state.email, { required: true, email: true });
    let passwordErrors = this.validate(this.state.password, { required: true, minLength: 8 });
    let firstNameErrors = this.validate(this.state.firstName, { required: true, minLength: 1 });
    let lastNameErrors = this.validate(this.state.lastName, { required: true, minLength: 1 });
    let vendorNameErrors = this.validate(this.state.vendorName, { required: false });
    let mobileErrors = this.validate(this.state.mobile, { required: true, phone: true });
    let passwordConfirmErrors = this.validate(this.state.password, { required: true, match: true })
    let typeErrors = this.validate(this.state.personType, { required: true })
    let avatar = <Avatar>{"N"}</Avatar> // default

    if (this.state.firstName !== undefined && this.state.avatar === '') {
      avatar = <Avatar>{this.state.firstName.charAt(0).toUpperCase()}</Avatar>
    } else if (this.state.avatar !== '') {
      avatar = <Avatar className="avatar" src={this.state.avatar} />
    }

    //button validation
    let signUpEnabled = (emailErrors.isValid && passwordErrors.isValid && firstNameErrors.isValid && lastNameErrors.isValid && passwordConfirmErrors.isValid && mobileErrors.isValid && typeErrors.isValid);
    return (
      <div role="article">
        <h1>sign up</h1>

        <form>
          <ValidatedInput field="email" type="email" floatingLabelText="Email" changeCallback={this.handleChange} errors={emailErrors} />
          <ValidatedInput field="firstName" type="text" floatingLabelText="First Name" changeCallback={this.handleChange} errors={firstNameErrors} />
          <ValidatedInput field="lastName" type="text" floatingLabelText="Last Name" changeCallback={this.handleChange} errors={lastNameErrors} />
          <ValidatedInput field="password" type="password" floatingLabelText="Password" changeCallback={this.handleChange} errors={passwordErrors} />
          <ValidatedInput field="passwordConfirm" type="password" floatingLabelText="Confirm Password" changeCallback={this.handleChange} errors={passwordConfirmErrors} />
          <ValidatedInput field="mobile" type="text" floatingLabelText="Mobile Phone Number" changeCallback={this.handleChange} errors={mobileErrors} />
          <p>Are you a...</p>
          <RadioButtonGroup name="personType" style={styles.block} onChange={this.handlePersonType} errors={typeErrors}>
            <RadioButton
              value="volunteer"
              label="Volunteer"
              style={styles.radioButton}
            /><RadioButton
              value="vendor"
              label="Vendor"
              style={styles.radioButton}
            />
          </RadioButtonGroup>
          <ValidatedInput field="vendorName" type="text" floatingLabelText="Vendor Name" changeCallback={this.handleChange} errors={vendorNameErrors} />


          <div className="avatar-field">
            {avatar}

            <TextField underlineFocusStyle={{ borderColor: '#244B65' }} floatingLabelFocusStyle={{ color: '#244B65' }} className="avatar-input" id="avatar" name="avatar" type="text" hintText="http://www.test.com/picture.jpg" floatingLabelText="Avatar Image URL" floatingLabelFixed={true} onChange={this.handleChange} /><br />
          </div>

          <div>
            <RaisedButton backgroundColor='#244B65' labelColor='#ffffff' id="submit-button" label="sign up" disabled={!signUpEnabled} onClick={(event) => this.signUp(event)} />
            <p>Already have an account? <Link to="/signin">Sign In!</Link></p>
          </div>
        </form>
      </div>
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
    let vendorDisplay = '';
    if (this.props.field === "vendorName" && this.props.errors.style === '') {
      vendorDisplay = ' hidden vendorDisplay';
    } else if (this.props.field === "vendorName") {
      vendorDisplay = ' vendorDisplay';
    }

    return (
      <div className={"form-group " + this.props.errors.style + vendorDisplay}>
        <TextField
          onChange={this.props.changeCallback}
          floatingLabelText={this.props.floatingLabelText}
          id={this.props.field}
          type={this.props.type}
          name={this.props.field}
          underlineFocusStyle={{ borderColor: '#244B65' }}
          floatingLabelFocusStyle={{ color: '#244B65' }}
        />
        <ValidationErrors errors={this.props.errors} />
      </div>
    );
  }
}

class ValidationErrors extends React.Component {
  render() {
    return (
      <div role="region">
        {this.props.errors.required &&
          <span>Required! </span>
        }
        {this.props.errors.email &&
          <span>Not an email address.</span>
        }
        {this.props.errors.minLength &&
          <span>Must be at least {this.props.errors.minLength} character(s).</span>
        }
        {this.props.errors.match &&
          <span>Your passwords do not match.</span>
        }
        {this.props.errors.phone &&
          <span>That is not a valid phone number.</span>
        }
      </div>
    );
  }
}

export default SignUpForm;
