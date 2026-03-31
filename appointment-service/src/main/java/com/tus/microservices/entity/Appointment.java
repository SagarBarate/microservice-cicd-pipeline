package com.tus.microservices.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.tus.microservices.model.AppointmentStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "appointments")
@Getter
@Setter
public class Appointment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private Long doctorId;
	private String doctorName;
	private String doctorSpecialization;
	private Long patientId;
	private String patientName;
	private String patientConcern;
	private LocalDate appointmentDate;

	@Enumerated(EnumType.STRING)
	private AppointmentStatus status = AppointmentStatus.BOOKED;

	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	@PrePersist
	public void prePersist() {
		LocalDateTime now = LocalDateTime.now();
		if (status == null) {
			status = AppointmentStatus.BOOKED;
		}
		createdAt = now;
		updatedAt = now;
	}

	@PreUpdate
	public void preUpdate() {
		updatedAt = LocalDateTime.now();
	}
}
