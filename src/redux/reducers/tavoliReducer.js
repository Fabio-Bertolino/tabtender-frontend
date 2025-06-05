import { IS_LOADING_OFF, IS_LOADING_ON, GET_TAVOLI, GET_TAVOLO_BY_ID } from "../actions";

const initialState = {
  tavoli: [],
  tavoloSelezionato: null,
  isLoading: false,
};

const tavoliReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TAVOLI:
      return {
        ...state,
        tavoli: action.payload,
      };
    case GET_TAVOLO_BY_ID:
      return {
        ...state,
        tavoloSelezionato: action.payload,
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

export default tavoliReducer;
