package com.tus.microservices.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tus.microservices.model.AppointmentRecord;
import com.tus.microservices.service.AppointmentService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/v1/appointment")
@RestController
public class AppointmentController {
	
	@Autowired
	private AppointmentService appointmentService;
	
	@GetMapping("/test")
	public String sayHello() {
		log.info("appointment logs");
		return "hello appointment";
	}
	
	@PostMapping("/book")
	public ResponseEntity<String> bookAppointment(@RequestBody AppointmentRecord bookAppointment) {
		log.info("Booking Appointment...");

	    if (bookAppointment == null) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid appointment details");
	    }

	    AppointmentRecord appointmentRecord = appointmentService.saveAppointment(bookAppointment);

	    if (appointmentRecord != null) {
	        return ResponseEntity.status(HttpStatus.CREATED).body("Appointment booked successfully");
	    } else {
	        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
	                .body("Appointment service is temporarily unavailable. Please try again later.");
	    }
	}
	
	@GetMapping
	public ResponseEntity<List<AppointmentRecord>> getAllAppiontment() {
		try {
			List<AppointmentRecord> records = new ArrayList();
			
			appointmentService.getAllAppointmentData().forEach(records::add);

			if (records.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<>(records, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
}
