import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import {
  selectFilteredUsers,
  setSearchTerm,
  setFilter,
} from "../../store/usersSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Checkbox } from "../../../components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Calendar, Users, BookOpen, Plus } from "lucide-react";
import { type Assignment } from "../../data/assignments";
import { selectUser, type User } from "@/store/authSlice";
import axios from "axios";

// 1. Definir una interfaz para el estado del formulario para un tipado robusto.
type Difficulty = "easy" | "medium" | "hard";
type Status = "draft" | "published";

interface FormDataState {
  title: string;
  description: string;
  mainTheme: string;
  subtopicThemes: string[];
  assignedStudents: string[];
  dueDate: string;
  points: number;
  experience: number;
  difficulty: Difficulty;
  status: Status;
}

interface CreateAssignmentModalProps {
  onCreateAssignment: (
    assignment: Omit<Assignment, "createdAt" | "completedBy" | "teacherId">
  ) => void;
}

export function CreateAssignmentModal({
  onCreateAssignment,
}: CreateAssignmentModalProps) {
  const currentUser = useSelector(selectUser) as User;
  const dispatch: AppDispatch = useDispatch();
  const [newSubtopic, setNewSubtopic] = useState("");
  const [customSubtopics, setCustomSubtopics] = useState<string[]>([]);

  // 2. Establecer el filtro para mostrar solo estudiantes en este componente.
  useState(() => {
    dispatch(setFilter({ role: "student" }));
  });

  const filteredStudents = useSelector(selectFilteredUsers);
  const searchTerm = useSelector((state: RootState) => state.users.searchTerm);
  const allStudentsCount = useSelector(
    (state: RootState) =>
      state.users.users.filter((u) => u.role === "student").length
  );

  const [open, setOpen] = useState(false);
  // 3. Usar la interfaz para tipar el estado del formulario.
  const [formData, setFormData] = useState<FormDataState>({
    title: "",
    description: "",
    mainTheme: "",
    subtopicThemes: [],
    assignedStudents: [],
    dueDate: "",
    points: 50,
    experience: 100,
    difficulty: "medium",
    status: "draft",
  });

  const handleStudentSelection = (studentId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      assignedStudents: checked
        ? [...prev.assignedStudents, studentId]
        : prev.assignedStudents.filter((id) => id !== studentId),
    }));
  };

  const handleAddSubtopic = () => {
    if (newSubtopic.trim() === "") return;
    setCustomSubtopics((prev) => [...prev, newSubtopic.trim()]);
    setFormData((prev) => ({
      ...prev,
      subtopicThemes: [...prev.subtopicThemes, newSubtopic.trim()],
    }));
    setNewSubtopic("");
  };

  const handleSave = (status: Status) => {
    if (
      !formData.title ||
      !formData.mainTheme ||
      formData.assignedStudents.length === 0
    ) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }
    const newAssignment = {
      ...formData,
      teacherId: currentUser._id,
      status,
      dueDate: new Date(formData.dueDate),
    };
    console.log(currentUser._id);
    onCreateAssignment(newAssignment);
    setOpen(false);
    setFormData({
      title: "",
      description: "",
      mainTheme: "",
      subtopicThemes: [],
      assignedStudents: [],
      dueDate: "",
      points: 50,
      experience: 100,
      difficulty: "medium",
      status: "draft",
    });
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
        </DialogHeader>

        <form id="assignment-form" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
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
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="ej: Domina la Multiplicación"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe los objetivos"
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
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          dueDate: e.target.value,
                        }))
                      }
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Dificultad</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value: Difficulty) =>
                        setFormData((prev) => ({ ...prev, difficulty: value }))
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
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contenido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tema Principal *</Label>
                    <Input
                      value={formData.mainTheme}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          mainTheme: e.target.value,
                        }))
                      }
                      placeholder="ej: Números"
                      required
                    />
                  </div>
                  {formData.mainTheme && (
                    <div className="space-y-2">
                      <Label>Subtemas</Label>
                      <div className="space-y-1 max-h-32 overflow-y-auto border p-2 rounded">
                        {customSubtopics.map((sub, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`subtopic-${index}`}
                              checked={formData.subtopicThemes.includes(sub)}
                              onCheckedChange={(checked) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  subtopicThemes: checked
                                    ? [...prev.subtopicThemes, sub]
                                    : prev.subtopicThemes.filter(
                                        (name) => name !== sub
                                      ),
                                }));
                              }}
                            />
                            <Label
                              htmlFor={`subtopic-${index}`}
                              className="cursor-pointer"
                            >
                              {sub}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Nuevo subtema"
                          value={newSubtopic}
                          onChange={(e) => setNewSubtopic(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSubtopic();
                            }
                          }}
                        />
                        <Button type="button" onClick={handleAddSubtopic}>
                          Agregar
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Users className="h-4 w-4 inline mr-2" />
                    Estudiantes
                  </CardTitle>
                  {/* 4. Input conectado a Redux */}
                  <Input
                    className="mt-2"
                    placeholder="Buscar estudiantes por email..."
                    value={searchTerm}
                    onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                  />
                  <CardDescription>
                    {formData.assignedStudents.length} de {allStudentsCount}{" "}
                    seleccionados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {/* 5. Lógica de "Seleccionar todos" conectada a los estudiantes filtrados */}
                    <div className="flex items-center space-x-2 mb-3">
                      <Checkbox
                        id="select-all"
                        checked={
                          formData.assignedStudents.length ===
                            filteredStudents.length &&
                          filteredStudents.length > 0
                        }
                        onCheckedChange={(checked) => {
                          const studentIds = filteredStudents.map((s) => s._id);
                          setFormData((prev) => ({
                            ...prev,
                            assignedStudents: checked ? studentIds : [],
                          }));
                        }}
                      />
                      <Label htmlFor="select-all" className="font-medium">
                        Seleccionar todos ({filteredStudents.length})
                      </Label>
                    </div>

                    {/* 6. Mapeo sobre los estudiantes filtrados desde Redux */}
                    {filteredStudents.map((student) => (
                      <div
                        key={student._id}
                        className="flex items-center justify-between p-2 rounded border hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`student-${student._id}`}
                            checked={formData.assignedStudents.includes(
                              student._id
                            )}
                            onCheckedChange={(checked) =>
                              handleStudentSelection(
                                student._id,
                                checked as boolean
                              )
                            }
                          />
                          {student.profilePicture ? (
                            <img
                              src={student.profilePicture}
                              alt={student.name}
                              className="h-8 w-8 rounded-full"
                            />
                          ) : (
                            <span className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                              {student.name.charAt(0)}
                            </span>
                          )}
                          <div>
                            <Label
                              htmlFor={`student-${student._id}`}
                              className="text-sm font-medium cursor-pointer"
                            >
                              {student.name}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              {student.email}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {student.groups.length} grupos
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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
              onClick={() => handleSave("draft")}
            >
              Guardar Borrador
            </Button>
            <Button
              type="button"
              className="bg-green-500 hover:bg-green-600"
              onClick={() => handleSave("published")}
            >
              Publicar Asignación
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
