package com.tus.microservices.client.dto;

public record AssignDoctorRequest(Long doctorId, String doctorName, String doctorSpecialization) {
}
