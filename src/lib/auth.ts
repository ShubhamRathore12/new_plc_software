import { apiRequest } from "./api";

export async function loginUser(username: string, password: string) {
  return apiRequest("/api/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}
