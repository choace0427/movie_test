import { create } from "zustand";

export const authStore = create(() => ({
  user:
    typeof window !== "undefined" && localStorage.getItem("userSession")
      ? JSON.parse(localStorage.getItem("userSession")).user
      : null,
}));
