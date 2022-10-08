const reducer = (state = '', action) => {
  if (action.type === 'updateUser') {
    return action.payload
  }

  else {
    return state
  }
}

export default reducer