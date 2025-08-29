import { createSlice } from "@reduxjs/toolkit";
import { createLesson, deleteLesson, fetchLessons, updateLesson } from "./lessonActions";

export interface Question {
  id: string;
  type: 'multiple-choice' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: number;
  points: number;
  xp: number;
  hints: string[];
}

export interface Lesson {
  _id: string;
  title: string;
  description: string;
  assignmentId: string;
  order: number;
  estimatedDuration: number;
  difficulty: number;
  prerequisiteIds: string[];
  content: {
    theory: string;
    examples: string[];
    visualAids: string[];
  };
  questions: Question[];
  rewards: {
    points: number;
    xp: number;
    badges: string[];
  };
  adaptiveSettings: {
    minAccuracy: number;
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

interface LessonState {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
}

const initialState: LessonState = {
  lessons: [],
  loading: false,
  error: null,
};



const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessons.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = action.payload;
      })
      .addCase(fetchLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons.push(action.payload.lesson);
      })
      .addCase(createLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.lessons.findIndex((l) => l._id === action.payload.id);
        if (index !== -1) {
          state.lessons[index] = action.payload;
        }
      })
      .addCase(updateLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = state.lessons.filter((l) => l._id !== action.payload);
      })
      .addCase(deleteLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default lessonSlice.reducer;