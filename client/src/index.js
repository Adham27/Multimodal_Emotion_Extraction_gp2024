import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './styles/index.scss';
import ProtectedRoute from './components/Layout';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import App from './pages/App';
import Profile from './pages/Profile';
import Main from './pages/Landing/main';
import Team from './pages/Landing/Team';
import ContactUs from './pages/Landing/ContactUs';
import Cookies from 'js-cookie'; 

const getAccessToken = () => {
  return Cookies.get('access_token_cookie') || localStorage.getItem('Token');
}

const isAuthenticated = () => {
  return !!getAccessToken();
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    index: true
  },
  {
    path: '/contact-us',
    element: <ContactUs />,
    index: true
  },
  {
    path:'/team',
    element: <Team />,
    index: true
  },
  {
    path: '/Login',
    element: <Login />,
    index: true
  },
  {
    path: '/register',
    element: <Register />,
    index: true
  },
  {
    element: <ProtectedRoute isAuthenticated={isAuthenticated()} />,
    children: [
      {
        path: `users/${localStorage.getItem('user_id')}/dashboard`,
        element: <Home />
      },
      {
        path: `users/${localStorage.getItem('user_id')}/app`,
        element: <App />
      },
      {
        path: `users/${localStorage.getItem('user_id')}/profile`,
        element: <Profile />
      },
      
    ]
  },
  {
    path: '*',
    element: <ErrorPage />
  }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);