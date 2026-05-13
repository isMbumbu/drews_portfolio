import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import './services.css';

const services = [
  {
    id: '01',
    title: 'Full-Stack Development',
    tags: ['FASTAPI', 'REACT', 'POSTGRESQL', 'DOCKER'],
    description: 'Architecting scalable backend systems and responsive frontend interfaces with a focus on clean, multi-tenant architecture.'
  },
  {
    id: '02',
    title: 'Cloud & DevOps',
    tags: ['KUBERNETES', 'CI/CD', 'AWS', 'REDIS'],
    description: 'Streamlining deployment pipelines and managing containerized environments to ensure 99.9% system reliability.'
  },
  {
    id: '03',
    title: 'AI & Data Solutions',
    tags: ['LLM INTEGRATION', 'DATA PIPELINES', 'API OPTIMIZATION'],
    description: 'Leveraging modern AI frameworks to build intelligent features and optimize data processing at scale.'
  }
];

function Services() {
  return (
    <main className="svc-root">
      <Navigation />
      
      {/* Decorative vertical rail */}
      <aside className="svc-rail">
        <span className="svc-rail-text">CORE CAPABILITIES — AMBUKA</span>
      </aside>

      <section className="svc-container">
        <header className="svc-header">
          <span className="svc-meta">SPECIALIZATIONS</span>
          <h1 className="svc-main-title">Expertise & <em>Solutions</em></h1>
        </header>

        <div className="svc-list">
          {services.map((svc) => (
            <motion.div 
              key={svc.id} 
              className="svc-row"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="svc-row-id">{svc.id}</div>
              
              <div className="svc-row-content">
                <div className="svc-row-top">
                  <h3 className="svc-row-title">{svc.title}</h3>
                  <div className="svc-row-tags">
                    {svc.tags.map(tag => <span key={tag}>{tag}</span>)}
                  </div>
                </div>
                <p className="svc-row-desc">{svc.description}</p>
              </div>

              <div className="svc-row-arrow">↗</div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Services;