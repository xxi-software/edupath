import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectFilteredUsers, setSearchTerm } from "@/store/usersSlice";
import { fetchUsers } from "@/store/usersActions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Progress } from "../../../components/ui/progress";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Users, TrendingUp, Award, BookOpen, ChevronRight, Settings } from "lucide-react";
import { mathTopics } from "../../data/mathTopics";
import { CreateAssignmentModal } from "./CreateAssignamentModal";
import { type Assignment, mockAssignments } from "../../data/assignments";
import { AssignmentManager } from "./AssignmentManager";
import type { AppDispatch, RootState } from "@/store";
import type { User } from "@/store/authSlice";

interface TeacherDashboardProps {
  user: User;
}

export function TeacherDashboard({ user }: TeacherDashboardProps) {
  const [assignments, setAssignments] = useState(mockAssignments);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const filteredUsers = useSelector(selectFilteredUsers);
  const searchTerm = useSelector((state: RootState) => state.users.searchTerm);

  const averageProgress = filteredUsers.length > 0
    ? Math.round(filteredUsers.reduce((acc, student) => acc + (student.experience || 0), 0) / filteredUsers.length)
    : 0;

  const totalActiveStudents = filteredUsers.length;
  const studentsWithStreak = filteredUsers.filter(s => (s.streakDays || 0) > 0).length;

  useEffect(() => {
      dispatch(fetchUsers());
  }, [dispatch]);

  const handleCreateAssignment = (newAssignment: Omit<Assignment, | 'createdAt' | 'completedBy' | 'teacherId'>) => {
    const assignment: Assignment = {
      ...newAssignment,
      teacherId: user._id,
      createdAt: new Date(),
      completedBy: []
    };

    setAssignments(prev => [...prev, assignment]);
    console.log("Nueva asignación creada:", assignment);
  };

  // Si hay una asignación seleccionada, mostrar el AssignmentManager
  if (selectedAssignment) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setSelectedAssignment(null)}
          >
            ← Volver al Dashboard
          </Button>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Dashboard</span>
            <ChevronRight className="h-4 w-4" />
            <span>{selectedAssignment.title}</span>
          </div>
        </div>
        <AssignmentManager 
          assignment={selectedAssignment}
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
                <p className="text-2xl font-bold">{assignments.filter(a => a.status === 'published').length}</p>
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
            <Input className="mt-2" placeholder="Buscar estudiantes por email..." value={searchTerm} onChange={(e) => dispatch(setSearchTerm(e.target.value))} />
            <CardDescription>
              Seguimiento individual del rendimiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((student) => (
                <div key={student._id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    {student.profilePicture ? (
                      <img src={student.profilePicture} alt={student.name} className="h-8 w-8 rounded-full" />
                    ) : (
                      <span className="text-2xl bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center">
                        {student.name.charAt(0)}
                      </span>
                    )}
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground"></p>
                      <p className="text-xs text-muted-foreground">{student.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{student.experience || 0} XP</p>
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
            <CardTitle>Progreso por Tema</CardTitle>
            <CardDescription>
              Rendimiento grupal por área de estudio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mathTopics.map((topic) => {
                const completedByStudents = filteredUsers.filter(s =>
                  s.completedTopics?.includes(topic.id) || false
                ).length;
                const completionRate = filteredUsers.length > 0 ? (completedByStudents / filteredUsers.length) * 100 : 0;
                
                return (
                  <div key={topic.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1 rounded ${topic.color}`}>
                          <div className="w-3 h-3"></div>
                        </div>
                        <span className="font-medium">{topic.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {completedByStudents}/{filteredUsers.length} completado
                      </span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {Math.round(completionRate)}% de estudiantes han completado este tema
                    </p>
                  </div>
                );
              })}
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
            <CreateAssignmentModal onCreateAssignment={handleCreateAssignment} />
          </div>
        </CardHeader>
        <CardContent>
          {assignments.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay asignaciones aún
              </h3>
              <p className="text-gray-500 mb-4">
                Crea tu primera asignación para comenzar a gestionar lecciones
              </p>
              <CreateAssignmentModal onCreateAssignment={handleCreateAssignment} />
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((assignment) => {
                const topic = mathTopics.find(t => t.id === assignment.topicId);
                const completionRate = (assignment.completedBy.length / assignment.assignedStudents.length) * 100;
                const isOverdue = assignment.dueDate < new Date();
                
                return (
                  <Card key={assignment.id} className={`hover:shadow-md transition-shadow cursor-pointer ${
                    isOverdue ? 'border-red-200 bg-red-50' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className={`p-3 rounded-lg ${topic?.color || 'bg-gray-500'}`}>
                            <BookOpen className="h-5 w-5 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{assignment.title}</h3>
                              <Badge variant={assignment.status === 'published' ? 'default' : 'secondary'}>
                                {assignment.status === 'published' ? 'Publicada' : 'Borrador'}
                              </Badge>
                              {isOverdue && (
                                <Badge variant="destructive">
                                  Vencida
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2">
                              {assignment.description}
                            </p>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{topic?.name}</span>
                              <span>•</span>
                              <span>{assignment.assignedStudents.length} estudiantes</span>
                              <span>•</span>
                              <span>Vence: {assignment.dueDate.toLocaleDateString()}</span>
                            </div>
                            
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span>Progreso de estudiantes</span>
                                <span>{assignment.completedBy.length}/{assignment.assignedStudents.length}</span>
                              </div>
                              <Progress value={completionRate} className="h-1" />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="text-right mr-4">
                            <div className="text-sm font-medium">{assignment.points} pts</div>
                            <div className="text-xs text-muted-foreground">{assignment.xp} XP</div>
                          </div>
                          
                          <Button
                            onClick={() => setSelectedAssignment(assignment)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Gestionar Lecciones
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
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