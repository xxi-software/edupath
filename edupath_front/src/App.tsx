import { Routes, Route, Link } from "react-router";
import { AuthForm } from "./components/auth/authForm";
import { Dashboard } from "./components/dashboard/dashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
