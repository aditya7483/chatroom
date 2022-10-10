import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import SendIcon from '@mui/icons-material/Send';
import './Chatroom.css'
import { useNavigate } from 'react-router-dom';
import { Avatar, CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actionCreators } from '../states'

// const link = 'http://127.0.0.1:3001'
const link = 'https://chat74.herokuapp.com'

export const Chatroom = () => {

  const selectedUser = useSelector(state => state.selectedUser)
  const dispatch = useDispatch()
  const { setSelectedUser } = bindActionCreators(actionCreators, dispatch)

  const bottomRef = useRef(null)

  const [mess, setMess] = useState('')
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textLoading, setTextLoading] = useState(false);
  const [userData, setUserData] = useState({});
  // const [selectedUser, setSelectedUser] = useState('');
  const [globalUsers, setGlobalUsers] = useState([]);

  const socket = io(link)
  let authToken = window.localStorage.getItem('auth-token')
  let nav = useNavigate()


  const fetchTexts = async (username) => {
    {
      setTextLoading(true)
      setData([])
      try {
        let res = await fetch(`https://chat74.herokuapp.com/api/chat/getTexts`, {
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
        setTextLoading(false)
        setData(jsonres.data);
        // console.log(jsonres)
      } catch (err) {
        setTextLoading(false)
        console.log(err)
      }
    }
  }

  const fetchUserData = async () => {
    try {
      let res = await fetch(`https://chat74.herokuapp.com/api/auth/getUser`, {
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
      let res = await fetch(`https://chat74.herokuapp.com/api/auth/getGlobalUsers`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'auth-token': authToken
          }
        })
      let data = await res.json();
      setGlobalUsers(data);
    } catch (err) { console.log(err) }
  }

  useEffect(() => {

    if (!authToken || authToken === 'undefined') {
      nav('/')
    }
    else {
      if (selectedUser === '') {
        setLoading(true)
        fetchUserData()
        fetchGlobalUsers()
        setLoading(false)
      }
      else {
        fetchTexts(selectedUser)
      }
    }
  }, [selectedUser]);

  const changeAlert = (obj, val) => {
    let index = globalUsers.findIndex((ele) => { return ele.username === obj.to })
    let newObj = globalUsers;
    newObj[index].messAlert = val;
    setGlobalUsers(newObj);
  }

  socket.on('messageRecieve', (obj) => {
    if (obj.to === userData.username && obj.from === selectedUser) {
      setData(data.concat(obj))
    }
    // changeAlert(obj, true)
  })

  socket.on('messageError', (err) => {
    setError(true)
    console.log(err)
  })

  const handleTextChange = (e) => {
    setMess(e.target.value)
  }

  const handleSend = (e) => {
    e.preventDefault()
    let newData = {
      from: userData.username,
      to: selectedUser,
      message: mess,
      time: Date.now(),
      _id: Math.random().toString()
    }
    setData(data.concat(newData))
    // bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    // var objDiv = document.getElementById("texts-div");
    // objDiv.scrollTop = objDiv.scrollHeight;
    setMess('')
    socket.emit('messageSent', newData)
  }

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}`,
    };
  }

  return (
    <div className="container-fluid mt-3 main-div">
      <div className='d-flex flex-row justify-content-around'>

        {/* profiles container */}
        <div className="col-sm-3 bg-dev" style={{ border: '1px solid' }}>
          <div className="global-user-heading text-center">
            <h5>Global Users</h5>
          </div>
          {loading && <div className="text-center mt-5">
            {<CircularProgress color="success" />}
          </div>}
          <div style={{ overflowY: 'scroll' }}>
            {
              globalUsers.map((ele) => {
                return <div className="profile-container" key={ele._id} onClick={() => { fetchTexts(ele.username) }}>
                  <Avatar {...stringAvatar(`${ele.username}`)} />
                  <p className='mb-0 mx-3'>
                    {ele.username}
                  </p>
                  {/* {ele.messAlert && <span className="badge rounded-pill bg-danger" style={{ marginLeft: 'auto', marginRight: '0.7rem' }}>
                    {" "}
                    <span className="visually-hidden">unread messages</span>
                  </span>} */}
                </div>
              })
            }
          </div>
        </div>

        {/* Texts container */}
        <div className="col texts-container" style={{ border: '1px solid' }}>
          {selectedUser.length !== 0 && <div className="profile-container-top position-sticky">
            <Avatar {...stringAvatar(`${selectedUser}`)} className={'avatar'} />
            <p className='mb-0 mx-3'>
              {selectedUser}
            </p>
          </div>}
          <div className='texts-div d-flex flex-column' ref={bottomRef} style={{ height: '90%' }}>
            {textLoading && <div className="text-center">
              {<CircularProgress color="success" />}
            </div>}
            {selectedUser.length === 0 &&
              <div className="text-center m-auto">
                <h5>WELCOME</h5>
                <p style={{ color: 'dimgray' }}>Please select a user to connect with them</p>
              </div>
            }
            {data.map(ele => {
              return <div key={ele._id} className={ele.from === userData.username ? "sent align-self-end textbox" : 'recieved align-self-start textbox'}>
                <p className='mb-0'>
                  {ele.message}
                </p>
              </div>
            })
            }
          </div>

          {
            selectedUser.length !== 0 &&
            <div className="position-relative send-div">
              <form onSubmit={handleSend}>
                <input type="text" className="form-control chat-input" placeholder="Send Message" value={mess} onChange={handleTextChange} />
              </form>
              <div className="sendIcon" onClick={handleSend}>
                <SendIcon color={mess.length > 0 ? "primary" : "disabled"} />
              </div>
            </div>

          }
        </div>
      </div>
    </div>
  )
}
