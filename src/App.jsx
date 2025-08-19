import './App.css'
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Cookies from "js-cookie";

import Login from './Login';
import Home from './Home';
import QuizzGame from './QuizzGame';
import PageNotFound from './PageNotFound';





const ProtectedRoute = ({ children }) => {
  const token=Cookies.get("jwt_token");

  if (!token) {
    return <Navigate to="/login" replace />; 
  }
 return children;
};

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quizz"
            element={
              <ProtectedRoute>
                <QuizzGame />
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
