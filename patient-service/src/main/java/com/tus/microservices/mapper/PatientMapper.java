package com.tus.microservices.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.tus.microservices.entity.Patient;
import com.tus.microservices.model.PatientRecord;

@Mapper
public interface PatientMapper {

	Patient recordDataToEntity(PatientRecord patientRecord);

	PatientRecord entityDataToRecord(Patient patient);

	List<PatientRecord> entityListToRecordList(List<Patient> doctor);
}
