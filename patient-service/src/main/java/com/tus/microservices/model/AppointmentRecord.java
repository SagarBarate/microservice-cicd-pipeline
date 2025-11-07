package com.tus.microservices.model;

import java.time.LocalDate;

public record AppointmentRecord(
		Long doctorId,
		Long patientId,
		LocalDate appointmentDate
        ) {
}
