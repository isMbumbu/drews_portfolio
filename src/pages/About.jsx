import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import { 
  FaJs, FaPython, FaJava, FaReact, FaNodeJs, FaDocker 
} from 'react-icons/fa';
import { 
  SiSpringboot, SiFlask, SiPostgresql, SiMongodb, SiFastapi, SiKubernetes 
} from 'react-icons/si';
import '../components/about.css';

function About() {
  const skills = [
    { icon: <FaJs />, name: "JavaScript" },
    { icon: <FaPython />, name: "Python" },
    { icon: <FaJava />, name: "Java" },
    { icon: <SiSpringboot />, name: "Spring Boot" },
    { icon: <FaReact />, name: "React" },
    { icon: <FaNodeJs />, name: "Node.js" },
    { icon: <SiFlask />, name: "Flask" },
    { icon: <SiFastapi />, name: "FastAPI" },
    { icon: <SiPostgresql />, name: "PostgreSQL" },
    { icon: <SiMongodb />, name: "MongoDB" },
    { icon: <SiKubernetes />, name: "Kubernetes" },
    { icon: <FaDocker />, name: "Docker" },
  ];

  return (
    <div className="about-root">
      <Navigation />
      
      {/* Decorative vertical rail like the gallery example */}
      <aside className="about-rail">
        <span className="rail-text">ENGINEERING ETHOS — 2026</span>
      </aside>

      <main className="about-container">
        <header className="about-header">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="about-subtitle"
          >
            01 — BIOGRAPHY
          </motion.h2>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="about-title"
          >
            Crafting <em>Scalable</em> <br />Digital Architecture.
          </motion.h1>
        </header>

        <section className="about-grid">
          {/* Main Narrative */}
          <div className="about-narrative">
            <p className="lead-text">
              I am Andrew Ambuka, a Full Stack Software Engineer based in Nairobi. 
              My approach to development is rooted in the principles of 
              <strong> Distributed Systems</strong> and <strong>Clean Architecture</strong>.
            </p>
            <p>
              With a background in Computer Science from PUEA and intensive training 
              from Moringa School and ALX, I’ve transitioned from curiosity to 
              architecting systems that handle secure financial workflows and 
              multi-tenant inventory platforms.
            </p>
            
            <div className="education-section">
              <h3>Academic Foundation</h3>
              <div className="edu-item">
                <span className="edu-year">2025</span>
                <div className="edu-detail">
                  <h4>BSc. Computer Science</h4>
                  <p>Presbyterian University of East Africa (Second Class Upper)</p>
                </div>
              </div>
              <div className="edu-item">
                <span className="edu-year">2025</span>
                <div className="edu-detail">
                  <h4>Software Engineering</h4>
                  <p>Moringa School Graduate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Toolkit */}
          <aside className="about-sidebar">
            <h3 className="sidebar-title">TECHNICAL TOOLKIT</h3>
            <div className="skills-editorial-grid">
              {skills.map((skill, index) => (
                <div key={index} className="skill-item-minimal">
                  <span className="skill-icon">{skill.icon}</span>
                  <span className="skill-name">{skill.name}</span>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default About;