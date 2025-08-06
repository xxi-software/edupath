export interface Exercise {
  id: string;
  question: string;
  type: 'multiple-choice' | 'fill-blank' | 'true-false';
  options?: string[];
  correctAnswer: string | number;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  xp: number;
}

export interface Subtopic {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  completed: boolean;
  progress: number;
  unlocked: boolean;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  subtopics: Subtopic[];
  completed: boolean;
  progress: number;
  unlocked: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned: boolean;
  dateEarned?: Date;
  requirement: string;
}

export interface UserProgress {
  userId: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  totalPoints: number;
  streakDays: number;
  badges: Badge[];
  completedTopics: string[];
  currentTopic?: string;
}

// Mock data para matemáticas
export const mathTopics: Topic[] = [
  {
    id: "arithmetic",
    name: "Aritmética Básica",
    description: "Fundamentos de números y operaciones",
    icon: "calculator",
    color: "bg-blue-500",
    unlocked: true,
    completed: false,
    progress: 75,
    subtopics: [
      {
        id: "addition",
        name: "Suma",
        description: "Operaciones de suma básica",
        completed: true,
        progress: 100,
        unlocked: true,
        exercises: [
          {
            id: "add1",
            question: "¿Cuánto es 15 + 23?",
            type: "multiple-choice",
            options: ["35", "38", "41", "33"],
            correctAnswer: "38",
            difficulty: "easy",
            points: 10,
            xp: 25
          },
          {
            id: "add2",
            question: "Resuelve: 127 + 89 = ?",
            type: "fill-blank",
            correctAnswer: 216,
            difficulty: "medium",
            points: 15,
            xp: 35
          }
        ]
      },
      {
        id: "subtraction",
        name: "Resta",
        description: "Operaciones de resta básica",
        completed: true,
        progress: 100,
        unlocked: true,
        exercises: [
          {
            id: "sub1",
            question: "¿Cuánto es 45 - 17?",
            type: "multiple-choice",
            options: ["28", "32", "25", "30"],
            correctAnswer: "28",
            difficulty: "easy",
            points: 10,
            xp: 25
          }
        ]
      },
      {
        id: "multiplication",
        name: "Multiplicación",
        description: "Tablas de multiplicar y operaciones",
        completed: false,
        progress: 40,
        unlocked: true,
        exercises: [
          {
            id: "mult1",
            question: "¿Cuánto es 7 × 8?",
            type: "multiple-choice",
            options: ["54", "56", "48", "64"],
            correctAnswer: "56",
            difficulty: "easy",
            points: 10,
            xp: 25
          }
        ]
      },
      {
        id: "division",
        name: "División",
        description: "Operaciones de división básica",
        completed: false,
        progress: 0,
        unlocked: false,
        exercises: []
      }
    ]
  },
  {
    id: "algebra",
    name: "Álgebra Inicial",
    description: "Introducción a variables y ecuaciones",
    icon: "function-square",
    color: "bg-purple-500",
    unlocked: false,
    completed: false,
    progress: 0,
    subtopics: [
      {
        id: "variables",
        name: "Variables",
        description: "Introducción a las variables algebraicas",
        completed: false,
        progress: 0,
        unlocked: false,
        exercises: []
      }
    ]
  },
  {
    id: "geometry",
    name: "Geometría Básica",
    description: "Formas, perímetros y áreas",
    icon: "shapes",
    color: "bg-green-500",
    unlocked: false,
    completed: false,
    progress: 0,
    subtopics: [
      {
        id: "shapes",
        name: "Figuras Geométricas",
        description: "Identificación de formas básicas",
        completed: false,
        progress: 0,
        unlocked: false,
        exercises: []
      }
    ]
  }
];

export const availableBadges: Badge[] = [
  {
    id: "first-steps",
    name: "Primeros Pasos",
    description: "Completa tu primera lección",
    icon: "baby",
    color: "bg-yellow-500",
    earned: true,
    dateEarned: new Date("2024-01-15"),
    requirement: "Completar 1 ejercicio"
  },
  {
    id: "calculator",
    name: "Calculadora Humana",
    description: "Domina la aritmética básica",
    icon: "calculator",
    color: "bg-blue-500",
    earned: true,
    dateEarned: new Date("2024-01-20"),
    requirement: "Completar aritmética básica"
  },
  {
    id: "streak-master",
    name: "Maestro de Racha",
    description: "Mantén una racha de 7 días",
    icon: "flame",
    color: "bg-orange-500",
    earned: false,
    requirement: "Racha de 7 días consecutivos"
  },
  {
    id: "perfectionist",
    name: "Perfeccionista",
    description: "Obtén 100% en 5 temas",
    icon: "crown",
    color: "bg-purple-500",
    earned: false,
    requirement: "100% en 5 temas diferentes"
  },
  {
    id: "explorer",
    name: "Explorador",
    description: "Desbloquea 3 áreas nuevas",
    icon: "compass",
    color: "bg-green-500",
    earned: false,
    requirement: "Desbloquear 3 áreas de estudio"
  }
];

export const mockUser: UserProgress = {
  userId: "user123",
  name: "Ana Rodríguez",
  avatar: "👩‍🎓",
  level: 8,
  xp: 2340,
  totalPoints: 1250,
  streakDays: 5,
  badges: availableBadges.filter(badge => badge.earned),
  completedTopics: ["arithmetic"],
  currentTopic: "arithmetic"
};

// Mock data para estudiantes (vista profesor)
export const mockStudents: UserProgress[] = [
  {
    userId: "student1",
    name: "Carlos Mendez",
    avatar: "👨‍🎓",
    level: 6,
    xp: 1800,
    totalPoints: 980,
    streakDays: 3,
    badges: [availableBadges[0], availableBadges[1]],
    completedTopics: ["arithmetic"],
    currentTopic: "algebra"
  },
  {
    userId: "student2",
    name: "Sofia López",
    avatar: "👩‍🎓",
    level: 12,
    xp: 3600,
    totalPoints: 2100,
    streakDays: 12,
    badges: availableBadges.filter(badge => badge.earned),
    completedTopics: ["arithmetic", "algebra"],
    currentTopic: "geometry"
  },
  {
    userId: "student3",
    name: "Diego Torres",
    avatar: "👨‍🎓",
    level: 4,
    xp: 950,
    totalPoints: 540,
    streakDays: 1,
    badges: [availableBadges[0]],
    completedTopics: [],
    currentTopic: "arithmetic"
  },
  {
    userId: "student4",
    name: "María García",
    avatar: "👩‍🎓",
    level: 9,
    xp: 2750,
    totalPoints: 1580,
    streakDays: 7,
    badges: [availableBadges[0], availableBadges[1], availableBadges[2]],
    completedTopics: ["arithmetic"],
    currentTopic: "algebra"
  }