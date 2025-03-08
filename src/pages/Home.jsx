import {useEffect, useState} from 'react'
import Navigation from '../components/Navigation'
import HomeC from '../components/HomeC'
import About from './About'

function Home() {
  return (
    <div>
      <Navigation/>
      <HomeC />
      <About/>

    </div>
  )
}

export default Home