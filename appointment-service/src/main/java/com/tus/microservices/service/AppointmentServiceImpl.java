package com.tus.microservices.service;

import java.util.Collections;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tus.microservices.entity.Appointment;
import com.tus.microservices.mapper.AppointmentMapper;
import com.tus.microservices.model.AppointmentRecord;
import com.tus.microservices.repository.AppointmentRepository;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AppointmentServiceImpl implements AppointmentService {

	
	@Autowired
	private AppointmentMapper mapper;
	
	@Autowired
	private AppointmentRepository appointmentRepository;

	@Override
	@CircuitBreaker(name = "appointmentService", fallbackMethod = "fallbackForSaveAppointment")
    @Retry(name = "appointmentService")
	public AppointmentRecord saveAppointment(AppointmentRecord appointmentRecord) {
		
		if (appointmentRecord == null) {
        throw new IllegalArgumentException("Appointment record cannot be null");
    }
		
		// Simulate failure in 50% of cases
	    if (new Random().nextBoolean()) {
	        log.error("Simulated failure in saveAppointment!");
	        throw new RuntimeException("Database unavailable - Simulated failure");
	    }

    log.info("Attempting to save appointment...");
    Appointment appointment = mapper.recordDataToEntity(appointmentRecord);
    appointmentRepository.save(appointment);
    return mapper.entityDataToRecord(appointment);}

	@Override
	@CircuitBreaker(name = "appointmentService", fallbackMethod = "fallbackForGetAllAppointments")
    @Retry(name = "appointmentService")
	public List<AppointmentRecord> getAllAppointmentData() {
		 log.info("Fetching all appointment records...");

	        // Simulate failure in 50% of cases
	        if (new java.util.Random().nextBoolean()) {
	            log.error("Simulated failure in getAllAppointmentData!");
	            throw new RuntimeException("Database unavailable - Simulated failure");
	        }

	        return mapper.entityListToRecordList(appointmentRepository.findAll());
	}

	 // Fallback Method
    public AppointmentRecord fallbackForSaveAppointment(AppointmentRecord appointmentRecord, Throwable t) {
        log.error("Circuit Breaker triggered! Reason: {}", t.getMessage(), t);
        return null; // Indicating service failure to the controller
    }
    
    // Fallback Method - Provides Default Response
    public List<AppointmentRecord> fallbackForGetAllAppointments(Throwable t) {
        log.error("Circuit Breaker triggered in getAllAppointmentData! Reason: {}", t.getMessage(), t);
        
        // Default response when service is down
        return Collections.emptyList(); // Returning an empty list instead of null
    }
}
