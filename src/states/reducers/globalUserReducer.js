
const reducer = (state = [], action) => {
  if (action.type === 'begin') {
    return state
  }

  else if (action.type === 'success') {
    return action.payload
  }

  else if (action.type === 'failure') {
    return state
  }

  else {
    return state
  }
}

export default reducer