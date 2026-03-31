import axiosClient from "../api/axiosClient";
import { extractArray, extractObject } from "../utils/helpers";
import { bookPatientAppointment } from "./patientService";

const APPOINTMENT_BOOKING_MODE =
  import.meta.env.VITE_APPOINTMENT_BOOKING_MODE || "appointment-service";

export async function getAppointments() {
  const response = await axiosClient.get("/v1/appointment");
  return extractArray(response.data);
}

export async function bookAppointment(payload, mode = APPOINTMENT_BOOKING_MODE) {
  if (mode === "patient-service") {
    return bookPatientAppointment(payload);
  }
  const response = await axiosClient.post("/v1/appointment/book", payload);
  return extractObject(response.data);
}

export async function appointmentHealth() {
  const response = await axiosClient.get("/v1/appointment/test");
  return response.data;
}
