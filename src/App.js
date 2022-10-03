import io from 'socket.io-client'
import { useEffect } from 'react'
import { Login } from './components/Login';
import { Chatroom } from './components/Chatroom';
import { Navbar } from './components/Navbar';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  // const socket = io('http://127.0.0.1:3001/')

  useEffect(() => {
  }, []);

  return (
    <>
      <BrowserRouter>

        <Navbar />

        <Routes>

          <Route exact path="/login" element={<Login />} />
          <Route exact path="/chatroom" element={<Chatroom />} />
        </Routes>

      </BrowserRouter>
    </>
  );
}

export default App;
