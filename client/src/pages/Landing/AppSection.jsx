import React from 'react';
import '../../styles/appSection.scss'
import Lottie from "lottie-react";
import Ai from '../../lottie/aboutModel.json'
import { Link } from 'react-router-dom';
const AppSection = () => {

    return (
        <>


            <div className="container"> <div className="row  h-welcome-auto">


                <div className="col d-flex align-items-center ">
                    <div className="landing-hight p-3">
                        <h1 ><span>EXPRESSIFY</span> MODEL </h1>
                        <p className='text-muted'>  </p>
                        <Link to='/login'> <button className="btn btn-outline-primary w-100">
                           TRY THE FUTURE
                        </button>
                        </Link>
                    </div>
                </div>
                <div className="col d-flex align-items-center model-style">
                    <Lottie animationData={Ai} className='style' />
                </div>
            </div></div>

        </>
    );
};

export default AppSection;
