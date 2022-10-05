import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import SendIcon from '@mui/icons-material/Send';
import { FormControl, TextField } from '@mui/material';
import './Chatroom.css'

const link = 'http://127.0.0.1:3001/'

export const Chatroom = () => {

  const [mess, setMess] = useState('')
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [selectedUser, setSelectedUser] = useState({});

  const socket = io(link)

  const fetchData = async () => {
    {
      let res = await fetch(`${link}/api/texts/getTexts`)
      let jsonres = await res.json();
      setData(jsonres.data);
    }
  }

  useEffect(() => {
    setLoading(true)
    fetch(`${link}/api/user/getUser`, {
      method: 'GET',
      body: {
        'Content-Type': "application/json",

      }
    })
    setLoading(false)
  }, []);

  socket.on('messageError', (err) => {
    setError(true)
  })

  const handleTextChange = (e) => {
    setMess(e.target.value)
  }

  const handleSend = () => {
    let newData = {
      from: 'todo',
      to: 'todo',
      message: mess,
      time: Date.now()
    }
    setData(data.concat(newData))
    socket.emit('messageSent', newData)
  }

  return (
    <div className="container-fluid">
      <div className='d-flex flex-row justify-content-around'>
        <div className="col-sm-3 " style={{ border: '1px solid' }}>

        </div>
        <div className="col texts-container" style={{ border: '1px solid' }}>

          <div className='texts-div d-flex flex-column' style={{ border: '1px solid', height: '90%' }}>
            <div className="recieved textbox">
              <p className='mb-0'>
                Lorem ipsum dolor, sit amet consectetur Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam quia incidunt consectetur voluptas natus. adipisicing elit. Aut et quod nemo mollitia suscipit cupiditate animi accusamus.
              </p>
            </div>
            <div className="sent align-self-end textbox">
              <p className='mb-0'>
                Lorem ipsum dolor, sit amet consectetur Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam quia incidunt consectetur voluptas natus. adipisicing elit. Aut et quod nemo mollitia suscipit cupiditate animi accusamus.
              </p>
            </div>
            <div className="sent align-self-end textbox">
              <p className='mb-0'>
                Lorem ipsum dolor, sit amet consectetur Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam quia incidunt consectetur voluptas natus. adipisicing elit. Aut et quod nemo mollitia suscipit cupiditate animi accusamus.
              </p>
            </div>
            <div className="sent align-self-end textbox">
              <p className='mb-0'>
                Lorem ipsum dolor, sit amet consectetur Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam quia incidunt consectetur voluptas natus. adipisicing elit. Aut et quod nemo mollitia suscipit cupiditate animi accusamus.
              </p>
            </div>
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
