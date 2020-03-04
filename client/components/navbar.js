import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store';
// import Logo from '../../public/logo.png'

const Navbar = props => {
  const { handleClick, isLoggedIn, user } = props;

  return (
    <div className="column">
      <div className="nav space-between">
        {isLoggedIn ? <p>Welcome {user.name}</p> : null}

        <div>
          {isLoggedIn ? (
            <div id="right-nav" className="row">
              {/* The navbar will show these links after you log in */}
              <Link to="/portfolio" className="nav-links">
                Portfolio
              </Link>
              <Link to="/transactions" className="nav-links">
                Transactions
              </Link>
              <a href="#" className="nav-links" onClick={handleClick}>
                Logout
              </a>
            </div>
          ) : (
            <div>
              <div id="register" className="nav-links">
                {/* The navbar will show these links before you log in */}
                <Link to="/"> Log in </Link>
                <p> &nbsp;/ &nbsp; </p>
                <Link to="/signup">Sign Up</Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <div></div>
    </div>
  );
};
/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id,
    user: state.user,
  };
};

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout());
    },
  };
};

export default connect(mapState, mapDispatch)(Navbar);

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};
