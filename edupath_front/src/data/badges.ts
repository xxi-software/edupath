import {type Badge } from './types';

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