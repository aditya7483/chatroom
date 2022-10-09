import { AppBar, Avatar, Backdrop, Box, CircularProgress, IconButton, Menu, MenuItem, SwipeableDrawer, Toolbar, Typography } from '@mui/material'
import React, { useState } from 'react'
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu'
import { UserList } from './UserList';
import './Navbar.css'


export const Navbar = () => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [backdrop, setBackdrop] = useState(false);
  const [drawer, setDrawer] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setBackdrop(true)
    window.localStorage.removeItem('auth-token')
    window.location.reload()
  }

  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>

            <div className='sm-dev' onClick={() => {
              setDrawer(drawer ? false : true)
            }}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >

                <MenuIcon />
              </IconButton>
            </div>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              CHATROOM
            </Typography>
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
      <UserList drawerStatus={drawer} />
    </div >
  )
}
