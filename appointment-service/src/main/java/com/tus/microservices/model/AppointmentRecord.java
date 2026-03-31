package com.tus.microservices.model;

import java.time.LocalDate;

public record AppointmentRecord(
		Long id,
		Long doctorId,
		Long patientId,
		LocalDate appointmentDate
        ) {
}
