import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Separator } from "../../../components/ui/separator";
import { Switch } from "../../../components/ui/switch";
import { 
  Plus, 
  Trash2, 
  Brain, 
  BookOpen, 
  Target, 
  Star,
  Clock,
  Save
} from "lucide-react";
import { type Lesson, type Question } from "../../data/lessons";
import { mathTopics } from "../../data/mathTopics";

interface LessonCreatorProps {
  assignmentId: string;
  topicId: string;
  onLessonCreated: (lesson: Lesson) => void;
  onClose: () => void;
}

export function LessonCreator({ assignmentId, topicId, onLessonCreated, onClose }: LessonCreatorProps) {
  const [currentTab, setCurrentTab] = useState("basic");
  const [lessonData, setLessonData] = useState({
    title: "",
    description: "",
    estimatedDuration: 15,
    difficulty: 2,
    theory: "",
    examples: [""],
    points: 50,
    xp: 75,
    minAccuracy: 70,
    adaptiveDifficulty: true,
    retryAllowed: true,
    maxRetries: 3
  });

  const [questions, setQuestions] = useState<Omit<Question, 'id'>[]>([{
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    difficulty: 2,
    points: 10,
    xp: 15,
    hints: ['']
  }]);

  const topic = mathTopics.find(t => t.id === topicId);

  const addQuestion = () => {
    setQuestions(prev => [...prev, {
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      difficulty: lessonData.difficulty,
      points: 10,
      xp: 15,
      hints: ['']
    }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    setQuestions(prev => prev.map((q, i) => 
      i === index ? { ...q, [field]: value } : q
    ));
  };

  const addExample = () => {
    setLessonData(prev => ({
      ...prev,
      examples: [...prev.examples, '']
    }));
  };

  const updateExample = (index: number, value: string) => {
    setLessonData(prev => ({
      ...prev,
      examples: prev.examples.map((ex, i) => i === index ? value : ex)
    }));
  };

  const removeExample = (index: number) => {
    setLessonData(prev => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    const newLesson: Lesson = {
      id: `lesson_${Date.now()}`,
      title: lessonData.title,
      description: lessonData.description,
      topicId: topicId,
      subtopicId: topic?.subtopics[0]?.id || '',
      assignmentId: assignmentId,
      order: 1,
      estimatedDuration: lessonData.estimatedDuration,
      difficulty: lessonData.difficulty as 1 | 2 | 3 | 4 | 5,
      prerequisiteIds: [],
      content: {
        theory: lessonData.theory,
        examples: lessonData.examples.filter(ex => ex.trim() !== ''),
        visualAids: []
      },
      questions: questions.map((q, i) => ({ ...q, id: `q_${Date.now()}_${i}` })) as Question[],
      rewards: {
        points: lessonData.points,
        xp: lessonData.xp,
        badges: []
      },
      adaptiveSettings: {
        minAccuracy: lessonData.minAccuracy,
        adaptiveDifficulty: lessonData.adaptiveDifficulty,
        retryAllowed: lessonData.retryAllowed,
        maxRetries: lessonData.maxRetries
      },
      unlocked: true,
      completed: false
    };

    onLessonCreated(newLesson);
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

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-500" />
            Crear Nueva Lección
          </DialogTitle>
          <DialogDescription>
            Tema: {topic?.name} • Diseña contenido educativo adaptativo con IA
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="content">Contenido</TabsTrigger>
            <TabsTrigger value="questions">Preguntas</TabsTrigger>
            <TabsTrigger value="ai-settings">IA & Gamificación</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información Básica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título de la Lección *</Label>
                      <Input
                        id="title"
                        value={lessonData.title}
                        onChange={(e) => setLessonData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="ej: Multiplicación Básica"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duración Estimada (min)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={lessonData.estimatedDuration}
                        onChange={(e) => setLessonData(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 15 }))}
                        min="5"
                        max="60"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={lessonData.description}
                      onChange={(e) => setLessonData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe los objetivos y contenido de la lección"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Dificultad</Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(level => (
                        <button
                          key={level}
                          onClick={() => setLessonData(prev => ({ ...prev, difficulty: level }))}
                          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            lessonData.difficulty === level
                              ? `${getDifficultyColor(level)} text-white border-transparent`
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Dificultad seleccionada: {getDifficultyLabel(lessonData.difficulty)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contenido Teórico</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theory">Teoría Principal *</Label>
                    <Textarea
                      id="theory"
                      value={lessonData.theory}
                      onChange={(e) => setLessonData(prev => ({ ...prev, theory: e.target.value }))}
                      placeholder="Explica los conceptos fundamentales que los estudiantes deben entender"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Ejemplos Prácticos</Label>
                      <Button variant="outline" size="sm" onClick={addExample}>
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar Ejemplo
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {lessonData.examples.map((example, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={example}
                            onChange={(e) => updateExample(index, e.target.value)}
                            placeholder={`Ejemplo ${index + 1}: ej. 3 × 4 = 12`}
                          />
                          {lessonData.examples.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeExample(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="questions" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Preguntas de Práctica</h3>
                  <p className="text-sm text-muted-foreground">
                    {questions.length} pregunta(s) • IA adaptará según el rendimiento
                  </p>
                </div>
                <Button onClick={addQuestion} className="bg-green-500 hover:bg-green-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Pregunta
                </Button>
              </div>

              <div className="space-y-4">
                {questions.map((question, questionIndex) => (
                  <Card key={questionIndex}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Pregunta {questionIndex + 1}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getDifficultyColor(question.difficulty)} text-white`}>
                            Nivel {question.difficulty}
                          </Badge>
                          {questions.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeQuestion(questionIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tipo de Pregunta</Label>
                          <Select
                            value={question.type}
                            onValueChange={(value: 'multiple-choice' | 'fill-blank') => 
                              updateQuestion(questionIndex, 'type', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="multiple-choice">Opción Múltiple</SelectItem>
                              <SelectItem value="fill-blank">Completar</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Dificultad</Label>
                          <Select
                            value={question.difficulty.toString()}
                            onValueChange={(value) => 
                              updateQuestion(questionIndex, 'difficulty', parseInt(value))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5].map(level => (
                                <SelectItem key={level} value={level.toString()}>
                                  Nivel {level} - {getDifficultyLabel(level)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Pregunta *</Label>
                        <Textarea
                          value={question.question}
                          onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                          placeholder="¿Cuál es el resultado de 7 × 8?"
                          rows={2}
                        />
                      </div>

                      {question.type === 'multiple-choice' && (
                        <div className="space-y-2">
                          <Label>Opciones de Respuesta</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {question.options?.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex gap-2 items-center">
                                <Input
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...(question.options || [])];
                                    newOptions[optionIndex] = e.target.value;
                                    updateQuestion(questionIndex, 'options', newOptions);
                                  }}
                                  placeholder={`Opción ${optionIndex + 1}`}
                                />
                                <input
                                  type="radio"
                                  name={`correct-${questionIndex}`}
                                  checked={question.correctAnswer === option}
                                  onChange={() => updateQuestion(questionIndex, 'correctAnswer', option)}
                                  className="w-4 h-4 text-green-500"
                                />
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Marca el radio button de la respuesta correcta
                          </p>
                        </div>
                      )}

                      {question.type === 'fill-blank' && (
                        <div className="space-y-2">
                          <Label>Respuesta Correcta *</Label>
                          <Input
                            value={question.correctAnswer as string}
                            onChange={(e) => updateQuestion(questionIndex, 'correctAnswer', e.target.value)}
                            placeholder="12"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Explicación</Label>
                        <Textarea
                          value={question.explanation}
                          onChange={(e) => updateQuestion(questionIndex, 'explanation', e.target.value)}
                          placeholder="Explica por qué esta es la respuesta correcta..."
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Pista (Opcional)</Label>
                        <Input
                          value={question.hints?.[0] || ''}
                          onChange={(e) => updateQuestion(questionIndex, 'hints', [e.target.value])}
                          placeholder="Una pista para ayudar al estudiante..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Puntos</Label>
                          <Input
                            type="number"
                            value={question.points}
                            onChange={(e) => updateQuestion(questionIndex, 'points', parseInt(e.target.value) || 10)}
                            min="1"
                            max="100"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>XP</Label>
                          <Input
                            type="number"
                            value={question.xp}
                            onChange={(e) => updateQuestion(questionIndex, 'xp', parseInt(e.target.value) || 15)}
                            min="1"
                            max="200"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ai-settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    Configuración de IA Adaptativa
                  </CardTitle>
                  <CardDescription>
                    Personaliza cómo la IA adaptará la experiencia de aprendizaje
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Precisión Mínima para Aprobar (%)</Label>
                      <Input
                        type="number"
                        value={lessonData.minAccuracy}
                        onChange={(e) => setLessonData(prev => ({ ...prev, minAccuracy: parseInt(e.target.value) || 70 }))}
                        min="0"
                        max="100"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Máximo de Reintentos</Label>
                      <Input
                        type="number"
                        value={lessonData.maxRetries}
                        onChange={(e) => setLessonData(prev => ({ ...prev, maxRetries: parseInt(e.target.value) || 3 }))}
                        min="1"
                        max="10"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Dificultad Adaptativa</Label>
                        <p className="text-sm text-muted-foreground">
                          La IA ajustará la dificultad basada en el rendimiento del estudiante
                        </p>
                      </div>
                      <Switch
                        checked={lessonData.adaptiveDifficulty}
                        onCheckedChange={(checked) => setLessonData(prev => ({ ...prev, adaptiveDifficulty: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Permitir Reintentos</Label>
                        <p className="text-sm text-muted-foreground">
                          Los estudiantes pueden volver a intentar la lección si no aprueban
                        </p>
                      </div>
                      <Switch
                        checked={lessonData.retryAllowed}
                        onCheckedChange={(checked) => setLessonData(prev => ({ ...prev, retryAllowed: checked }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-500" />
                    Recompensas Gamificadas
                  </CardTitle>
                  <CardDescription>
                    Configura los puntos y experiencia que ganarán los estudiantes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Puntos por Completar
                      </Label>
                      <Input
                        type="number"
                        value={lessonData.points}
                        onChange={(e) => setLessonData(prev => ({ ...prev, points: parseInt(e.target.value) || 50 }))}
                        min="0"
                        max="500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Experiencia (XP)
                      </Label>
                      <Input
                        type="number"
                        value={lessonData.xp}
                        onChange={(e) => setLessonData(prev => ({ ...prev, xp: parseInt(e.target.value) || 75 }))}
                        min="0"
                        max="1000"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Vista Previa de Recompensas</h4>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{lessonData.points} puntos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">{lessonData.xp} XP</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{lessonData.estimatedDuration} min</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600"
            disabled={!lessonData.title || !lessonData.theory || questions.some(q => !q.question)}
          >
            <Save className="h-4 w-4 mr-2" />
            Crear Lección
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}