import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const user_id = localStorage.getItem('user_id');
  const user_token = localStorage.getItem('Token');
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <a className="navbar-brand">EXPRESSIFY</a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav m-auto">
            <Link to={'/'}  className="nav-link">Home</Link>
            {user_id && user_token ? (
              <Link to={`/users/${user_id}/app`} className="nav-link">App</Link>
            ) : (
              <Link to={'/login'} className="nav-link">App</Link>
            )}
            <Link to={'/team'}  className="nav-link">Team </Link>
            <Link to={'/paper'}  className="nav-link">Paper </Link>
            </div>
            <div className="navbar-nav ml-auto">
            <Link to={'/contact-us'}> <button className="btn btn-primary">contact-us</button></Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
