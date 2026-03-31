package com.tus.microservices.client.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DoctorDto(Long id, String name, String specialization, String phoneNumber, String email) {
}
