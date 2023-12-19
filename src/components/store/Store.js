import { createStore, combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const userSection = (
  oldData = {
    cu: {},
  },
  newData
) => {
  if (newData.type === "LOGIN_USER") {
    oldData.cu = newData.payload;
  } else if (newData.type === "LOGOUT_USER") {
    oldData.cu = {};
    localStorage.removeItem("userToken");
  }
  return { ...oldData };
};


const Comment = (
  oldData = {
    comment: [],
  },
  newData
) => {
  if (newData.type === "ADD_COMMENT") {
    oldData.comment = newData.payload;
  }
  return { ...oldData, comment: Array.isArray(oldData.comment) ? oldData.comment : [] };
};

const persistConfig = {
  key: "Product",
  storage,
};

const allSections = combineReducers({ userSection, Comment });
const persistedReducer = persistReducer(persistConfig, allSections);
const meraStore = createStore(
  persistedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export const persistor = persistStore(meraStore);
export default meraStore;
