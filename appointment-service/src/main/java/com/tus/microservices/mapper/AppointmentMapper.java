package com.tus.microservices.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.tus.microservices.entity.Appointment;
import com.tus.microservices.model.AppointmentResponse;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {

	@Mapping(target = "status", expression = "java(appointment.getStatus() != null ? appointment.getStatus().name() : null)")
	AppointmentResponse toResponse(Appointment appointment);

	List<AppointmentResponse> toResponseList(List<Appointment> appointments);
}
