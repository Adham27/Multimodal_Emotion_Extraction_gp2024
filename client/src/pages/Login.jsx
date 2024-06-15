import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Login.scss';
import { Spin, message } from 'antd';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async e => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      message.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      let response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });
      setLoading(false);

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("Token", data.access_token);
        localStorage.setItem('user_id',data.user_id);
        message.success('Login successful and will be redirected to the home page');
        setTimeout(() => {
          window.location.href = `users/${data.user_id}/dashboard`;
        }, 200);
      } else {
        message.error('Incorrect email or password');
      }
    } catch (error) {
      setLoading(false);
      message.error('Error during login');
    }
  };

  return (
    <>
      <Header />
      <div className='container'>
        <div className="row">
          <div className="col-md-6 d-flex justify-content-center align-items-center h-auto">
            <form onSubmit={handleLogin}>
              <div className="row m-5">
                <div className="text col-12 mt-3">
                  <h2>Log in to your account.</h2>
                  <p>Welcome back! Fill your data in the required fields.</p>
                </div>
                <div className="col-12 mt-3">
                  <input type="email" className="form-control" placeholder="Email" name="email" value={loginData.email} onChange={handleChange} />
                </div>
                <div className="col-12 mt-3">
                  <input type="password" className="form-control" placeholder="Password" name="password" value={loginData.password} onChange={handleChange} />
                </div>
                <div className="col-12 mt-3">
                  {loading ? (
                    <Spin />
                  ) : (
                    <button className='btn-log'>Login</button>
                  )}
                </div>
                <div className="col-12 mt-2 text-design">
                  <h5>Don't have an account ? <Link to='/register'><span>Join now!</span></Link></h5>
                </div>
              </div>
            </form>
          </div>
          <div className="col-md-6 d-none d-md-block">
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;