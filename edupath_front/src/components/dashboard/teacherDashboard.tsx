import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectFilteredUsers, setSearchTerm } from "@/store/usersSlice";
import { fetchUsers } from "@/store/usersActions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Progress } from "../../../components/ui/progress";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Users,
  TrendingUp,
  Award,
  BookOpen,
  ChevronRight,
  Settings,
  Trash2,
} from "lucide-react";
import { CreateAssignmentModal } from "./CreateAssignamentModal";
import { AssignmentManager } from "./AssignmentManager";
import type { AppDispatch, RootState } from "@/store";
import type { User } from "@/store/authSlice";
import { createGroup, deleteGroup, fetchGroups } from "@/store/groupActions";
import type { Group } from "@/store/groupSlice";

interface TeacherDashboardProps {
  user: User;
}

export function TeacherDashboard({ user }: TeacherDashboardProps) {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const filteredUsers = useSelector(selectFilteredUsers) as User[];
  const searchTerm = useSelector((state: RootState) => state.users.searchTerm) as string;
  const loading = useSelector((state: RootState) => state.groups.loading);

  const groups = useSelector((state: RootState) => state.groups.groups) as Group[] || [];

  const averageProgress =
    filteredUsers.length > 0
      ? Math.round(
          filteredUsers.reduce(
            (acc, student) => acc + (student.experience || 0),
            0
          ) / filteredUsers.length
        )
      : 0;

  const totalActiveStudents = filteredUsers.length;
  const studentsWithStreak = filteredUsers.filter(
    (s) => (s.streakDays || 0) > 0
  ).length;

  const handleDeleteGroup = (id: string) => {
    dispatch(deleteGroup(id))
    dispatch(fetchGroups());
  }

  useEffect(() => {
    dispatch(fetchGroups());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleCreateAssignment = async (
    newAssignment: Omit<Group, "createdAt" | "completedBy" | "teacherId">
  ) => {
    const groupData = {
      title: newAssignment.title,
      teacherId: user._id,
      description: newAssignment.description,
      difficulty: newAssignment.difficulty || "medium",
      assignedStudents: newAssignment.assignedStudents || [],
      completedBy: [],
      experience: newAssignment.experience || 0,
      mainTheme: newAssignment.mainTheme || "default-topic",
      points: newAssignment.points || 0,
      status:
        newAssignment.status === "completed"
          ? "published"
          : newAssignment.status || "draft",
      subtopicThemes: [],
      dueDate: newAssignment.dueDate,
    } as unknown as Group;

    try {
      await dispatch(createGroup(groupData)).unwrap();
      console.log(groups);
      // Opcional: agregar notificación de éxito
    } catch (error) {
      console.error("Error creating group:", error);
      // Opcional: mostrar error al usuario
    }
  };

  // Si hay un grupo seleccionado, mostrar el GroupManager
  if (selectedGroup) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setSelectedGroup(null)}>
            ← Volver al Dashboard
          </Button>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Dashboard</span>
            <ChevronRight className="h-4 w-4" />
            <span>{selectedGroup.title}</span>
          </div>
        </div>
        <AssignmentManager
          group={selectedGroup}
          userRole="teacher"
          userId={user._id}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Estudiantes Activos</p>
                <p className="text-2xl font-bold">{totalActiveStudents}</p>
              </div>
              <Users className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Nivel Promedio</p>
                <p className="text-2xl font-bold">{averageProgress}</p>
              </div>
              <TrendingUp className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Con Racha Activa</p>
                <p className="text-2xl font-bold">{studentsWithStreak}</p>
              </div>
              <Award className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Asignaciones Activas</p>
                <p className="text-2xl font-bold">
                  
                </p>
              </div>
              <BookOpen className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de estudiantes */}
        <Card>
          <CardHeader>
            <CardTitle>Progreso de Estudiantes</CardTitle>
            <Input
              className="mt-2"
              placeholder="Buscar estudiantes por email..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            />
            <CardDescription>
              Seguimiento individual del rendimiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((student) => (
                <div
                  key={student._id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    {student.profilePicture ? (
                      <img
                        src={student.profilePicture}
                        alt={student.name}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <span className="text-2xl bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center">
                        {student.name.charAt(0)}
                      </span>
                    )}
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground"></p>
                      <p className="text-xs text-muted-foreground">
                        {student.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {student.experience || 0} XP
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Racha de {student.streakDays || 0} días
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progreso por temas */}
        <Card>
          <CardHeader>
            <CardTitle>Progreso por Asignación</CardTitle>
            <CardDescription>
              Rendimiento grupal por asignación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-4 text-muted-foreground">Cargando grupos...</div>
                ) : groups.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No hay grupos disponibles</div>
                ) : (
                  groups?.map((group) => {
                    if(!group || !group.assignedStudents) return null
                    const completedByStudents = group.completedBy.length;
                    const totalStudents = group.assignedStudents.length;
                    const completionRate = totalStudents > 0 ? (completedByStudents / totalStudents) * 100 : 0;
                    const difficultyColor = group.difficulty === "easy" ? "bg-green-500" : group.difficulty === "medium" ? "bg-yellow-500" : "bg-red-500";
                    const isOverdue = new Date(group.dueDate) < new Date();

                    return (
                      <div key={group._id} className="space-y-2 p-3 rounded-lg border hover:bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <div className={`p-1 rounded ${difficultyColor}`}>
                              <div className="w-3 h-3"></div>
                            </div>
                            <span className="font-medium">{group.title}</span>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={group.status === "published" ? "default" : "secondary"}>
                              {group.status === "published" ? "Publicada" : "Borrador"}
                            </Badge>
                            {isOverdue && <Badge variant="destructive">Vencida</Badge>}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => setSelectedGroup(group)}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteGroup(group._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{group.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{group.mainTheme}</span>
                          <span>•</span>
                          <span>Dificultad: {group.difficulty}</span>
                          <span>•</span>
                          <span>Vence: {new Date(group.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>Progreso de estudiantes</span>
                            <span>{completedByStudents}/{totalStudents}</span>
                          </div>
                          <Progress value={completionRate} className="h-2" />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{group.points} pts</span>
                          <span>{group.experience} XP</span>
                        </div>
                      </div>
                    );
                  })
                )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gestión de Asignaciones */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mis Asignaciones</CardTitle>
              <CardDescription>
                Gestiona contenido y lecciones de tus asignaciones
              </CardDescription>
            </div>
            <CreateAssignmentModal
              onCreateAssignment={handleCreateAssignment}
            />
          </div>
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>

      {/* Acciones rápidas */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium">Panel de Control</h3>
              <p className="text-muted-foreground">
                Gestiona contenido y revisa el progreso detallado
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-green-500 hover:bg-green-600">
                Ver Reportes Detallados
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
