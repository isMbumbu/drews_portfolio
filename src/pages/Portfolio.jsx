import React from 'react'
import Navigation from '../components/Navigation'
import '../components/portfolio.css'

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
          </div>
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
          </div>
          <h3>Law Connect</h3>
          <p>A law firm website for managing cases, documents, and client information.</p>
        </div>
  )
}

export default Portfolio
