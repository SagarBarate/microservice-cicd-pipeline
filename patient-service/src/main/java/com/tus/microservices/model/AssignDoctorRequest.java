package com.tus.microservices.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AssignDoctorRequest(
		@NotNull(message = "Doctor id is required") Long doctorId,

		@NotBlank(message = "Doctor name is required") String doctorName,

		String doctorSpecialization) {
}
