import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchGroups = createAsyncThunk("groups/fetchGroups", async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/group/getGroups");
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching groups:", error);
  }
});

export const createGroup = createAsyncThunk(
  "groups/createGroup",
  async (groupData) => {
    try {
      const response = await axios.post("http://localhost:3000/api/group/createGroup", groupData);
      if (response.status === 201) {
        return response.data;
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  }
);