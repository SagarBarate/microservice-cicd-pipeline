package com.tus.microservices.service;

import java.util.List;

import com.tus.microservices.model.AssignDoctorRequest;
import com.tus.microservices.model.PatientRecord;

public interface PatientService {

	PatientRecord savePatient(PatientRecord patientRecord);

	List<PatientRecord> getAllPatientData();

	List<PatientRecord> getAllPatientsDataByName(String name);

	PatientRecord getPatientDetails(Long id);

	void deleteAll();

	void deleteById(Long id);

	PatientRecord updatePatient(Long id, PatientRecord updateData);

	PatientRecord assignDoctor(Long id, AssignDoctorRequest request);
}
