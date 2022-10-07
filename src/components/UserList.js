import { SwipeableDrawer } from '@mui/material'
import React from 'react'

export const UserList = () => {
  return (
    <>
      <SwipeableDrawer
        anchor={anchor}
        open={state[anchor]}
        onClose={toggleDrawer(anchor, false)}
        onOpen={toggleDrawer(anchor, true)}
      >

      </SwipeableDrawer>
    </>
  )
}
