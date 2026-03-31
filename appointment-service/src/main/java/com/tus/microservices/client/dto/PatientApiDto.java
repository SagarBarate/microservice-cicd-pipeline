package com.tus.microservices.client.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PatientApiDto(
		Long id,
		String name,
		int age,
		String gender,
		String phoneNumber,
		String email,
		String concern,
		Long assignedDoctorId,
		String assignedDoctorName,
		String assignedDoctorSpecialization) {
}
