import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Lesson } from "./lessonSlice";
import axios from "axios";

export const createLesson = createAsyncThunk(
  'lesson/createLesson',
  async (lessonData: Omit<Lesson, '_id'>, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3000/api/lesson/createLesson', lessonData, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.status !== 200) throw new Error('Failed to create lesson');
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Async thunk para fetch lecciones por assignmentId
export const fetchLessons = createAsyncThunk(
  'lesson/fetchLessons',
  async (assignmentId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/lesson/getLessons/${assignmentId}`);
      if (response.status !== 200) throw new Error('Failed to fetch lessons');
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Async thunk para update lección
export const updateLesson = createAsyncThunk(
  'lesson/updateLesson',
  async ({ id, data }: { id: string; data: Partial<Lesson> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/lesson/updateLesson/${id}`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.status !== 200) throw new Error('Failed to update lesson');
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Async thunk para delete lección
export const deleteLesson = createAsyncThunk(
  'lesson/deleteLesson',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/lesson/deleteLesson/${id}`);
      if (response.status !== 200) throw new Error('Failed to delete lesson');
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);