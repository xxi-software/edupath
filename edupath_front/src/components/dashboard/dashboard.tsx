import { useState } from "react";
import { useSelector } from "react-redux";
import { StudentDashboard } from "./studentDashboard";
import { TeacherDashboard } from "./teacherDashboard";
import { Button } from "../../../components/ui/button";
import { BookOpen, GraduationCap, Users } from "lucide-react";
import { Logout } from "../auth/logout";
import { selectUser } from "../../store/authSlice";
import type { UserProgress } from "../../data/types";
/**
 * Contenedor principal del dashboard que conmuta entre vistas de
 * Estudiante y Profesor y muestra navegación básica.
 */
export function Dashboard() {
  const reduxUser = useSelector(selectUser);
  const [currentRole, setCurrentRole] = useState<"student" | "teacher">(
    reduxUser?.role || "student"
  );

  // Map the Redux user data to the UserProgress type
  const currentUser: UserProgress = {
    userId: reduxUser?._id || "default",
    name: reduxUser?.name || "Usuario",
    avatar: "👤",
    level: 1,
    xp: 0,
    totalPoints: 0,
    streakDays: 0,
    badges: [],
    completedTopics: [],
    role: reduxUser?.role || "student",
  };

  /**
   * Cambia el rol visualizado. En una implementación real, esto podría
   * depender del rol del usuario en Redux.
   */
  const handleRoleSwitch = (role: "student" | "teacher") => {
    setCurrentRole(role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header con navegación */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-green-500 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-900">EduPath</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {currentRole === "student" ? (
                  <Button
                    variant={currentRole === "student" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleRoleSwitch("student")}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Estudiante
                  </Button>
                ) : (
                  <Button
                    variant={currentRole === "teacher" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleRoleSwitch("teacher")}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Profesor
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-2xl">{currentUser.avatar}</span>
                <span className="font-medium text-gray-900">
                  {currentUser.name}
                </span>
              </div>
              <Logout />
            </div>
          </div>
        </div>
      </header>

      {/* Contenido del dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentRole === "student" ? (
          <StudentDashboard user={currentUser} />
        ) : (
          <TeacherDashboard user={currentUser} />
        )}
      </main>
    </div>
  );
}
