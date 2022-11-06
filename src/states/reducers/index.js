import { combineReducers } from 'redux'
import selectedUserReducer from './selectedUserReducer'
import dataReducer from './dataReducer'
import textLoadingReducer from './textLoadingReducer'
import globalUserReducer from './globalUserReducer'
import userDataReducer from './userDataReducer'

const reducers = combineReducers({
  selectedUser: selectedUserReducer,
  data: dataReducer,
  textLoading: textLoadingReducer,
  globalUsers: globalUserReducer,
  userData: userDataReducer
})

export default reducers