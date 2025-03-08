import { useState } from 'react'
import Home from './pages/Home'
import Blog from './pages/Blog'
import About from './pages/About'
import Contact from './pages/Contact'
import Portfolio from './pages/Portfolio'
import Services from './pages/Services'
import Post from './pages/Post'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {

  return (
     <BrowserRouter>
        <Routes>
          <Route path= '/' element={<Home/>}/>
          <Route path='/blog' element={<Blog/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/portfolio' element={<Portfolio/>}/>
          <Route path='/services' element={<Services/>}/>
          <Route path='/post' element={<Post/>} />
  
        </Routes>
     </BrowserRouter>
     
  )
}

export default App
