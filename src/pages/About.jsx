import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import '../components/about.css';
import { 
  FaJs, FaPython, FaJava, FaReact, FaNodeJs, FaNetworkWired, FaDocker, FaGitAlt 
} from 'react-icons/fa';
import { 
  SiSpringboot, SiFlask, SiPostgresql, SiMongodb, SiFastapi, SiKubernetes, SiGithub, SiCypress 
} from 'react-icons/si';
import { MdOutlineApi } from 'react-icons/md';
import { FaPeopleArrows } from 'react-icons/fa';

function About() {
  return (
    <div>
      <Navigation />
      <div className="about-container">
        <div className="about-content">
          <p>
            I’m a dedicated full-stack developer with a passion for crafting impactful web and mobile applications. 
            My toolkit includes <strong>React, React Native, Node.js, Flask, PostgreSQL, and MongoDB</strong>, 
            backed by a strong foundation in <strong>object-oriented programming (OOP)</strong> with Python and Java. 
            I thrive on building scalable, efficient, and intuitive solutions that deliver real value to users.
          </p>

        </div>

        <div className="about-skills">
          <h3>Skills</h3>
            <ul>
              <li><FaJs title="JavaScript" /> JavaScript</li>
              <li><FaPython title="Python" /> Python</li>
              <li><FaJava title="Java" /> Java</li>
              <li><SiSpringboot title="Spring Boot" /> Spring Boot</li>
              <li><FaReact title="React & React Native" /> React & React Native</li>
              <li><FaNodeJs title="Node.js" /> Node.js</li>
              <li><SiFlask title="Flask" /> Flask</li>
              <li><SiPostgresql title="PostgreSQL" /> PostgreSQL</li>
              <li><SiMongodb title="MongoDB" /> MongoDB</li>
              <li><SiFastapi title="FastAPI" /> FastAPI</li>
              <li><SiKubernetes title="Kubernetes" /> Kubernetes</li>
              <li><FaDocker title="Docker" /> Docker</li>
            </ul>
        </div>
        <div className="about-education">
          <h3>Education</h3>
          <p><strong>The Presbyterian University of East Africa</strong> – BSc. Computer Science (Second Class Upper Division)</p>
          <p><strong>Moringa School</strong> – Software Engineering</p>
          <p><strong>ALX</strong> –AI Career Essentials</p>
        </div>
      </div>
    </div>
  );
}

export default About;
