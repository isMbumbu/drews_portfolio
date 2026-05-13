import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../components/home.css';
import floatingImage from '/home-removebg-preview.png';

function HomeC() {
  const [text, setText] = useState('');
  const fullText = "Full Stack Software Engineer turning ideas into scalable apps, APIs, and business systems — powered by Python, React, cloud-native tools, and a growing obsession with system design, AI, and building things that actually make people’s work easier.";
  const speed = 40; // Faster speed for a snappier, premium feel

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="ambuka-hero">
      {/* Background Decorative Watermark */}
      <div className="hero-watermark">ENGINEER</div>

      <div className="hero-container">
        <div className="hero-left">
          {/* Top Metadata Row */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-meta"
          >
            <span>NAIROBI, KENYA</span>
            <span className="hero-meta-dash"></span>
            <span>{new Date().getFullYear()} PORTFOLIO</span>
          </motion.div>

          {/* Typing Hero Text */}
          <div className="hero-title-wrap">
             <h1 className="hero-title">
               Andrew <em>Ambuka</em>
             </h1>
             <p className="hero-dynamic-text">
               {text}<span className="cursor-blink">|</span>
             </p>
          </div>

          <div className="hero-cta-group">
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-primary">
              VIEW RESUME
            </a>
            <Link to="/portfolio" className="btn-secondary">
              MY WORK
            </Link>
          </div>
        </div>

        <div className="hero-right">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="hero-image-wrapper"
          >
            <img src={floatingImage} alt='Andrew Ambuka' className='hero-image' />
            <div className="hero-image-overlay"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HomeC;