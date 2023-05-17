import { configureStore, combineReducers, getDefaultMiddleware } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import globalReducer from "./reducer/global";
import userReducer from "./reducer/user";
import memoReducer from "./reducer/memo";
import editorReducer from "./reducer/editor";
import shortcutReducer from "./reducer/shortcut";
import filterReducer from "./reducer/filter";
import resourceReducer from "./reducer/resource";
import dialogReducer from "./reducer/dialog";
import tagReducer from "./reducer/tag";
import layoutReducer from "./reducer/layout";
import storage from "redux-persist/lib/storage";

// create reducer
const reducer = combineReducers({
  global: globalReducer,
  user: userReducer,
  memo: memoReducer,
  tag: tagReducer,
  editor: editorReducer,
  shortcut: shortcutReducer,
  filter: filterReducer,
  resource: resourceReducer,
  dialog: dialogReducer,
  layout: layoutReducer,
});

// redux persist
const persistConfig = {
  key: "redux-state",
  storage: storage,
};

const persistReducerConfig = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistReducerConfig,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

export const persistor = persistStore(store);

type AppState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
