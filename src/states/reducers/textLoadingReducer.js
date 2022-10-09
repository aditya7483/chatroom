const reducer = (state = false, action) => {
  if (action.type === 'setTextLoading') {
    return action.payload
  }

  else {
    return state
  }
}

export default reducer