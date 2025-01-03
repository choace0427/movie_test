import { create } from "zustand";

export const authStore = create(() => ({
  user: localStorage.getItem("userSession")
    ? JSON.parse(localStorage.getItem("userSession")).user
    : null,
}));
