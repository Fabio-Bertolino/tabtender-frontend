import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import TopBar from "./components/TopBar";
import Tavoli from "./components/tavoli";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import OrdinazioneTavolo from "./components/OrdinazioneTavolo";
import AreaAmministratore from "./components/areaAmministratore";
import Auth from "./components/Auth";
import { useState } from "react";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const token = useSelector((state) => state.auth.token);
  return (
    <div className="App">
      <BrowserRouter>
        <TopBar />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <ProtectedRoute token={token}>
                <Tavoli />
              </ProtectedRoute>
            }
          />
          <Route path="/tavoli/:id" element={<OrdinazioneTavolo />} />
          <Route path="/area-amministratore" element={<AreaAmministratore />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
