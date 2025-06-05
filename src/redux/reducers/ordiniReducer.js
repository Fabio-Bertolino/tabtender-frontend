import {
  IS_LOADING_OFF,
  IS_LOADING_ON,
  GET_ORDINI,
  GET_ORDINE_BY_ID,
  SET_ORDINE_CORRENTE,
  ADD_PRODOTTO_TO_ORDINE,
  UPDATE_QUANTITA_PRODOTTO,
  CLEAR_ORDINE_CORRENTE,
  ORDINE_SUBMIT_SUCCESS,
  ORDINE_SUBMIT_FAILURE,
} from "../actions";

const initialState = {
  ordini: [],
  ordineCorrente: {
    // id: null,
    tavoloId: null,
    prodotti: [], // [{ prodotto: {...}, quantita: n }]
  },
  ordineSelezionato: null,
  isLoading: false,
  error: null,
};

const ordiniReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ORDINI:
      return {
        ...state,
        ordini: action.payload,
      };

    case GET_ORDINE_BY_ID:
      return {
        ...state,
        ordineSelezionato: action.payload,
      };

    case SET_ORDINE_CORRENTE:
      return {
        ...state,
        ordineCorrente: {
          // id: action.payload.id || null,
          tavoloId: action.payload.tavoloId,
          prodotti: action.payload.prodotti || [],
        },
      };

    case ADD_PRODOTTO_TO_ORDINE: {
      const prodottoEsistente = state.ordineCorrente.prodotti.find((p) => p.prodotto.id === action.payload.id);

      let nuoviProdotti;

      if (prodottoEsistente) {
        nuoviProdotti = state.ordineCorrente.prodotti.map((p) =>
          p.prodotto.id === action.payload.id ? { ...p, quantita: p.quantita + 1 } : p
        );
      } else {
        nuoviProdotti = [...state.ordineCorrente.prodotti, { prodotto: action.payload, quantita: 1 }];
      }

      return {
        ...state,
        ordineCorrente: {
          ...state.ordineCorrente,
          prodotti: nuoviProdotti,
        },
      };
    }

    case UPDATE_QUANTITA_PRODOTTO:
      return {
        ...state,
        ordineCorrente: {
          ...state.ordineCorrente,
          prodotti: state.ordineCorrente.prodotti
            .map((p) => (p.prodotto.id === action.payload.id ? { ...p, quantita: action.payload.quantita } : p))
            .filter((p) => p.quantita > 0),
        },
      };

    case CLEAR_ORDINE_CORRENTE:
      return {
        ...state,
        ordineCorrente: {
          // id: null,
          tavoloId: null,
          prodotti: [],
        },
      };

    case ORDINE_SUBMIT_SUCCESS:
      return {
        ...state,
        ordineCorrente: {
          // id: action.payload.id,
          tavoloId: action.payload.tavoloId,
          prodotti: action.payload.prodotti,
        },
        error: null,
      };

    case ORDINE_SUBMIT_FAILURE:
      return {
        ...state,
        error: action.payload,
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

export default ordiniReducer;
