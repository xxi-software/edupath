import { useState } from "react";
import { StudentDashboard } from "./studentDashboard";
import { TeacherDashboard } from "./teacherDashboard";
import { Button } from "../../../components/ui/button";
import { BookOpen, GraduationCap, Users } from "lucide-react";
import { mockUser, mockTeacher } from "../../data/users";
import { Logout } from "../auth/logout";
/**
 * Contenedor principal del dashboard que conmuta entre vistas de
 * Estudiante y Profesor y muestra navegación básica.
 */
export function Dashboard() {
  const [currentRole, setCurrentRole] = useState<"student" | "teacher">(
    "student"
  );
  const [currentUser, setCurrentUser] = useState(mockUser);

  /**
   * Cambia el rol visualizado y sincroniza el usuario actual con datos mock.
   */
  const handleRoleSwitch = (role: "student" | "teacher") => {
    setCurrentRole(role);
    setCurrentUser(role === "student" ? mockUser : mockTeacher);
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
                <Button
                  variant={currentRole === "student" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleRoleSwitch("student")}
                  className={
                    currentRole === "student"
                      ? "bg-green-500 hover:bg-green-600"
                      : ""
                  }
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Estudiante
                </Button>
                <Button
                  variant={currentRole === "teacher" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleRoleSwitch("teacher")}
                  className={
                    currentRole === "teacher"
                      ? "bg-green-500 hover:bg-green-600 disabled"
                      : ""
                  }
                >
                  <Users className="h-4 w-4 mr-2" />
                  Profesor
                </Button>
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
