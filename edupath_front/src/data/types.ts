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
  role: 'student' | 'teacher';
}