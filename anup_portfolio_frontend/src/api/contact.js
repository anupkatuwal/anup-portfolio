import { apiClient } from "./client";

export async function sendContactMessage(payload) {
  const response = await apiClient.post("/contact", payload);
  return response.data;
}
