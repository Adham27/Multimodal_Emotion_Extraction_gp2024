import React from 'react';
import '../../styles/team.scss';
import { Carousel } from 'antd';
import { LinkedinFilled, GithubFilled } from '@ant-design/icons';
import adham from '../../imgs/WhatsApp Image 2024-05-30 at 12.26.41 AM.jpeg';
import img from '../../imgs/Shrug-pana.png'
const contentStyle = {
  height: '75vh',
  color: '#fff',
  textAlign: 'center',
  background: '#364d79',
};

const teamMembers = [
  {
    name: 'Adham Maged Hassan',
    description: 'As an undergraduate computer science student majoring in big data, I aim to excel in big data analytics, web development, and AI. With skills in React.js, Node.js, and Flask, I\'m seeking a backend role to enhance my abilities and contribute to innovative projects. My goal is to gain hands-on experience in data analysis, machine learning, and AI, and to make a positive societal impact through data-driven solutions.',
    linkedin: 'https://www.linkedin.com/in/adham-maged-8535841bb/',
    github: 'https://github.com/Adham27',
    image: adham
  },
  {
    name: 'Ali Fouad Marzabn',
    description: 'As an undergraduate computer science student majoring in big data, I aim to excel in big data analytics, web development, and AI. With skills in React.js, Node.js, and Flask, I\'m seeking a backend role to enhance my abilities and contribute to innovative projects. My goal is to gain hands-on experience in data analysis, machine learning, and AI, and to make a positive societal impact through data-driven solutions.',
    linkedin: 'https://www.linkedin.com/in/adham-maged-8535841bb/',
    github: 'https://github.com/Adham27',
    image: img
  },
  {
    name: 'Mariam Shrif Amin',
    description: 'As an undergraduate computer science student majoring in big data, I aim to excel in big data analytics, web development, and AI. With skills in React.js, Node.js, and Flask, I\'m seeking a backend role to enhance my abilities and contribute to innovative projects. My goal is to gain hands-on experience in data analysis, machine learning, and AI, and to make a positive societal impact through data-driven solutions.',
    linkedin: 'https://www.linkedin.com/in/adham-maged-8535841bb/',
    github: 'https://github.com/Adham27',
    image: img
  },
  {
    name: 'Mohmed Adel Khalifa',
    description: 'As an undergraduate computer science student majoring in big data, I aim to excel in big data analytics, web development, and AI. With skills in React.js, Node.js, and Flask, I\'m seeking a backend role to enhance my abilities and contribute to innovative projects. My goal is to gain hands-on experience in data analysis, machine learning, and AI, and to make a positive societal impact through data-driven solutions.',
    linkedin: 'https://www.linkedin.com/in/adham-maged-8535841bb/',
    github: 'https://github.com/Adham27',
    image: img
  },
  {
    name: 'Yousef Mohmed Elhefny',
    description: 'As an undergraduate computer science student majoring in big data, I aim to excel in big data analytics, web development, and AI. With skills in React.js, Node.js, and Flask, I\'m seeking a backend role to enhance my abilities and contribute to innovative projects. My goal is to gain hands-on experience in data analysis, machine learning, and AI, and to make a positive societal impact through data-driven solutions.',
    linkedin: 'https://www.linkedin.com/in/adham-maged-8535841bb/',
    github: 'https://github.com/Adham27',
    image: img
  },
  
];

const Team = () => {
  return (
    <div className="bg-team ">
      <div className="container">
        <div className="d-flex justify-content-center pt-5 text-center">
          <div>
            <h4>-Team members-</h4>
            <p className='text-header'>Let's know more about us!</p>
          </div>
        </div>

        <div style={{ height: '75vh', overflow: 'hidden' }}>
          <Carousel arrows dotPosition="left" style={{ height: '100%' }} infinite={false}>
            {teamMembers.map((member, index) => (
              <div key={index}>
                <div style={contentStyle}>
                  <div className="row">
                    <div className="col-7 d-flex flex-column justify-content-center p-5 text-start">
                      <h3>{member.name}</h3>
                      <p>{member.description}</p>
                      <div className='d-flex position-icons'>
                        <div className='p-2'>
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                            <LinkedinFilled style={{ fontSize: '22px', color: '#fff' }} />
                          </a>
                        </div>
                        <div className='p-2'>
                          <a href={member.github} target="_blank" rel="noopener noreferrer">
                            <GithubFilled style={{ fontSize: '22px', color: '#fff' }} />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="col-5 d-flex justify-content-center align-items-center">
                      <img src={member.image} className="img-fluid rounded" alt={member.name} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Team;
