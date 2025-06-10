import { SET_USERNAME, SET_PASSWORD, IS_LOGIN, IS_NOT_LOGIN, SET_TOKEN, LOGOUT } from "../actions";

const initialState = {
  username: localStorage.getItem("username") || "",
  password: "",
  token: localStorage.getItem("token") || "",
  isLogin: true,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USERNAME:
      return { ...state, username: action.payload };
    case SET_PASSWORD:
      return { ...state, password: action.payload };
    case IS_LOGIN:
      return { ...state, isLogin: true };
    case IS_NOT_LOGIN:
      return { ...state, isLogin: false };
    case SET_TOKEN:
      return { ...state, token: action.payload };
    case LOGOUT:
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      return { ...state, token: "", username: null, password: null };
    default:
      return state;
  }
};

export default authReducer;
