import { Button } from "../../../components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";

export const Logout = () => {
  const navigate = useNavigate();
  const onLogout = () => {
    window.localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onLogout}
      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Cerrar Sesión
    </Button>
  );
};
