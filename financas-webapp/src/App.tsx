import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Transactions from "./pages/Transactions/Transactions";
import NewTransaction from "./pages/Transactions/NewTransaction";
import SpendingLimits from "./pages/SpendingLimits/SpendingLimits";
import NewSpendingLimit from "./pages/SpendingLimits/NewSpendingLimit";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions/new"
          element={
            <ProtectedRoute>
              <NewTransaction />
            </ProtectedRoute>
          }
        />

        <Route
          path="/spending-limits"
          element={
            <ProtectedRoute>
              <SpendingLimits />
            </ProtectedRoute>
          }
        />

        <Route
          path="/spending-limits/new"
          element={
            <ProtectedRoute>
              <NewSpendingLimit />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;