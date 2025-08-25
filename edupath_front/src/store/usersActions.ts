import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/users/listStudents");
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
});