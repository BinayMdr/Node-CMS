// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import userDetails from './userDetails';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu,userDetails });

export default reducers;
