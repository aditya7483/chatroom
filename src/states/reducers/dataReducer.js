let initialState = {
  loading: false,
  data: [{}],
  error: null
}


const reducer = (state = initialState, action) => {
  if (action.type === 'begin') {
    return {
      loading: true,
      error: null
    }
  }

  else if (action.type === 'success') {
    return {
      loading: false,
      error: null,
      data: action.payload
    }
  }

  else if (action.type === 'failure') {
    return {
      loading: false,
      error: action.payload,
      data: state.data
    }
  }

  else {
    return state
  }
}

export default reducer