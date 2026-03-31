import axiosClient from "../api/axiosClient";
import { extractArray, extractObject } from "../utils/helpers";

export async function getDoctors(filters = {}) {
  const response = await axiosClient.get("/v1/doctor", { params: filters });
  return extractArray(response.data);
}

export async function getDoctorById(id) {
  const response = await axiosClient.get(`/v1/doctor/${id}`);
  return extractObject(response.data);
}

export async function createDoctor(payload) {
  const response = await axiosClient.post("/v1/doctor", payload);
  return extractObject(response.data);
}

export async function updateDoctor(id, payload) {
  const response = await axiosClient.put(`/v1/doctor/${id}`, payload);
  return extractObject(response.data);
}

export async function deleteDoctor(id) {
  return axiosClient.delete(`/v1/doctor/${id}`);
}

export async function deleteAllDoctors() {
  return axiosClient.delete("/v1/doctor");
}

export async function doctorHealth() {
  const response = await axiosClient.get("/v1/doctor/test");
  return response.data;
}
