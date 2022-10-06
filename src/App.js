import { useEffect } from 'react'
import { Login } from './components/Login';
import { Chatroom } from './components/Chatroom';
import { Navbar } from './components/Navbar';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

function App() {

  let nav = useNavigate()

  useEffect(() => {
    let authToken = window.localStorage.getItem('auth-token')
    if (authToken && authToken !== 'undefined') {
      nav('/chat')
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
