export const setSelectedUser = (userData) => {
  return (dispatch) => {
    dispatch({
      type: 'updateUser',
      payload: userData
    })
  }
}
export const setUserData = (userData) => {
  return (dispatch) => {
    dispatch({
      type: 'setUser',
      payload: userData
    })
  }
}
export const setData = (mess) => {
  return (dispatch) => {
    dispatch({
      type: 'updateData',
      payload: mess
    })
  }
}
export const setTextLoading = (val) => {
  return (dispatch) => {
    dispatch({
      type: 'setTextLoading',
      payload: val
    })
  }
}

export const getGlobalUsers = (url, authToken) => {
  return async (dispatch) => {

    dispatch(getDataBegin())
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          'Content-Type': "application/json",
          "auth-token": authToken
        }
      })
      const data = await res.json()
      dispatch(getDataSuccess(data))
    } catch (err) {
      dispatch(getDataFailure(err))
    }
  }
}

export const getDataBegin = () => {
  return (dispatch) => {
    dispatch({
      type: 'begin'
    })
  }
}
export const getDataSuccess = (data) => {
  return (dispatch) => {
    dispatch({
      type: 'success',
      payload: data
    })
  }
}
export const getDataFailure = (err) => {
  return (dispatch) => {
    dispatch({
      type: 'error',
      payload: err
    })
  }
}