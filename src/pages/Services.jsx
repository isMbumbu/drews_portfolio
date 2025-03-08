import React from 'react';
import '../components/services.css';
import { FaCode, FaLightbulb, FaChartLine } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import background from '/services.jpg';

const services = [
  {
    id: 1,
    icon: <FaCode />,
    title: 'Professional Code',
    description: 'As a programmer my goal is to always scale up with every project done, write clean and simple code, and be creative while at it.'
  },
  {
    id: 2,
    icon: <FaLightbulb />,
    title: 'Creative Ideas',
    description: 'I am fueled by my passion for understanding cross-cultural technology practices which gives a good footing for creativity.'
  },
  {
    id: 3,
    icon: <FaChartLine />,
    title: 'SEO & Marketing',
    description: 'I stay in tune with the latest technology innovations and strategies through continued coursework and professional development.'
  }
];

function Services() {
  return (<>
    <Navigation />
    <section className="services-section"style={{ backgroundImage: `url(${background})` }}>
      <h2 className="section-title">What I Do</h2>
      <div className="services-container">
        {services.map(service => (
          <div key={service.id} className="service-card">
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
    </>
  );
}

export default Services;
