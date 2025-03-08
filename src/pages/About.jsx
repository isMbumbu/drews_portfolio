import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import '../components/about.css';
import { FaJs, FaPython, FaJava, FaReact, FaNodeJs, FaDatabase, FaNetworkWired } from 'react-icons/fa';
import { SiSpringboot, SiFlask, SiMongodb, SiPostgresql } from 'react-icons/si';

function About() {
  return (
    <div>
      <Navigation />
      <div className="about-container">
        <div className="about-content">
          <p>
            I am a passionate full-stack developer specializing in web and mobile applications.
            My expertise spans technologies like <strong>React, React Native, Node.js, Flask, PostgreSQL, and MongoDB</strong>.
            With a strong foundation in <strong>object-oriented programming (OOP)</strong> using Python and Java,
            I build scalable, efficient, and user-friendly software solutions.
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
              <li><FaNetworkWired title="Networking & Cybersecurity" /> Networking & Cybersecurity</li>
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
