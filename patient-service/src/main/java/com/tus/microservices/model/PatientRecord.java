package com.tus.microservices.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record PatientRecord(
		Long id,

		@NotBlank(message = "Patient name is required")
		String name,

		@Min(value = 0, message = "Age must be at least 0")
		@Max(value = 150, message = "Age must be at most 150")
		int age,

		String gender,

		String phoneNumber,

		@Email(message = "Email must be valid")
		String email,

		String concern,

		Long assignedDoctorId,

		String assignedDoctorName,

		String assignedDoctorSpecialization) {
}
