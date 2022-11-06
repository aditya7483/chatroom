const reducer = (state = {}, action) => {
  if (action.type === 'setUser') {
    return action.payload
  }

  else {
    return state
  }
}

export default reducer