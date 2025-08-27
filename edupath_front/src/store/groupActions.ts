import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Group } from "./groupSlice";

export const fetchGroups = createAsyncThunk("groups/fetchGroups", async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/group/getGroups"
    );
    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching groups:", error);
  }
});

export const createGroup = createAsyncThunk(
  "groups/createGroup",
  async (groupData: Group) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/group/createGroup",
        groupData
      );
      if (response.status === 201) {
        return response.data;
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  }
);

export const deleteGroup = createAsyncThunk(
  "groups/deleteGroup",
  async (groupId: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/group/deleteGroup`,
        { data: { id: groupId } }
      );
      if (response.status === 200) {
        return "Grupo eliminado";
      }
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  }
);
