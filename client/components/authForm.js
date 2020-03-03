import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { auth, signUp } from '../store';

/**
 * COMPONENT
 */
const AuthForm = props => {
  const { name, displayName, handleSubmit, error } = props;
  const isSignUpForm = name === 'signup';
  return (
    <div className="column">
      <form onSubmit={e => handleSubmit(e, name)} name={name}>
        <p> {displayName}</p>
        <div className="row">
          <input name="email" type="email" placeholder="email" required />
        </div>
        {isSignUpForm ? (
          <div className="row">
            <input name="name" type="name" placeholder="name" required />
          </div>
        ) : null}
        <div className="row">
          <input
            name="password"
            type="password"
            placeholder="password"
            required
          />
        </div>
        <div>
          <button type="submit">{displayName}</button>
        </div>
        {error && error.response && <div> {error.response.data} </div>}
      </form>
    </div>
  );
};

const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error,
  };
};

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error,
  };
};

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt, formName) {
      evt.preventDefault();

      const email = evt.target.email.value;
      const password = evt.target.password.value;
      if (formName === 'signup') {
        const name = evt.target.name.value;
        dispatch(signUp(email, name, password));
      } else {
        dispatch(auth(email, password));
      }
    },
  };
};

export const Login = connect(mapLogin, mapDispatch)(AuthForm);
export const Signup = connect(mapSignup, mapDispatch)(AuthForm);

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object,
};
