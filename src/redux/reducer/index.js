import { combineReducers } from "redux";

import { AuthReducer } from "./AuthReducer";
import {UserGroupReducer} from "./UserGroupReducer";
import {UserReducer} from "./UserReducer";

export const rootReducer = combineReducers({
    AuthReducer:AuthReducer,
    UserGroupReducer: UserGroupReducer,
    UserReducer: UserReducer
})
