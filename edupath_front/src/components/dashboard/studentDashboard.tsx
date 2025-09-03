import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { LessonPlayer } from "./LessonPlayer";
import type { AppDispatch, RootState } from "@/store";
import type { Lesson } from "@/store/lessonSlice";
import { Progress } from "../../../components/ui/progress";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Trophy,
  Flame,
  Star,
  Target,
  Play,
  ChevronRight,
} from "lucide-react";
import { availableBadges } from "../../data/badges";
import type { User } from "@/store/authSlice";
import { fetchStudentGroups } from "@/store/groupActions";
import { fetchLessons } from "@/store/lessonActions";
import { AssignmentManager } from "./AssignmentManager";

interface StudentDashboardProps {
  user: User;
}

export function StudentDashboard({ user }: StudentDashboardProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showLessonPlayer, setShowLessonPlayer] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const lessons = useSelector((state: RootState) => state.lessons.lessons);
  const groups = useSelector((state: RootState) => state.groups.groups);
  const loading = useSelector((state: RootState) => state.groups.loading);
  const nextLevelXP = (user.level ?? 0 + 1) * 500;
  const currentLevelXP = user.level ?? 0 * 500;
  const progressToNext =
    ((user.experience - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  const handleLessonComplete = (
    lessonId: string,
    score: number,
    timeSpent: number
  ) => {
    setShowLessonPlayer(true);
  };

  useEffect(() => {
    if (selectedGroup) {
      dispatch(fetchLessons(selectedGroup));
    }
    else{
      dispatch(fetchStudentGroups(user._id));
    }
  }, [dispatch, selectedGroup, user._id]);

  useEffect(() => {
    console.log("grupos",groups)
  }, [groups]);

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
          userRole="student"
          userId={user._id}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats de usuario */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Nivel</p>
                <p className="text-2xl font-bold">{user.level}</p>
              </div>
              <Trophy className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">XP Total</p>
                <p className="text-2xl font-bold">{user.experience}</p>
              </div>
              <Star className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Puntos</p>
                <p className="text-2xl font-bold">{user.experience}</p>
              </div>
              <Target className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Racha</p>
                <p className="text-2xl font-bold">{user.streakDays} días</p>
              </div>
              <Flame className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progreso del nivel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tu Progreso</CardTitle>
            <CardDescription>
              {nextLevelXP - (user.experience ?? 0)} XP para el siguiente nivel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Nivel {user.level}</span>
                <span>Nivel {user.level ?? 0 + 1}</span>
              </div>
              <Progress value={progressToNext} className="h-3" />
              <p className="text-sm text-muted-foreground mt-1">
                {user.experience ?? 0 - currentLevelXP} /{" "}
                {nextLevelXP - currentLevelXP} XP
              </p>
            </div>
            {/* Lista de lecciones */}
            <div className="grid gap-4">
              {/* Rutas de aprendizaje */}
              <div className="space-y-2">
                <h4 className="font-medium">Rutas de Aprendizaje</h4>
              </div>
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
                      <div className="text-center py-4 text-muted-foreground">
                        Cargando grupos...
                      </div>
                    ) : groups.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        No hay grupos disponibles
                      </div>
                    ) : Array.isArray(groups) ? (
                      groups.map((group) => {
                        if (!group || !group.assignedStudents) return null;
                        const completedByStudents = group.completedBy.length;
                        const totalStudents = group.assignedStudents.length;
                        const completionRate =
                          totalStudents > 0
                            ? (completedByStudents / totalStudents) * 100
                            : 0;
                        const difficultyColor =
                          group.difficulty === "easy"
                            ? "bg-green-500"
                            : group.difficulty === "medium"
                            ? "bg-yellow-500"
                            : "bg-red-500";
                        const isOverdue = new Date(group.dueDate) < new Date();

                        return (
                          <div
                            key={group._id}
                            className="space-y-2 p-3 rounded-lg border hover:bg-gray-50"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-2">
                                <div
                                  className={`p-1 rounded ${difficultyColor}`}
                                >
                                  <div className="w-3 h-3"></div>
                                </div>
                                <span className="font-medium">
                                  {group.title}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <Badge
                                  variant={
                                    group.status === "published"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {group.status === "published"
                                    ? "Publicada"
                                    : "Borrador"}
                                </Badge>
                                {isOverdue && (
                                  <Badge variant="destructive">Vencida</Badge>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedGroup(group)}
                                  className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 px-4 py-2 rounded-md shadow"
                                >
                                  <Play className="h-4 w-4 mr-1" />
                                  Comenzar
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {group.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Tema principal: {group.mainTheme}</span>
                              <span>•</span>
                              <span>
                                Subtemas:{" "}
                                {group.subtopicThemes.length > 0 ? (
                                  <div className="subtopicThemes map">
                                    {group.subtopicThemes.map((theme) => (
                                      <span key={theme}>{theme} | </span>
                                    ))}
                                  </div>
                                ) : (
                                  "N/A"
                                )}
                              </span>
                              <span>Dificultad: {group.difficulty}</span>
                              <span>•</span>
                              <span>
                                Vence:{" "}
                                {new Date(group.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span>Progreso de estudiantes</span>
                                <span>
                                  {completedByStudents}/{totalStudents}
                                </span>
                              </div>
                              <Progress
                                value={completionRate}
                                className="h-2"
                              />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{group.points} pts</span>
                              <span>{group.experience} XP</span>
                            </div>
                          </div>
                        );
                      })
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              {/* Modal de reproductor de lección */}
              {showLessonPlayer && selectedLesson && (
                <LessonPlayer
                  lesson={selectedLesson}
                  onComplete={handleLessonComplete}
                  onClose={() => {
                    setShowLessonPlayer(false);
                    setSelectedLesson(null);
                  }}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Insignias */}
        <Card>
          <CardHeader>
            <CardTitle>Insignias</CardTitle>
            <CardDescription>Insignias que has desbloqueado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {availableBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    badge.earned
                      ? "bg-gradient-to-b from-yellow-50 to-yellow-100 border-yellow-200"
                      : "bg-gray-50 border-gray-200 opacity-60"
                  }`}
                >
                  <div
                    className={`text-2xl mb-1 ${
                      badge.earned ? "" : "grayscale"
                    }`}
                  >
                    {badge.icon === "baby" && "👶"}
                    {badge.icon === "calculator" && "🧮"}
                    {badge.icon === "flame" && "🔥"}
                    {badge.icon === "crown" && "👑"}
                    {badge.icon === "compass" && "🧭"}
                  </div>
                  <p className="text-xs font-medium">{badge.name}</p>
                  {badge.earned && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      ¡Desbloqueada!
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Acción rápida */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">¡Continúa tu aventura!</h3>
            <p className="text-muted-foreground mb-4">
              Completa más ejercicios para desbloquear nuenas lecciones
            </p>
            <Button size="lg" className="bg-green-500 hover:bg-green-600">
              <Play className="h-4 w-4 mr-2" />
              Continuar Aprendiendo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
