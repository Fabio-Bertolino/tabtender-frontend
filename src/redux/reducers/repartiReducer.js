import { IS_LOADING_OFF, IS_LOADING_ON, GET_REPARTI, GET_REPARTO_BY_ID } from "../actions";

const initialState = {
  reparti: [],
  repartoSelezionato: null,
  isLoading: false,
};

const repartiReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REPARTI:
      return {
        ...state,
        reparti: action.payload,
      };
    case GET_REPARTO_BY_ID:
      return {
        ...state,
        repartoSelezionato: action.payload,
      };
    case IS_LOADING_ON:
      return {
        ...state,
        isLoading: true,
      };
    case IS_LOADING_OFF:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default repartiReducer;
