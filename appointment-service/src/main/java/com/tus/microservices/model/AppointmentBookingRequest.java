package com.tus.microservices.model;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AppointmentBookingRequest(
		@NotNull(message = "Doctor id is required") Long doctorId,

		String doctorName,

		String doctorSpecialization,

		Long patientId,

		@NotBlank(message = "Patient name is required") String patientName,

		@Email(message = "Patient email must be valid") String patientEmail,

		String patientPhone,

		@Min(value = 0, message = "Patient age must be at least 0") @Max(value = 150, message = "Patient age must be at most 150") Integer patientAge,

		String patientGender,

		@NotBlank(message = "Patient concern is required") String patientConcern,

		@NotNull(message = "Appointment date is required") @FutureOrPresent(message = "Appointment date cannot be in the past") LocalDate appointmentDate) {
}
