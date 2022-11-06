import { AppBar, Avatar, Backdrop, Box, CircularProgress, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu'
import { UserList } from './UserList';
import './Navbar.css'
import { useSelector } from 'react-redux'

export const Navbar = () => {
  const userData = useSelector(state => state.userData)

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

            <div className='sm-dev'>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => {
                  setDrawer(drawer ? false : true)
                }}
              >

                <MenuIcon />
              </IconButton>
            </div>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className='nav-heading'>
              CHATROOM
            </Typography>

            {userData.username &&
              <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleMenu}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
                  >
                    <Avatar sx={{ width: 32, height: 32 }}>{`${userData.username}`.charAt(0)}</Avatar>
                  </IconButton>
                </Tooltip>
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
                  <MenuItem>
                    <Avatar sx={{ width: 24, height: 24, mr: 1 }} /> {userData.username}
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ width: 24, height: 24, mr: 1 }} /> Logout
                  </MenuItem>
                </Menu>
              </Box>}
          </Toolbar>
        </AppBar>
      </Box>
      <UserList drawerStatus={drawer} />
    </div >
  )
}
