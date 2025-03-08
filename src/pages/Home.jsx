import {useEffect, useState} from 'react'
import Navigation from '../components/Navigation'
import HomeC from '../components/HomeC'
import About from './About'
import Portfolio from './Portfolio'
import Services from './Services'
import Footer from '../components/Footer'

function Home() {
  return (
    <div>
      <Navigation/>
      <HomeC />
      <About/>
      <Services/>
      <h1>My Projects</h1> 
      <Portfolio/>
      <Footer />

    </div>
  )
}

export default Home