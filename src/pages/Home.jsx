import {useEffect, useState} from 'react'
import Navigation from '../components/Navigation'
import HomeC from '../components/HomeC'
import About from './About'
import Portfolio from './Portfolio'

function Home() {
  return (
    <div>
      <Navigation/>
      <HomeC />
      <About/>
      <Portfolio/>

    </div>
  )
}

export default Home