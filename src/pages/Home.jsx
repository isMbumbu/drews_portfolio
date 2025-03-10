import { useEffect, useState } from 'react'
import Navigation from '../components/Navigation'
import HomeC from '../components/HomeC'
import About from './About'
import Portfolio from './Portfolio'
import Services from './Services'
import Footer from '../components/Footer'
import '../App.css'

function Home() {
  return (
    <div className='biggy'>
      <Navigation />
      <HomeC />
      <About style={{ marginTop: '-50px' }} /> {/* Adjusted negative margin */}

      <Services />
      
      <Portfolio />
      <Footer />
    </div>
  )
}

export default Home
