import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunk from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension'
import { rootReducer } from '../reducer'
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"

const persistConfig = {
    key: "root",
    storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const loggerMiddleware = createLogger();
export const store = createStore(persistedReducer,
    composeWithDevTools(applyMiddleware(
        loggerMiddleware,
        thunk
    ))
)


export const persistor = persistStore(store)

