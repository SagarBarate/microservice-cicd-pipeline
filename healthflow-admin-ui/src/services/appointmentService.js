import axiosClient from "../api/axiosClient";
import { extractArray, extractObject } from "../utils/helpers";

export async function getAppointments() {
  const response = await axiosClient.get("/v1/appointment");
  return extractArray(response.data);
}

export async function getAppointmentById(id) {
  const response = await axiosClient.get(`/v1/appointment/${id}`);
  return extractObject(response.data);
}

export async function bookAppointment(payload) {
  const response = await axiosClient.post("/v1/appointment/book", payload);
  return extractObject(response.data);
}

export async function appointmentHealth() {
  const response = await axiosClient.get("/v1/appointment/test");
  return response.data;
}
