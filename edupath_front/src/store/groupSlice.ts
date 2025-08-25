import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { fetchGroups, createGroup } from "./groupActions";

export interface Group{
  id: string;
  name: string;
  teacher: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  assignedStudents: string[];
  completeBy: string[];
  experience: number;
  mainTheme: string;
  point: number;
  status: "published" | "draft";
  subtopicsThemes: string[];
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
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
    error: null
  } as GroupState,
  reducers: {
    fetchGroupsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchGroupsSuccess(state, action: PayloadAction<Group[]>) {
      state.loading = false;
      state.groups = action.payload;
    },
    fetchGroupsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    }
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
        state.error = typeof action.payload === "string" ? action.payload : "Unknown error";
      });
    builder
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
        state.error = typeof action.payload === "string" ? action.payload : "Unknown error";
      });
  }
})

export default groupSlice.reducer;