import React, { useEffect, useState } from 'react'
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


  const [mess, setMess] = useState('')
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textLoading, setTextLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [globalUsers, setGlobalUsers] = useState([]);

  const socket = io(link)
  let authToken = window.localStorage.getItem('auth-token')
  let nav = useNavigate()


  const fetchTexts = (username) => {
    {
      console.log('fetchTexts called')
      setTextLoading(true)

      fetch(`https://chat74.herokuapp.com/api/chat/getTexts`, {
        method: 'POST',
        headers: {
          'Content-Type': "application/json",
          'auth-token': authToken
        },
        body: JSON.stringify({
          from: userData.username,
          to: username
        })
      }).then(res => { return res.json() })
        .then(jsonres => {
          setTextLoading(false)
          setData(jsonres.data);
        })
        .catch((err) => {
          setTextLoading(false)
          console.log(err)
        })

    }
  }

  const fetchUserData = () => {

    fetch(`https://chat74.herokuapp.com/api/auth/getUser`, {
      method: 'GET',
      headers: {
        'Content-Type': "application/json",
        'auth-token': authToken
      }
    }).then(res => { return res.json() }).then(data => { setUserData(data); })
      .catch((err) => {
        console.log(err)
      })
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
      setLoading(false)
      setGlobalUsers(data);
    } catch (err) { console.log(err) }
  }

  useEffect(() => {

    if (!authToken || authToken === 'undefined') {
      nav('/login')
    }
    else if (selectedUser.length === 0) {
      setLoading(true)
      fetchUserData()
      fetchGlobalUsers()
    }
  }, []);

  useEffect(() => {
    if (selectedUser.length > 0) {
      fetchTexts(selectedUser)
    }
  }, [selectedUser])

  const handleUserClick = (username) => {
    // setData([])
    fetchTexts(username)
    setSelectedUser(username)
    var objDiv = document.getElementById("texts-div");
    objDiv.scrollTop = objDiv.scrollHeight;
    // let obj = { to: username }
    // changeAlert(obj, false)
  }

  // const changeAlert = (obj, val) => {
  //   let index = globalUsers.findIndex((ele) => { return ele.username === obj.to })
  //   let newObj = globalUsers;
  //   newObj[index].messAlert = val;
  //   setGlobalUsers(newObj);
  // }

  socket.on('messageRecieve', (obj) => {
    if (obj.to === userData.username && obj.from === selectedUser) {
      setData(data.concat(obj))
    }
    // else if (obj.to === userData.username && obj.from !== selectedUser) {
    //   changeAlert(obj, true)
    // }
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
    var objDiv = document.getElementById("texts-div");
    objDiv.scrollTop = objDiv.scrollHeight;
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
                return <div className="profile-container" key={ele._id} onClick={() => { handleUserClick(ele.username) }}>
                  <Avatar {...stringAvatar(`${ele.username}`)} />
                  <p className='mb-0 mx-3'>
                    {ele.username}
                  </p>
                  {ele.messAlert && <span className=" p-2 bg-success border border-light rounded-circle" style={{ marginLeft: 'auto', marginRight: '0.7rem' }}>
                    {" "}
                    <span className="visually-hidden">New alerts</span>
                  </span>}
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
          <div id='texts-div' className='texts-div d-flex flex-column'>
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
      <button onClick={() => { console.log(data) }}>click</button>
    </div>
  )
}
