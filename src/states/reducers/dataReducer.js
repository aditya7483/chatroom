
const reducer = (state = [], action) => {
  if (action.type === 'updateData') {
    return action.payload
  }

  else {
    return state
  }
}

export default reducer