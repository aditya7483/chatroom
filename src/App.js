import { useEffect } from 'react'
import { Login } from './components/Login';
import { Chatroom } from './components/Chatroom';
import { Navbar } from './components/Navbar';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <BrowserRouter>

        <Navbar />

        <Routes>

          <Route exact path="/" element={<Login />} />
          <Route exact path="/chat" element={<Chatroom />} />
        </Routes>

      </BrowserRouter>
    </>
  );
}

export default App;
