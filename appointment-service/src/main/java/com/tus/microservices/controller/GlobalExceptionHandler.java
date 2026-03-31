package com.tus.microservices.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.tus.microservices.exception.AppointmentNotFoundException;
import com.tus.microservices.exception.AppointmentPersistenceException;
import com.tus.microservices.exception.DoctorNotFoundException;
import com.tus.microservices.exception.DownstreamServiceException;
import com.tus.microservices.exception.PatientNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
		Map<String, String> errors = new HashMap<>();
		for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
			errors.put(fe.getField(), fe.getDefaultMessage());
		}
		Map<String, Object> body = new HashMap<>();
		body.put("message", "Validation failed");
		body.put("errors", errors);
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
	}

	@ExceptionHandler({ DoctorNotFoundException.class, PatientNotFoundException.class, AppointmentNotFoundException.class })
	public ResponseEntity<Map<String, String>> handleNotFound(RuntimeException ex) {
		Map<String, String> body = new HashMap<>();
		body.put("message", ex.getMessage());
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
	}

	@ExceptionHandler(DownstreamServiceException.class)
	public ResponseEntity<Map<String, String>> handleDownstream(DownstreamServiceException ex) {
		Map<String, String> body = new HashMap<>();
		body.put("message", ex.getMessage());
		return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(body);
	}

	@ExceptionHandler(AppointmentPersistenceException.class)
	public ResponseEntity<Map<String, String>> handlePersistence(AppointmentPersistenceException ex) {
		Map<String, String> body = new HashMap<>();
		body.put("message", ex.getMessage());
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
		Map<String, String> body = new HashMap<>();
		body.put("message", ex.getMessage());
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
	}
}
