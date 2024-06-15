import React from 'react'
import '../styles/error.scss'
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <> 
   <div className='container '>
   <div>
    <Link to={'/'}> <Button className='error-button' type="primary">Back Home</Button> </Link>
   </div>
   </div>
    </>
    
  )
}

export default ErrorPage
