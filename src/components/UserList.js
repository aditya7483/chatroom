import { Avatar } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actionCreators } from '../states'
import './UserList.css'

export const UserList = ({ drawerStatus }) => {

  const link = 'http://localhost:3001'
  let authToken = window.localStorage.getItem('auth-token')
  const [drawer, setDrawer] = useState(false);

  const globalUsers = useSelector(state => state.globalUsers)
  const dispatch = useDispatch()
  const { setSelectedUser, getGlobalUsers } = bindActionCreators(actionCreators, dispatch)

  useEffect(() => {
    if (globalUsers.length === 0) { getGlobalUsers(`https://chat74.herokuapp.com/api/auth/getGlobalUsers`, authToken) }
    else {
      setDrawer(drawerStatus)
    }
  }, [drawerStatus]);

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
    <>
      <div className="col-sm-3 users-open" style={{ border: '1px solid', left: `${drawer ? '0' : '-120%'}` }}>
        <div className="global-user-heading text-center">
          <h5>Global Users</h5>
        </div>
        <div style={{ overflowY: 'scroll' }}>
          {
            globalUsers.map((ele) => {
              return <div className="profile-container-nav" key={ele._id} onClick={() => {
                setSelectedUser(ele.username)
                setDrawer(false)
              }}>
                <Avatar {...stringAvatar(`${ele.username}`)} />
                <p className='mb-0 mx-3'>
                  {ele.username}
                </p>
              </div>
            })
          }
        </div>
      </div>
    </>
  )
}
