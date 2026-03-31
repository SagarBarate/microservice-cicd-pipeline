package com.tus.microservices.service;

import java.util.List;

import com.tus.microservices.model.AppointmentBookingRequest;
import com.tus.microservices.model.AppointmentResponse;

public interface AppointmentService {

	AppointmentResponse bookAppointment(AppointmentBookingRequest request);

	List<AppointmentResponse> getAllAppointments();

	AppointmentResponse getAppointmentById(Long id);
}
