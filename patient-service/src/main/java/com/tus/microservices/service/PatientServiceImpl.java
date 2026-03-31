package com.tus.microservices.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tus.microservices.entity.Patient;
import com.tus.microservices.exception.PatientNotFoundException;
import com.tus.microservices.mapper.PatientMapper;
import com.tus.microservices.model.AssignDoctorRequest;
import com.tus.microservices.model.PatientRecord;
import com.tus.microservices.repository.PatientRepository;

@Service
public class PatientServiceImpl implements PatientService {

	private final PatientMapper mapper;
	private final PatientRepository patientRepository;

	public PatientServiceImpl(PatientMapper mapper, PatientRepository patientRepository) {
		this.mapper = mapper;
		this.patientRepository = patientRepository;
	}

	@Override
	@Transactional
	public PatientRecord savePatient(PatientRecord patientRecord) {
		if (patientRecord == null) {
			throw new IllegalArgumentException("Patient record cannot be null");
		}
		Patient patient = mapper.recordDataToEntity(patientRecord);
		patientRepository.save(patient);
		return mapper.entityDataToRecord(patient);
	}

	@Override
	public List<PatientRecord> getAllPatientData() {
		return mapper.entityListToRecordList(patientRepository.findAll());
	}

	@Override
	public List<PatientRecord> getAllPatientsDataByName(String name) {
		return mapper.entityListToRecordList(patientRepository.findByNameContainingIgnoreCase(name));
	}

	@Override
	public PatientRecord getPatientDetails(Long id) {
		Optional<Patient> patient = patientRepository.findById(id);
		return patient.map(mapper::entityDataToRecord).orElse(null);
	}

	@Override
	public void deleteAll() {
		patientRepository.deleteAll();
	}

	@Override
	public void deleteById(Long id) {
		patientRepository.deleteById(id);
	}

	@Override
	@Transactional
	public PatientRecord updatePatient(Long id, PatientRecord updateData) {
		Optional<Patient> patientOpt = patientRepository.findById(id);
		if (patientOpt.isEmpty()) {
			return null;
		}
		Patient modifiedPatient = patientOpt.get();
		modifiedPatient.setName(updateData.name());
		modifiedPatient.setAge(updateData.age());
		modifiedPatient.setGender(updateData.gender());
		modifiedPatient.setPhoneNumber(updateData.phoneNumber());
		modifiedPatient.setEmail(updateData.email());
		if (updateData.concern() != null) {
			modifiedPatient.setConcern(updateData.concern());
		}
		if (updateData.assignedDoctorId() != null) {
			modifiedPatient.setAssignedDoctorId(updateData.assignedDoctorId());
		}
		if (updateData.assignedDoctorName() != null) {
			modifiedPatient.setAssignedDoctorName(updateData.assignedDoctorName());
		}
		if (updateData.assignedDoctorSpecialization() != null) {
			modifiedPatient.setAssignedDoctorSpecialization(updateData.assignedDoctorSpecialization());
		}
		patientRepository.save(modifiedPatient);
		return mapper.entityDataToRecord(modifiedPatient);
	}

	@Override
	@Transactional
	public PatientRecord assignDoctor(Long id, AssignDoctorRequest request) {
		Patient patient = patientRepository.findById(id)
				.orElseThrow(() -> new PatientNotFoundException("Patient not found with id: " + id));
		patient.setAssignedDoctorId(request.doctorId());
		patient.setAssignedDoctorName(request.doctorName());
		patient.setAssignedDoctorSpecialization(request.doctorSpecialization());
		patientRepository.save(patient);
		return mapper.entityDataToRecord(patient);
	}
}
