import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Login from './pages/login/Login'
import Home from './pages/home/Home'
import './App.css'
import SignUp from './pages/signup/Signup'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useAuthContext } from './context/AuthContext'
import Landing from './pages/landing/Landing'

function App() {
  const {authUser} = useAuthContext();

  return (
      <div className='p-4 h-screen flex items-center justify-center'>
        {/* <Login/> */}
        <Routes>
          <Route path = "/" element = {authUser ?<Home/> : <Navigate to="/landing"/>}/>
          <Route path = "/landing" element = {<Landing/>}/>
          <Route path = "/login" element = {authUser ? <Navigate to="/"/>:<Login/>}/>
          <Route path = "/signup" element = {authUser ? <Navigate to="/"/> : <SignUp/> }/>
        </Routes>
        <ToastContainer/>
        
      </div>
  )
}

export default App
