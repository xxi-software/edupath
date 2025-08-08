import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";
import { Button } from "../../../components/ui/button";
import { Users, TrendingUp, Award, BookOpen } from "lucide-react";
import { type UserProgress } from "../../data/types";
import { mockStudents } from "../../data/users";
import { mathTopics } from "../../data/mathTopics";
import { CreateAssignmentModal } from "./CreateAssignamentModal";
import { type Assignment, mockAssignments } from "../../data/assignments";

interface TeacherDashboardProps {
  user: UserProgress;
}

export function TeacherDashboard({ user }: TeacherDashboardProps) {
  const [assignments, setAssignments] = useState(mockAssignments);
  const averageProgress = Math.round(
    mockStudents.reduce((acc, student) => acc + student.level, 0) / mockStudents.length
  );

  const handleCreateAssignment = (newAssignment: Omit<Assignment, 'id' | 'createdAt' | 'completedBy' | 'teacherId'>) => {
    const assignment: Assignment = {
      ...newAssignment,
      id: `assignment_${Date.now()}`,
      teacherId: user.userId,
      createdAt: new Date(),
      completedBy: []
    };
    
    setAssignments(prev => [...prev, assignment]);
    // Aquí podrías enviar a una API real
    console.log("Nueva asignación creada:", assignment);
  };
  
  const totalActiveStudents = mockStudents.length;
  const studentsWithStreak = mockStudents.filter(s => s.streakDays > 0).length;

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
                <p className="text-sm opacity-90">Temas Disponibles</p>
                <p className="text-2xl font-bold">{mathTopics.length}</p>
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
            <CardDescription>
              Seguimiento individual del rendimiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockStudents.map((student) => (
                <div key={student.userId} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{student.avatar}</span>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Nivel {student.level} • {student.streakDays} días de racha
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{student.xp} XP</p>
                    <p className="text-xs text-muted-foreground">
                      {student.badges.length} insignias
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
                const completedByStudents = mockStudents.filter(s => 
                  s.completedTopics.includes(topic.id)
                ).length;
                const completionRate = (completedByStudents / mockStudents.length) * 100;
                
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
                        {completedByStudents}/{mockStudents.length} completado
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
              <CreateAssignmentModal onCreateAssignment={handleCreateAssignment} />
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