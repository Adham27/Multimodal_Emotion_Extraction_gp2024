import React from 'react';
import '../../styles/welcomeSection.scss'
import Lottie from "lottie-react";
import Ai from '../../lottie/welcome.json'
import { Link } from 'react-router-dom';
const WelcomeSection = () => {

  return (
    <>


      <div className="row  h-welcome-auto">

        <div className="col d-flex align-items-center">
          <Lottie animationData={Ai} className='style' />
        </div>
        <div className="col d-flex align-items-center ">
          <div className="landing-hight p-3">
            <h1 >Welcome! Revolutionize Learning with <span>EXPRESSIFY.</span> </h1>
            <p className='text-muted'>Meet Expressify, the app revolutionizing education with advanced emotion detection. By analyzing facial expressions and voice, Expressify gives educators real-time insights to personalize teaching and support students better. Experience a new era of empathetic and effective learning with Expressify.</p>
            <Link to='/login'> <button className="btn btn-outline-primary w-100">
              JOIN US
            </button>
            </Link>
          </div>
        </div>
      </div>

    </>
  );
};

export default WelcomeSection;
