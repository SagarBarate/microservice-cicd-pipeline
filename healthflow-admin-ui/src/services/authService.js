import axiosClient from "../api/axiosClient";
import { extractObject } from "../utils/helpers";

export async function loginUser(username) {
  const response = await axiosClient.post("/auth/login", null, {
    params: { username }
  });
  const payload = extractObject(response.data);
  const token = payload?.token || response?.data?.token || response?.data;
  return typeof token === "string" ? token : "";
}
