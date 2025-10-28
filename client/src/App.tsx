import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import { isAuthenticated } from "./utils/auth";
import * as React from "react";

const PrivateRoute = ({ element }: { element: React.JSX.Element }) => {
  return isAuthenticated() ? element : <Navigate to="/signin" />;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/landing" />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/landing" element={<PrivateRoute element={<Landing />} />} />
      <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
    </Routes>
  );
};

export default App;
