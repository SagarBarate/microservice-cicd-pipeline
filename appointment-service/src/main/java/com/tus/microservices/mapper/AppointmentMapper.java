package com.tus.microservices.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.tus.microservices.entity.Appointment;
import com.tus.microservices.model.AppointmentRecord;

@Mapper
public interface AppointmentMapper {

	@Mapping(source = "doctorId" , target = "doctorId")
	@Mapping(source = "patientId" , target = "patientId")
	@Mapping(source = "appointmentDate" , target = "appointmentDate")
	Appointment recordDataToEntity(AppointmentRecord appointmentRecord);
	
	@Mapping(source = "doctorId" , target = "doctorId")
	@Mapping(source = "patientId" , target = "patientId")
	@Mapping(source = "appointmentDate" , target = "appointmentDate")
	AppointmentRecord entityDataToRecord(Appointment appointment);
	
	@Mapping(source = "doctorId" , target = "doctorId")
	@Mapping(source = "patientId" , target = "patientId")
	@Mapping(source = "appointmentDate" , target = "appointmentDate")
	List<AppointmentRecord> entityListToRecordList(List<Appointment> appointments);
	
}
