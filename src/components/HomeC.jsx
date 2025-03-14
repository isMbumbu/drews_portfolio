import { useState, useEffect } from 'react';
import './home.css';
import { useLocation, Link } from 'react-router-dom';
import floatingImage from '/home-removebg-preview.png'

function HomeC() {
  const [text, setText] = useState('');
  const fullText = "Hello, My name is AMBUKA. I am a Computer Scientist and a FULL-STACK DEVELOPER.";
  const speed = 80;

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

  useEffect(() => {
    const createSnowflake = () => {
      const snowflake = document.createElement('div');
      snowflake.className = 'snowflake';
      snowflake.innerText = '❆';
      snowflake.style.left = `${Math.random() * 100}vw`;
      snowflake.style.animationDuration = `${3 + Math.random() * 5}s`;
      snowflake.style.opacity = Math.random();
      snowflake.style.fontSize = `${Math.random() * 1.5 + 1}rem`;
      snowflake.style.transform = `rotate(${Math.random() * 360}deg)`;
      document.body.appendChild(snowflake);

      setTimeout(() => {
        snowflake.remove();
      }, 8000);
    };

    const snowInterval = setInterval(createSnowflake, 200);
    return () => clearInterval(snowInterval);
  }, []);

  return (
    <div className='home container-fluid container-sm fade-slide'>
      <div className="intro">
        <h3 className='dynamic-text'>{text}</h3>
        <div className="buttons d-grid gap-2 d-md-flex mx-auto">
        <Link to='/contact'><button className='btn btn-secondary me-md-2 hover-effect'>Hire Me</button></Link>
        <Link to='/portfolio'><button className='btn btn-secondary me-md-2 hover-effect'>My Work</button></Link>
        </div>
      </div>

      <img 
  src={floatingImage} 
  alt='Floating image'
  className='floating-image'
/>

    </div>
  );
}

export default HomeC;
