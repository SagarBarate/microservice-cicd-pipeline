package com.tus.microservices.model;

public record PatientRecord(
		Long id,
        String name,
        int age,
        String gender,
        String phoneNumber,
        String email
        ) {

}
