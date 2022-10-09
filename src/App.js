import { useEffect } from 'react'
import { Login } from './components/Login';
import { Chatroom } from './components/Chatroom';
import { Navbar } from './components/Navbar';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

function App() {

  let nav = useNavigate()
  const link = 'http://localhost:3001'

  useEffect(() => {
    let authToken = window.localStorage.getItem('auth-token')
    if (authToken && authToken !== 'undefined') {
      fetch(`https://chat74.herokuapp.com/api/auth/getUser`, {
        method: 'GET',
        headers: {
          'Content-Type': "application/json",
          'auth-token': authToken
        }
      }).then(res => {
        return res.json()
      })
        .then(data => {
          console.log(data)
          nav('/chat')
        })
        .catch(err => {
          window.localStorage.removeItem('auth-token')
          window.location.reload()
          window.alert('Session Expired !! Please login again')
        })
    }
  }, []);

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chatroom />} />
      </Routes>
    </>
  );
}

export default App;
