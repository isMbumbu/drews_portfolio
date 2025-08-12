import React from 'react';
import '../components/services.css';
import { FaCode, FaLightbulb, FaChartLine } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import background from '/services.jpg';

const services = [
  {
    id: 1,
    icon: <FaCode />,
    title: 'Full-Stack Development',
    description: 'I build scalable web applications using FastAPI, React, PostgreSQL, and Docker, with clean, maintainable, and production-ready code.'
  },
  {
    id: 2,
    icon: <FaLightbulb />,
    title: 'Cloud & DevOps',
    description: 'I work with Kubernetes, containerization, and CI/CD pipelines to deploy reliable and efficient systems.'
  },
  {
    id: 3,
    icon: <FaChartLine />,
    title: 'AI & Data Solutions',
    description: 'I integrate AI models and data-driven solutions into applications, leveraging modern tools and APIs to create intelligent features.'
  }
];

function Services() {
  return (
    <>
      <Navigation />
      <section className="services-section" style={{ backgroundImage: `url(${background})` }}>
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
