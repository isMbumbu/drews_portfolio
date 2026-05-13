import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import '../components/portfolio.css';

const projects = [
  {
    id: '01',
    title: 'SokoPay Digital Platform',
    category: 'FINTECH / AGRI-TECH',
    description: 'A multi-tenant payment and supply chain system integrated with M-Pesa.',
    tech: ['FASTAPI', 'POSTGRESQL', 'CELERY', 'REDIS'],
    link: 'https://sokopayadmin.sokolink.co.ke/',
    img: 'sokopay.png' // Use your actual image paths
  },
  {
    id: '02',
    title: 'Isoi Photography',
    category: 'E-COMMERCE / FINE ART',
    description: 'High-end photography portfolio and print store with custom CMS.',
    tech: ['REACT', 'NEXT.JS', 'STRIPE'],
    link: 'https://isoi-photography.co.ke',
    img: 'isoi.png'
  },
  {
    id: '03',
    title: 'AkibaFlow',
    category: 'FINANCIAL TOOLS',
    description: 'Budgeting app with SMS transaction ingestion and expense tracking.',
    tech: ['REACT NATIVE', 'PYTHON', 'PYDANTIC'],
    link: 'https://github.com/isMbumbu/AkibaFlow',
    img: 'akibaflow.png'
  },
  {
    id: '04',
    title: 'Agrimmerce',
    category: 'SAAS / AGRICULTURE',
    description: 'SaaS solution for local farmers to digitize product listings.',
    tech: ['NODE.JS', 'MONGODB', 'REACT'],
    link: 'https://agrimmerce-1.onrender.com/',
    img: 'agrimmerce.png'
  },
  {
    id: '05',
    title: 'Law Firm Management',
    category: 'LEGAL-TECH',
    description: 'Empowering lawyers with seamless case and document management.',
    tech: ['DJANGO', 'POSTGRESQL', 'BOOTSTRAP'],
    link: 'https://anylawfirm.netlify.app/',
    img: 'advocates.png'
  },
  {
  id: '06',
  title: 'Inventory Archive',
  category: 'DISTRIBUTED SYSTEMS',
  description: 'Multi-tenant infrastructure for tracking asset lifecycles and inter-departmental transfers across agricultural value chains.',
  tech: ['FASTAPI', 'REACT', 'POSTGRESQL', 'DOCKER'],
  link: 'https://inventory.sokolink.co.ke/',
  img: 'inventory.png' // Ensure this matches your asset naming convention
},
];

function Portfolio() {
  return (
    <main className="port-root">
      <Navigation />
      
      <aside className="port-rail">
        <span className="port-rail-text">SELECTED WORKS — 2025/26</span>
      </aside>

      <section className="port-container">
        <header className="port-header">
          <span className="port-meta">PORTFOLIO</span>
          <h1 className="port-main-title">Project <em>Archive</em></h1>
        </header>

        <div className="port-grid">
          {projects.map((project, index) => (
            <motion.div 
              key={project.id}
              className={`port-card item-${project.id}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="port-link">
                <div className="port-img-wrapper">
                  <img src={project.img} alt={project.title} className="port-img" />
                  <div className="port-overlay">
                    <span className="view-text">VIEW PROJECT ↗</span>
                  </div>
                </div>
                
                <div className="port-info">
                  <div className="port-info-header">
                    <span className="port-number">{project.id}</span>
                    <span className="port-category">{project.category}</span>
                  </div>
                  <h3 className="port-title">{project.title}</h3>
                  <p className="port-desc">{project.description}</p>
                  <div className="port-tech-stack">
                    {project.tech.map(t => <span key={t}>{t}</span>)}
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Portfolio;