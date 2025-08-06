import { type Topic } from './types';

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