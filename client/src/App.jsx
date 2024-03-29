import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Card from './components/Card'
import Login from './components/Login'
import LandingPage from './compound components/LandingPage'
import Saved from './components/Saved'
import Browse from './components/Browse'
import Post from './components/Post'
import View from './components/View'
import { Route, Routes } from 'react-router-dom'

function App() {

  console.log(import.meta.env);
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route exact path="/auth" element={<Login />} />
        <Route exact path="/" element={<LandingPage />} />
        <Route exact path="/saved" element={<Saved />} />
        <Route exact path="/browse" element={<Browse />} />
        <Route exact path="/post" element={<Post />} />
        <Route exact path="/view" element={<View />} />
      </Routes> 
  </div>
  )
} 

export default App

