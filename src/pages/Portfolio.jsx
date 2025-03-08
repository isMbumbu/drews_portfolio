import React from 'react'
import Navigation from '../components/Navigation'
import '../components/portfolio.css'
import gitImg from '/git.png'


function Portfolio() {
  return (
    <div>
      <Navigation />
      <div className="portfolio-container">
        <div className="portfolio-item">
          <a href="https://gyyym.netlify.app/" target="_blank" rel="noopener noreferrer">
            <img 
              src="Gym.png" 
              alt="GymBuddy Website Preview"
              className="portfolio-image"
            />
          </a>
          <h3>Gym Buddy</h3>
          <p>Helps gym owners, trainers, and members manage fitness routines and schedules.</p>
        </div>
          
        <div className="portfolio-item">
          <a href="https://anylawfirm.netlify.app" target="_blank" rel="noopener noreferrer">
            <img 
              src="image.png" 
              alt="LawFirm Website Preview"
              className="portfolio-image"
            />
          </a>
          <h3>Law Connect</h3>
          <p>A law firm website for managing cases, documents, and client information.</p>
        </div>

        <div className="portfolio-item">
          <a href="https://github.com/isMbumbu" target="_blank" rel="noopener noreferrer">
            <img 
              src={gitImg} 
              alt="GitHub Profile"
              className="portfolio-image"
            />
          </a>
          <h3>My GitHub Profile</h3>
          <p>Check out my projects and contributions on GitHub.</p>
        </div>
      </div>
    </div>
  )
}

export default Portfolio
