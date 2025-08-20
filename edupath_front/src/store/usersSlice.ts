import { createSlice, type PayloadAction, createSelector } from "@reduxjs/toolkit";
import { type User } from "./authSlice";
import type { RootState } from './index';
import { fetchUsers } from "./usersActions";

// Definimos una interfaz para el estado del slice de usuarios
interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filter: Partial<Pick<User, 'role'>>; // Permite filtrar por rol u otras propiedades de User
}

// Estado inicial del slice
const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  searchTerm: "",
  filter: {},
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    fetchUsersStart(state) {
      // Acción para iniciar la carga de usuarios
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess(state, action: PayloadAction<User[]>) {
      state.loading = false;
      state.users = action.payload;
    },
    fetchUsersFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setFilter(state, action: PayloadAction<Partial<Pick<User, 'role'>>>) {
      state.filter = action.payload;
    },
    updateUserGroups(state, action: PayloadAction<{ userId: string; groups: string[] }>) {
      const { userId, groups } = action.payload;
      const userIndex = state.users.findIndex(user => user._id === userId);
      if (userIndex !== -1) {
        state.users[userIndex].groups = groups;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.error.message === 'string' ? action.error.message : 'Failed to fetch users';
      });
  }
});

export const {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  setSearchTerm,
  setFilter,
  updateUserGroups,
} = usersSlice.actions;

export default usersSlice.reducer;

// SELECTORS
const selectUsersState = (state: RootState) => state.users;

export const selectAllUsers = createSelector(
  [selectUsersState],
  (usersState) => usersState.users
);

export const selectFilteredUsers = createSelector(
  [selectAllUsers, selectUsersState],
  (allUsers, usersState) => {
    const { searchTerm, filter } = usersState;
    
    let filteredUsers = allUsers;

    // Aplicar filtro por rol si existe
    if (filter.role) {
      filteredUsers = filteredUsers.filter((user: User) => user.role === filter.role);
    }

    // Aplicar búsqueda por email si hay un término de búsqueda
    if (searchTerm) {
      filteredUsers = filteredUsers.filter((user: User) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filteredUsers;
  }
);
