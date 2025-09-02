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
import { fetchLessons } from "@/store/lessonActions";
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
  Lock,
  Clock,
  CheckCircle,
  Settings,
  Trash2,
} from "lucide-react";
import { availableBadges } from "../../data/badges";
import type { User } from "@/store/authSlice";

interface StudentDashboardProps {
  user: User;
}

export function StudentDashboard({ user }: StudentDashboardProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showLessonPlayer, setShowLessonPlayer] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const lessons = useSelector((state: RootState) => state.lessons.lessons);
  const groups = useSelector((state: RootState) => state.groups.groups);
  const nextLevelXP = (user.level + 1) * 500;
  const currentLevelXP = user.level * 500;
  const progressToNext =
    ((user.experience - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  const handleLessonSelect = (
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
  }, [dispatch, selectedGroup]);

  return (
    <div className="space-y-6">
      {/* Stats de usuario */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Nivel</p>
                <p className="text-2xl font-bold">{user.experience}</p>
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
              {nextLevelXP - user.experience || 0} XP para el siguiente nivel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Nivel {user.level}</span>
                <span>Nivel {user.level + 1}</span>
              </div>
              <Progress value={progressToNext} className="h-3" />
              <p className="text-sm text-muted-foreground mt-1">
                {user.experience - currentLevelXP} /{" "}
                {nextLevelXP - currentLevelXP} XP
              </p>
            </div>

            {/* Lista de lecciones */}
            <div className="grid gap-4">
              {lessons.map((lesson, index) => (
                <Card
                  key={index}
                  className={`${
                    lesson.completed
                      ? "border-green-200 bg-green-50"
                      : !lesson.unlocked
                      ? "border-gray-200 bg-gray-50 opacity-60"
                      : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium">
                          {lesson.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : !lesson.unlocked ? (
                            <Lock className="h-4 w-4 text-gray-400" />
                          ) : (
                            index + 1
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={`font-medium ${
                                !lesson.unlocked ? "text-gray-400" : ""
                              }`}
                            >
                              {lesson.title}
                            </h3>
                          </div>

                          <p
                            className={`text-sm mb-2 ${
                              !lesson.unlocked
                                ? "text-gray-400"
                                : "text-muted-foreground"
                            }`}
                          >
                            {lesson.description}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {lesson.estimatedDuration} min
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {lesson.rewards.points} pts
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {lesson.rewards.xp} XP
                            </span>
                          </div>

                          {lesson.userProgress && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              Mejor puntuación: {lesson.userProgress.bestScore}%
                              • Intentos: {lesson.userProgress.attempts} •
                              Racha: {lesson.userProgress.currentStreak}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {lesson.completed && (
                          <Badge className="bg-green-500 text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completada
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedLesson(lesson);
                            setShowLessonForm(true);
                          }}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteAssignment(lesson._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {lesson.unlocked && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedLesson(lesson);
                              setShowLessonPlayer(true);
                            }}
                            disabled={!lesson.unlocked}
                            className={
                              lesson.completed
                                ? "bg-gray-500 hover:bg-gray-600"
                                : "bg-green-500 hover:bg-green-600"
                            }
                          >
                            <Play className="h-4 w-4 mr-1" />
                            {lesson.completed ? "Repasar" : "Comenzar"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Modal de reproductor de lección */}
            {showLessonPlayer && selectedLesson && (
              <LessonPlayer
                lesson={selectedLesson}
                onComplete={handleLessonComplete}
                onClose={() => setShowLessonPlayer(false)}
              />
            )}

            {/* Rutas de aprendizaje */}
            <div className="space-y-3">
              <h4 className="font-medium">Rutas de Aprendizaje</h4>
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
