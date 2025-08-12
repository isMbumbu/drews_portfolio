import React from 'react'
import Navigation from '../components/Navigation'
import '../components/portfolio.css'
import gitImg from '/git.png'


function Portfolio() {
  return (
    <div>
      <Navigation />
      <h1 className="heading">My Projects</h1>
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
          <div className="portfolio-buttons">
            <a href="https://gyyym.netlify.app/" target="_blank" rel="noopener noreferrer" className="custom-btn portfolio-btn">Live Demo</a>
            <a href="https://github.com/isMbumbu/simple-gymbuddy" target="_blank" rel="noopener noreferrer" className="custom-btn portfolio-btn">GitHub</a>
          </div>
        </div>
        <div className="portfolio-item">
          <a href="https://agrimmerce-1.onrender.com/" target="_blank" rel="noopener noreferrer">
            <img 
              src="agrimmerce.png" 
              alt="Agrimmerce Website Preview"
              className="portfolio-image"
            />
          </a>
          <h3>Agrimmerce</h3>
          <p>A Software as a Solution for local farmers to be able to post their available products online</p>
          <div className="portfolio-buttons">
            <a href="https://agrimmerce-1.onrender.com/" target="_blank" rel="noopener noreferrer" className="custom-btn portfolio-btn">Live Demo</a>
            <a href="https://github.com/isMbumbu/agrimmerce" target="_blank" rel="noopener noreferrer" className="custom-btn portfolio-btn">GitHub</a>
          </div>
        </div>
        <div className="portfolio-item">
          <a href="https://github.com/CorneliusKibetDC/Mini-Techs-Battleship-Group7" target="_blank" rel="noopener noreferrer">
            <img 
              src="battle.png" 
              alt="BattleShip CLI preview"
              className="portfolio-image"
            />
          </a>
          <h3>Battleship Game</h3>
          <p>A Software game which is played on the Command Line Interface (CLI) and provides a simple yet engaging gameplay experience.</p>
          <div className="portfolio-buttons">
            <a href="https://github.com/CorneliusKibetDC/Mini-Techs-Battleship-Group7" target="_blank" rel="noopener noreferrer" className="custom-btn portfolio-btn">GitHub</a>
          </div>
        </div>
        
        <div className="portfolio-item">
          <a href="https://anylawfirm.netlify.app/" target="_blank" rel="noopener noreferrer">
            <img 
              src="advocates.png" 
              alt="Any Advocates preview"
              className="portfolio-image"
            />
          </a>
          <h3>Case Managenent For Law Firms</h3>
          <p>A Software enabling Empowering lawyers and clients with seamless communication and efficient case management.</p>
          <div className="portfolio-buttons">
            <a href="https://anylawfirm.netlify.app/" target="_blank" rel="noopener noreferrer" className="custom-btn portfolio-btn">Live Demo</a>
            <a href="https://github.com/isMbumbu/newfirm-backend" target="_blank" rel="noopener noreferrer" className="custom-btn portfolio-btn">GitHub</a>
          </div>
        </div>
          
{/*         <div className="portfolio-item">
          <a href="https://anylawfirm.netlify.app" target="_blank" rel="noopener noreferrer">
            <img 
              src="image.png" 
              alt="LawFirm Website Preview"
              className="portfolio-image"
            />
          </a>
          <h3>Law Connect</h3>
          <p>A law firm website for managing cases, documents, and client information.</p>
        </div> */}

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
          <div className="portfolio-buttons">
            <a href="https://github.com/isMbumbu" target="_blank" rel="noopener noreferrer" className="custom-btn portfolio-btn">GitHub</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Portfolio
