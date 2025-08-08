export interface Assignment {
  id: string;
  title: string;
  description: string;
  topicId: string;
  subtopicIds: string[];
  teacherId: string;
  assignedStudents: string[];
  dueDate: Date;
  points: number;
  xp: number;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'draft' | 'published' | 'completed';
  createdAt: Date;
  completedBy: string[];
}

export const mockAssignments: Assignment[] = [
  {
    id: "assignment1",
    title: "Domina la Multiplicación",
    description: "Completa todos los ejercicios de multiplicación básica",
    topicId: "arithmetic",
    subtopicIds: ["multiplication"],
    teacherId: "teacher1",
    assignedStudents: ["student1", "student2", "student3"],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
    points: 100,
    xp: 200,
    difficulty: "medium",
    status: "published",
    createdAt: new Date(),
    completedBy: ["student2"]
  }
];