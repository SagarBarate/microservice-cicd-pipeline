package com.tus.microservices.exception;

public class DoctorNotFoundException extends RuntimeException {

	public DoctorNotFoundException(String message) {
		super(message);
	}
}
