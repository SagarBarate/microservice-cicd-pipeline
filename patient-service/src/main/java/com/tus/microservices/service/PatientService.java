package com.tus.microservices.service;

import java.util.List;

import com.tus.microservices.model.PatientRecord;

public interface PatientService {

    public PatientRecord savePatient(PatientRecord patientRecord);
	
	public List<PatientRecord> getAllPatientData(); 

	public List<PatientRecord> getAllPatientsDataByName(String name); 
	
	public PatientRecord getPatientDetails(Long id);
	
	public void deleteAll();
	
	public void deleteById(Long id);

	public PatientRecord updatePatient(Long id, PatientRecord updateData);
}
