package com.tus.microservices.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record AppointmentResponse(
		Long id,
		Long doctorId,
		String doctorName,
		String doctorSpecialization,
		Long patientId,
		String patientName,
		String patientConcern,
		LocalDate appointmentDate,
		String status,
		LocalDateTime createdAt,
		LocalDateTime updatedAt) {
}
