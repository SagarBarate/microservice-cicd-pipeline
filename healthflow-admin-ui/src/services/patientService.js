import axiosClient from "../api/axiosClient";
import { extractArray, extractObject } from "../utils/helpers";

export async function getPatients(filters = {}) {
  const response = await axiosClient.get("/v1/patient", { params: filters });
  return extractArray(response.data);
}

export async function getPatientById(id) {
  const response = await axiosClient.get(`/v1/patient/${id}`);
  return extractObject(response.data);
}

export async function createPatient(payload) {
  const response = await axiosClient.post("/v1/patient", payload);
  return extractObject(response.data);
}

export async function updatePatient(id, payload) {
  const response = await axiosClient.put(`/v1/patient/${id}`, payload);
  return extractObject(response.data);
}

export async function deletePatient(id) {
  return axiosClient.delete(`/v1/patient/${id}`);
}

export async function deleteAllPatients() {
  return axiosClient.delete("/v1/patient");
}

export async function bookPatientAppointment(payload) {
  const response = await axiosClient.post("/v1/patient/bookAppointment", payload);
  return extractObject(response.data);
}

export async function patientHealth() {
  const response = await axiosClient.get("/v1/patient/test");
  return response.data;
}
