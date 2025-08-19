export interface Question {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'drag-drop' | 'interactive';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  points: number;
  xp: number;
  hints?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  topicId: string;
  subtopicId: string;
  assignmentId?: string;
  order: number;
  estimatedDuration: number; // en minutos
  difficulty: 1 | 2 | 3 | 4 | 5;
  prerequisiteIds: string[];
  content: {
    theory: string;
    examples: string[];
    visualAids?: string[];
  };
  questions: Question[];
  rewards: {
    points: number;
    xp: number;
    badges?: string[];
  };
  adaptiveSettings: {
    minAccuracy: number; // % mínimo para pasar
    adaptiveDifficulty: boolean;
    retryAllowed: boolean;
    maxRetries: number;
  };
  unlocked: boolean;
  completed: boolean;
  userProgress?: {
    attempts: number;
    bestScore: number;
    timeSpent: number;
    completedAt?: Date;
    currentStreak: number;
  };
}

export interface LessonProgress {
  lessonId: string;
  userId: string;
  attempts: LessonAttempt[];
  currentStreak: number;
  bestScore: number;
  totalTimeSpent: number;
  isCompleted: boolean;
  completedAt?: Date;
  nextRecommendedDifficulty: number;
}

export interface LessonAttempt {
  id: string;
  timestamp: Date;
  score: number;
  timeSpent: number;
  answers: UserAnswer[];
  aiAdaptations: {
    difficultyAdjustment: number;
    hintsUsed: number;
    adaptiveContent: boolean;
  };
}

export interface UserAnswer {
  questionId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  timeSpent: number;
  hintsUsed: number;
}

// Algoritmo de IA Adaptativa
export class AdaptiveAI {
  static calculateNextDifficulty(attempts: LessonAttempt[]): number {
    if (attempts.length === 0) return 2; // Dificultad media por defecto
    
    const recent = attempts.slice(-3); // Últimos 3 intentos
    const avgScore = recent.reduce((acc, att) => acc + att.score, 0) / recent.length;
    const avgTime = recent.reduce((acc, att) => acc + att.timeSpent, 0) / recent.length;
    
    // Algoritmo de ajuste de dificultad
    if (avgScore >= 90 && avgTime <= 60) return Math.min(5, recent[0].aiAdaptations.difficultyAdjustment + 1);
    if (avgScore >= 75 && avgTime <= 120) return Math.min(4, recent[0].aiAdaptations.difficultyAdjustment + 0.5);
    if (avgScore >= 60) return recent[0].aiAdaptations.difficultyAdjustment;
    if (avgScore >= 40) return Math.max(1, recent[0].aiAdaptations.difficultyAdjustment - 0.5);
    return Math.max(1, recent[0].aiAdaptations.difficultyAdjustment - 1);
  }

  static shouldProvideHint(currentAttempt: UserAnswer[], questionIndex: number): boolean {
    const incorrectAnswers = currentAttempt.filter(a => !a.isCorrect).length;
    const timeSpent = currentAttempt[questionIndex]?.timeSpent || 0;
    
    return incorrectAnswers >= 2 || timeSpent > 60;
  }

  static generateAdaptiveQuestions(baseDifficulty: number, userPerformance: number): Question[] {
    // Lógica para generar preguntas adaptativas basadas en rendimiento
    const adjustedDifficulty = Math.max(1, Math.min(5, 
      baseDifficulty + (userPerformance > 80 ? 1 : userPerformance < 50 ? -1 : 0)
    ));
    
    return mockQuestions.filter(q => q.difficulty === adjustedDifficulty);
  }
}

// Mock data para desarrollo
export const mockQuestions: Question[] = [
  {
    id: "q1",
    type: "multiple-choice",
    question: "¿Cuál es el resultado de 7 × 8?",
    options: ["54", "56", "58", "62"],
    correctAnswer: "56",
    explanation: "7 × 8 = 56. Puedes recordarlo pensando que 7 × 8 es igual a (7 × 10) - (7 × 2) = 70 - 14 = 56",
    difficulty: 2,
    points: 10,
    xp: 15,
    hints: ["Intenta descomponer: 7 × 8 = 7 × (10 - 2)", "7 × 10 = 70, ahora resta 7 × 2"]
  },
  {
    id: "q2",
    type: "fill-blank",
    question: "Complete la ecuación: 12 × _ = 144",
    correctAnswer: "12",
    explanation: "144 ÷ 12 = 12, por lo tanto 12 × 12 = 144",
    difficulty: 3,
    points: 15,
    xp: 20,
    hints: ["¿Qué número multiplicado por 12 da 144?", "Piensa en la raíz cuadrada de 144"]
  }
];

export const mockLessons: Lesson[] = [
  {
    id: "lesson1",
    title: "Multiplicación Básica",
    description: "Aprende los fundamentos de la multiplicación con números del 1 al 10",
    topicId: "arithmetic",
    subtopicId: "multiplication",
    order: 1,
    estimatedDuration: 15,
    difficulty: 2,
    prerequisiteIds: [],
    content: {
      theory: "La multiplicación es una operación matemática que representa la suma repetida de un número.",
      examples: [
        "3 × 4 = 3 + 3 + 3 + 3 = 12",
        "5 × 2 = 5 + 5 = 10"
      ],
      visualAids: ["multiplication-visual.svg"]
    },
    questions: mockQuestions.slice(0, 2),
    rewards: {
      points: 50,
      xp: 75,
      badges: ["first-multiplication"]
    },
    adaptiveSettings: {
      minAccuracy: 70,
      adaptiveDifficulty: true,
      retryAllowed: true,
      maxRetries: 3
    },
    unlocked: true,
    completed: false
  },
  {
    id: "lesson2", 
    title: "Tablas de Multiplicar Avanzadas",
    description: "Domina las tablas del 6 al 12 con técnicas avanzadas",
    topicId: "arithmetic",
    subtopicId: "multiplication",
    order: 2,
    estimatedDuration: 20,
    difficulty: 4,
    prerequisiteIds: ["lesson1"],
    content: {
      theory: "Las tablas de multiplicar avanzadas requieren estrategias y patrones para memorizar eficientemente.",
      examples: [
        "Para la tabla del 9: 9 × 7 = (10 × 7) - 7 = 70 - 7 = 63",
        "Para la tabla del 11: 11 × 34 = 11 × 30 + 11 × 4 = 330 + 44 = 374"
      ]
    },
    questions: mockQuestions.slice(1, 3),
    rewards: {
      points: 100,
      xp: 150,
      badges: ["multiplication-master"]
    },
    adaptiveSettings: {
      minAccuracy: 80,
      adaptiveDifficulty: true,
      retryAllowed: true,
      maxRetries: 2
    },
    unlocked: false,
    completed: false
  }
];

export const mockLessonProgress: LessonProgress[] = [
  {
    lessonId: "lesson1",
    userId: "student1",
    attempts: [],
    currentStreak: 0,
    bestScore: 0,
    totalTimeSpent: 0,
    isCompleted: false,
    nextRecommendedDifficulty: 2
  }
];