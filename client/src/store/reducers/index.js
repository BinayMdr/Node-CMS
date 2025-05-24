// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import userDetails from './userDetails';
import globalSetting from './globalSetting';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu,userDetails,globalSetting });

export default reducers;
