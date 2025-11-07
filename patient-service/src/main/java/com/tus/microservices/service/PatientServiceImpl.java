package com.tus.microservices.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tus.microservices.entity.Patient;
import com.tus.microservices.mapper.PatientMapper;
import com.tus.microservices.model.PatientRecord;
import com.tus.microservices.repository.PatientRepository;

@Service
public class PatientServiceImpl implements PatientService {

	
	@Autowired
	private PatientMapper mapper;
	
	@Autowired
	private PatientRepository patientRepositry;

	@Override
	public PatientRecord savePatient(PatientRecord patientRecord) {
		PatientRecord savedPatient = null;
		try {
			if(patientRecord!=null) {
			Patient patient = mapper.recordDataToEntity(patientRecord);
			patientRepositry.save(patient);
			savedPatient= mapper.entityDataToRecord(patient);
			}
		} catch (Exception e) {
			return null;
		}
		return savedPatient;
	}

	@Override
	public List<PatientRecord> getAllPatientData() {
		return mapper.entityListToRecordList(patientRepositry.findAll());
	}

	@Override
	public List<PatientRecord> getAllPatientsDataByName(String name) {
		return mapper.entityListToRecordList(patientRepositry.findByNameContainingIgnoreCase(name));
	}

	@Override
	public PatientRecord getPatientDetails(Long id) {
		PatientRecord patientDetail = null;
		Optional<Patient> patient = patientRepositry.findById(id);
		if (patient.isPresent()) {
			patientDetail = mapper.entityDataToRecord(patient.get());
			return patientDetail;
		}
		else
			return patientDetail;
	}

	@Override
	public void deleteAll() {
		patientRepositry.deleteAll();
	}

	@Override
	public void deleteById(Long id) {
		patientRepositry.deleteById(id);
	}

	@Override
	public PatientRecord updatePatient(Long id, PatientRecord updateData) {
		PatientRecord patientDetail = null;
		Optional<Patient> patient = patientRepositry.findById(id);
		if (patient.isPresent()) {
			Patient modifiedPatient = patient.get();
			modifiedPatient.setName(updateData.name());
			modifiedPatient.setAge(updateData.age());
			modifiedPatient.setGender(updateData.gender());
			modifiedPatient.setPhoneNumber(updateData.phoneNumber());
			modifiedPatient.setEmail(updateData.email());
			patientRepositry.save(modifiedPatient);
			patientDetail = mapper.entityDataToRecord(modifiedPatient);
			return patientDetail;
		}
		else
			return patientDetail;
	}
	
}
