import { createAsyncThunk } from "@reduxjs/toolkit";
import { Navigate } from "react-router-dom";

export const IS_LOADING_ON = "IS_LOADING_ON";
export const IS_LOADING_OFF = "IS_LOADING_OFF";

export const SET_USERNAME = "SET_USERNAME";
export const SET_PASSWORD = "SET_PASSWORD";
export const SET_TOKEN = "SET_TOKEN";
export const IS_LOGIN = "IS_LOGIN";
export const IS_NOT_LOGIN = "IS_NOT_LOGIN";
export const LOGOUT = "LOGOUT";
export const GET_USER = "GET_USER";

export const GET_TAVOLI = "GET_TAVOLI";
export const GET_TAVOLO_BY_ID = "GET_TAVOLO_BY_ID";

export const GET_REPARTI = "GET_REPARTI";
export const GET_REPARTO_BY_ID = "GET_REPARTI_BY_ID";

export const GET_ORDINI = "GET_ORDINI";
export const GET_ORDINE_BY_ID = "GET_ORDINE_BY_ID";
export const ORDINE_LISTA_PRODOTTI = "ORDINE_LISTA_PRODOTTI";
export const SET_ORDINE_CORRENTE = "SET_ORDINE_CORRENTE";
export const ADD_PRODOTTO_TO_ORDINE = "ADD_PRODOTTO_TO_ORDINE";
export const REMOVE_PRODOTTO_FROM_ORDINE = "REMOVE_PRODOTTO_FROM_ORDINE";
export const UPDATE_QUANTITA_PRODOTTO = "UPDATE_QUANTITA_PRODOTTO";
export const CLEAR_ORDINE_CORRENTE = "CLEAR_ORDINE_CORRENTE";
export const ORDINE_SUBMIT_SUCCESS = "ORDINE_SUBMIT_SUCCESS";
export const ORDINE_SUBMIT_FAILURE = "ORDINE_SUBMIT_FAILURE";

export const setUsernameAction = (userName) => ({
  type: SET_USERNAME,
  payload: userName,
});

export const setPasswordAction = (password) => ({
  type: SET_PASSWORD,
  payload: password,
});

export const setTokenAction = (token) => ({
  type: SET_TOKEN,
  payload: token,
});

export const addProdottoToOrdine = (prodotto) => ({
  type: ADD_PRODOTTO_TO_ORDINE,
  payload: prodotto,
});

export const updateQuantitaProdotto = (id, quantita) => ({
  type: UPDATE_QUANTITA_PRODOTTO,
  payload: { id, quantita },
});

export const clearOrdineCorrente = () => ({
  type: CLEAR_ORDINE_CORRENTE,
});

const apiUrl = import.meta.env.VITE_API_URL;
// const token = sessionStorage.getItem("token");

// export const getUserAction = () => {
//   return async(dispatch) => {
//     dispatch({type: IS_LOADING_ON});
//     try{

//     }
//   }
// };

//-------TAVOLI--------
export const getTavoliAction = () => {
  return async (dispatch) => {
    dispatch({ type: IS_LOADING_ON });
    try {
      let response = await fetch(apiUrl + "/api/tavoli", {
        method: "GET",
        headers: {
          // Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        let tavoli = await response.json();
        console.log("FETCH TAVOLI: " + tavoli);
        dispatch({ type: GET_TAVOLI, payload: tavoli.content });
      } else {
        throw new Error("Errore nel recupero dei tavoli.");
      }
    } catch (err) {
      console.log("Error", err);
    } finally {
      dispatch({ type: IS_LOADING_OFF });
    }
  };
};

export const getTavoloByIdAction = (id) => {
  return async (dispatch) => {
    dispatch({ type: IS_LOADING_ON });
    try {
      let response = await fetch(apiUrl + "/api/tavoli/" + id, {
        method: "GET",
        headers: {
          // Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        let tavolo = await response.json();
        console.log("FETCH TAVOLO SINGOLO: " + JSON.stringify(tavolo));
        dispatch({ type: GET_TAVOLO_BY_ID, payload: tavolo });
        if (tavolo.ordine != null) {
          dispatch({
            type: SET_ORDINE_CORRENTE,
            payload: {
              id: tavolo.ordine.id,
              tavoloId: parseInt(id),
              prodotti: tavolo.ordine.prodotti,
            },
          });
        } else {
          dispatch({
            type: SET_ORDINE_CORRENTE,
            payload: {
              id: null,
              tavoloId: parseInt(id),
              prodotti: [],
            },
          });
        }
      } else {
        throw new Error("Errore nel recupero del tavolo.");
      }
    } catch (err) {
      console.log("Error", err);
    } finally {
      dispatch({ type: IS_LOADING_OFF });
    }
  };
};

export const postTavoloAction = (numeroTavolo, numeroPosti) => {
  return async (dispatch) => {
    console.log("Sto inviando la richiesta POST...");
    try {
      let response = await fetch(apiUrl + "/api/tavoli", {
        method: "POST",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numeroTavolo: numeroTavolo,
          numeroPosti: numeroPosti,
        }),
      });
      if (response.ok) {
        await response.json();
        dispatch(getTavoliAction());
        return { success: true };
      } else {
        return { success: false, error: "Creazione fallita" };
      }
    } catch (err) {
      console.log("Error", err);
      return { success: false, error: err.message };
    }
  };
};

export const deleteTavoloAction = (id) => {
  return async (dispatch) => {
    try {
      let response = await fetch(apiUrl + "/api/tavoli/" + id, {
        method: "DELETE",
        headers: {
          // Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        dispatch(getTavoliAction());
        return { success: true };
      } else {
        return { success: false, error: "Cancellazione fallita" };
      }
    } catch (err) {
      console.log("Error", err);
      return { success: false, error: err.message };
    }
  };
};

export const putTavoloAction = (id, numeroPosti) => {
  return async (dispatch) => {
    try {
      let response = await fetch(apiUrl + "/api/tavoli/" + id, {
        method: "PUT",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numeroPosti: numeroPosti,
        }),
      });
      if (response.ok) {
        dispatch(getTavoliAction());
        return { success: true };
      } else {
        return { success: false, error: "Modifica fallita" };
      }
    } catch (err) {
      console.log("Error", err);
      return { success: false, error: err.message };
    }
  };
};

//-------REPARTI--------
export const getRepartiAction = () => {
  return async (dispatch) => {
    dispatch({ type: IS_LOADING_ON });
    try {
      let response = await fetch(apiUrl + "/api/reparti", {
        method: "GET",
        headers: {
          // Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        let reparti = await response.json();
        console.log("FETCH REPARTI: " + reparti);
        dispatch({ type: GET_REPARTI, payload: reparti.content });
      } else {
        throw new Error("Errore nel recupero dei reparti.");
      }
    } catch (err) {
      console.log("Error", err);
    } finally {
      dispatch({ type: IS_LOADING_OFF });
    }
  };
};

export const getRepartoByIdAction = (id) => {
  return async (dispatch) => {
    dispatch({ type: IS_LOADING_ON });
    try {
      let response = await fetch(apiUrl + "/api/reparti/" + id, {
        method: "GET",
        headers: {
          // Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        let reparto = await response.json();
        console.log("FETCH REPARTO SINGOLO: " + JSON.stringify(reparto));
        dispatch({ type: GET_REPARTO_BY_ID, payload: reparto });
      } else {
        throw new Error("Errore nel recupero del reparto.");
      }
    } catch (err) {
      console.log("Error", err);
    } finally {
      dispatch({ type: IS_LOADING_OFF });
    }
  };
};

export const deleteRepartoAction = (id) => {
  return async (dispatch) => {
    try {
      let response = await fetch(apiUrl + "/api/reparti/" + id, {
        method: "DELETE",
        headers: {
          // Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        dispatch(getRepartiAction());
        return { success: true };
      } else {
        return { success: false, error: "Cancellazione fallita" };
      }
    } catch (err) {
      console.log("Error", err);
      return { success: false, error: err.message };
    }
  };
};

export const postRepartoAction = (nomeReparto) => {
  return async (dispatch) => {
    console.log("Sto inviando la richiesta POST...");
    try {
      let response = await fetch(apiUrl + "/api/reparti", {
        method: "POST",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nomeReparto,
        }),
      });
      if (response.ok) {
        await response.json();
        dispatch(getRepartiAction());
        return { success: true };
      } else {
        return { success: false, error: "Creazione fallita" };
      }
    } catch (err) {
      console.log("Error", err);
      return { success: false, error: err.message };
    }
  };
};

export const putRepartoAction = (id, nomeReparto) => {
  return async (dispatch) => {
    console.log("Sto inviando la richiesta POST...");
    try {
      let response = await fetch(apiUrl + "/api/reparti/" + id, {
        method: "PUT",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nomeReparto,
        }),
      });
      if (response.ok) {
        dispatch(getRepartiAction());
        return { success: true };
      } else {
        return { success: false, error: "Modifica fallita" };
      }
    } catch (err) {
      console.log("Error", err);
      return { success: false, error: err.message };
    }
  };
};

//-------ORDINI--------
export const getOrdineByIdAction = (id) => {
  return async (dispatch) => {
    dispatch({ type: IS_LOADING_ON });
    try {
      let response = await fetch(apiUrl + "/api/ordini/" + id, {
        method: "GET",
        headers: {
          // Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        let ordine = await response.json();
        console.log("FETCH ORDINE SINGOLO: " + JSON.stringify(ordine));
        dispatch({ type: GET_ORDINE_BY_ID, payload: ordine });
      } else {
        throw new Error("Errore nel recupero dell' ordine.");
      }
    } catch (err) {
      console.log("Error", err);
    } finally {
      dispatch({ type: IS_LOADING_OFF });
    }
  };
};

const formatOrdineForBackend = (ordine) => {
  return {
    tavoloId: ordine.tavoloId,
    nomeUtente: localStorage.getItem("username"),
    prodotti: ordine.prodotti.map((p) => ({
      prodotto: {
        id: p.prodotto?.id ?? p.id,
        nome: p.prodotto?.nome ?? p.nome,
        prezzo: p.prodotto?.prezzo ?? p.prezzo,
        immagine: p.prodotto?.immagine ?? p.immagine,
        note: p.prodotto?.note ?? p.note ?? "",
        varianti: (p.prodotto?.varianti ?? p.varianti ?? []).map((v) => ({
          id: v.id,
          nome: v.nome,
          prezzo: v.prezzo,
        })),
      },
      quantita: p.quantita,
    })),
  };
};

export const submitOrdineAction = () => async (dispatch, getState) => {
  dispatch({ type: IS_LOADING_ON });

  try {
    const { ordineCorrente } = getState().ordini;

    const method = ordineCorrente.id ? "PUT" : "POST";
    const url = ordineCorrente.id ? `/api/ordini/${ordineCorrente.id}` : "/api/ordini";

    const body = formatOrdineForBackend(ordineCorrente);
    console.log(JSON.stringify(body));

    const res = await fetch(apiUrl + url, {
      method,
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    dispatch({ type: ORDINE_SUBMIT_SUCCESS, payload: data });
    return { success: true, data };
  } catch (err) {
    dispatch({ type: ORDINE_SUBMIT_FAILURE, payload: err.message });
  } finally {
    dispatch({ type: IS_LOADING_OFF });
  }
};

export const deleteOrdineAction = (id) => {
  return async (dispatch) => {
    try {
      let response = await fetch(apiUrl + "/api/ordini/" + id, {
        method: "DELETE",
        headers: {
          // Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: "Cancellazione fallita" };
      }
    } catch (err) {
      console.log("Error", err);
      return { success: false, error: err.message };
    }
  };
};

export const spostaOrdineAction = (id, nuovoTavoloId) => {
  return async (dispatch) => {
    try {
      let response = await fetch(apiUrl + "/api/ordini/" + id + "/sposta?nuovoTavoloId=" + nuovoTavoloId, {
        method: "PUT",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        dispatch(getRepartiAction());
        return { success: true };
      } else {
        return { success: false, error: "Modifica fallita" };
      }
    } catch (err) {
      console.log("Error", err);
      return { success: false, error: err.message };
    }
  };
};
//-------PRODOTTI--------

export const deleteProdottoAction = (id) => {
  return async (dispatch) => {
    try {
      let response = await fetch(apiUrl + "/api/prodotti/" + id, {
        method: "DELETE",
        headers: {
          // Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        dispatch(getRepartiAction());
        return { success: true };
      } else {
        return { success: false, error: "Cancellazione fallita" };
      }
    } catch (err) {
      console.log("Error", err);
      return { success: false, error: err.message };
    }
  };
};

export const postProdottoAction = (nomeProdotto, prezzoProdotto, idReparto) => {
  return async (dispatch) => {
    console.log("Sto inviando la richiesta POST...");
    try {
      let response = await fetch(apiUrl + "/api/prodotti", {
        method: "POST",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nomeProdotto,
          prezzo: prezzoProdotto,
          repartoId: idReparto,
        }),
      });
      if (response.ok) {
        await response.json();
        dispatch(getRepartiAction());
        return { success: true };
      } else {
        return { success: false, error: "Creazione fallita" };
      }
    } catch (err) {
      console.log("Error", err);
      return { success: false, error: err.message };
    }
  };
};

export const putProdottoAction = (id, nomeProdotto, prezzoProdotto, idReparto) => {
  return async (dispatch) => {
    console.log("Sto inviando la richiesta POST...");
    try {
      let response = await fetch(apiUrl + "/api/prodotti/" + id, {
        method: "PUT",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nomeProdotto,
          prezzo: prezzoProdotto,
          repartoId: idReparto,
        }),
      });
      if (response.ok) {
        dispatch(getRepartiAction());
        return { success: true };
      } else {
        return { success: false, error: "Modifica fallita" };
      }
    } catch (err) {
      console.log("Error", err);
      return { success: false, error: err.message };
    }
  };
};
