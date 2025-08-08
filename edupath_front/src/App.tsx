import { Routes, Route } from "react-router-dom";
import { AuthForm } from "./components/auth/authform";
import { Dashboard } from "./components/dashboard/Dashboard";
import { ProtectedRoute } from "./components/auth/protectedRoute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
