import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { 
  Clock, 
  Star, 
  Target, 
  Lightbulb, 
  CheckCircle, 
  XCircle,
  Brain,
  Zap,
  ArrowRight,
  ArrowLeft,
  RotateCcw
} from "lucide-react";
import { type Lesson, type Question, type UserAnswer, AdaptiveAI } from "../../data/lessons";

interface LessonPlayerProps {
  lesson: Lesson;
  onComplete: (lessonId: string, score: number, timeSpent: number) => void;
  onClose: () => void;
}

export function LessonPlayer({ lesson, onComplete, onClose }: LessonPlayerProps) {
  const [currentPhase, setCurrentPhase] = useState<'theory' | 'practice' | 'results'>('theory');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);
  const [aiInsights, setAiInsights] = useState<string[]>([]);

  const currentQuestion = lesson.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / lesson.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === lesson.questions.length - 1;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    // Generar insights de IA basados en el progreso
    if (userAnswers.length > 0) {
      const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
      const accuracy = (correctAnswers / userAnswers.length) * 100;
      
      const insights = [];
      if (accuracy > 80) {
        insights.push("¡Excelente rendimiento! La IA sugiere aumentar la dificultad.");
      } else if (accuracy < 50) {
        insights.push("La IA recomienda repasar los conceptos básicos.");
      }
      
      if (hintsUsed > lesson.questions.length / 2) {
        insights.push("Considera revisar la teoría antes de continuar.");
      }
      
      setAiInsights(insights);
    }
  }, [userAnswers, hintsUsed, lesson.questions.length]);

  const handleStartPractice = () => {
    setCurrentPhase('practice');
    setQuestionStartTime(Date.now());
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return;

    const questionTimeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      userAnswer: selectedAnswer,
      isCorrect,
      timeSpent: questionTimeSpent,
      hintsUsed: showHint ? 1 : 0
    };

    setUserAnswers(prev => [...prev, newAnswer]);
    
    // IA: Decidir si mostrar explicación adicional
    if (!isCorrect && Math.random() > 0.5) {
      // Mostrar explicación adaptativa (simulado)
      setTimeout(() => {
        alert(`IA Adaptativa: ${currentQuestion.explanation}`);
      }, 1000);
    }

    // Avanzar a la siguiente pregunta o mostrar resultados
    if (isLastQuestion) {
      setCurrentPhase('results');
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowHint(false);
      setQuestionStartTime(Date.now());
    }
  };

  const handleShowHint = () => {
    setShowHint(true);
    setHintsUsed(prev => prev + 1);
  };

  const handleRetry = () => {
    setCurrentPhase('practice');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer('');
    setShowHint(false);
    setHintsUsed(0);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
  };

  const calculateScore = () => {
    const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
    return Math.round((correctAnswers / lesson.questions.length) * 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        {/* Header con progreso */}
        <div className="p-6 border-b bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-xl">{lesson.title}</DialogTitle>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(timeSpent)}
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {lesson.rewards.points} pts
              </div>
            </div>
          </div>
          
          {currentPhase === 'practice' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Pregunta {currentQuestionIndex + 1} de {lesson.questions.length}</span>
                <span>{Math.round(progress)}% completado</span>
              </div>
              <Progress value={progress} className="h-2 bg-white/20" />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Fase de teoría */}
          {currentPhase === 'theory' && (
            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Conceptos Clave</h3>
                <p className="text-muted-foreground">
                  Primero repasemos la teoría antes de practicar
                </p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Teoría</h4>
                      <p className="text-muted-foreground">{lesson.content.theory}</p>
                    </div>
                    
                    {lesson.content.examples.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Ejemplos</h4>
                        <div className="space-y-2">
                          {lesson.content.examples.map((example, index) => (
                            <div key={index} className="p-3 bg-green-50 rounded-lg">
                              <code className="text-green-800">{example}</code>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button 
                  onClick={handleStartPractice}
                  className="bg-green-500 hover:bg-green-600"
                  size="lg"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Comenzar Práctica
                </Button>
              </div>
            </div>
          )}

          {/* Fase de práctica */}
          {currentPhase === 'practice' && currentQuestion && (
            <div className="p-6 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium mb-2">{currentQuestion.question}</h3>
                        <Badge className={`${lesson.difficulty <= 2 ? 'bg-green-500' : lesson.difficulty <= 4 ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                          Dificultad: {lesson.difficulty}/5
                        </Badge>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div>+{currentQuestion.points} puntos</div>
                        <div>+{currentQuestion.xp} XP</div>
                      </div>
                    </div>

                    {/* Opciones de respuesta */}
                    {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                      <div className="space-y-2">
                        {currentQuestion.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedAnswer(option)}
                            className={`w-full p-3 text-left rounded-lg border transition-colors ${
                              selectedAnswer === option
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 ${
                                selectedAnswer === option
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-gray-300'
                              }`}>
                                {selectedAnswer === option && (
                                  <div className="w-full h-full rounded-full bg-white border-2 border-green-500"></div>
                                )}
                              </div>
                              <span>{option}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Respuesta de completar */}
                    {currentQuestion.type === 'fill-blank' && (
                      <div className="space-y-2">
                        <Input
                          value={selectedAnswer}
                          onChange={(e) => setSelectedAnswer(e.target.value)}
                          placeholder="Escribe tu respuesta aquí..."
                          className="text-lg p-4"
                        />
                      </div>
                    )}

                    {/* Pista si está disponible */}
                    {showHint && currentQuestion.hints && (
                      <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5" />
                            <div>
                              <p className="font-medium text-blue-900 mb-1">Pista</p>
                              <p className="text-blue-700">{currentQuestion.hints[0]}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* IA Insights durante la práctica */}
                    {aiInsights.length > 0 && (
                      <Card className="border-purple-200 bg-purple-50">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Brain className="h-5 w-5 text-purple-500 mt-0.5" />
                            <div>
                              <p className="font-medium text-purple-900 mb-1">IA Adaptativa</p>
                              {aiInsights.map((insight, index) => (
                                <p key={index} className="text-purple-700 text-sm">{insight}</p>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Botones de acción */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {!showHint && currentQuestion.hints && (
                    <Button variant="outline" onClick={handleShowHint}>
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Pista
                    </Button>
                  )}
                </div>

                <div className="flex gap-2">
                  {currentQuestionIndex > 0 && (
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Anterior
                    </Button>
                  )}
                  
                  <Button 
                    onClick={handleAnswerSubmit}
                    disabled={!selectedAnswer}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    {isLastQuestion ? 'Finalizar' : 'Siguiente'}
                    {!isLastQuestion && <ArrowRight className="h-4 w-4 ml-2" />}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Fase de resultados */}
          {currentPhase === 'results' && (
            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {calculateScore() >= lesson.adaptiveSettings.minAccuracy ? (
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  ) : (
                    <XCircle className="h-10 w-10 text-red-600" />
                  )}
                </div>
                
                <h3 className="text-2xl font-bold mb-2">
                  {calculateScore() >= lesson.adaptiveSettings.minAccuracy ? 
                    '¡Lección Completada!' : 'Intenta de Nuevo'}
                </h3>
                
                <div className={`text-4xl font-bold mb-4 ${getScoreColor(calculateScore())}`}>
                  {calculateScore()}%
                </div>

                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">
                      +{calculateScore() >= lesson.adaptiveSettings.minAccuracy ? lesson.rewards.points : 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Puntos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600">
                      +{calculateScore() >= lesson.adaptiveSettings.minAccuracy ? lesson.rewards.xp : 0}
                    </div>
                    <div className="text-xs text-muted-foreground">XP</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">{formatTime(timeSpent)}</div>
                    <div className="text-xs text-muted-foreground">Tiempo</div>
                  </div>
                </div>
              </div>

              {/* Desglose de respuestas */}
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-medium mb-4">Desglose de Respuestas</h4>
                  <div className="space-y-3">
                    {userAnswers.map((answer, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          {answer.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <span className="text-sm">Pregunta {index + 1}</span>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div>{formatTime(answer.timeSpent)}</div>
                          {answer.hintsUsed > 0 && (
                            <div className="text-xs">Pistas usadas: {answer.hintsUsed}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* IA Insights finales */}
              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Brain className="h-6 w-6 text-purple-500" />
                    <div>
                      <h4 className="font-medium text-purple-900">Análisis de IA</h4>
                      <p className="text-sm text-purple-700">
                        Recomendaciones personalizadas basadas en tu rendimiento
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {calculateScore() >= 90 && (
                      <p className="text-sm text-purple-700">
                        • Excelente rendimiento. La IA sugiere aumentar la dificultad en próximas lecciones.
                      </p>
                    )}
                    {hintsUsed > 0 && (
                      <p className="text-sm text-purple-700">
                        • Usaste {hintsUsed} pista(s). Considera repasar la teoría para reducir la dependencia de pistas.
                      </p>
                    )}
                    {timeSpent < 60 && (
                      <p className="text-sm text-purple-700">
                        • Tiempo de resolución rápido. Podrías beneficiarte de problemas más complejos.
                      </p>
                    )}
                    <p className="text-sm text-purple-700">
                      • Dificultad recomendada para la próxima lección: Nivel {AdaptiveAI.calculateNextDifficulty([])}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Botones finales */}
              <div className="flex gap-3 justify-center">
                {calculateScore() < lesson.adaptiveSettings.minAccuracy && lesson.adaptiveSettings.retryAllowed && (
                  <Button onClick={handleRetry} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Intentar de Nuevo
                  </Button>
                )}
                
                <Button 
                  onClick={() => onComplete(lesson.id, calculateScore(), timeSpent)}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Continuar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}