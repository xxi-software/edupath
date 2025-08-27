import { useState,  } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";
import { Badge } from "../../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { 
  Play, 
  Clock, 
  Trophy, 
  Star, 
  Target, 
  TrendingUp,
  Brain,
  Zap,
  CheckCircle,
  Lock,
  Plus
} from "lucide-react";
import { type Lesson, type LessonProgress, mockLessons, AdaptiveAI } from "../../data/lessons";
import { LessonPlayer } from "./LessonPlayer";
import { LessonCreator } from "./LessonCreator";
import type { Group } from "@/store/groupSlice";

interface AssignmentManagerProps {
  group: Group;
  userRole: 'student' | 'teacher';
  userId: string;
}

export function AssignmentManager({ group, userRole, userId }: AssignmentManagerProps) {
  const [lessons, setLessons] = useState<Lesson[]>(
    mockLessons.filter(l => l.topicId === group._id || "")
  );
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [showLessonPlayer, setShowLessonPlayer] = useState(false);
  const [showLessonCreator, setShowLessonCreator] = useState(false);

  // Calcular estadísticas de progreso
  const completedLessons = lessons.filter(l => l.completed).length;
  const totalProgress = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;
  const totalPoints = lessons.reduce((acc, l) => acc + (l.completed ? l.rewards.points : 0), 0);
  const totalXP = lessons.reduce((acc, l) => acc + (l.completed ? l.rewards.xp : 0), 0);

  // IA Adaptativa - Recomendar próxima lección
  const getRecommendedLesson = () => {
    const uncompletedLessons = lessons.filter(l => !l.completed && l.unlocked);
    if (uncompletedLessons.length === 0) return null;

    // Usar IA para recomendar basado en rendimiento
    const userProgressData = lessonProgress.find(p => p.userId === userId);
    if (userProgressData && userProgressData.attempts.length > 0) {
      const recommendedDifficulty = AdaptiveAI.calculateNextDifficulty(userProgressData.attempts);
      return uncompletedLessons.find(l => l.difficulty === recommendedDifficulty) || uncompletedLessons[0];
    }
    
    return uncompletedLessons[0];
  };

  const handleLessonComplete = (lessonId: string, score: number, timeSpent: number) => {
    setLessons(prev => prev.map(lesson => {
      if (lesson.id === lessonId) {
        return {
          ...lesson,
          completed: score >= lesson.adaptiveSettings.minAccuracy,
          userProgress: {
            attempts: (lesson.userProgress?.attempts || 0) + 1,
            bestScore: Math.max(score, lesson.userProgress?.bestScore || 0),
            timeSpent: (lesson.userProgress?.timeSpent || 0) + timeSpent,
            completedAt: score >= lesson.adaptiveSettings.minAccuracy ? new Date() : undefined,
            currentStreak: score >= lesson.adaptiveSettings.minAccuracy ? 
              (lesson.userProgress?.currentStreak || 0) + 1 : 0
          }
        };
      }
      return lesson;
    }));

    // Desbloquear próximas lecciones si es necesario
    if (score >= lessons.find(l => l.id === lessonId)?.adaptiveSettings.minAccuracy!) {
      setLessons(prev => prev.map(lesson => {
        if (lesson.prerequisiteIds.includes(lessonId)) {
          return { ...lesson, unlocked: true };
        }
        return lesson;
      }));
    }

    setShowLessonPlayer(false);
  };

  const getDifficultyColor = (difficulty: number) => {
    const colors = {
      1: 'bg-green-500',
      2: 'bg-blue-500', 
      3: 'bg-yellow-500',
      4: 'bg-orange-500',
      5: 'bg-red-500'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-500';
  };

  const getDifficultyLabel = (difficulty: number) => {
    const labels = {
      1: 'Muy Fácil',
      2: 'Fácil',
      3: 'Medio',
      4: 'Difícil', 
      5: 'Muy Difícil'
    };
    return labels[difficulty as keyof typeof labels] || 'Desconocido';
  };

  if (!group) {
    return <div>Cargando grupo...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header de la asignación */}
      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{group.title}</h2>
              <p className="opacity-90">{group.description}</p>
              <div className="flex items-center gap-4 text-sm opacity-75">
                <span>Vence: {new Date(group.dueDate).toLocaleDateString()}</span>
                <span>•</span>
                <span>{lessons.length} lecciones</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{Math.round(totalProgress)}%</div>
              <div className="text-sm opacity-75">Completado</div>
            </div>
          </div>

          <div className="mt-4">
            <Progress value={totalProgress} className="h-3 bg-white/20" />
          </div>

          <div className="flex items-center gap-6 mt-4">
            <div className="text-center">
              <Target className="h-5 w-5 mx-auto mb-1" />
              <div className="font-bold">{totalPoints}</div>
              <div className="text-xs opacity-75">Puntos</div>
            </div>
            <div className="text-center">
              <Star className="h-5 w-5 mx-auto mb-1" />
              <div className="font-bold">{totalXP}</div>
              <div className="text-xs opacity-75">XP</div>
            </div>
            <div className="text-center">
              <Trophy className="h-5 w-5 mx-auto mb-1" />
              <div className="font-bold">{completedLessons}</div>
              <div className="text-xs opacity-75">Lecciones</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="lessons" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lessons">Lecciones</TabsTrigger>
          <TabsTrigger value="progress">Progreso</TabsTrigger>
          <TabsTrigger value="ai-insights">IA Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="space-y-4">
          {userRole === 'teacher' && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Gestionar Lecciones</h3>
                    <p className="text-sm text-muted-foreground">
                      Crear y editar el contenido de las lecciones
                    </p>
                  </div>
                  <Button 
                    onClick={() => setShowLessonCreator(true)}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Lección
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recomendación de IA */}
          {userRole === 'student' && getRecommendedLesson() && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-900">IA Recomienda</h3>
                    <p className="text-sm text-blue-700 mb-3">
                      Basado en tu rendimiento, esta lección es perfecta para ti
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-blue-900">{getRecommendedLesson()?.title}</p>
                        <p className="text-xs text-blue-600">
                          {getRecommendedLesson()?.estimatedDuration} min • {getDifficultyLabel(getRecommendedLesson()?.difficulty || 1)}
                        </p>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedLesson(getRecommendedLesson()!);
                          setShowLessonPlayer(true);
                        }}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Zap className="h-4 w-4 mr-1" />
                        Comenzar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de lecciones */}
          <div className="grid gap-4">
            {lessons.map((lesson, index) => (
              <Card key={lesson.id} className={`${
                lesson.completed ? 'border-green-200 bg-green-50' : 
                !lesson.unlocked ? 'border-gray-200 bg-gray-50 opacity-60' : ''
              }`}>
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
                          <h3 className={`font-medium ${!lesson.unlocked ? 'text-gray-400' : ''}`}>
                            {lesson.title}
                          </h3>
                          <Badge 
                            className={`${getDifficultyColor(lesson.difficulty)} text-white text-xs`}
                          >
                            {getDifficultyLabel(lesson.difficulty)}
                          </Badge>
                        </div>
                        
                        <p className={`text-sm mb-2 ${!lesson.unlocked ? 'text-gray-400' : 'text-muted-foreground'}`}>
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
                            Mejor puntuación: {lesson.userProgress.bestScore}% • 
                            Intentos: {lesson.userProgress.attempts} • 
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
                      
                      {lesson.unlocked && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedLesson(lesson);
                            setShowLessonPlayer(true);
                          }}
                          disabled={!lesson.unlocked}
                          className={lesson.completed ? 
                            "bg-gray-500 hover:bg-gray-600" : 
                            "bg-green-500 hover:bg-green-600"}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          {lesson.completed ? 'Repasar' : 'Comenzar'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Progreso</CardTitle>
              <CardDescription>
                Seguimiento detallado de tu rendimiento y mejoras
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 mx-auto text-green-500 mb-2" />
                  <div className="text-2xl font-bold text-green-600">{Math.round(totalProgress)}%</div>
                  <div className="text-sm text-muted-foreground">Progreso Total</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Target className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{totalPoints}</div>
                  <div className="text-sm text-muted-foreground">Puntos Ganados</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Star className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                  <div className="text-2xl font-bold text-purple-600">{totalXP}</div>
                  <div className="text-sm text-muted-foreground">Experiencia</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Progreso por Lección</h4>
                {lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{lesson.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Dificultad: {getDifficultyLabel(lesson.difficulty)}
                      </p>
                    </div>
                    <div className="text-right">
                      {lesson.completed ? (
                        <Badge className="bg-green-500 text-white">
                          {lesson.userProgress?.bestScore}% ✓
                        </Badge>
                      ) : lesson.unlocked ? (
                        <Badge variant="outline">Pendiente</Badge>
                      ) : (
                        <Badge variant="secondary">Bloqueada</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Insights de IA Adaptativa
              </CardTitle>
              <CardDescription>
                Análisis personalizado de tu aprendizaje y recomendaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Análisis de rendimiento */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-3">Análisis de Rendimiento</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-purple-700 mb-2">Fortalezas Detectadas:</p>
                      <ul className="text-sm text-purple-600 space-y-1">
                        <li>• Excelente en multiplicaciones básicas</li>
                        <li>• Respuesta rápida en ejercicios simples</li>
                        <li>• Buena retención de conceptos</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm text-purple-700 mb-2">Áreas de Mejora:</p>
                      <ul className="text-sm text-purple-600 space-y-1">
                        <li>• Ejercicios con múltiples pasos</li>
                        <li>• Problemas de aplicación práctica</li>
                        <li>• Gestión del tiempo en exámenes</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Recomendaciones personalizadas */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-3">Recomendaciones Personalizadas</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800">Aumentar Dificultad</p>
                        <p className="text-sm text-green-600">
                          Tu rendimiento ha sido excelente. La IA sugiere aumentar la dificultad para mantener el desafío.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800">Sesiones Cortas</p>
                        <p className="text-sm text-blue-600">
                          Basado en tu patrón de aprendizaje, sesiones de 15-20 minutos son más efectivas para ti.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-orange-800">Enfoque en Aplicaciones</p>
                        <p className="text-sm text-orange-600">
                          Incluir más problemas de aplicación práctica mejorará tu comprensión conceptual.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Predicción de rendimiento */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-3">Predicción de Rendimiento</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">85%</div>
                      <div className="text-xs text-blue-500">Próxima Lección</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">3 días</div>
                      <div className="text-xs text-green-500">Tiempo Estimado</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">Nivel 4</div>
                      <div className="text-xs text-purple-500">Dificultad Óptima</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de reproductor de lección */}
      {showLessonPlayer && selectedLesson && (
        <LessonPlayer
          lesson={selectedLesson}
          onComplete={handleLessonComplete}
          onClose={() => setShowLessonPlayer(false)}
        />
      )}

      {/* Modal de creador de lección */}
      {showLessonCreator && (
        <LessonCreator
          assignmentId={group._id}
          topicId={group.mainTheme}
          onLessonCreated={(newLesson) => {
            setLessons(prev => [...prev, newLesson]);
            setShowLessonCreator(false);
          }}
          onClose={() => setShowLessonCreator(false)}
        />
      )}
    </div>
  );
}