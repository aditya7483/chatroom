import { combineReducers } from 'redux'
import selectedUserReducer from './selectedUserReducer'
import dataReducer from './dataReducer'

const reducers = combineReducers({
  selectedUser: selectedUserReducer,
  data: dataReducer
})

export default reducers