package com.tus.microservices.exception;

public class AppointmentPersistenceException extends RuntimeException {

	public AppointmentPersistenceException(String message, Throwable cause) {
		super(message, cause);
	}
}
