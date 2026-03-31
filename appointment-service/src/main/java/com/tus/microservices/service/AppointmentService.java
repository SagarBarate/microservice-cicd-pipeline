package com.tus.microservices.service;

import java.util.List;

import com.tus.microservices.model.AppointmentRecord;

public interface AppointmentService {

    public AppointmentRecord saveAppointment(AppointmentRecord appointmentRecord);
	
	public List<AppointmentRecord> getAllAppointmentData(); 

}
