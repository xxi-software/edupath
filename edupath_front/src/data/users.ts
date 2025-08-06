import { type UserProgress } from './types';
import { availableBadges } from './badges';

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
  currentTopic: "arithmetic",
  role: "student"
};

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
    currentTopic: "algebra",
    role: "student"
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
    currentTopic: "geometry",
    role: "student"
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
    currentTopic: "arithmetic",
    role: "student"
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
    currentTopic: "algebra",
    role: "student"
  }
];

export const mockTeacher: UserProgress = {
  userId: "teacher1",
  name: "Prof. Martinez",
  avatar: "👨‍🏫",
  level: 20,
  xp: 8500,
  totalPoints: 5000,
  streakDays: 30,
  badges: availableBadges,
  completedTopics: ["arithmetic", "algebra", "geometry"],
  currentTopic: "geometry",
  role: "teacher"
};