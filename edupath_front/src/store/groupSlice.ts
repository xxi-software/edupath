import { createSlice } from "@reduxjs/toolkit";
import { createGroup, deleteGroup, fetchGroups } from "./groupActions";

export interface Group {
  _id: string;
  title: string;
  teacherId: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  assignedStudents: string[];
  completedBy: string[];
  experience: number;
  mainTheme: string;
  points: number;
  status: "published" | "draft";
  subtopicThemes: string[];
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
  __v: number;
}

interface GroupState {
  groups: Group[];
  loading: boolean;
  error: string | null;
}

const groupSlice = createSlice({
  name: "group",
  initialState: {
    groups: [],
    loading: false,
    error: null,
  } as GroupState,
  reducers: {
    // You can add synchronous reducers here if needed

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string" ? action.payload : "Unknown error";
      })
      .addCase(deleteGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = state.groups.filter((group) => group._id !== action.payload);
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string" ? action.payload : "Unknown error";
      })
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.groups.push(action.payload);
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string" ? action.payload : "Unknown error";
      })
  },
});

export default groupSlice.reducer;
