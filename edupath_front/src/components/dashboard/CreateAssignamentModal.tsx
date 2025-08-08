import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Checkbox } from "../../../components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Calendar, Clock, Users, Target, Star, BookOpen, Plus } from "lucide-react";
import { mathTopics } from "../../data/mathTopics";
import { mockStudents } from "../../data/users";
import { type Assignment } from "../../data/assignments";

interface CreateAssignmentModalProps {
  onCreateAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt' | 'completedBy' | 'teacherId'>) => void;
}

export function CreateAssignmentModal({ onCreateAssignment }: CreateAssignmentModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    topicId: "",
    subtopicIds: [] as string[],
    assignedStudents: [] as string[],
    dueDate: "",
    points: 50,
    xp: 100,
    difficulty: "medium" as const,
    status: "draft" as const
  });

  const selectedTopic = mathTopics.find(topic => topic.id === formData.topicId);
  const availableSubtopics = selectedTopic?.subtopics || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.topicId || formData.assignedStudents.length === 0) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    const newAssignment: Omit<Assignment, 'id' | 'createdAt' | 'completedBy' | 'teacherId'> = {
      ...formData,
      dueDate: new Date(formData.dueDate)
    };

    onCreateAssignment(newAssignment);
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      topicId: "",
      subtopicIds: [],
      assignedStudents: [],
      dueDate: "",
      points: 50,
      xp: 100,
      difficulty: "medium",
      status: "draft"
    });
    
    setOpen(false);
  };

  const handleStudentSelection = (studentId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        assignedStudents: [...prev.assignedStudents, studentId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        assignedStudents: prev.assignedStudents.filter(id => id !== studentId)
      }));
    }
  };

  const handleSubtopicSelection = (subtopicId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        subtopicIds: [...prev.subtopicIds, subtopicId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        subtopicIds: prev.subtopicIds.filter(id => id !== subtopicId)
      }));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-500 hover:bg-green-600">
          <Plus className="h-4 w-4 mr-2" />
          Crear Asignación
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-500" />
            Crear Nueva Asignación
          </DialogTitle>
          <DialogDescription>
            Crea una asignación personalizada para tus estudiantes
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Información básica */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información Básica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título de la Asignación *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="ej: Domina la Multiplicación"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe los objetivos y contenido de la asignación"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Fecha Límite *
                      </Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Dificultad</Label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={(value: "easy" | "medium" | "hard") => 
                          setFormData(prev => ({ ...prev, difficulty: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              Fácil
                            </div>
                          </SelectItem>
                          <SelectItem value="medium">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              Medio
                            </div>
                          </SelectItem>
                          <SelectItem value="hard">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              Difícil
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="points">
                        <Target className="h-4 w-4 inline mr-1" />
                        Puntos
                      </Label>
                      <Input
                        id="points"
                        type="number"
                        value={formData.points}
                        onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                        min="0"
                        max="500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="xp">
                        <Star className="h-4 w-4 inline mr-1" />
                        Experiencia (XP)
                      </Label>
                      <Input
                        id="xp"
                        type="number"
                        value={formData.xp}
                        onChange={(e) => setFormData(prev => ({ ...prev, xp: parseInt(e.target.value) || 0 }))}
                        min="0"
                        max="1000"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contenido y estudiantes */}
            <div className="space-y-4">
              {/* Selección de tema */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contenido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tema Principal *</Label>
                    <Select
                      value={formData.topicId}
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        topicId: value,
                        subtopicIds: [] // Reset subtopics when topic changes
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tema" />
                      </SelectTrigger>
                      <SelectContent>
                        {mathTopics.map((topic) => (
                          <SelectItem key={topic.id} value={topic.id}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${topic.color}`}></div>
                              {topic.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedTopic && (
                    <div className="space-y-2">
                      <Label>Subtemas (Opcional)</Label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {availableSubtopics.map((subtopic) => (
                          <div key={subtopic.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`subtopic-${subtopic.id}`}
                              checked={formData.subtopicIds.includes(subtopic.id)}
                              onCheckedChange={(checked) => 
                                handleSubtopicSelection(subtopic.id, checked as boolean)
                              }
                              disabled={!subtopic.unlocked}
                            />
                            <Label 
                              htmlFor={`subtopic-${subtopic.id}`}
                              className={`text-sm ${!subtopic.unlocked ? 'text-gray-400' : ''}`}
                            >
                              {subtopic.name}
                              {!subtopic.unlocked && " (Bloqueado)"}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Selección de estudiantes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Users className="h-4 w-4 inline mr-2" />
                    Estudiantes
                  </CardTitle>
                  <CardDescription>
                    {formData.assignedStudents.length} de {mockStudents.length} seleccionados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    <div className="flex items-center space-x-2 mb-3">
                      <Checkbox
                        id="select-all"
                        checked={formData.assignedStudents.length === mockStudents.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData(prev => ({ 
                              ...prev, 
                              assignedStudents: mockStudents.map(s => s.userId) 
                            }));
                          } else {
                            setFormData(prev => ({ ...prev, assignedStudents: [] }));
                          }
                        }}
                      />
                      <Label htmlFor="select-all" className="font-medium">
                        Seleccionar todos
                      </Label>
                    </div>
                    
                    {mockStudents.map((student) => (
                      <div key={student.userId} className="flex items-center justify-between p-2 rounded border hover:bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`student-${student.userId}`}
                            checked={formData.assignedStudents.includes(student.userId)}
                            onCheckedChange={(checked) => 
                              handleStudentSelection(student.userId, checked as boolean)
                            }
                          />
                          <span className="text-lg">{student.avatar}</span>
                          <div>
                            <Label 
                              htmlFor={`student-${student.userId}`}
                              className="text-sm font-medium cursor-pointer"
                            >
                              {student.name}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Nivel {student.level} • {student.xp} XP
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {student.badges.length} insignias
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Vista previa */}
          {formData.title && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg text-green-700">Vista Previa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="font-medium">{formData.title}</h3>
                    {formData.description && (
                      <p className="text-sm text-muted-foreground">{formData.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm">
                      {formData.dueDate && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(formData.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <Badge className={`${getDifficultyColor(formData.difficulty)} text-white`}>
                        {formData.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <Target className="h-4 w-4 mx-auto text-green-600" />
                        <p className="text-sm font-medium">{formData.points}</p>
                        <p className="text-xs text-muted-foreground">Puntos</p>
                      </div>
                      <div className="text-center">
                        <Star className="h-4 w-4 mx-auto text-purple-600" />
                        <p className="text-sm font-medium">{formData.xp}</p>
                        <p className="text-xs text-muted-foreground">XP</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData(prev => ({ ...prev, status: "draft" }))}
            >
              Guardar Borrador
            </Button>
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600"
              onClick={() => setFormData(prev => ({ ...prev, status: "published" }))}
            >
              Publicar Asignación
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}