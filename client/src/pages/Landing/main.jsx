import React from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import WelcomeSection from './WelcomeSection.jsx';
import Team from './Team.jsx';
import AppSection from './AppSection.jsx';
import Paper from './Paper.jsx';
import ContactUS from './ContactUs.jsx';


const Main = () => {

  return (
    <>
      <Header />
      
          <WelcomeSection />
          <Team/>
          <AppSection/>
          <Paper />
          <ContactUS/>
          <Footer />
    </>
  );
};

export default Main;
