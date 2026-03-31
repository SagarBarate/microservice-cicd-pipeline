package com.tus.microservices.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tus.microservices.model.AppointmentBookingRequest;
import com.tus.microservices.model.AppointmentResponse;
import com.tus.microservices.service.AppointmentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/v1/appointment")
@RestController
@RequiredArgsConstructor
public class AppointmentController {

	private final AppointmentService appointmentService;

	@GetMapping("/test")
	public String sayHello() {
		log.info("appointment logs");
		return "hello appointment";
	}

	@PostMapping("/book")
	public ResponseEntity<AppointmentResponse> bookAppointment(
			@Valid @RequestBody AppointmentBookingRequest bookingRequest) {
		log.info("Booking appointment for doctor {}", bookingRequest.doctorId());
		AppointmentResponse created = appointmentService.bookAppointment(bookingRequest);
		return ResponseEntity.status(HttpStatus.CREATED).body(created);
	}

	@GetMapping
	public ResponseEntity<List<AppointmentResponse>> getAllAppointments() {
		List<AppointmentResponse> list = appointmentService.getAllAppointments();
		return ResponseEntity.ok(list);
	}

	@GetMapping("/{id}")
	public ResponseEntity<AppointmentResponse> getAppointmentById(@PathVariable Long id) {
		return ResponseEntity.ok(appointmentService.getAppointmentById(id));
	}
}
