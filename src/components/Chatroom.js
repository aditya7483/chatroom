import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import SendIcon from '@mui/icons-material/Send';
import './Chatroom.css'
import { useNavigate } from 'react-router-dom';

const link = 'http://127.0.0.1:3001'

export const Chatroom = () => {

  const [mess, setMess] = useState('')
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [selectedUser, setSelectedUser] = useState({});
  const [globalUsers, setGlobalUsers] = useState([]);

  const socket = io(link)
  let authToken = window.localStorage.getItem('auth-token')
  let nav = useNavigate()


  const fetchTexts = async (username) => {
    {
      try {
        let res = await fetch(`${link}/api/chat/getTexts`, {
          method: 'POST',
          headers: {
            'Content-Type': "application/json",
            'auth-token': authToken
          },
          body: JSON.stringify({
            from: userData.username,
            to: username
          })
        })
        let jsonres = await res.json();
        setSelectedUser(username)
        setData(jsonres.data);
        console.log(jsonres)
      } catch (err) {
        console.log(err)
      }
    }
  }

  const fetchUserData = async () => {
    try {
      let res = await fetch(`${link}/api/auth/getUser`, {
        method: 'GET',
        headers: {
          'Content-Type': "application/json",
          'auth-token': authToken
        }
      })
      let data = await res.json();
      setUserData(data);
    } catch (err) {
      console.log(err)
    }
  }
  const fetchGlobalUsers = async () => {
    try {
      let res = await fetch(`${link}/api/auth/getGlobalUsers`)
      let data = await res.json();
      setGlobalUsers(data);
    } catch (err) { console.log(err) }
  }

  useEffect(() => {

    if (!authToken || authToken === 'undefined') {
      nav('/')
    }
    else {
      setLoading(true)
      fetchUserData()
      fetchGlobalUsers()
      setLoading(false)
    }
  }, []);

  socket.on('messageError', (err) => {
    setError(true)
  })

  const handleTextChange = (e) => {
    setMess(e.target.value)
  }

  const handleSend = (e) => {
    e.preventDefault()
    let newData = {
      from: userData.username,
      to: selectedUser.username,
      message: mess,
      time: Date.now(),
      _id: Math.random().toString()
    }
    setData(data.concat(newData))
    setMess('')
    socket.emit('messageSent', newData)
  }

  return (
    <div className="container-fluid">
      <div className='d-flex flex-row justify-content-around'>

        {/* profiles container */}
        <div className="col-sm-3 " style={{ border: '1px solid' }}>
          {
            globalUsers.map((ele) => {
              return <div className="profile-container" key={ele._id} onClick={() => { fetchTexts(ele.username) }}>
                {ele.username}
              </div>
            })
          }
        </div>

        {/* Texts container */}
        <div className="col texts-container" style={{ border: '1px solid' }}>

          <div className='texts-div d-flex flex-column' style={{ border: '1px solid', height: '90%' }}>
            {data.map(ele => {
              return <div key={ele._id} className={ele.from === userData.username ? "sent align-self-end textbox" : 'recieved align-self-start textbox'}>
                <p className='mb-0'>
                  {ele.message}
                </p>
              </div>
            })
            }
          </div>

          <div>
            <div className="position-relative">
              <form onSubmit={handleSend}>
                <input type="text" className="form-control chat-input" placeholder="Send Message" value={mess} onChange={handleTextChange} />
              </form>
              <div className="sendIcon" onClick={handleSend}>
                <SendIcon color={mess.length > 0 ? "primary" : "disabled"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
