import { combineReducers } from 'redux'
import selectedUserReducer from './selectedUserReducer'
import dataReducer from './dataReducer'
import textLoadingReducer from './textLoadingReducer'
import globalUserReducer from './globalUserReducer'


const reducers = combineReducers({
  selectedUser: selectedUserReducer,
  data: dataReducer,
  textLoading: textLoadingReducer,
  globalUsers: globalUserReducer
})

export default reducers