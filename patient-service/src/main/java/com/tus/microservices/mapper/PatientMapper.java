package com.tus.microservices.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.tus.microservices.entity.Patient;
import com.tus.microservices.model.PatientRecord;

@Mapper
public interface PatientMapper {

	@Mapping(source = "name" , target = "name")
	@Mapping(source = "age" , target = "age")
	@Mapping(source = "gender" , target = "gender")
	@Mapping(source = "phoneNumber" , target = "phoneNumber")
	@Mapping(source = "email" , target = "email")
	Patient recordDataToEntity(PatientRecord patientRecord);
	
	@Mapping(source = "name" , target = "name")
	@Mapping(source = "age" , target = "age")
	@Mapping(source = "gender" , target = "gender")
	@Mapping(source = "phoneNumber" , target = "phoneNumber")
	@Mapping(source = "email" , target = "email")
	PatientRecord entityDataToRecord(Patient patient);
	
	@Mapping(source = "name" , target = "name")
	@Mapping(source = "age" , target = "age")
	@Mapping(source = "gender" , target = "gender")
	@Mapping(source = "phoneNumber" , target = "phoneNumber")
	@Mapping(source = "email" , target = "email")
	List<PatientRecord> entityListToRecordList(List<Patient> doctor);
	
}
